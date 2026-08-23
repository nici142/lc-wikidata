import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { plants } from "../data/plants";
import type { Category, Difficulty, Location, Season, Sunlight, Watering } from "../data/types";
import {
  DIFFICULTY_LABELS,
  LOCATION_LABELS,
  SEASON_ICONS,
  SEASON_LABELS,
  SUNLIGHT_ICONS,
  SUNLIGHT_LABELS,
  WATERING_ICONS,
  WATERING_LABELS,
} from "../data/types";
import PlantCard from "../components/PlantCard";
import PageHeader from "../components/PageHeader";
import FilterGroup from "../components/FilterGroup";
import { useFavorites } from "../hooks/useFavorites";

type PetFilter = "alle" | "katzen" | "hunde" | "beide";
type SortOption = "empfohlen" | "name" | "pflege";

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("ß", "ss");
}

function readParam<T extends string>(params: URLSearchParams, key: string, allowed: T[], fallback: T): T {
  const value = params.get(key);
  return (allowed as string[]).includes(value ?? "") ? (value as T) : fallback;
}

const DIFFICULTY_ORDER: Record<Difficulty, number> = { einfach: 0, mittel: 1, anspruchsvoll: 2 };

const standortOptions: { value: Location | "alle"; label: string; icon?: string }[] = [
  { value: "alle", label: "Alle" },
  { value: "balkon", label: LOCATION_LABELS.balkon, icon: "🪴" },
  { value: "garten", label: LOCATION_LABELS.garten, icon: "🌳" },
  { value: "zimmer", label: LOCATION_LABELS.zimmer, icon: "🏠" },
  { value: "bad", label: LOCATION_LABELS.bad, icon: "🛁" },
  { value: "kueche", label: LOCATION_LABELS.kueche, icon: "🍳" },
];

const kategorieOptions: { value: Category | "alle"; label: string; icon?: string }[] = [
  { value: "alle", label: "Alle" },
  { value: "zier", label: "Zierpflanzen", icon: "🌸" },
  { value: "gemuese", label: "Gemüse", icon: "🥕" },
  { value: "obst", label: "Obst", icon: "🍓" },
  { value: "kraeuter", label: "Kräuter", icon: "🌿" },
];

const seasonOptions: { value: Season | "alle"; label: string; icon?: string }[] = [
  { value: "alle", label: "Alle" },
  { value: "fruehling", label: SEASON_LABELS.fruehling, icon: SEASON_ICONS.fruehling },
  { value: "sommer", label: SEASON_LABELS.sommer, icon: SEASON_ICONS.sommer },
  { value: "herbst", label: SEASON_LABELS.herbst, icon: SEASON_ICONS.herbst },
  { value: "winter", label: SEASON_LABELS.winter, icon: SEASON_ICONS.winter },
];

const difficultyOptions: { value: Difficulty | "alle"; label: string }[] = [
  { value: "alle", label: "Alle" },
  { value: "einfach", label: DIFFICULTY_LABELS.einfach },
  { value: "mittel", label: DIFFICULTY_LABELS.mittel },
  { value: "anspruchsvoll", label: DIFFICULTY_LABELS.anspruchsvoll },
];

const petOptions: { value: PetFilter; label: string; icon?: string }[] = [
  { value: "alle", label: "Alle" },
  { value: "katzen", label: "Nur Katzen sicher", icon: "🐱" },
  { value: "hunde", label: "Nur Hunde sicher", icon: "🐶" },
  { value: "beide", label: "Katzen & Hunde sicher", icon: "🐾" },
];

const sunlightOptions: { value: Sunlight | "alle"; label: string; icon?: string }[] = [
  { value: "alle", label: "Alle" },
  { value: "sonne", label: SUNLIGHT_LABELS.sonne, icon: SUNLIGHT_ICONS.sonne },
  { value: "halbschatten", label: SUNLIGHT_LABELS.halbschatten, icon: SUNLIGHT_ICONS.halbschatten },
  { value: "schatten", label: SUNLIGHT_LABELS.schatten, icon: SUNLIGHT_ICONS.schatten },
];

