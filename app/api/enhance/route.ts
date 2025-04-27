import { NextRequest, NextResponse } from "next/server";
import { Groq } from "groq-sdk";

const ENHANCE_SYSTEM_PROMPT = `
You are an AI writing assistant.  
Your job is to take a user’s raw note and rewrite it so that:
1. Grammar, punctuation, and spelling are correct.
2. Sentences flow smoothly and read naturally.
3. The original tone and voice of the author are preserved.
4. Any user-provided instructions (tone, style, focus) are applied.
5. The length remains roughly the same—don’t over-expand or cut significant detail.

Only output the rewritten note text—do not prepend or append any commentary.
`.trim();

export async function POST(req: NextRequest) {
  const { content, instructions } = await req.json();

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const userMessage = instructions
    ? `Enhance the following note applying these instructions: ${instructions}\n\nOriginal Note:\n${content}`
    : `Enhance the following note, correcting grammar and improving flow while preserving voice:\n\n${content}`;

  const chatCompletion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.3,
    max_completion_tokens: 512,
    top_p: 1,
    messages: [
      { role: "system", content: ENHANCE_SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
  });

  return NextResponse.json({
    enhanced: chatCompletion.choices[0].message.content,
  });
}
