import { useCallback, useRef, useState } from "react";
import { analyzeImage } from "../lib/diagnose";
import type { DiagnosisResult } from "../lib/diagnose";

const statusMeta = {
  gesund: {
    label: "Sieht gesund aus",
    color: "text-leaf-700",
    ring: "ring-leaf-300",
    bg: "bg-leaf-50",
    emoji: "🌿",
  },
  leichter_stress: {
    label: "Leichte Stresssymptome",
    color: "text-amber-700",
    ring: "ring-amber-300",
    bg: "bg-amber-50",
    emoji: "🍃",
  },
  deutliche_probleme: {
    label: "Deutliche Auffälligkeiten",
    color: "text-rose-700",
    ring: "ring-rose-300",
    bg: "bg-rose-50",
    emoji: "🚨",
  },
} as const;

const severityColor = {
  info: "border-leaf-200 bg-leaf-50 text-leaf-800",
  warnung: "border-amber-200 bg-amber-50 text-amber-800",
  kritisch: "border-rose-200 bg-rose-50 text-rose-800",
} as const;

export default function DiagnosePage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Bitte lade eine Bilddatei hoch (JPG, PNG, ...).");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    setPreview(URL.createObjectURL(file));
    try {
      const res = await analyzeImage(file);
      setResult(res);
    } catch (e) {
      console.error(e);
      setError("Die Analyse ist fehlgeschlagen. Bitte versuche es mit einem anderen Bild.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-leaf-900">Pflanzen-Diagnose</h1>
      <p className="mt-1 max-w-2xl text-bark-900/70">
        Lade ein Foto deiner Pflanze hoch – am besten ein Blatt formatfüllend und gut
        ausgeleuchtet. Die App schätzt anhand von Blattfarbe und Mustern ein, wie es ihr geht.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`mt-6 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
          dragOver ? "border-leaf-500 bg-leaf-100" : "border-leaf-300 bg-white hover:bg-leaf-50"
        }`}
      >
        <span className="text-4xl">📷</span>
        <p className="font-medium text-leaf-800">Bild hierher ziehen oder klicken zum Hochladen</p>
        <p className="text-xs text-bark-900/50">JPG, PNG oder WEBP</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      {preview && (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,240px)_1fr]">
          <img
            src={preview}
            alt="Hochgeladenes Pflanzenfoto"
            className="h-60 w-full rounded-2xl border border-leaf-200 object-cover shadow-sm md:h-full"
          />

          <div>
            {loading && (
              <div className="flex items-center gap-3 rounded-2xl border border-leaf-200 bg-white p-5 text-leaf-700">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-leaf-600 border-t-transparent" />
                Analysiere Bild …
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4">
                <div
                  className={`rounded-2xl border p-5 ring-1 ${statusMeta[result.status].bg} ${statusMeta[result.status].ring}`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 text-lg font-semibold ${statusMeta[result.status].color}`}>
                      <span>{statusMeta[result.status].emoji}</span>
                      {statusMeta[result.status].label}
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${statusMeta[result.status].color}`}>
                        {result.healthScore}
                        <span className="text-sm font-normal">/100</span>
                      </div>
                      <div className="text-xs text-bark-900/50">Gesundheits-Score</div>
                    </div>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/70">
                    <div
                      className="h-full rounded-full bg-current transition-all"
                      style={{ width: `${result.healthScore}%` }}
                    />
                  </div>
                </div>

                {result.issues.length > 0 ? (
                  <div className="space-y-3">
                    {result.issues.map((issue) => (
                      <div
                        key={issue.id}
                        className={`rounded-xl border p-4 ${severityColor[issue.severity]}`}
                      >
                        <p className="font-semibold">{issue.title}</p>
                        <p className="mt-1 text-sm opacity-90">{issue.description}</p>
                        <ul className="mt-2 ml-4 list-disc space-y-1 text-sm opacity-90">
                          {issue.tips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl border border-leaf-200 bg-white p-4 text-sm text-bark-900/70">
                    Keine auffälligen Anzeichen von Stress, Schädlingen oder Nährstoffmangel
                    gefunden. Weiter so! 🌱
                  </p>
                )}

                <p className="text-xs text-bark-900/50">
                  ℹ️ Diese Einschätzung basiert auf einer einfachen Farbanalyse des Bildes im
                  Browser und ersetzt keine fachliche Diagnose. Bei anhaltenden Problemen einen
                  Pflanzenexperten oder eine Gartenberatung hinzuziehen.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
