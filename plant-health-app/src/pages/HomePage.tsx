import { useMemo } from "react";
import { Link } from "react-router-dom";
import { plants } from "../data/plants";
import Logo from "../components/Logo";

const features = [
  {
    icon: "📷",
    title: "Bild-Diagnose",
    description:
      "Foto einer Pflanze hochladen und direkt im Browser eine erste Einschätzung zum Gesundheitszustand erhalten – z. B. Hinweise auf Nährstoffmangel, Trockenstress oder Schädlingsbefall.",
    to: "/diagnose",
    linkLabel: "Pflanze diagnostizieren",
  },
  {
    icon: "🌿",
    title: "Pflanzenfinder",
    description:
      "Alle Pflanzen an einem Ort, mit kombinierbaren Filtern: Standort (Balkon/Garten/Zimmer), Jahreszeit, Pflegeaufwand, Zier- oder Gemüsepflanze.",
    to: "/pflanzen",
    linkLabel: "Pflanzen entdecken",
  },
  {
    icon: "🐾",
    title: "Tiersicherheit",
    description:
      "Direkt erkennen, welche Pflanzen für Katzen und Hunde unbedenklich sind – und bei welchen du besser vorsichtig bist. Als eigener Filter kombinierbar mit Standort & Co.",
    to: "/pflanzen?tier=beide",
    linkLabel: "Tierfreundliche Pflanzen ansehen",
  },
  {
    icon: "🥕",
    title: "Gemüse fürs Beet oder den Kübel",
    description:
      "Welches Gemüse sich in einem Kübel auf dem Balkon ziehen lässt und welches wegen Platz- oder Wurzelbedarf eher ein Gartenbeet braucht.",
    to: "/pflanzen?kategorie=gemuese",
    linkLabel: "Gemüse ansehen",
  },
];

export default function HomePage() {
  const stats = useMemo(() => {
    const vegetables = plants.filter((p) => p.category === "gemuese").length;
    const indoor = plants.filter((p) => p.locations.includes("zimmer")).length;
    const petFriendly = plants.filter(
      (p) => p.toxicity.cats === "ungiftig" && p.toxicity.dogs === "ungiftig",
    ).length;
    return [
      { value: plants.length, label: "Pflanzen in der Datenbank" },
      { value: vegetables, label: "Gemüsesorten" },
      { value: indoor, label: "Zimmerpflanzen" },
      { value: petFriendly, label: "tierfreundliche Sorten" },
    ];
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      {/* Hero */}
      <section className="flex flex-col items-center text-center">
        <Logo size={56} />
        <h1 className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-bark-900 sm:text-5xl">
          Dein Begleiter für gesunde, glückliche Pflanzen
        </h1>
        <p className="mt-4 max-w-xl text-[1.05rem] leading-relaxed text-bark-500">
          PlantBuddy hilft dir per Foto einzuschätzen, wie es deiner Pflanze geht, und findet
          passende Pflanzen für Balkon, Garten oder Zimmer – nach Jahreszeit, Pflegeaufwand und
          Tierfreundlichkeit.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/diagnose"
            className="flex items-center gap-2 rounded-full bg-leaf-700 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-leaf-900/20 transition-colors hover:bg-leaf-800"
          >
            📷 Pflanze diagnostizieren
          </Link>
          <Link
            to="/pflanzen"
            className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-leaf-800 ring-1 ring-bark-200 transition-colors hover:bg-leaf-50"
          >
            🌿 Pflanzen entdecken
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-bark-200/70 bg-white/70 px-4 py-5 text-center"
          >
            <div className="font-display text-2xl font-semibold text-leaf-800 sm:text-3xl">
              {s.value}+
            </div>
            <div className="mt-1 text-xs text-bark-500">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="mt-16">
        <h2 className="text-center font-display text-2xl font-semibold text-bark-900">
          Was PlantBuddy für dich übernimmt
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.to}
              className="group flex flex-col gap-3 rounded-2xl border border-bark-200/70 bg-white/90 p-6 shadow-[0_1px_2px_rgba(43,39,30,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-leaf-200 hover:shadow-[0_12px_24px_-12px_rgba(43,39,30,0.18)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-100 text-2xl">
                {f.icon}
              </span>
              <h3 className="font-display text-lg font-semibold text-bark-900">{f.title}</h3>
              <p className="text-sm leading-relaxed text-bark-500">{f.description}</p>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-leaf-700">
                {f.linkLabel}
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mt-14 rounded-2xl border border-clay-100 bg-clay-50 p-5 text-sm text-clay-600">
        <p>
          <strong>Gut zu wissen:</strong> Die Bild-Diagnose ist eine leichte, browserbasierte
          Heuristik und kein trainiertes KI-Modell – sie ersetzt keine fachliche Diagnose. Auch
          die Giftigkeits-Angaben zur Tiersicherheit dienen der ersten Orientierung und ersetzen
          keine tierärztliche Beratung. Bei anhaltenden Pflanzenproblemen oder
          Vergiftungsverdacht wende dich an eine Gartenberatung bzw. einen Tierarzt oder
          Giftnotruf.
        </p>
      </section>
    </div>
  );
}
