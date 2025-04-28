import { useState, useEffect } from "react";
import ChartIsland from "./ChartIsland";
import type { Deck, Slide } from "../types/deck";
import ProgressiveImage from "./ProgressiveImage";
import { get, set } from "idb-keyval";

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
    function handleKeyDown(e: KeyboardEvent) {
        if (!deck || !deck.slides) { return }
      if (e.key === "ArrowRight") {
        setSlideIndex((prev) =>
          Math.min(prev + 1, deck?.slides.length - 1 || 0)
        );
      } else if (e.key === "ArrowLeft") {
        setSlideIndex((prev) => Math.max(prev - 1, 0));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deck]);

  useEffect(() => {
    if (!deck) return;

    const nextSlide = deck.slides[slideIndex + 1];
    if (nextSlide && nextSlide.imagePrompt && !prefetchedImages[nextSlide.id]) {
      prefetchImage(nextSlide.id, nextSlide.imagePrompt);
    }
  }, [slideIndex, deck]);

  async function prefetchImage(slideId: string, prompt: string) {
    if (!deck) return; // <- make sure deck is available

    const enhancedPrompt = `${prompt} - deck ${deck.id}`;

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: enhancedPrompt }),
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

    if (slideIndex < (deck.slides?.length ?? 0) - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      // Last slide → mark deck as presented and return home
      finishDeck();
    }
  }

  function finishDeck() {
    if (!deck) return;

    const updatedDeck = { ...deck, status: "presented" };
    localStorage.setItem(`pptk-${updatedDeck.id}`, JSON.stringify(updatedDeck));
    window.location.href = "/";
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
    <div className="relative">
      {/* Top-right Regenerate Button */}
      {slide.type !== "intro" && (
        <button
          onClick={regenerateSlide}
          className="absolute top-4 right-4 bg-white border border-gray-300 rounded-full p-2 shadow hover:rotate-90 transition"
          title="Regenerate Slide"
        >
          🔄
        </button>
      )}

      {/* Main Content */}
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 ">
        {slide.type === "intro" ? (
          <>
            <div className="w-full flex justify-center">
              <h1 className="text-4xl font-extrabold mb-6 max-w-[600px] text-center">
                {slide.title}
              </h1>
            </div>
            <p className="text-xl text-gray-700 max-w-2xl">
              {slide.imagePrompt}
            </p>
          </>
        ) : (
          <div className="w-full flex justify-center">
            <div className="flex flex-col md:flex-row justify-around items-start w-full max-w-[800px] gap-8">
              {/* LEFT: Text side */}
              <div className="w-full md:w-2/3 text-center md:text-left">
                <h2 className="text-4xl font-extrabold mb-6">{slide.title}</h2>

                {slide.bullets?.length > 0 && (
                  <ul className="list-disc ml-5 space-y-4 text-2xl">
                    {slide.bullets.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                )}

                {slide.chart && (
                  <div className="my-8">
                    <ChartIsland slide={slide} />
                  </div>
                )}
              </div>

              {/* RIGHT: Image side */}
              {slide.imagePrompt && (
                <div className="w-full md:w-1/3 flex justify-center">
                  <ProgressiveImage
                    prompt={slide.imagePrompt}
                    prefetchedUrl={prefetchedImages[slide.id]}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="w-full flex justify-center mt-8">
        <div className="flex justify-between items-center w-full max-w-2xl mt-8">
          <button
            onClick={prevSlide}
            disabled={slideIndex === 0}
            className={`py-2 px-4 rounded transition
      ${
        slideIndex === 0
          ? "invisible bg-gray-200 text-gray-200 cursor-default"
          : "bg-gray-400 hover:bg-gray-500 text-white cursor-pointer"
      }`}
          >
            Previous
          </button>

          {slideIndex === (deck.slides?.length ?? 0) - 1 ? (
            <button
              onClick={finishDeck}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded"
            >
              Finish
            </button>
          ) : (
            <button
              onClick={nextSlide}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
