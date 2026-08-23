// Client-seitige Bildanalyse zur groben Einschätzung der Pflanzengesundheit.
//
// WICHTIG: Dies ist eine leichte, heuristische Farb-/Musteranalyse (HSV-Verteilung
// der Pixel), KEIN trainiertes KI-Modell und KEINE botanische Ferndiagnose.
// Sie läuft komplett im Browser, ohne Server oder API-Key. Für eine belastbarere
// Diagnose lässt sich `analyzeImage` leicht durch einen Aufruf einer echten
// Bilderkennungs-API ersetzen (z. B. Plant.id/Kindwise oder ein Vision-Modell
// über ein eigenes Backend) – siehe README.

export type IssueSeverity = "info" | "warnung" | "kritisch";

export interface DiagnosisIssue {
  id: string;
  title: string;
  severity: IssueSeverity;
  description: string;
  tips: string[];
}

export interface DiagnosisResult {
  healthScore: number; // 0-100
  status: "gesund" | "leichter_stress" | "deutliche_probleme";
  greenRatio: number;
  yellowRatio: number;
  brownRatio: number;
  spotRatio: number;
  issues: DiagnosisIssue[];
}

const SAMPLE_SIZE = 120; // Bild wird auf 120x120 herunterskaliert für die Analyse

function rgbToHsv(r: number, g: number, b: number) {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rN) h = ((gN - bN) / d) % 6;
    else if (max === gN) h = (bN - rN) / d + 2;
    else h = (rN - gN) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  const v = max;
  return { h, s, v };
}

async function loadImageToCanvas(file: File): Promise<ImageData> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });

  const canvas = document.createElement("canvas");
  canvas.width = SAMPLE_SIZE;
  canvas.height = SAMPLE_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas wird nicht unterstützt");
  ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
  return ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
}

export async function analyzeImage(file: File): Promise<DiagnosisResult> {
  const imageData = await loadImageToCanvas(file);
  const { data } = imageData;

  let plantPixels = 0;
  let green = 0;
  let yellow = 0;
  let brown = 0;
  let darkSpots = 0;
  let paleSpots = 0;

  // Grobes Raster, um Fleckigkeit (hohe lokale Kontraste) zu erkennen
  const grid: number[] = new Array(SAMPLE_SIZE * SAMPLE_SIZE).fill(0);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const { h, s, v } = rgbToHsv(r, g, b);
    const pixelIndex = i / 4;

    // Hintergrund (sehr helle/graue/blaue Flächen, z. B. Wand, Himmel, Tisch) ausschließen
    const isLikelyPlant = s > 0.15 || v < 0.85;
    if (!isLikelyPlant) {
      grid[pixelIndex] = -1;
      continue;
    }
    plantPixels++;

    if (h >= 70 && h <= 170 && s > 0.15 && v > 0.15) {
      green++;
      grid[pixelIndex] = v > 0.25 ? 1 : 2; // 2 = sehr dunkles Grün
    } else if (h >= 35 && h < 70 && s > 0.25) {
      yellow++;
      grid[pixelIndex] = 3;
    } else if (h >= 15 && h < 35 && s > 0.25 && v < 0.6) {
      brown++;
      grid[pixelIndex] = 4;
    } else if (v < 0.22) {
      darkSpots++;
      grid[pixelIndex] = 5;
    } else if (v > 0.85 && s < 0.2) {
      paleSpots++;
      grid[pixelIndex] = 6;
    } else {
      grid[pixelIndex] = 0;
    }
  }

  const total = Math.max(plantPixels, 1);
  const greenRatio = green / total;
  const yellowRatio = yellow / total;
  const brownRatio = brown / total;
  const darkSpotRatio = darkSpots / total;
  const paleSpotRatio = paleSpots / total;
  const spotRatio = darkSpotRatio + paleSpotRatio;

  const issues: DiagnosisIssue[] = [];

  if (yellowRatio > 0.18) {
    issues.push({
      id: "chlorose",
      title: "Mögliche Chlorose / Nährstoffmangel",
      severity: yellowRatio > 0.35 ? "kritisch" : "warnung",
      description:
        "Auffällig viele gelbliche Blattbereiche erkannt. Das deutet häufig auf Nährstoffmangel (z. B. Eisen, Stickstoff), zu viel oder zu wenig Wasser oder zu wenig Licht hin.",
      tips: [
        "Gießverhalten prüfen – weder austrocknen noch Staunässe",
        "Mit einem ausgewogenen Flüssigdünger versorgen",
        "Standort auf ausreichend Licht prüfen",
      ],
    });
  }

  if (brownRatio > 0.12) {
    issues.push({
      id: "blattflecken",
      title: "Braune Blattränder oder -flecken",
      severity: brownRatio > 0.25 ? "kritisch" : "warnung",
      description:
        "Braune, abgestorbene Bereiche gefunden. Mögliche Ursachen sind Sonnenbrand, Trockenstress, Staunässe oder ein Pilzbefall.",
      tips: [
        "Betroffene Blätter entfernen, um Ausbreitung zu vermeiden",
        "Gießrhythmus überprüfen und für gute Drainage sorgen",
        "Standort ggf. vor praller Mittagssonne schützen",
      ],
    });
  }

  if (darkSpotRatio > 0.05) {
    issues.push({
      id: "pilz-schaedlinge",
      title: "Punktuelle dunkle Flecken",
      severity: "warnung",
      description:
        "Kleine, verteilte dunkle Flecken können auf Pilzbefall (z. B. Blattfleckenkrankheit) oder Schädlinge hinweisen.",
      tips: [
        "Blattunterseiten auf Schädlinge (Läuse, Spinnmilben) kontrollieren",
        "Für gute Luftzirkulation sorgen, Blätter beim Gießen trocken halten",
        "Bei Verdacht auf Pilzbefall betroffene Blätter entfernen",
      ],
    });
  }

  if (paleSpotRatio > 0.06) {
    issues.push({
      id: "mehltau",
      title: "Helle, mehlige Beläge",
      severity: "warnung",
      description:
        "Helle, leicht grau-weißliche Flächen können auf Echten oder Falschen Mehltau hindeuten.",
      tips: [
        "Luftfeuchtigkeit reduzieren und für Abstand zwischen Pflanzen sorgen",
        "Befallene Blätter frühzeitig entfernen",
        "Bei starkem Befall auf ein geeignetes Fungizid zurückgreifen",
      ],
    });
  }

  if (plantPixels < SAMPLE_SIZE * SAMPLE_SIZE * 0.05) {
    issues.push({
      id: "kein-blatt-erkannt",
      title: "Wenig Pflanzenmaterial erkannt",
      severity: "info",
      description:
        "Auf dem Bild wurden nur wenige pflanzentypische Farbflächen erkannt. Für ein zuverlässigeres Ergebnis am besten ein Blatt formatfüllend und gut ausgeleuchtet fotografieren.",
      tips: ["Näher heranzoomen", "Bei Tageslicht ohne starken Schatten fotografieren"],
    });
  }

  let healthScore = Math.round(
    100 * greenRatio - 60 * yellowRatio - 90 * brownRatio - 70 * spotRatio,
  );
  healthScore = Math.min(100, Math.max(0, healthScore));
  if (issues.length === 0) healthScore = Math.max(healthScore, 80);

  const status: DiagnosisResult["status"] =
    healthScore >= 75 ? "gesund" : healthScore >= 45 ? "leichter_stress" : "deutliche_probleme";

  return {
    healthScore,
    status,
    greenRatio,
    yellowRatio,
    brownRatio,
    spotRatio,
    issues,
  };
}
