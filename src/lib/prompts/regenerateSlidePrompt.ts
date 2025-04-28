const regenerateSlidePrompt = (slideContext: object) => `
You are rewriting a single presentation slide for a PowerPoint Karaoke game for software engineers.

Requirements:

- Make the rewritten slide funny, playful, and absurd — but still work-appropriate.
- Keep the same structure: title, bullets, optional chart, optional imagePrompt.
- Chart data (if present) must stay realistic (use funny labels if you regenerate).
- Focus on humor, exaggeration, irony, or absurdity.

STRICT RULES:
- Only return pure JSON.
- No explanations or notes or preambles.

Here is the slide to rewrite:
${JSON.stringify(slideContext, null, 2)}
`;

export default regenerateSlidePrompt;
