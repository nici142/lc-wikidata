import { useMemo, useState } from "react";
import { plants } from "../data/plants";
import type { Difficulty, Location } from "../data/types";
import { DIFFICULTY_LABELS, LOCATION_LABELS } from "../data/types";
import PlantCard from "../components/PlantCard";

const difficulties: Difficulty[] = ["einfach", "mittel", "anspruchsvoll"];
const locations: Location[] = ["balkon", "garten"];

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
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-leaf-900">
        Pflanzen nach Pflegeaufwand
      </h1>
      <p className="mt-1 max-w-2xl text-bark-900/70">
        Von pflegeleicht bis anspruchsvoll – finde Pflanzen passend zu deiner verfügbaren Zeit
        und Erfahrung.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => setLocation("alle")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            location === "alle"
              ? "bg-leaf-600 text-white shadow-sm"
              : "bg-white text-leaf-800 ring-1 ring-leaf-200 hover:bg-leaf-100"
          }`}
        >
          Balkon &amp; Garten
        </button>
        {locations.map((loc) => (
          <button
            key={loc}
            onClick={() => setLocation(loc)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              location === loc
                ? "bg-leaf-600 text-white shadow-sm"
                : "bg-white text-leaf-800 ring-1 ring-leaf-200 hover:bg-leaf-100"
            }`}
          >
            {LOCATION_LABELS[loc]}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-10">
        {grouped.map(({ difficulty, items }) => (
          <section key={difficulty}>
            <div className="flex items-baseline justify-between border-b border-leaf-200 pb-2">
              <h2 className="font-display text-lg font-semibold text-leaf-800">
                {DIFFICULTY_LABELS[difficulty]}
              </h2>
              <span className="text-xs text-bark-900/50">{items.length} Pflanzen</span>
            </div>
            <p className="mt-2 text-sm text-bark-900/60">{difficultyHint[difficulty]}</p>
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
