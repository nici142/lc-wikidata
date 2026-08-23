# 🌿 PlantBuddy

**Live:** https://nici142.github.io/lc-wikidata/app/ (via GitHub Pages,
Deploy aus dem `gh-pages`-Branch, Unterverzeichnis `/app`, unabhängig von
der Wikidata-Lesson-Seite im Rest des Branches).

Eine Web-App rund um Pflanzengesundheit und Pflanzenwahl:

- **🏠 Startseite** – erklärt kurz, was die App macht, mit direkten
  Einstiegen in Diagnose, Pflanzenfinder, Tiersicherheit und Gemüse sowie
  ein paar Kennzahlen zur Pflanzendatenbank.
- **📷 Diagnose** – Foto einer Pflanze hochladen und eine Einschätzung zum
  Gesundheitszustand erhalten (mögliche Nährstoffmängel, Trockenstress,
  Pilzbefall/Schädlinge, Mehltau-Anzeichen).
- **🌿 Pflanzenfinder** – eine Seite für alles andere: Freitextsuche
  (umlauttolerant) plus sieben kombinierbare Filter – Standort (Balkon/
  Garten/Zimmer/Badezimmer/Küche), Kategorie (Zier-/Gemüse-/Obstpflanzen/
  Kräuter), Jahreszeit, Pflegeaufwand, Lichtbedarf, Wasserbedarf und
  Tierhaltung (z. B. „nur katzensicher") – plus Sortierung (Name/
  Pflegeaufwand) und ein Umschalter „Nur Merkliste". Das Filter-Panel ist
  standardmäßig eingeklappt (Badge zeigt die Anzahl aktiver Filter) und
  öffnet sich automatisch bei einem Deep-Link mit vorbelegten Filtern –
  damit man auf dem Handy nicht erst daran vorbeiscrollen muss, um
  Pflanzen zu sehen. Der Filterstand landet in der URL und lässt sich so
  teilen/mit Zurück-Button aufrufen.
- **📄 Pflanzendetailseite** (`/pflanzen/:id`) – eigene, verlinkbare Seite
  je Pflanze mit vollständigem Steckbrief, Pflegetipps, Tiersicherheit und
  ähnlichen Pflanzen.
- **♥ Merkliste** – Pflanzen lassen sich per Herz-Icon merken. Die Auswahl
  wird rein clientseitig in `localStorage` gespeichert (kein Konto, kein
  Backend) und bleibt auf diesem Gerät/Browser erhalten.

`/` ist die Startseite, die Diagnose liegt unter `/diagnose`. Alte
Direktlinks wie `/balkon`, `/garten`, `/zimmer`, `/gemuese`, `/tiere`,
`/pflege` und `/suche` funktionieren weiterhin – sie leiten mit passend
vorbelegten Filtern auf `/pflanzen` um.

Die App ist als PWA installierbar (Manifest + Icons + Service Worker mit
Stale-while-revalidate-Caching) – "Zum Startbildschirm hinzufügen" macht
sie zu einer App-artigen Kachel, bereits besuchte Seiten funktionieren
danach auch offline.

## Tech-Stack

React 19 + TypeScript, Vite, React Router, Tailwind CSS v4. Rein clientseitig,
kein Backend nötig.

## Entwicklung

```bash
npm install
npm run dev       # Dev-Server
npm run build     # Produktions-Build (tsc + vite build)
npm run preview   # Build lokal ansehen
```

## Deploy auf GitHub Pages

Pages ist für dieses Repo als klassischer Jekyll-Branch-Build auf
`gh-pages` konfiguriert und bedient dort die Wikidata-Lesson-Seite. Damit
die App diesen Build nicht stört, wird sie separat als reiner Static-
Build in ein Unterverzeichnis `/app` desselben Branches kopiert:

```bash
# 1. Mit dem Unterpfad als Base bauen
npx vite build --base=/lc-wikidata/app/ --outDir dist-ghpages

# 2. gh-pages in ein Worktree auschecken, app/ ersetzen, committen, pushen
git worktree add /tmp/gh-pages-worktree gh-pages
rm -rf /tmp/gh-pages-worktree/app
cp -r dist-ghpages /tmp/gh-pages-worktree/app
cd /tmp/gh-pages-worktree && git add app && git commit -m "Deploy app" && git push origin gh-pages
git worktree remove /tmp/gh-pages-worktree --force
```

