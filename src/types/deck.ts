export type SlideType = "standard" | "chart" | "image";

export interface ChartInfo {
  type: "bar" | "pie" | "line";
  data: {
    labels: string[];
    values: number[];
  };
}

export interface Slide {
  id: string;
  type: "standard" | "chart" | "intro" | "qa";
  title: string;
  bullets: string[];
  chart: ChartInfo | null;
  imagePrompt: string | null;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  slides: Slide[];
  createdAt: string;
  status?: "available" | "presented";
}

