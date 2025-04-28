// src/pages/api/generate-image.ts

export const prerender = false;

import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const { prompt } = await request.json();

  try {
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("output_format", "jpeg");
    formData.append("model", "stable-diffusion-2-1");
    formData.append("steps", "10");
    formData.append("cfg_scale", "5");
    formData.append("aspect_ratio", "1:1");

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.STABILITY_API_KEY}`,
          Accept: "image/*",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      console.error("Stability response error:", await response.text());
      return new Response(
        JSON.stringify({ error: "Failed to generate image" }),
        { status: 500 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );

    const base64Url = `data:image/png;base64,${base64}`;

    return new Response(JSON.stringify({ url: base64Url }), { status: 200 });
  } catch (error) {
    console.error("Stability AI error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};
