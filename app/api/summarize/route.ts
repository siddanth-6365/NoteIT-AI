import { NextRequest, NextResponse } from "next/server";
import { Groq } from "groq-sdk";

type GroqChatMessage =
  | { role: "system" | "user" | "assistant"; content: string }
  | { role: "function"; name: string; content: string };

const SYSTEM_PROMPT = `
You are an AI assistant specialized in summarizing user notes. 
Given a block of text, produce a concise summary
that captures the key points and main ideas. 
Keep the style neutral and clear.
`.trim();

export async function POST(req: NextRequest) {
  const { content } = await req.json();

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const messages: GroqChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: `Please summarize the following note:\n\n${content}` },
  ];

  try {
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
    });

    return NextResponse.json({ summary: chatCompletion.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}