export const prerender = false;

import type { APIRoute } from "astro";
import { generateDeck } from "../../lib/claudeApi";

export const POST: APIRoute = async ({ request }) => {
  const deck = await generateDeck();
  return new Response(JSON.stringify(deck), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
