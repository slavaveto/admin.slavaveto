import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message) {
            console.error("Error: Message is required.");
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "Ты профессиональный переводчик. Переводи текст с русского на украинский литературным языком, сохраняя стиль, смысл текста и пунктуацию. Никогда не добавляй точку в конце текста, если её нет в оригинале."
                },
                {
                    role: "user",
                    content: `Переведи текст: ${message}. Ответ должен содержать ТОЛЬКО перевод текста. Если есть какие-либо элементы HTML, обязательно их копируй.`
                }
            ],
            "temperature": 0.0
        });

        const reply = completion.choices[0]?.message?.content || "No reply";

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error("Error in API handler:", {
            message: error.message,
            response: error.response?.data || null,
        });

        return NextResponse.json(
            { error: "Failed to connect to OpenAI", details: error.message },
            { status: 500 }
        );
    }
}