const wateringOptions: { value: Watering | "alle"; label: string; icon?: string }[] = [
  { value: "alle", label: "Alle" },
  { value: "wenig", label: WATERING_LABELS.wenig, icon: WATERING_ICONS.wenig },
  { value: "mittel", label: WATERING_LABELS.mittel, icon: WATERING_ICONS.mittel },
  { value: "viel", label: WATERING_LABELS.viel, icon: WATERING_ICONS.viel },
];

export default function PlantFinderPage() {
  const [params, setParams] = useSearchParams();
  const { favorites, count: favoriteCount } = useFavorites();

  const [query, setQuery] = useState(params.get("q") ?? "");
  const [standort, setStandort] = useState(
    readParam<Location | "alle">(
      params,
      "standort",
      ["alle", "balkon", "garten", "zimmer", "bad", "kueche"],
      "alle",
    ),
  );
  const [kategorie, setKategorie] = useState(
    readParam<Category | "alle">(
      params,
      "kategorie",
      ["alle", "zier", "gemuese", "obst", "kraeuter"],
      "alle",
    ),
  );
  const [season, setSeason] = useState(
    readParam<Season | "alle">(params, "jahreszeit", ["alle", "fruehling", "sommer", "herbst", "winter"], "alle"),
  );
  const [difficulty, setDifficulty] = useState(
    readParam<Difficulty | "alle">(params, "pflege", ["alle", "einfach", "mittel", "anspruchsvoll"], "alle"),
  );
  const [pet, setPet] = useState(
    readParam<PetFilter>(params, "tier", ["alle", "katzen", "hunde", "beide"], "alle"),
  );
  const [sunlight, setSunlight] = useState(
    readParam<Sunlight | "alle">(params, "licht", ["alle", "sonne", "halbschatten", "schatten"], "alle"),
  );
  const [watering, setWatering] = useState(
    readParam<Watering | "alle">(params, "wasser", ["alle", "wenig", "mittel", "viel"], "alle"),
  );
  const [onlyFavorites, setOnlyFavorites] = useState(params.get("favoriten") === "1");
  const [sort, setSort] = useState(
    readParam<SortOption>(params, "sortierung", ["empfohlen", "name", "pflege"], "empfohlen"),
  );
  // Bei einem Deep-Link mit vorbelegten Filtern (z. B. von der Startseite) das Panel
  // direkt geöffnet zeigen, damit klar ist, warum die Liste schon gefiltert ist.
  const [filtersOpen, setFiltersOpen] = useState(
    () =>
      standort !== "alle" ||
      kategorie !== "alle" ||
      season !== "alle" ||
      difficulty !== "alle" ||
      pet !== "alle" ||
      sunlight !== "alle" ||
      watering !== "alle",
  );

  // Aktive Filter in der URL spiegeln, damit sich Ansichten teilen/mit Zurück-Button aufrufen lassen.
  useEffect(() => {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (standort !== "alle") next.set("standort", standort);
    if (kategorie !== "alle") next.set("kategorie", kategorie);
    if (season !== "alle") next.set("jahreszeit", season);
    if (difficulty !== "alle") next.set("pflege", difficulty);
    if (pet !== "alle") next.set("tier", pet);
    if (sunlight !== "alle") next.set("licht", sunlight);
    if (watering !== "alle") next.set("wasser", watering);
    if (onlyFavorites) next.set("favoriten", "1");
    if (sort !== "empfohlen") next.set("sortierung", sort);
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, standort, kategorie, season, difficulty, pet, sunlight, watering, onlyFavorites, sort]);

  const normalizedQuery = normalize(query.trim());

  const filtered = useMemo(() => {
    const result = plants.filter((p) => {
      if (standort !== "alle" && !p.locations.includes(standort)) return false;
      if (kategorie !== "alle" && (p.category ?? "zier") !== kategorie) return false;
      if (season !== "alle" && !p.seasons.includes(season)) return false;
      if (difficulty !== "alle" && p.difficulty !== difficulty) return false;
      if (sunlight !== "alle" && p.sunlight !== sunlight) return false;
      if (watering !== "alle" && p.watering !== watering) return false;
      if (pet === "katzen" && p.toxicity.cats !== "ungiftig") return false;
      if (pet === "hunde" && p.toxicity.dogs !== "ungiftig") return false;
      if (pet === "beide" && (p.toxicity.cats !== "ungiftig" || p.toxicity.dogs !== "ungiftig")) return false;
      if (onlyFavorites && !favorites.has(p.id)) return false;
      if (normalizedQuery) {
        const haystack = normalize([p.name, p.latinName, p.description, ...p.careTips].join(" "));
        if (!haystack.includes(normalizedQuery)) return false;
      }
      return true;
    });

    if (sort === "name") {
      return [...result].sort((a, b) => a.name.localeCompare(b.name, "de"));
    }
    if (sort === "pflege") {
      return [...result].sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]);
    }
    return result;
  }, [standort, kategorie, season, difficulty, sunlight, watering, pet, onlyFavorites, favorites, normalizedQuery, sort]);

  const produceLabel = kategorie === "obst" ? "Obstsorten" : "Gemüsesorten";
  const producePlants = useMemo(
    () =>
      kategorie === "gemuese" || kategorie === "obst"
        ? plants.filter((p) => p.category === kategorie)
        : [],
    [kategorie],
  );
  const balconyProduceCount = useMemo(
    () => producePlants.filter((p) => p.locations.includes("balkon")).length,
    [producePlants],
  );

  const herbs = useMemo(() => plants.filter((p) => p.category === "kraeuter"), []);
  const kitchenHerbCount = useMemo(
    () => herbs.filter((p) => p.locations.includes("kueche")).length,
    [herbs],
  );

  const categoryFilterCount = [standort, kategorie, season, difficulty, pet, sunlight, watering].filter(
    (v) => v !== "alle",
  ).length;
  const activeFilterCount = (query ? 1 : 0) + (onlyFavorites ? 1 : 0) + categoryFilterCount;

  function resetFilters() {
    setQuery("");
    setStandort("alle");
    setKategorie("alle");
    setSeason("alle");
    setDifficulty("alle");
    setPet("alle");
    setSunlight("alle");
    setWatering("alle");
    setOnlyFavorites(false);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        icon="🌿"
        title="Pflanzenfinder"
        description="Durchsuche alle Pflanzen und kombiniere beliebig viele Filter – z. B. nur katzensichere Balkonpflanzen für den Sommer."
      />

      <div className="relative mt-6">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-leaf-500">
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pflanze suchen, z. B. Lavendel, Aloe, Sansevieria …"
          className="w-full rounded-full border border-bark-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm outline-none placeholder:text-bark-400 focus:border-leaf-400 focus:ring-4 focus:ring-leaf-100"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Suche zurücksetzen"
            className="absolute inset-y-0 right-4 flex items-center text-bark-400 hover:text-bark-700"
          >
            ✕
          </button>
        )}
      </div>

      <div className="mt-2.5 flex gap-2.5">
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-5 py-3 text-sm font-medium transition-colors sm:flex-none ${
            filtersOpen || categoryFilterCount > 0
              ? "bg-leaf-700 text-white shadow-sm shadow-leaf-900/15"
              : "bg-white text-bark-700 ring-1 ring-bark-200 hover:bg-leaf-50 hover:text-leaf-800"
          }`}
        >
          <span aria-hidden>⚙️</span>
          Filter{categoryFilterCount > 0 ? ` (${categoryFilterCount})` : ""}
          <span aria-hidden className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`}>
            ▾
          </span>
        </button>
        <button
          type="button"
          onClick={() => setOnlyFavorites((v) => !v)}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-5 py-3 text-sm font-medium transition-colors sm:flex-none ${
            onlyFavorites
              ? "bg-clay-100 text-clay-600"
              : "bg-white text-bark-700 ring-1 ring-bark-200 hover:bg-clay-50 hover:text-clay-600"
          }`}
        >
          <span aria-hidden>{onlyFavorites ? "♥" : "♡"}</span>
          Merkliste{favoriteCount > 0 ? ` (${favoriteCount})` : ""}
        </button>
      </div>

      {filtersOpen && (
        <div className="mt-2.5 rounded-2xl border border-bark-200/70 bg-white/70 p-5">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FilterGroup label="Standort" value={standort} onChange={setStandort} options={standortOptions} />
            <FilterGroup label="Kategorie" value={kategorie} onChange={setKategorie} options={kategorieOptions} />
            <FilterGroup label="Jahreszeit" value={season} onChange={setSeason} options={seasonOptions} />
            <FilterGroup label="Pflegeaufwand" value={difficulty} onChange={setDifficulty} options={difficultyOptions} />
            <FilterGroup label="Lichtbedarf" value={sunlight} onChange={setSunlight} options={sunlightOptions} />
            <FilterGroup label="Wasserbedarf" value={watering} onChange={setWatering} options={wateringOptions} />
            <FilterGroup label="Tierhaltung" value={pet} onChange={setPet} options={petOptions} />
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="mt-4 text-xs font-medium text-leaf-700 underline decoration-leaf-300 underline-offset-2 hover:text-leaf-800"
            >
              Alle Filter zurücksetzen ({activeFilterCount})
            </button>
          )}
        </div>
      )}

      {producePlants.length > 0 && (
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-leaf-100 bg-leaf-50 p-3 text-sm text-leaf-800">
          <span aria-hidden>💡</span>
          <span>
            {balconyProduceCount} von {producePlants.length} {produceLabel} lassen sich in
            ausreichend großen Kübeln auch auf dem Balkon ziehen – filtere zusätzlich nach
            „Balkon", um sie zu sehen.
          </span>
        </div>
      )}

      {kategorie === "kraeuter" && (
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-leaf-100 bg-leaf-50 p-3 text-sm text-leaf-800">
          <span aria-hidden>💡</span>
          <span>
            {kitchenHerbCount} von {herbs.length} Kräutern eignen sich auch fürs Fensterbrett in
            der Küche – filtere zusätzlich nach „Küche", um sie zu sehen.
          </span>
        </div>
      )}

      {pet !== "alle" && (
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-clay-100 bg-clay-50 p-3 text-sm text-clay-600">
          <span aria-hidden>⚠️</span>
          <span>
            Die Giftigkeits-Angaben dienen der ersten Orientierung und ersetzen keine tierärztliche
            Beratung. Bei Vergiftungsverdacht sofort Tierarzt oder Giftnotruf kontaktieren.
          </span>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-bark-500">
          {filtered.length} {filtered.length === 1 ? "Pflanze gefunden" : "Pflanzen gefunden"}
        </p>
        <label className="flex items-center gap-2 text-xs text-bark-500">
          Sortieren nach
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-lg border border-bark-200 bg-white px-2.5 py-1.5 text-xs font-medium text-bark-700 outline-none focus:border-leaf-400"
          >
            <option value="empfohlen">Empfohlen</option>
            <option value="name">Name (A–Z)</option>
            <option value="pflege">Pflegeaufwand</option>
          </select>
        </label>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-bark-200 bg-white p-4 text-sm text-bark-500">
          Keine Pflanze gefunden.{" "}
          <button onClick={resetFilters} className="font-medium text-leaf-700 underline">
            Filter zurücksetzen
          </button>{" "}
          und erneut versuchen.
        </div>
      )}
    </div>
  );
}
