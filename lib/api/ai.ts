import { Groq } from "groq-sdk";

// If groq-sdk does not export a message type, define a minimal one:
type GroqChatMessage =
  | { role: "system" | "user" | "assistant"; content: string }
  | { role: "function"; name: string; content: string };

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = `
You are an AI assistant specialized in summarizing user notes. 
Given a block of text, produce a concise summary
that captures the key points and main ideas. 
Keep the style neutral and clear.
`.trim();

export async function generateSummary(content: string): Promise<any> {
  // Explicitly type messages as GroqChatMessage[]
  const messages: GroqChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `Please summarize the following note:\n\n${content}`,
    },
  ];

  const chatCompletion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages,
    temperature: 0.2,
    max_completion_tokens: 256,
    top_p: 1,
  });

  return chatCompletion.choices[0].message.content;
}
