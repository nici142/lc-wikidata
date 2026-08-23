# 🌿 PlantBuddy

Eine Web-App rund um Pflanzengesundheit und Pflanzenwahl:

- **📷 Diagnose** – Foto einer Pflanze hochladen und eine Einschätzung zum
  Gesundheitszustand erhalten (mögliche Nährstoffmängel, Trockenstress,
  Pilzbefall/Schädlinge, Mehltau-Anzeichen).
- **🔍 Suche** – pflanzenübergreifende Live-Suche nach deutschem oder
  botanischem Namen (umlauttolerant).
- **🪴 Balkonpflanzen** – die passenden Pflanzen für Frühling, Sommer, Herbst
  und Winter.
- **🌳 Gartenpflanzen** – ideale Pflanzen fürs Beet, filterbar nach
  Pflegeaufwand.
- **🥕 Gemüse** – welches Gemüse sich in Kübeln auf dem Balkon ziehen lässt
  und welches wegen Platz-/Wurzelbedarf eher ein Gartenbeet braucht.
- **🏠 Zimmerpflanzen** – ganzjährig geeignete Pflanzen fürs Zuhause.
- **🧰 Pflegeaufwand** – Übersicht leicht/mittel/anspruchsvoll zu pflegender
  Pflanzen für Balkon, Garten und Zimmer.
- **🐾 Tiersicherheit** – welche Pflanzen bei Katzen- und/oder Hundehaltung
  unbedenklich sind und welche giftig sind.

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

`src/data/plants.ts` enthält ~65 gängige Balkon-, Garten-, Zimmer- und
Gemüsepflanzen mit Jahreszeiten-Eignung, Standort (Balkon/Garten/Zimmer),
Pflegeaufwand, Pflegetipps sowie Giftigkeit für Katzen und Hunde.
Gemüse-/Nutzpflanzen tragen zusätzlich `category: "gemuese"`. Die
Giftigkeits-Angaben beruhen auf allgemein bekannten, gängigen
Einschätzungen und ersetzen keine tierärztliche Beratung – bei
Vergiftungsverdacht immer Tierarzt/Giftnotruf kontaktieren. Weitere
Pflanzen lassen sich einfach als zusätzliche Einträge in dieser Datei
ergänzen.

## Design

Farbpalette, Typografie (Fraunces für Überschriften) und Komponenten
(`PageHeader`, `FilterChip`, `PlantCard`) sind in `src/index.css` bzw.
`src/components/` zentral definiert, damit alle Seiten ein einheitliches
Erscheinungsbild teilen.
