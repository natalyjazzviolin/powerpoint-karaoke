export type SlideType = "standard" | "chart" | "image";

export interface ChartData {
  type: "bar" | "pie" | "line";
  labels: string[];
  data: number[];
}

export interface Slide {
  id: string;
  type: SlideType;
  title: string;
  bullets?: string[];
  chart?: ChartData | null;
  imagePrompt?: string | null;
  regeneratedVersions: Slide[];
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  slides: Slide[];
  createdAt: string; // ISO timestamp
}
