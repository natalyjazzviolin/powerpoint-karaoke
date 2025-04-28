// src/components/DeckViewer.tsx

import { useState, useEffect } from "react";
import ChartIsland from "./ChartIsland";
import type { Deck, Slide } from "../types/deck";

interface DeckViewerProps {
  id: string;
}

export default function DeckViewer({ id }: DeckViewerProps) {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

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

  if (!deck) {
    return <p className="text-center text-xl text-red-500">Deck not found!</p>;
  }

  const slide = deck.slides[slideIndex];

  function prevSlide() {
    if (deck && slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    }
  }

  function nextSlide() {
    if (deck && slideIndex < deck.slides.length - 1) {
      setSlideIndex(slideIndex + 1);
    }
  }

  async function regenerateSlide() {
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

      if (!deck) {
        throw new Error("Deck not loaded");
      }

      const updatedDeck: Deck = {
        ...(deck as Deck),
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
              <div className="italic text-gray-500 mt-6">
                Imagine: {slide.imagePrompt}
              </div>
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
          className="bg-red-500 text-white py-2 px-4 rounded"
        >
          Regenerate Slide
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
