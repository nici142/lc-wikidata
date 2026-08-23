import { useMemo, useState } from "react";
import { plants } from "../data/plants";
import type { Difficulty } from "../data/types";
import { DIFFICULTY_LABELS } from "../data/types";
import PlantCard from "../components/PlantCard";
import PageHeader from "../components/PageHeader";
import FilterChip from "../components/FilterChip";

const difficulties: Difficulty[] = ["einfach", "mittel", "anspruchsvoll"];

export default function IndoorPage() {
  const [difficulty, setDifficulty] = useState<Difficulty | "alle">("alle");

  const filtered = useMemo(
    () =>
      plants.filter(
        (p) =>
          p.locations.includes("zimmer") &&
          (difficulty === "alle" || p.difficulty === difficulty),
      ),
    [difficulty],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        icon="🏠"
        tone="clay"
        title="Die perfekten Zimmerpflanzen"
        description="Pflanzen fürs Zuhause – ganzjährig geeignet, unabhängig von der Jahreszeit draußen."
      />

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterChip active={difficulty === "alle"} onClick={() => setDifficulty("alle")}>
          Alle
        </FilterChip>
        {difficulties.map((d) => (
          <FilterChip key={d} active={difficulty === d} onClick={() => setDifficulty(d)}>
            {DIFFICULTY_LABELS[d]}
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
