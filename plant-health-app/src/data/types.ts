export type Season = "fruehling" | "sommer" | "herbst" | "winter";
export type Difficulty = "einfach" | "mittel" | "anspruchsvoll";
export type Location = "balkon" | "garten" | "zimmer" | "bad" | "kueche";
export type ToxicityLevel = "giftig" | "leicht_giftig" | "ungiftig";
export type Sunlight = "sonne" | "halbschatten" | "schatten";
export type Watering = "wenig" | "mittel" | "viel";
export type Category = "zier" | "gemuese" | "obst" | "kraeuter";

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
  /** Optional: markiert Gemüse/Obst/Kräuter. Fehlt bei reinen Zierpflanzen. */
  category?: Category;
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
  zimmer: "Zimmer",
  bad: "Badezimmer",
  kueche: "Küche",
};

export const TOXICITY_LABELS: Record<ToxicityLevel, string> = {
  giftig: "Giftig",
  leicht_giftig: "Leicht giftig",
  ungiftig: "Unbedenklich",
};

export const SUNLIGHT_LABELS: Record<Sunlight, string> = {
  sonne: "Sonne",
  halbschatten: "Halbschatten",
  schatten: "Schatten",
};

export const SUNLIGHT_ICONS: Record<Sunlight, string> = {
  sonne: "🌞",
  halbschatten: "⛅",
  schatten: "🌑",
};

export const WATERING_LABELS: Record<Watering, string> = {
  wenig: "Wenig Wasser",
  mittel: "Mittlerer Wasserbedarf",
  viel: "Viel Wasser",
};

export const WATERING_ICONS: Record<Watering, string> = {
  wenig: "💧",
  mittel: "💧💧",
  viel: "💧💧💧",
};
