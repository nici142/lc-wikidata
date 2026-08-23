export type Season = "fruehling" | "sommer" | "herbst" | "winter";
export type Difficulty = "einfach" | "mittel" | "anspruchsvoll";
export type Location = "balkon" | "garten";
export type ToxicityLevel = "giftig" | "leicht_giftig" | "ungiftig";
export type Sunlight = "sonne" | "halbschatten" | "schatten";
export type Watering = "wenig" | "mittel" | "viel";

export interface Toxicity {
  cats: ToxicityLevel;
  dogs: ToxicityLevel;
  notes?: string;
}

export interface Plant {
  id: string;
  name: string;
  latinName: string;
  emoji: string;
  description: string;
  locations: Location[];
  seasons: Season[];
  difficulty: Difficulty;
  sunlight: Sunlight;
  watering: Watering;
  careTips: string[];
  toxicity: Toxicity;
}

export const SEASON_LABELS: Record<Season, string> = {
  fruehling: "Frühling",
  sommer: "Sommer",
  herbst: "Herbst",
  winter: "Winter",
};

export const SEASON_ICONS: Record<Season, string> = {
  fruehling: "🌱",
  sommer: "☀️",
  herbst: "🍂",
  winter: "❄️",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  einfach: "Leicht zu pflegen",
  mittel: "Mittlerer Aufwand",
  anspruchsvoll: "Anspruchsvoll",
};

export const LOCATION_LABELS: Record<Location, string> = {
  balkon: "Balkon",
  garten: "Garten",
};

export const TOXICITY_LABELS: Record<ToxicityLevel, string> = {
  giftig: "Giftig",
  leicht_giftig: "Leicht giftig",
  ungiftig: "Unbedenklich",
};
