"use client";

import { useState } from "react";
import { NextResponse } from "next/server";

export default function ChatGPTTest() {
    const [userMessage, setUserMessage] = useState("");
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async () => {
        setIsLoading(true);
        setResponse("");

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("API Error:", errorData);
                throw new Error(errorData.error || `HTTP Error: ${res.status}`);
            }

            const data = await res.json();
            setResponse(data.reply || "No response received.");
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error message:", error.message);
                return NextResponse.json(
                    { error: "Failed to connect to OpenAI", details: error.message },
                    { status: 500 }
                );
            } else {
                console.error("Unknown error:", error);
                return NextResponse.json(
                    { error: "An unknown error occurred" },
                    { status: 500 }
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">ChatGPT Connection Test</h1>
            <textarea
                className="border border-gray-300 p-2 w-full rounded mb-4"
                placeholder="Enter your message..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
            />
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                onClick={handleSendMessage}
                disabled={isLoading}
            >
                {isLoading ? "Connecting..." : "Send"}
            </button>
            {response && (
                <div className="mt-4 p-4 border border-gray-300 rounded bg-gray-50">
                    <strong>Response:</strong>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
}