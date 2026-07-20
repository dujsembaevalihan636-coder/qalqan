"use client";

import { Map3D } from "./Map3D";

// Full-bleed cinematic map — no UI chrome (Miu Miu stage, not product card).
export function HeroMap() {
  return <Map3D autoRotate interactive={false} showChip={false} />;
}
