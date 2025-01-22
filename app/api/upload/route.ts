import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";


// Проверяем, что переменные окружения заданы
if (!process.env.GOOGLE_CLOUD_KEY) {
    console.error("Ошибка: Переменные окружения GOOGLE_CLOUD_KEY или GOOGLE_CLOUD_BUCKET_NAME не заданы.");
    throw new Error("Не заданы переменные окружения.");
}

// Парсим JSON-ключ из переменной окружения
let credentials;
try {
    credentials = JSON.parse(process.env.GOOGLE_CLOUD_KEY);
    console.log("JSON-ключ успешно разобран из переменной окружения.");
} catch (error) {
    console.error("Ошибка при разборе JSON-ключа из переменной окружения:", error);
    throw error;
}

// Инициализация Google Cloud Storage
const storage = new Storage({ credentials });
console.log("Инициализация Google Cloud Storage успешна.");

if (!process.env.GOOGLE_CLOUD_BUCKET_NAME) {
    console.error("Ошибка: Переменные окружения не заданы.");
    throw new Error("Не заданы переменные окружения GOOGLE_CLOUD_BUCKET_NAME или GOOGLE_CLOUD_KEY_FILE.");
}

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
const projectFolder = "uploads"; // Папка для хранения файлов

export const config = {
    api: {
        bodyParser: false, // Отключаем встроенный парсер Next.js
    },
};

export async function POST(req: any) {
    try {
        console.log("Запрос на загрузку файла получен.");

        const contentType = req.headers.get("content-type");
        if (!contentType || !contentType.startsWith("multipart/form-data")) {
            console.error("Неправильный Content-Type:", contentType);
            return NextResponse.json(
                { error: "Неправильный Content-Type" },
                { status: 400 }
            );
        }

        const boundary = contentType.split("boundary=")[1];
        if (!boundary) {
            console.error("Boundary не найден.");
            return NextResponse.json(
                { error: "Boundary не найден в заголовке Content-Type" },
                { status: 400 }
            );
        }

        const reader = req.body?.getReader();
        if (!reader) {
            console.error("Ошибка: Тело запроса пустое.");
            return NextResponse.json({ error: "Тело запроса пустое" }, { status: 400 });
        }

        const chunks: Uint8Array[] = [];
        let done = false;

        console.log("Чтение данных из тела запроса...");
        while (!done) {
            const { value, done: streamDone } = await reader.read();
            if (value) chunks.push(value);
            done = streamDone;
        }

        const buffer = Buffer.concat(chunks);

        // Парсим multipart/form-data
        console.log("Парсинг multipart/form-data...");
        const parts = buffer
            .toString("binary")
            .split(`--${boundary}`)
            .filter((part) => part.trim() !== "--" && part.trim() !== "");

        if (!parts.length) {
            console.error("Ошибка: Данные файла не найдены.");
            return NextResponse.json({ error: "Файл не найден" }, { status: 400 });
        }

        for (const part of parts) {
            const headersEndIndex = part.indexOf("\r\n\r\n");
            const headersRaw = part.substring(0, headersEndIndex);
            const body = part.substring(headersEndIndex + 4, part.lastIndexOf("\r\n"));

            const contentDisposition = headersRaw.match(/Content-Disposition: form-data;(.+?)(\r\n|$)/i);
            if (contentDisposition) {
                const filenameMatch = contentDisposition[1].match(/filename="(.+?)"/);
                const originalFilename = filenameMatch ? filenameMatch[1] : null;

                if (originalFilename) {
                    console.log("Обработка файла:", originalFilename);

                    const fileExtension = originalFilename.split(".").pop();
                    const randomName = uuidv4(); // Генерируем уникальное имя

                    const cloudPath = `${projectFolder}/${randomName}.${fileExtension}`;
                    const file = storage.bucket(bucketName).file(cloudPath);

                    console.log("Сохранение оригинального файла в Google Cloud:", cloudPath);
                    await file.save(Buffer.from(body, "binary"), {
                        metadata: {
                            contentType: headersRaw.match(/Content-Type: (.+?)\r\n/i)?.[1] || "application/octet-stream",
                        },
                    });

                    const tempPath = `/tmp/${randomName}.${fileExtension}`;
                    fs.writeFileSync(tempPath, Buffer.from(body, "binary"));

                    const metadata = await sharp(tempPath).metadata();
                    const originalWidth = metadata.width || Infinity;

                    console.log("Создание уменьшенных копий...");
                    const sizes = [320, 768, 1024, 1920];
                    const resizedUrls = [];

                    for (const size of sizes) {
                        if (size <= originalWidth) {
                            const resizedFileName = `${randomName}_${size}.${fileExtension}`;
                            const resizedFilePath = `/tmp/${resizedFileName}`;
                            const resizedCloudPath = `${projectFolder}/resized/${resizedFileName}`;

                            console.log(`Создание уменьшенного файла: ${resizedFileName}`);
                            await sharp(tempPath)
                                .resize(size, null, {
                                    fit: "inside",
                                    withoutEnlargement: true,
                                })
                                .toFile(resizedFilePath);

                            console.log(`Загрузка уменьшенного файла в Google Cloud: ${resizedCloudPath}`);
                            const resizedFile = storage.bucket(bucketName).file(resizedCloudPath);
                            await resizedFile.save(fs.readFileSync(resizedFilePath), {
                                metadata: {
                                    contentType: metadata.format ? `image/${metadata.format}` : "image/jpeg",
                                },
                            });

                            resizedUrls.push(`https://storage.googleapis.com/${bucketName}/${resizedCloudPath}`);
                        }
                    }

                    console.log("Файл успешно обработан.");
                    return NextResponse.json({
                        url: `https://storage.googleapis.com/${bucketName}/${cloudPath}`,
                        resized: resizedUrls,
                    });
                }
            }
        }

        console.error("Файл не найден в form-data.");
        return NextResponse.json({ error: "Файл не найден в form-data" }, { status: 400 });
    } catch (error) {
        console.error("Ошибка при обработке запроса:", error);
        return NextResponse.json({ error: "Ошибка загрузки файла" }, { status: 500 });
    }
}