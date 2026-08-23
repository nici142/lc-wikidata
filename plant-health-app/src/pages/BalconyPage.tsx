import { useMemo, useState } from "react";
import { plants } from "../data/plants";
import type { Season } from "../data/types";
import { SEASON_ICONS, SEASON_LABELS } from "../data/types";
import PlantCard from "../components/PlantCard";

const seasons: Season[] = ["fruehling", "sommer", "herbst", "winter"];

export default function BalconyPage() {
  const [season, setSeason] = useState<Season>("sommer");

  const filtered = useMemo(
    () =>
      plants.filter((p) => p.locations.includes("balkon") && p.seasons.includes(season)),
    [season],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-leaf-900">
        Die perfekten Balkonpflanzen
      </h1>
      <p className="mt-1 max-w-2xl text-bark-900/70">
        Wähle eine Jahreszeit und entdecke, welche Pflanzen deinen Balkon dann am schönsten
        aussehen lassen.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {seasons.map((s) => (
          <button
            key={s}
            onClick={() => setSeason(s)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              season === s
                ? "bg-leaf-600 text-white shadow-sm"
                : "bg-white text-leaf-800 ring-1 ring-leaf-200 hover:bg-leaf-100"
            }`}
          >
            <span>{SEASON_ICONS[s]}</span> {SEASON_LABELS[s]}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-bark-900/60">
        {filtered.length} {filtered.length === 1 ? "Pflanze gefunden" : "Pflanzen gefunden"}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>
    </div>
  );
}
