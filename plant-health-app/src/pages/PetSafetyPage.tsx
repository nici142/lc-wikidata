import { useMemo, useState } from "react";
import { plants } from "../data/plants";
import PlantCard from "../components/PlantCard";

type Pet = "katzen" | "hunde" | "beide";

const petOptions: { id: Pet; label: string; icon: string }[] = [
  { id: "beide", label: "Katzen & Hunde", icon: "🐾" },
  { id: "katzen", label: "Nur Katzen", icon: "🐱" },
  { id: "hunde", label: "Nur Hunde", icon: "🐶" },
];

export default function PetSafetyPage() {
  const [pet, setPet] = useState<Pet>("beide");

  const { safe, risky } = useMemo(() => {
    const isSafeFor = (p: (typeof plants)[number]) => {
      if (pet === "katzen") return p.toxicity.cats === "ungiftig";
      if (pet === "hunde") return p.toxicity.dogs === "ungiftig";
      return p.toxicity.cats === "ungiftig" && p.toxicity.dogs === "ungiftig";
    };
    return {
      safe: plants.filter(isSafeFor),
      risky: plants.filter((p) => !isSafeFor(p)),
    };
  }, [pet]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-leaf-900">
        Tiersicherheit: giftig oder unbedenklich?
      </h1>
      <p className="mt-1 max-w-2xl text-bark-900/70">
        Ein Überblick, welche Pflanzen bei Katzen- oder Hundehaltung unbedenklich sind – und bei
        welchen du besser vorsichtig bist.
      </p>

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        ⚠️ Diese Übersicht dient der ersten Orientierung und ersetzt keine tierärztliche
        Beratung. Bei Vergiftungsverdacht sofort Tierarzt oder Giftnotruf kontaktieren.
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {petOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setPet(opt.id)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              pet === opt.id
                ? "bg-leaf-600 text-white shadow-sm"
                : "bg-white text-leaf-800 ring-1 ring-leaf-200 hover:bg-leaf-100"
            }`}
          >
            <span>{opt.icon}</span> {opt.label}
          </button>
        ))}
      </div>

      <section className="mt-8">
        <div className="flex items-center gap-2 border-b border-leaf-200 pb-2">
          <h2 className="font-display text-lg font-semibold text-leaf-700">
            ✅ Unbedenklich ({safe.length})
          </h2>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {safe.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center gap-2 border-b border-rose-200 pb-2">
          <h2 className="font-display text-lg font-semibold text-rose-700">
            ⚠️ Giftig oder mit Vorsicht zu genießen ({risky.length})
          </h2>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {risky.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      </section>
    </div>
  );
}
