import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "plantbuddy:favorites";

function readStoredFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function writeStoredFavorites(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // localStorage nicht verfügbar (z. B. privates Fenster) – Favoriten bleiben dann nur für die Sitzung im Speicher.
  }
}

/**
 * Merkliste für Pflanzen, rein clientseitig in localStorage gespeichert.
 * Kein Backend, keine Anmeldung nötig – die Auswahl bleibt auf diesem Gerät/Browser erhalten.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set(readStoredFavorites()));

  // Auf Änderungen aus anderen Tabs/Fenstern reagieren.
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) {
        setFavorites(new Set(readStoredFavorites()));
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      writeStoredFavorites([...next]);
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.has(id), [favorites]);

  return { favorites, toggleFavorite, isFavorite, count: favorites.size };
}
