import { useState, useEffect } from "react";
import ChartIsland from "./ChartIsland";
import type { Deck, Slide } from "../types/deck";
import ProgressiveImage from "./ProgressiveImage";

interface DeckViewerProps {
  id: string;
}

export default function DeckViewer({ id }: DeckViewerProps) {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const [prefetchedImages, setPrefetchedImages] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const deckJson = localStorage.getItem(`pptk-${id}`);
    if (!deckJson) return;

    const parsedDeck = JSON.parse(deckJson) as Deck;

    parsedDeck.slides.unshift({
      id: "intro-slide",
      type: "intro",
      title: parsedDeck.title,
      bullets: [],
      chart: null,
      imagePrompt: parsedDeck.description,
    });

    setDeck(parsedDeck);
  }, [id]);

  useEffect(() => {
    if (!deck) return;

    const nextSlide = deck.slides[slideIndex + 1];
    if (nextSlide && nextSlide.imagePrompt && !prefetchedImages[nextSlide.id]) {
      prefetchImage(nextSlide.id, nextSlide.imagePrompt);
    }
  }, [slideIndex, deck]);

  async function prefetchImage(slideId: string, prompt: string) {
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const { url } = await res.json();

      setPrefetchedImages((prev) => ({ ...prev, [slideId]: url }));
    } catch (error) {
      console.error("Prefetching image failed:", error);
    }
  }

  function prevSlide() {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    }
  }

  function nextSlide() {
    if (!deck) return;

    if (slideIndex < deck.slides.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      celebrateAndExit();
    }
  }

  function celebrateAndExit() {
    const messages = [
      "🤖 AI has taken over your presentation!",
      "🛸 Robots are now running your meetings!",
      "📈 AI salesbots are closing deals without you!",
      "🧠 Your brain has been outsourced to a neural net!",
      "☁️ All cloud data now belongs to AI Overlords!",
      "🪄 Your PowerPoints are now procedurally generated forever!",
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    const viewer = document.getElementById("deck-viewer");
    if (viewer) {
      viewer.innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
          <h1 class="text-4xl font-bold text-purple-600 animate-pulse mb-6">${randomMessage}</h1>
          <p class="text-lg text-gray-500">Redirecting you back to safety...</p>
        </div>
      `;
    }

    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  }

  async function regenerateSlide() {
    if (!deck) return;
    const slide = deck.slides[slideIndex];
    if (!slide || slide.type === "intro") {
      alert("Cannot regenerate the title slide!");
      return;
    }

    setDeck(
      (prev) =>
        prev && {
          ...prev,
          slides: prev.slides.map((s, idx) =>
            idx === slideIndex ? { ...s, title: "Regenerating..." } : s
          ),
        }
    );

    try {
      const res = await fetch("/api/regenerate-slide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slide }),
      });
      const newSlide = await res.json();

      const updatedDeck: Deck = {
        ...deck,
        slides: deck.slides.map((s, idx) =>
          idx === slideIndex ? newSlide : s
        ),
      };

      localStorage.setItem(`pptk-${id}`, JSON.stringify(updatedDeck));
      setDeck(updatedDeck);
    } catch (error) {
      console.error(error);
      alert("Failed to regenerate slide.");
    }
  }

  if (!deck) {
    return <p className="text-center text-xl text-red-500">Deck not found!</p>;
  }

  const slide = deck.slides[slideIndex];

  return (
    <div>
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8">
        {slide.type === "intro" ? (
          <>
            <h1 className="text-5xl font-extrabold mb-6 text-purple-600">
              {slide.title}
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl">
              {slide.imagePrompt}
            </p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>

            {slide.bullets?.length > 0 && (
              <ul className="list-disc ml-5 space-y-2">
                {slide.bullets.map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
            )}

            {slide.chart && (
              <div className="my-8 w-full max-w-xl">
                <ChartIsland slide={slide} />
              </div>
            )}

            {slide.imagePrompt && (
              <ProgressiveImage
                prompt={slide.imagePrompt}
                prefetchedUrl={prefetchedImages[slide.id]}
              />
            )}
          </>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={prevSlide}
          className="bg-gray-400 text-white py-2 px-4 rounded"
        >
          Previous
        </button>
        <button
          onClick={regenerateSlide}
          className="absolute top-4 right-4 bg-white border border-gray-300 rounded-full p-2 shadow hover:rotate-90 transition"
          title="Regenerate Slide"
        >
          🔄
        </button>
        <button
          onClick={nextSlide}
          className="bg-green-600 text-white py-2 px-4 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
