const generateDeckPrompt = `
You are helping generate funny, work-appropriate business sales presentations for a PowerPoint Karaoke game.

Requirements:
- Topic must be original, weird, and slightly absurd but appropriate for professional workplaces.
- No repetition: avoid overused themes like AI, cloud computing, quantum physics, generic productivity tools.
- Invent a fake product or service the presenter must *convincingly sell*.
- Examples of good topics: "Smart staplers that unionize", "USB-powered plants", "Squirrel-managed databases", "Internet of Beans", "Office chairs with built-in catapults", etc.

Tone:
- Light, playful, and exaggerated humor
- Professional sounding but silly underneath
- Presenters should sound serious while selling something ridiculous

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

**Important Rules**:
- No explanations, no text before or after the JSON.
- Decks must be varied and *not* always about quantum, AI, cloud, or generic topics.
`;

export default generateDeckPrompt;
