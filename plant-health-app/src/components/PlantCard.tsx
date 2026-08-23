import type { Plant } from "../data/types";
import {
  DIFFICULTY_LABELS,
  SEASON_ICONS,
  SEASON_LABELS,
  TOXICITY_LABELS,
} from "../data/types";

const difficultyColor: Record<Plant["difficulty"], string> = {
  einfach: "bg-leaf-100 text-leaf-700",
  mittel: "bg-amber-100 text-amber-700",
  anspruchsvoll: "bg-rose-100 text-rose-700",
};

const toxicityColor: Record<string, string> = {
  giftig: "bg-rose-100 text-rose-700",
  leicht_giftig: "bg-amber-100 text-amber-700",
  ungiftig: "bg-leaf-100 text-leaf-700",
};

export default function PlantCard({ plant }: { plant: Plant }) {
  const petSafe = plant.toxicity.cats === "ungiftig" && plant.toxicity.dogs === "ungiftig";

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-leaf-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl leading-none">{plant.emoji}</span>
            <div>
              <h3 className="font-display font-semibold text-leaf-900">{plant.name}</h3>
              <p className="text-xs italic text-leaf-600">{plant.latinName}</p>
            </div>
          </div>
        </div>
        {petSafe && (
          <span
            title="Unbedenklich für Katzen und Hunde"
            className="shrink-0 rounded-full bg-leaf-100 px-2 py-1 text-xs font-medium text-leaf-700"
          >
            🐾 tierfreundlich
          </span>
        )}
      </div>

      <p className="text-sm text-bark-900/80">{plant.description}</p>

      <div className="flex flex-wrap gap-1.5 text-xs">
        {plant.seasons.map((s) => (
          <span
            key={s}
            className="flex items-center gap-1 rounded-full bg-leaf-50 px-2 py-1 text-leaf-700 ring-1 ring-leaf-200"
          >
            {SEASON_ICONS[s]} {SEASON_LABELS[s]}
          </span>
        ))}
        <span className={`rounded-full px-2 py-1 font-medium ${difficultyColor[plant.difficulty]}`}>
          {DIFFICULTY_LABELS[plant.difficulty]}
        </span>
      </div>

      <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
        <div className={`rounded-lg px-2 py-1.5 ${toxicityColor[plant.toxicity.cats]}`}>
          🐱 Katzen: <strong>{TOXICITY_LABELS[plant.toxicity.cats]}</strong>
        </div>
        <div className={`rounded-lg px-2 py-1.5 ${toxicityColor[plant.toxicity.dogs]}`}>
          🐶 Hunde: <strong>{TOXICITY_LABELS[plant.toxicity.dogs]}</strong>
        </div>
      </div>

      <details className="group mt-1 text-sm">
        <summary className="cursor-pointer list-none font-medium text-leaf-700 group-open:mb-2">
          Pflegetipps anzeigen ▾
        </summary>
        <ul className="ml-4 list-disc space-y-1 text-bark-900/80">
          {plant.careTips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
        {plant.toxicity.notes && (
          <p className="mt-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-800">
            ⚠️ {plant.toxicity.notes}
          </p>
        )}
      </details>
    </article>
  );
}
