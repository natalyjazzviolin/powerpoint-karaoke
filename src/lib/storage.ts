import type { Deck } from "../types/deck";
import { get, set, keys } from "idb-keyval";

export async function saveDeck(deck: Deck): Promise<void> {
  await set(`pptk-${deck.id}`, JSON.stringify(deck));
}

export async function getDeck(id: string): Promise<Deck | null> {
  const item = await get(`pptk-${id}`);
  return item ? (JSON.parse(item as string) as Deck) : null;
}


export async function listDecks(): Promise<Deck[]> {
  const allKeys = await keys();
  const decks: Deck[] = [];

  for (const key of allKeys) {
    if (
      typeof key === "string" &&
      key.startsWith("pptk-") &&
      !key.startsWith("pptk-img-")
    ) {
      const item = await get(key);
      if (item) {
        decks.push(JSON.parse(item as string) as Deck);
      }
    }
  }

  return decks.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

