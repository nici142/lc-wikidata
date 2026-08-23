import { Link } from "react-router-dom";
import type { Plant } from "../data/types";
import {
  DIFFICULTY_LABELS,
  SEASON_ICONS,
  SEASON_LABELS,
  TOXICITY_LABELS,
} from "../data/types";
import { useFavorites } from "../hooks/useFavorites";

const difficultyDot: Record<Plant["difficulty"], string> = {
  einfach: "bg-leaf-500",
  mittel: "bg-clay-400",
  anspruchsvoll: "bg-rose-500",
};

const toxicityColor: Record<string, string> = {
  giftig: "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
  leicht_giftig: "bg-clay-50 text-clay-600 ring-1 ring-clay-100",
  ungiftig: "bg-leaf-50 text-leaf-700 ring-1 ring-leaf-100",
};

export default function PlantCard({ plant }: { plant: Plant }) {
  const petSafe = plant.toxicity.cats === "ungiftig" && plant.toxicity.dogs === "ungiftig";
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(plant.id);

  return (
    <article className="group flex flex-col gap-3 rounded-2xl border border-bark-200/70 bg-white/90 p-4 shadow-[0_1px_2px_rgba(43,39,30,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-leaf-200 hover:shadow-[0_12px_24px_-12px_rgba(43,39,30,0.18)]">
      <div className="flex items-start justify-between gap-2">
        <Link to={`/pflanzen/${plant.id}`} className="flex min-w-0 flex-1 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-leaf-50 text-2xl leading-none ring-1 ring-leaf-100">
            {plant.emoji}
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-display text-[1.05rem] font-semibold leading-tight text-bark-900 group-hover:text-leaf-700">
              {plant.name}
            </h3>
            <p className="truncate text-xs italic text-bark-400">{plant.latinName}</p>
          </div>
        </Link>
        <div className="flex shrink-0 items-center gap-1.5">
          {petSafe && (
            <span
              title="Unbedenklich für Katzen und Hunde"
              className="hidden shrink-0 rounded-full bg-leaf-100 px-2 py-1 text-[11px] font-medium text-leaf-700 sm:inline-block"
            >
              🐾 tierfreundlich
            </span>
          )}
          <button
            type="button"
            onClick={() => toggleFavorite(plant.id)}
            aria-pressed={favorite}
            aria-label={favorite ? "Von Merkliste entfernen" : "Zur Merkliste hinzufügen"}
            title={favorite ? "Von Merkliste entfernen" : "Zur Merkliste hinzufügen"}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base transition-colors ${
              favorite
                ? "bg-clay-100 text-clay-600"
                : "bg-bark-100 text-bark-400 hover:bg-clay-50 hover:text-clay-500"
            }`}
          >
            {favorite ? "♥" : "♡"}
          </button>
        </div>
      </div>

      {petSafe && (
        <span className="-mt-2 inline-block w-fit rounded-full bg-leaf-100 px-2 py-1 text-[11px] font-medium text-leaf-700 sm:hidden">
          🐾 tierfreundlich
        </span>
      )}

      <p className="text-sm leading-relaxed text-bark-700">{plant.description}</p>

      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        {plant.seasons.map((s) => (
          <span
            key={s}
            className="flex items-center gap-1 rounded-full bg-bark-100 px-2 py-1 text-bark-700"
          >
            {SEASON_ICONS[s]} {SEASON_LABELS[s]}
          </span>
        ))}
        <span className="flex items-center gap-1.5 rounded-full bg-bark-100 px-2 py-1 font-medium text-bark-700">
          <span className={`h-1.5 w-1.5 rounded-full ${difficultyDot[plant.difficulty]}`} />
          {DIFFICULTY_LABELS[plant.difficulty]}
        </span>
      </div>

      <div className="mt-0.5 grid grid-cols-2 gap-2 text-xs">
        <div className={`rounded-lg px-2 py-1.5 leading-tight ${toxicityColor[plant.toxicity.cats]}`}>
          <div className="opacity-70">🐱 Katzen</div>
          <strong className="whitespace-nowrap">{TOXICITY_LABELS[plant.toxicity.cats]}</strong>
        </div>
        <div className={`rounded-lg px-2 py-1.5 leading-tight ${toxicityColor[plant.toxicity.dogs]}`}>
          <div className="opacity-70">🐶 Hunde</div>
          <strong className="whitespace-nowrap">{TOXICITY_LABELS[plant.toxicity.dogs]}</strong>
        </div>
      </div>

      <details className="group/details mt-0.5 text-sm">
        <summary className="cursor-pointer list-none font-medium text-leaf-700 marker:content-none group-open/details:mb-2">
          <span className="inline-flex items-center gap-1">
            Pflegetipps
            <span className="text-leaf-400 transition-transform group-open/details:rotate-180">
              ▾
            </span>
          </span>
        </summary>
        <ul className="ml-4 list-disc space-y-1 text-bark-700">
          {plant.careTips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
        {plant.toxicity.notes && (
          <p className="mt-2 rounded-lg bg-clay-50 p-2 text-xs text-clay-600">
            ⚠️ {plant.toxicity.notes}
          </p>
        )}
      </details>

      <Link
        to={`/pflanzen/${plant.id}`}
        className="mt-auto inline-flex items-center gap-1 pt-1 text-xs font-medium text-leaf-700 hover:text-leaf-800"
      >
        Alle Details
        <span aria-hidden>→</span>
      </Link>
    </article>
  );
}
