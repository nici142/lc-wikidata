import { Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import DiagnosePage from "./pages/DiagnosePage";
import BalconyPage from "./pages/BalconyPage";
import GardenPage from "./pages/GardenPage";
import IndoorPage from "./pages/IndoorPage";
import CarePage from "./pages/CarePage";
import PetSafetyPage from "./pages/PetSafetyPage";
import SearchPage from "./pages/SearchPage";

export default function App() {
  return (
    <div className="min-h-screen bg-leaf-50">
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<DiagnosePage />} />
          <Route path="/suche" element={<SearchPage />} />
          <Route path="/balkon" element={<BalconyPage />} />
          <Route path="/garten" element={<GardenPage />} />
          <Route path="/zimmer" element={<IndoorPage />} />
          <Route path="/pflege" element={<CarePage />} />
          <Route path="/tiere" element={<PetSafetyPage />} />
        </Routes>
      </main>
      <footer className="mx-auto max-w-6xl px-4 py-10 text-center text-xs text-bark-900/40">
        🌿 Pflanzenkompass – Bilddiagnose läuft lokal im Browser. Kein Ersatz für fachlichen
        oder tierärztlichen Rat.
      </footer>
    </div>
  );
}
