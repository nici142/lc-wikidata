import { Navigate, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import DiagnosePage from "./pages/DiagnosePage";
import PlantFinderPage from "./pages/PlantFinderPage";

export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<DiagnosePage />} />
          <Route path="/pflanzen" element={<PlantFinderPage />} />

          {/* Alte Einzelseiten sind im Pflanzenfinder aufgegangen – Links bleiben nutzbar. */}
          <Route path="/suche" element={<Navigate to="/pflanzen" replace />} />
          <Route path="/balkon" element={<Navigate to="/pflanzen?standort=balkon" replace />} />
          <Route path="/garten" element={<Navigate to="/pflanzen?standort=garten" replace />} />
          <Route path="/gemuese" element={<Navigate to="/pflanzen?kategorie=gemuese" replace />} />
          <Route path="/zimmer" element={<Navigate to="/pflanzen?standort=zimmer" replace />} />
          <Route path="/pflege" element={<Navigate to="/pflanzen" replace />} />
          <Route path="/tiere" element={<Navigate to="/pflanzen?tier=beide" replace />} />
        </Routes>
      </main>
      <footer className="mx-auto max-w-6xl px-4 py-10 text-center text-xs text-bark-400">
        🌿 PlantBuddy – Bilddiagnose läuft lokal im Browser. Kein Ersatz für fachlichen
        oder tierärztlichen Rat.
      </footer>
    </div>
  );
}
