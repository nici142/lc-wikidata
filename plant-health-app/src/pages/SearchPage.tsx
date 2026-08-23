import { useMemo, useState } from "react";
import { plants } from "../data/plants";
import PlantCard from "../components/PlantCard";
import PageHeader from "../components/PageHeader";

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("ß", "ss");
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const normalizedQuery = normalize(query.trim());

  const results = useMemo(() => {
    if (!normalizedQuery) return plants;
    return plants.filter((p) =>
      [p.name, p.latinName, p.description, ...p.careTips].some((field) =>
        normalize(field).includes(normalizedQuery),
      ),
    );
  }, [normalizedQuery]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        icon="🔍"
        title="Pflanzen suchen"
        description="Suche nach deutschem oder botanischem Namen, z. B. „Geranie“ oder „Pelargonium“."
      />

      <div className="relative mt-6 max-w-lg">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-leaf-500">
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="z. B. Lavendel, Aloe, Sansevieria …"
          autoFocus
          className="w-full rounded-full border border-bark-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm outline-none placeholder:text-bark-400 focus:border-leaf-400 focus:ring-4 focus:ring-leaf-100"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Suche zurücksetzen"
            className="absolute inset-y-0 right-4 flex items-center text-bark-400 hover:text-bark-700"
          >
            ✕
          </button>
        )}
      </div>

      <p className="mt-5 text-sm text-bark-500">
        {results.length} {results.length === 1 ? "Pflanze gefunden" : "Pflanzen gefunden"}
      </p>

      {results.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-xl border border-bark-200 bg-white p-4 text-sm text-bark-500">
          Keine Pflanze gefunden. Versuch es mit einem anderen Suchbegriff.
        </p>
      )}
    </div>
  );
}
