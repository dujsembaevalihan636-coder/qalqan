import { makeProjection } from "./kz";
import oblastsData from "./kz-oblasts.json";
import type { SchemeType } from "./types";

// Общая геометрия карты Казахстана: проекция + готовые SVG-пути областей.
// Считается один раз и переиспользуется картой (/map) и hero-визуалом.

export interface Oblasts {
  bounds: [number, number, number, number];
  regions: { name: string; polys: number[][][][] }[];
}

export const OBLASTS = oblastsData as Oblasts;
export const VIEW_W = 1000;
export const PROJ = makeProjection(OBLASTS.bounds, VIEW_W);
export const VIEW_H = Math.round(PROJ.height);

export const REGION_PATHS = OBLASTS.regions.map((r) => {
  let d = "";
  for (const poly of r.polys) {
    for (const ring of poly) {
      ring.forEach(([lng, lat], i) => {
        const [x, y] = PROJ.project(lng, lat);
        d += (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1);
      });
      d += "Z";
    }
  }
  return { name: r.name, d };
});

export const SCHEME_COLOR: Record<SchemeType, string> = {
  dropper: "#E23D3D",
  fake_job: "#C96B4A",
  pyramid: "#C9A227",
  phishing: "#5FA8A0",
  other: "#7A8A99",
};
