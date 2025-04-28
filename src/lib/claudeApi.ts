import type { Deck, Slide } from "../types/deck";
import generateDeckPrompt from "./prompts/generateDeckPrompt";
import regenerateSlidePrompt from "./prompts/regenerateSlidePrompt";

export async function generateDeck(): Promise<Deck> {
  const prompt = generateDeckPrompt;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": import.meta.env.PUBLIC_CLAUDE_API_KEY,
      "content-type": "application/json",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-opus-20240229",
      max_tokens: 3000,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Claude API Error Response:", errorText);
    throw new Error("Failed to fetch from Claude API");
  }

  const data = await response.json();
  console.log("Claude API Success Response:", data);

  if (!Array.isArray(data.content)) {
    console.error("Expected content array in Claude response:", data);
    throw new Error("Claude response missing content array.");
  }

  const textBlock = data.content.find((block: any) => block.type === "text");

  if (!textBlock || typeof textBlock.text !== "string") {
    console.error("No valid text block found:", data);
    throw new Error("Claude response missing text block.");
  }

  const parsed = JSON.parse(textBlock.text);
  parsed.id = `deck-${crypto.randomUUID()}`;
  return parsed as Deck;
}

export async function regenerateSlide(slideContext: Slide): Promise<Slide> {
  const prompt = regenerateSlidePrompt(slideContext);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": import.meta.env.PUBLIC_CLAUDE_API_KEY,
      "content-type": "application/json",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1500,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Claude API Error:", error);
    throw new Error("Failed to regenerate slide.");
  }

  const data = await response.json();

  const textBlock = data.content.find((block: any) => block.type === "text");

  if (!textBlock || typeof textBlock.text !== "string") {
    throw new Error("Claude response missing text block.");
  }

  const rawText = textBlock.text.trim();

  // ✨ Try to extract JSON if there's any leading text
  const firstBrace = rawText.indexOf("{");
  const lastBrace = rawText.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    console.error("Claude returned no JSON block:", rawText);
    throw new Error("No JSON object found in Claude output.");
  }

  const jsonText = rawText.slice(firstBrace, lastBrace + 1);

  const newSlide = JSON.parse(jsonText) as Slide;
  return newSlide;

}
