import { useMemo, useState } from "react";
import { plants } from "../data/plants";
import type { Difficulty, Location } from "../data/types";
import { DIFFICULTY_LABELS, LOCATION_LABELS } from "../data/types";
import PlantCard from "../components/PlantCard";
import PageHeader from "../components/PageHeader";
import FilterChip from "../components/FilterChip";

const difficulties: Difficulty[] = ["einfach", "mittel", "anspruchsvoll"];
const locations: Location[] = ["balkon", "garten", "zimmer"];

const difficultyHint: Record<Difficulty, string> = {
  einfach: "Verzeiht auch mal vergessenes Gießen – ideal für Einsteiger.",
  mittel: "Braucht regelmäßige Aufmerksamkeit bei Wasser, Standort oder Rückschnitt.",
  anspruchsvoll: "Empfindlich gegenüber Kälte, Wasser oder Standort – für erfahrene Hände.",
};

export default function CarePage() {
  const [location, setLocation] = useState<Location | "alle">("alle");

  const grouped = useMemo(() => {
    const base = plants.filter((p) => location === "alle" || p.locations.includes(location));
    return difficulties.map((d) => ({
      difficulty: d,
      items: base.filter((p) => p.difficulty === d),
    }));
  }, [location]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        icon="🧰"
        title="Pflanzen nach Pflegeaufwand"
        description="Von pflegeleicht bis anspruchsvoll – finde Pflanzen passend zu deiner verfügbaren Zeit und Erfahrung."
      />

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterChip active={location === "alle"} onClick={() => setLocation("alle")}>
          Alle Standorte
        </FilterChip>
        {locations.map((loc) => (
          <FilterChip key={loc} active={location === loc} onClick={() => setLocation(loc)}>
            {LOCATION_LABELS[loc]}
          </FilterChip>
        ))}
      </div>

      <div className="mt-10 space-y-12">
        {grouped.map(({ difficulty, items }) => (
          <section key={difficulty}>
            <div className="flex items-baseline justify-between border-b border-bark-200 pb-2">
              <h2 className="font-display text-lg font-semibold text-leaf-800">
                {DIFFICULTY_LABELS[difficulty]}
              </h2>
              <span className="text-xs text-bark-400">{items.length} Pflanzen</span>
            </div>
            <p className="mt-2 text-sm text-bark-500">{difficultyHint[difficulty]}</p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
