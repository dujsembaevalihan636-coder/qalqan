import { OBLASTS } from "./mapgeo";
import { KZ_CITIES } from "./kz";

// Плоские координаты для 3D: центрируем карту в начале координат и масштабируем
// в удобные для three.js единицы. X — долгота, Y — широта (север = +Y).

const [minLng, minLat, maxLng, maxLat] = OBLASTS.bounds;
const MID_LNG = (minLng + maxLng) / 2;
const MID_LAT = (minLat + maxLat) / 2;
const KX = Math.cos((MID_LAT * Math.PI) / 180); // сжатие по долготе
export const MAP_WIDTH = 9; // целевая ширина карты в 3D-единицах
export const LAND_DEPTH = 0.35; // толщина «плиты» области
const GEO_W = (maxLng - minLng) * KX;
const S = MAP_WIDTH / GEO_W;
export const MAP_DEPTH = (maxLat - minLat) * S;

export function flat(lng: number, lat: number): [number, number] {
  return [(lng - MID_LNG) * KX * S, (lat - MID_LAT) * S];
}

export interface Region3D {
  name: string;
  polys: { outer: [number, number][]; holes: [number, number][][] }[];
}

// Каждая область → набор полигонов (внешний контур + отверстия) в плоских координатах.
export const REGIONS_3D: Region3D[] = OBLASTS.regions.map((r) => ({
  name: r.name,
  polys: r.polys.map((poly) => {
    const rings = poly.map((ring) =>
      ring.map(([lng, lat]) => flat(lng, lat) as [number, number])
    );
    return { outer: rings[0], holes: rings.slice(1) };
  }),
}));

// Города в плоских координатах (для 3D-столбов угроз и маркеров).
export const CITIES_3D = KZ_CITIES.map((c) => {
  const [x, y] = flat(c.lng, c.lat);
  return { name: c.name, x, y };
});
