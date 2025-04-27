import type { Deck } from "../types/deck";

/**
 * Save a deck to localStorage
 */
export function saveDeck(deck: Deck): void {
  localStorage.setItem(`pptk-${deck.id}`, JSON.stringify(deck));
}

/**
 * Load a single deck from localStorage
 */
export function getDeck(id: string): Deck | null {
  const item = localStorage.getItem(`pptk-${id}`);
  return item ? (JSON.parse(item) as Deck) : null;
}

/**
 * List all saved decks from localStorage
 */
export function listDecks(): Deck[] {
  const decks: Deck[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("pptk-")) {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          decks.push(JSON.parse(item) as Deck);
        } catch (error) {
          console.error("Failed to parse deck:", error);
        }
      }
    }
  }

  // Optional: sort decks newest first
  return decks.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
