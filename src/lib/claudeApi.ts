import type { Deck, Slide } from "../types/deck";

export async function generateDeck(): Promise<Deck> {
  const prompt = `
You are helping generate fun but work-appropriate business sales presentations.
Requirements:

- Topic must be business-related (technology, SaaS, data, remote work, productivity tools).
- Humor must be light, safe, and appropriate for a professional work environment.
- Create a fake product or service to sell.
- Presentation structure:
  - Title
  - Funny Description
  - 5-7 slides
    - Each slide has title, bullets, optionally a chart, optionally an image description
- Return ONLY valid JSON matching this structure:

{
  "id": "deck-1234",
  "title": "Why Your Database Needs Therapy",
  "description": "Exploring stress management strategies for overworked databases.",
  "slides": [
    {
      "id": "slide-1",
      "type": "standard",
      "title": "Symptoms of Burnout",
      "bullets": ["Slow queries", "Frequent timeouts", "Schema changes causing anxiety"],
      "chart": null,
      "imagePrompt": "A cartoon database meditating at a spa retreat"
    }
  ],
  "createdAt": "ISO timestamp like 2024-04-27T12:00:00Z"
}
Respond ONLY with JSON — no extra text.
`;

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

  const parsed = JSON.parse(textBlock.text) as Deck;
  return parsed;
}

export async function regenerateSlide(slideContext: Slide): Promise<Slide> {
  const prompt = `Rewrite this slide: ${JSON.stringify(slideContext)} ...`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": import.meta.env.PUBLIC_CLAUDE_API_KEY,
      "content-type": "application/json",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-opus-20240229",
      temperature: 0.7,
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Claude API Error:", error);
    throw new Error("Failed to regenerate slide.");
  }

  const data = await response.json();
  console.log("Claude Raw Response:", data);

  if (!data.content) {
    throw new Error("Claude response missing content field.");
  }

  return JSON.parse(data.content) as Slide;
}
