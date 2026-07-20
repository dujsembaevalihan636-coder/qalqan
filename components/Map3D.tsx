"use client";

import dynamic from "next/dynamic";
import type { KzSceneProps } from "./scene/KzScene";

// 3D-сцена грузится только на клиенте (three.js требует window).
const KzScene = dynamic(() => import("./scene/KzScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex items-center gap-3 text-[13px] text-[#5C5852]">
        <span className="spin-slow inline-block h-4 w-4 rounded-full border-2 border-[rgba(243,239,230,0.12)] border-t-[#6AACA4]" />
        Карта загружается…
      </div>
    </div>
  ),
});

export function Map3D(props: KzSceneProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <KzScene {...props} />
    </div>
  );
}
