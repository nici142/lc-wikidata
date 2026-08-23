import { useMemo, useState } from "react";
import { plants } from "../data/plants";
import type { Difficulty } from "../data/types";
import { DIFFICULTY_LABELS } from "../data/types";
import PlantCard from "../components/PlantCard";

const difficulties: Difficulty[] = ["einfach", "mittel", "anspruchsvoll"];

export default function GardenPage() {
  const [difficulty, setDifficulty] = useState<Difficulty | "alle">("alle");

  const filtered = useMemo(
    () =>
      plants.filter(
        (p) =>
          p.locations.includes("garten") &&
          (difficulty === "alle" || p.difficulty === difficulty),
      ),
    [difficulty],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-leaf-900">
        Ideale Pflanzen für den Garten
      </h1>
      <p className="mt-1 max-w-2xl text-bark-900/70">
        Stöbere durch Pflanzen, die sich besonders gut fürs Beet oder Gartenbeete eignen.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => setDifficulty("alle")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            difficulty === "alle"
              ? "bg-leaf-600 text-white shadow-sm"
              : "bg-white text-leaf-800 ring-1 ring-leaf-200 hover:bg-leaf-100"
          }`}
        >
          Alle
        </button>
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              difficulty === d
                ? "bg-leaf-600 text-white shadow-sm"
                : "bg-white text-leaf-800 ring-1 ring-leaf-200 hover:bg-leaf-100"
            }`}
          >
            {DIFFICULTY_LABELS[d]}
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
