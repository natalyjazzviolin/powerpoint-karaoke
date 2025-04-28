const generateDeckPrompt = `
You are helping generate funny but work-appropriate business sales presentations for a PowerPoint Karaoke game.

Requirements:

- Topics must be related to business, technology, AI, SaaS, databases, remote work, cybersecurity, or wildly impractical tech ideas.
- Humor should be creative, silly, exaggerated, and imaginative — but still appropriate for professional settings.
- Encourage absurd products: e.g., a "supercomputer that only runs JavaScript", "AI that writes poetry for databases", "VPNs for dogs", etc.
- Avoid overused themes like "productivity" or "remote meetings" unless presented in a highly absurd or original way.

Presentation Structure:
- "title": A funny and memorable title for the deck
- "description": A short humorous overview of the presentation
- 5–7 slides
  - Each slide must include:
    - "id": Unique slide ID
    - "type": "standard" or "chart"
    - "title": Short, funny title
    - "bullets": 2–4 humorous bullet points
    - Optional "chart" field:
      - { "type": "bar" | "pie" | "line", "data": { "labels": [...], "values": [...] } }
    - Optional "imagePrompt" field: a short, highly specific and silly idea for an illustration

Final Output:
- Only return valid JSON
- No text explanations
- First character must be \`{\` and last character must be \`}\`

IMPORTANT:
- Each deck should have a **distinct and imaginative theme**.
- No repeating generic topics like "boosting productivity" unless done extremely absurdly.
`;

export default generateDeckPrompt;
