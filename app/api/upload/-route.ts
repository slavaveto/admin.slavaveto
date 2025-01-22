import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export const config = {
    api: {
        bodyParser: false, // Отключаем встроенный парсер Next.js
    },
};

// Функция для генерации случайного имени файла
function generateRandomName() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function POST(req: Request) {
    try {
        const contentType = req.headers.get("content-type");
        if (!contentType || !contentType.startsWith("multipart/form-data")) {
            return NextResponse.json(
                { error: "Неправильный Content-Type" },
                { status: 400 }
            );
        }

        const boundary = contentType.split("boundary=")[1];
        if (!boundary) {
            return NextResponse.json(
                { error: "Boundary не найден в заголовке Content-Type" },
                { status: 400 }
            );
        }

        const uploadDir = path.join(process.cwd(), "public/uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const reader = req.body?.getReader();
        if (!reader) {
            return NextResponse.json({ error: "Тело запроса пустое" }, { status: 400 });
        }

        const chunks: Uint8Array[] = [];
        let done = false;

        // Читаем данные как бинарный поток
        while (!done) {
            const { value, done: streamDone } = await reader.read();
            if (value) chunks.push(value);
            done = streamDone;
        }

        const buffer = Buffer.concat(chunks);

        // Парсим multipart/form-data
        const parts = buffer
            .toString("binary")
            .split(`--${boundary}`)
            .filter((part) => part.trim() !== "--" && part.trim() !== "");

        for (const part of parts) {
            const headersEndIndex = part.indexOf("\r\n\r\n");
            const headersRaw = part.substring(0, headersEndIndex);
            const body = part.substring(headersEndIndex + 4, part.lastIndexOf("\r\n"));

            const contentDisposition = headersRaw.match(/Content-Disposition: form-data;(.+?)(\r\n|$)/i);
            if (contentDisposition) {
                const filenameMatch = contentDisposition[1].match(/filename="(.+?)"/);
                const filename = filenameMatch ? filenameMatch[1] : null;

                if (filename) {
                    const filePath = path.join(uploadDir, filename);

                    // Сохраняем оригинальное изображение
                    fs.writeFileSync(filePath, Buffer.from(body, "binary"));

                    // Создаем уменьшенные копии с помощью sharp
                    const resizedDir = path.join(uploadDir, "resized");
                    if (!fs.existsSync(resizedDir)) {
                        fs.mkdirSync(resizedDir);
                    }

                    const sizes = [500, 1000]; // Указываем размеры для уменьшенных изображений

                    for (const size of sizes) {
                        const resizedFilePath = path.join(resizedDir, `${size}-${filename}`);
                        await sharp(filePath)
                            .resize(size, size, {
                                fit: "inside",
                                withoutEnlargement: true,
                            })
                            .toFile(resizedFilePath);
                    }

                    return NextResponse.json({
                        url: `/uploads/${filename}`,
                        resized: sizes.map((size) => `/uploads/resized/${size}-${filename}`),
                    });
                }
            }
        }

        return NextResponse.json({ error: "Файл не найден в form-data" }, { status: 400 });
    } catch (error) {
        console.error("Ошибка при загрузке файла:", error);
        return NextResponse.json({ error: "Ошибка загрузки файла" }, { status: 500 });
    }
}
