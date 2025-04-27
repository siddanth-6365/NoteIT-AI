export async function generateSummary(content: string): Promise<string> {
  const response = await fetch("/api/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate summary");
  }

  const data = await response.json();
  return data.summary;
}

export async function enhanceNote(
  content: string,
  instructions?: string
): Promise<string> {
  const response = await fetch("/api/enhance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, instructions }),
  });

  if (!response.ok) {
    throw new Error("Failed to enhance note");
  }

  const data = await response.json();
  return data.enhanced;
}
