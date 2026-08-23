import { useMemo, useState } from "react";
import { plants } from "../data/plants";
import type { Location } from "../data/types";
import PlantCard from "../components/PlantCard";
import PageHeader from "../components/PageHeader";
import FilterChip from "../components/FilterChip";

type LocationFilter = Location | "alle";

const filters: { id: LocationFilter; label: string; icon: string }[] = [
  { id: "alle", label: "Alle", icon: "🥕" },
  { id: "balkon", label: "Balkongeeignet", icon: "🪴" },
  { id: "garten", label: "Braucht Garten", icon: "🌳" },
];

export default function VegetablePage() {
  const [filter, setFilter] = useState<LocationFilter>("alle");

  const vegetables = useMemo(() => plants.filter((p) => p.category === "gemuese"), []);

  const filtered = useMemo(() => {
    if (filter === "alle") return vegetables;
    if (filter === "balkon") return vegetables.filter((p) => p.locations.includes("balkon"));
    // "Braucht Garten": nur Sorten, die NICHT balkongeeignet sind (nicht nur "auch im Garten möglich")
    return vegetables.filter((p) => !p.locations.includes("balkon"));
  }, [vegetables, filter]);

  const balconyCount = useMemo(
    () => vegetables.filter((p) => p.locations.includes("balkon")).length,
    [vegetables],
  );
  const gardenOnlyCount = useMemo(
    () => vegetables.filter((p) => !p.locations.includes("balkon")).length,
    [vegetables],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        icon="🥕"
        title="Gemüse für Balkon & Garten"
        description="Welches Gemüse passt in einen Kübel auf dem Balkon – und wofür brauchst du wirklich ein Beet im Garten?"
      />

      <div className="mt-5 flex items-start gap-2 rounded-xl border border-leaf-100 bg-leaf-50 p-3 text-sm text-leaf-800">
        <span aria-hidden>💡</span>
        <span>
          {balconyCount} von {vegetables.length} Gemüsesorten lassen sich in ausreichend großen
          Kübeln auch auf dem Balkon ziehen. {gardenOnlyCount} brauchen wegen ihres Platz- oder
          Wurzelbedarfs eher ein Gartenbeet.
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <FilterChip key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)}>
            <span>{f.icon}</span> {f.label}
          </FilterChip>
        ))}
      </div>

      <p className="mt-5 text-sm text-bark-500">
        {filtered.length} {filtered.length === 1 ? "Sorte gefunden" : "Sorten gefunden"}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>
    </div>
  );
}
