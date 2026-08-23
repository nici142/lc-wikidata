import { useMemo, useState } from "react";
import { plants } from "../data/plants";
import PlantCard from "../components/PlantCard";
import PageHeader from "../components/PageHeader";
import FilterChip from "../components/FilterChip";

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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        icon="🐾"
        tone="clay"
        title="Tiersicherheit: giftig oder unbedenklich?"
        description="Ein Überblick, welche Pflanzen bei Katzen- oder Hundehaltung unbedenklich sind – und bei welchen du besser vorsichtig bist."
      />

      <div className="mt-5 flex items-start gap-2 rounded-xl border border-clay-100 bg-clay-50 p-3 text-sm text-clay-600">
        <span aria-hidden>⚠️</span>
        <span>
          Diese Übersicht dient der ersten Orientierung und ersetzt keine tierärztliche Beratung.
          Bei Vergiftungsverdacht sofort Tierarzt oder Giftnotruf kontaktieren.
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {petOptions.map((opt) => (
          <FilterChip key={opt.id} active={pet === opt.id} onClick={() => setPet(opt.id)}>
            <span>{opt.icon}</span> {opt.label}
          </FilterChip>
        ))}
      </div>

      <section className="mt-10">
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

      <section className="mt-12">
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
