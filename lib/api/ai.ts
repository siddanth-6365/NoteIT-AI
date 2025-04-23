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

export async function enhanceNote(
  content: string,
  instructions?: string
): Promise<string> {
  const userMessage = instructions
    ? `Enhance the following note applying these instructions: ${instructions}\n\nOriginal Note:\n${content}`
    : `Enhance the following note, correcting grammar and improving flow while preserving voice:\n\n${content}`;

  const stream = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    stream: true,
    temperature: 0.3,
    max_completion_tokens: 512,
    top_p: 1,
    messages: [
      { role: "system", content: ENHANCE_SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
  });

  let rewritten = "";
  for await (const chunk of stream) {
    rewritten += chunk.choices[0]?.delta?.content || "";
  }
  return rewritten.trim();
}
