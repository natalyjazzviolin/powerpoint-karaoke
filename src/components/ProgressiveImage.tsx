import { useEffect, useState } from "react";

interface ProgressiveImageProps {
  prompt: string;
  prefetchedUrl?: string;
}

export default function ProgressiveImage({
  prompt,
  prefetchedUrl,
}: ProgressiveImageProps) {
  const [aiImageUrl, setAiImageUrl] = useState<string | null>(
    prefetchedUrl || null
  );
  const [loading, setLoading] = useState(!prefetchedUrl);

  useEffect(() => {
    if (prefetchedUrl) {
      setAiImageUrl(prefetchedUrl);
      setLoading(false);
      return; // Skip generating again
    }

    async function fetchAiImage() {
      try {
        const res = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });

        const { url } = await res.json();
        setAiImageUrl(url);
      } catch (error) {
        console.error("Failed to fetch AI image:", error);
      }
    }

    fetchAiImage();
  }, [prompt, prefetchedUrl]);

  return (
    <div className="relative w-[300px] h-[300px] overflow-hidden rounded shadow-md">
      {/* Loading color block */}
      {loading && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 transition-opacity duration-700"></div>
      )}

      {/* AI Image */}
      {aiImageUrl && (
        <img
          src={aiImageUrl}
          alt={prompt}
          onLoad={() => setLoading(false)}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
        />
      )}
    </div>
  );
}