Damit das aus einem Unterverzeichnis heraus funktioniert, nutzt
`BrowserRouter` `basename={import.meta.env.BASE_URL}`, `index.html`
referenziert Icons/Manifest über den `%BASE_URL%`-Platzhalter, und das
Manifest selbst verwendet relative Pfade. Bei einem normalen Root-Build
(`npm run build`, `BASE_URL="/"`) ändert sich dadurch nichts.

## Wie funktioniert die Bild-Diagnose?

Die Analyse in `src/lib/diagnose.ts` läuft komplett im Browser: Das Bild wird
auf ein Canvas gezeichnet, herunterskaliert und pixelweise in den HSV-Farbraum
umgerechnet. Aus dem Anteil an gesundem Grün, vergilbten, braunen und
gefleckten Bereichen wird ein Gesundheits-Score (0–100) sowie eine Liste
möglicher Probleme mit Pflegetipps abgeleitet.

**Wichtig:** Das ist eine leichte Heuristik, **kein** trainiertes
KI-Modell/keine botanische Ferndiagnose, und ersetzt keine fachliche
Einschätzung. Für eine deutlich genauere Diagnose lässt sich `analyzeImage`
in `src/lib/diagnose.ts` durch einen Aufruf an einen echten Bilderkennungs-
Dienst ersetzen (z. B. eine Pflanzen-/Krankheitserkennungs-API wie
Plant.id/Kindwise, oder ein Vision-fähiges LLM über ein eigenes Backend –
der API-Key darf dafür nie im Frontend liegen).

## Pflanzendatenbank

`src/data/plants.ts` enthält ~80 gängige Balkon-, Garten-, Zimmer-, Bad-
und Küchenpflanzen mit Jahreszeiten-Eignung, Standort (Balkon/Garten/
Zimmer/Badezimmer/Küche), Pflegeaufwand, Substrat (`soil`), Umtopf-
Rhythmus (`repotting`), saisonaler Pflege/Überwinterung (`overwintering`),
Pflegetipps sowie Giftigkeit für Katzen und Hunde. Gemüse, Obst und
Kräuter tragen zusätzlich `category: "gemuese" | "obst" | "kraeuter"`
(fehlt bei reinen Zierpflanzen). Die Giftigkeits-Angaben beruhen auf
allgemein bekannten, gängigen Einschätzungen und ersetzen keine
tierärztliche Beratung – bei Vergiftungsverdacht immer Tierarzt/
Giftnotruf kontaktieren. Weitere Pflanzen lassen sich einfach als
zusätzliche Einträge in dieser Datei ergänzen.

Substrat, Umtopf-Rhythmus und die saisonale Pflege (z. B. wie eine
Zitrone im Sommer draußen und im Winter hell/kühl drinnen überwintert)
stehen auf der jeweiligen Pflanzen-Detailseite (`/pflanzen/:id`) in den
Karten „Substrat", „Umtopfen" und „Pflege im Jahresverlauf".

## Bekannte Grenzen

- **Keine echten Fotos.** Jede Pflanze hat aktuell nur ein Emoji-Icon statt
  eines Fotos. Lizenzfreie Bilder für ~80 Pflanzen automatisiert zu
  beschaffen war in dieser Entwicklungsumgebung nicht zuverlässig möglich
  (externe Bildquellen sind netzwerkseitig nicht erreichbar). Am saubersten
  ließe sich das nachrüsten, indem man pro Pflanze eine Bild-URL (z. B. zu
  einem selbst gehosteten/lizenzierten Bild) im `image`-Feld ergänzt – das
  Datenmodell ist dafür offen, `PlantCard`/`PlantDetailPage` müssten dann
  nur noch das Bild statt des Emoji-Badges rendern.
- Die Bild-**Diagnose** ist eine Heuristik, kein trainiertes Modell (siehe
  oben).

## Design

Farbpalette, Typografie (Fraunces für Überschriften) und Komponenten
(`Logo`, `PageHeader`, `FilterChip`, `FilterGroup`, `PlantCard`) sind in
`src/index.css` bzw. `src/components/` zentral definiert, damit beide
Seiten ein einheitliches Erscheinungsbild teilen. Das Logo (Sprössling auf
abgerundeter Kachel) ist identisch als Nav-Logo (`Logo.tsx`) und als
Favicon (`public/favicon.svg`) hinterlegt.
