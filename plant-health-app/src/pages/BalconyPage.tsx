import { useMemo, useState } from "react";
import { plants } from "../data/plants";
import type { Season } from "../data/types";
import { SEASON_ICONS, SEASON_LABELS } from "../data/types";
import PlantCard from "../components/PlantCard";
import PageHeader from "../components/PageHeader";
import FilterChip from "../components/FilterChip";

const seasons: Season[] = ["fruehling", "sommer", "herbst", "winter"];

export default function BalconyPage() {
  const [season, setSeason] = useState<Season>("sommer");

  const filtered = useMemo(
    () =>
      plants.filter((p) => p.locations.includes("balkon") && p.seasons.includes(season)),
    [season],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        icon="🪴"
        tone="clay"
        title="Die perfekten Balkonpflanzen"
        description="Wähle eine Jahreszeit und entdecke, welche Pflanzen deinen Balkon dann am schönsten aussehen lassen."
      />

      <div className="mt-6 flex flex-wrap gap-2">
        {seasons.map((s) => (
          <FilterChip key={s} active={season === s} onClick={() => setSeason(s)}>
            <span>{SEASON_ICONS[s]}</span> {SEASON_LABELS[s]}
          </FilterChip>
        ))}
      </div>

      <p className="mt-5 text-sm text-bark-500">
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
