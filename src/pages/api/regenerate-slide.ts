import type { APIRoute } from "astro";
import { regenerateSlide } from "../../lib/claudeApi";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const slide = body.slide;

  if (!slide) {
    return new Response(JSON.stringify({ error: "Missing slide" }), {
      status: 400,
    });
  }

  const newSlide = await regenerateSlide(slide);
  return new Response(JSON.stringify(newSlide), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
