import { Link, useParams } from "react-router-dom";
import { plants } from "../data/plants";
import {
  DIFFICULTY_LABELS,
  LOCATION_LABELS,
  SEASON_ICONS,
  SEASON_LABELS,
  SUNLIGHT_ICONS,
  SUNLIGHT_LABELS,
  TOXICITY_LABELS,
  WATERING_ICONS,
  WATERING_LABELS,
} from "../data/types";
import PlantCard from "../components/PlantCard";
import { useFavorites } from "../hooks/useFavorites";

const toxicityColor: Record<string, string> = {
  giftig: "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
  leicht_giftig: "bg-clay-50 text-clay-600 ring-1 ring-clay-100",
  ungiftig: "bg-leaf-50 text-leaf-700 ring-1 ring-leaf-100",
};

export default function PlantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const plant = plants.find((p) => p.id === id);
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!plant) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-4xl">🌵</p>
        <h1 className="mt-4 font-display text-2xl font-semibold text-bark-900">
          Diese Pflanze kennen wir nicht
        </h1>
        <p className="mt-2 text-bark-500">
          Vielleicht wurde sie umbenannt oder existiert nicht (mehr) in der Datenbank.
        </p>
        <Link
          to="/pflanzen"
          className="mt-6 inline-flex items-center gap-1 rounded-full bg-leaf-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-leaf-800"
        >
          ← Zurück zum Pflanzenfinder
        </Link>
      </div>
    );
  }

  const favorite = isFavorite(plant.id);
  const petSafe = plant.toxicity.cats === "ungiftig" && plant.toxicity.dogs === "ungiftig";

  const related = plants
    .filter(
      (p) =>
        p.id !== plant.id &&
        ((p.category ?? "zier") === (plant.category ?? "zier") ||
          p.locations.some((l) => plant.locations.includes(l))),
    )
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link
        to="/pflanzen"
        className="inline-flex items-center gap-1 text-sm font-medium text-leaf-700 hover:text-leaf-800"
      >
        ← Zurück zum Pflanzenfinder
      </Link>

      <div className="mt-5 flex flex-col gap-5 rounded-3xl border border-bark-200/70 bg-white/90 p-6 sm:flex-row sm:items-start sm:p-8">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-leaf-50 text-5xl leading-none ring-1 ring-leaf-100">
          {plant.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-semibold text-bark-900 sm:text-3xl">
                {plant.name}
              </h1>
              <p className="italic text-bark-400">{plant.latinName}</p>
            </div>
            <button
              type="button"
              onClick={() => toggleFavorite(plant.id)}
              aria-pressed={favorite}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                favorite
                  ? "bg-clay-100 text-clay-600"
                  : "bg-bark-100 text-bark-600 hover:bg-clay-50 hover:text-clay-600"
              }`}
            >
              <span aria-hidden>{favorite ? "♥" : "♡"}</span>
              {favorite ? "Gemerkt" : "Merken"}
            </button>
          </div>
          <p className="mt-3 leading-relaxed text-bark-700">{plant.description}</p>
          {petSafe && (
            <span className="mt-3 inline-block rounded-full bg-leaf-100 px-3 py-1 text-xs font-medium text-leaf-700">
              🐾 tierfreundlich für Katzen & Hunde
            </span>
          )}
        </div>
      </div>

      {/* Steckbrief */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-bark-200/70 bg-white/70 p-3 text-center">
          <div className="text-lg">{DIFFICULTY_LABELS[plant.difficulty].startsWith("Leicht") ? "🟢" : plant.difficulty === "mittel" ? "🟠" : "🔴"}</div>
          <div className="mt-1 text-xs font-medium text-bark-700">{DIFFICULTY_LABELS[plant.difficulty]}</div>
        </div>
        <div className="rounded-xl border border-bark-200/70 bg-white/70 p-3 text-center">
          <div className="text-lg">{SUNLIGHT_ICONS[plant.sunlight]}</div>
          <div className="mt-1 text-xs font-medium text-bark-700">{SUNLIGHT_LABELS[plant.sunlight]}</div>
        </div>
        <div className="rounded-xl border border-bark-200/70 bg-white/70 p-3 text-center">
          <div className="text-lg">{WATERING_ICONS[plant.watering]}</div>
          <div className="mt-1 text-xs font-medium text-bark-700">{WATERING_LABELS[plant.watering]}</div>
        </div>
        <div className="rounded-xl border border-bark-200/70 bg-white/70 p-3 text-center">
          <div className="text-lg">📍</div>
          <div className="mt-1 text-xs font-medium text-bark-700">
            {plant.locations.map((l) => LOCATION_LABELS[l]).join(", ")}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {plant.seasons.map((s) => (
          <span
            key={s}
            className="flex items-center gap-1 rounded-full bg-bark-100 px-2.5 py-1 text-xs text-bark-700"
          >
            {SEASON_ICONS[s]} {SEASON_LABELS[s]}
          </span>
        ))}
      </div>

      {/* Pflegetipps */}
      <div className="mt-6 rounded-2xl border border-bark-200/70 bg-white/70 p-5">
        <h2 className="font-display text-lg font-semibold text-bark-900">Pflegetipps</h2>
        <ul className="mt-3 ml-4 list-disc space-y-1.5 text-sm text-bark-700">
          {plant.careTips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>

      {/* Substrat & Umtopfen */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-bark-200/70 bg-white/70 p-5">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-bark-900">
            <span aria-hidden>🪨</span> Substrat
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-bark-700">{plant.soil}</p>
        </div>
        <div className="rounded-2xl border border-bark-200/70 bg-white/70 p-5">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-bark-900">
            <span aria-hidden>🪴</span> Umtopfen
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-bark-700">{plant.repotting}</p>
        </div>
      </div>

      {/* Pflege im Jahresverlauf */}
      <div className="mt-4 rounded-2xl border border-bark-200/70 bg-white/70 p-5">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-bark-900">
          <span aria-hidden>🍂</span> Pflege im Jahresverlauf
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-bark-700">{plant.overwintering}</p>
      </div>

      {/* Tiersicherheit */}
      <div className="mt-4 rounded-2xl border border-bark-200/70 bg-white/70 p-5">
        <h2 className="font-display text-lg font-semibold text-bark-900">Tiersicherheit</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div className={`rounded-xl px-3 py-2.5 ${toxicityColor[plant.toxicity.cats]}`}>
            <div className="opacity-70">🐱 Katzen</div>
            <strong>{TOXICITY_LABELS[plant.toxicity.cats]}</strong>
          </div>
          <div className={`rounded-xl px-3 py-2.5 ${toxicityColor[plant.toxicity.dogs]}`}>
            <div className="opacity-70">🐶 Hunde</div>
            <strong>{TOXICITY_LABELS[plant.toxicity.dogs]}</strong>
          </div>
        </div>
        {plant.toxicity.notes && (
          <p className="mt-3 rounded-xl bg-clay-50 p-3 text-sm text-clay-600">
            ⚠️ {plant.toxicity.notes}
          </p>
        )}
        <p className="mt-3 text-xs text-bark-400">
          Diese Angaben dienen der ersten Orientierung und ersetzen keine tierärztliche
          Beratung. Bei Vergiftungsverdacht sofort Tierarzt oder Giftnotruf kontaktieren.
        </p>
      </div>

      {related.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-lg font-semibold text-bark-900">Ähnliche Pflanzen</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {related.map((p) => (
              <PlantCard key={p.id} plant={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
