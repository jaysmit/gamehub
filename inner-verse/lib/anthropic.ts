import Anthropic from "@anthropic-ai/sdk";

// ============================================
// ANTHROPIC CLIENT
// Server-side only - never import in client components
// ============================================

let anthropicClient: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set");
    }

    anthropicClient = new Anthropic({
      apiKey,
    });
  }

  return anthropicClient;
}

export async function generatePoem(prompt: string): Promise<string> {
  console.log("[Anthropic] Starting poem generation...");

  const client = getAnthropicClient();
  console.log("[Anthropic] Client initialized");

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    console.log("[Anthropic] Response received:", message.stop_reason);

    // Extract text from response
    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from Claude");
    }

    console.log("[Anthropic] Poem generated successfully, length:", textBlock.text.length);
    return textBlock.text;
  } catch (error) {
    console.error("[Anthropic] Error:", error);
    throw error;
  }
}
