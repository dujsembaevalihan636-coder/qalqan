// Города/регионы Казахстана с РЕАЛЬНЫМИ географическими координатами.
// Границы областей — из geoBoundaries (OpenStreetMap, ODbL), см. lib/kz-oblasts.json.
// Проекция и поиск ближайшего города используются картой и геолокацией.

export interface KzCity {
  name: string;
  lat: number;
  lng: number;
}

// Реальные координаты (широта, долгота) областных центров.
export const KZ_CITIES: KzCity[] = [
  { name: "Астана", lat: 51.169, lng: 71.449 },
  { name: "Алматы", lat: 43.238, lng: 76.889 },
  { name: "Шымкент", lat: 42.317, lng: 69.588 },
  { name: "Караганда", lat: 49.807, lng: 73.088 },
  { name: "Актобе", lat: 50.284, lng: 57.166 },
  { name: "Тараз", lat: 42.9, lng: 71.378 },
  { name: "Павлодар", lat: 52.287, lng: 76.967 },
  { name: "Усть-Каменогорск", lat: 49.948, lng: 82.628 },
  { name: "Семей", lat: 50.411, lng: 80.227 },
  { name: "Костанай", lat: 53.214, lng: 63.632 },
  { name: "Петропавловск", lat: 54.873, lng: 69.163 },
  { name: "Кокшетау", lat: 53.284, lng: 69.397 },
  { name: "Атырау", lat: 47.094, lng: 51.924 },
  { name: "Актау", lat: 43.641, lng: 51.198 },
  { name: "Уральск", lat: 51.204, lng: 51.371 },
  { name: "Кызылорда", lat: 44.848, lng: 65.482 },
  { name: "Туркестан", lat: 43.297, lng: 68.252 },
];

export const KZ_CITY_NAMES = KZ_CITIES.map((c) => c.name);

// ── Проекция lng/lat → координаты SVG (равнопромежуточная с поправкой на широту) ──
export interface Projection {
  project: (lng: number, lat: number) => [number, number];
  width: number;
  height: number;
}

export function makeProjection(
  bounds: [number, number, number, number],
  targetWidth: number,
  pad = 12
): Projection {
  const [minLng, minLat, maxLng, maxLat] = bounds;
  const midLat = ((minLat + maxLat) / 2) * (Math.PI / 180);
  const kx = Math.cos(midLat); // сжатие по долготе на данной широте
  const geoW = (maxLng - minLng) * kx;
  const geoH = maxLat - minLat;
  const innerW = targetWidth - pad * 2;
  const scale = innerW / geoW;
  const height = geoH * scale + pad * 2;
  const project = (lng: number, lat: number): [number, number] => {
    const x = pad + (lng - minLng) * kx * scale;
    const y = pad + (maxLat - lat) * scale; // y инвертирован (север вверху)
    return [x, y];
  };
  return { project, width: targetWidth, height };
}

// ── Гаверсинус и ближайший город (для геолокации) ──
export function haversineKm(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number
): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) *
      Math.cos((bLat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function nearestCity(
  lat: number,
  lng: number
): { city: KzCity; km: number } {
  let best = KZ_CITIES[0];
  let bestKm = Infinity;
  for (const c of KZ_CITIES) {
    const km = haversineKm(lat, lng, c.lat, c.lng);
    if (km < bestKm) {
      bestKm = km;
      best = c;
    }
  }
  return { city: best, km: bestKm };
}

// Нормализация названия региона (области → города).
export function normalizeRegion(input?: string | null): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();
  const found = KZ_CITY_NAMES.find(
    (c) => lower.includes(c.toLowerCase()) || c.toLowerCase().includes(lower)
  );
  if (found) return found;
  const map: Record<string, string> = {
    "нур-султан": "Астана",
    "астана": "Астана",
    "алма-ата": "Алматы",
    "шымкент": "Шымкент",
    "чимкент": "Шымкент",
    "оскемен": "Усть-Каменогорск",
    "усть-каменогорск": "Усть-Каменогорск",
  };
  for (const key of Object.keys(map)) {
    if (lower.includes(key)) return map[key];
  }
  return null;
}
