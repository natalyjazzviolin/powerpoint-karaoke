const generateDeckPrompt = `
You are helping generate silly but work-appropriate business sales presentations for a PowerPoint Karaoke game.

Requirements:

- The topic must be business-related (technology, SaaS, databases, remote work, AI, productivity tools, cybersecurity, etc.).
- The tone must be playful, light, exaggerated, and humorous — appropriate for professional environments.
- Invent a fake product or service to sell.
- Presentation Structure:
  - "title" — Funny but plausible business title
  - "description" — Lightly humorous overview of the presentation
  - "slides" — 5–7 slides
    - Each slide must have:
      - "id" — unique slide ID
      - "type" — either "standard" or "chart"
      - "title" — short, funny title
      - "bullets" — 2–4 humorous bullet points (if applicable)
      - "chart" (optional):
        - If included, must be an object, not a string
        - Chart object structure:
          {
            "type": "bar" | "pie" | "line",
            "data": {
              "labels": [Array of 3–6 short funny labels],
              "values": [Array of 3–6 numbers between 0 and 100]
            }
          }
      - "imagePrompt" (optional) — short funny image idea related to the slide
- Final Object Fields:
  - "id": unique deck ID like "deck-1234"
  - "title": deck title
  - "description": deck description
  - "slides": array of slides
  - "createdAt": ISO 8601 timestamp (e.g., "2024-04-27T12:00:00Z")

STRICT RULES:
- Return ONLY valid JSON matching this structure.
- No extra explanations, no notes, no "Here is the JSON:" preambles.
- Start output with { and end with }.
`;

export default generateDeckPrompt;
