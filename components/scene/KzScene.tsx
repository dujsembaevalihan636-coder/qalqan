"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { REGIONS_3D, CITIES_3D, LAND_DEPTH } from "@/lib/map3d";
import { SCHEME_COLOR } from "@/lib/mapgeo";
import { normalizeRegion } from "@/lib/kz";
import { type SchemeType } from "@/lib/types";
import type { RegionAggregate } from "@/app/api/map/route";

interface MapData {
  regions: RegionAggregate[];
  totals: { reports: number; regions: number; red: number };
}

// ── Геометрия областей (строится один раз) ──
function useLandGeometries() {
  return useMemo(() => {
    const geoms: THREE.ExtrudeGeometry[] = [];
    for (const region of REGIONS_3D) {
      for (const poly of region.polys) {
        if (poly.outer.length < 3) continue;
        const shape = new THREE.Shape();
        poly.outer.forEach(([x, y], i) =>
          i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)
        );
        for (const hole of poly.holes) {
          if (hole.length < 3) continue;
          const path = new THREE.Path();
          hole.forEach(([x, y], i) =>
            i === 0 ? path.moveTo(x, y) : path.lineTo(x, y)
          );
          shape.holes.push(path);
        }
        geoms.push(
          new THREE.ExtrudeGeometry(shape, {
            depth: LAND_DEPTH,
            bevelEnabled: true,
            bevelThickness: 0.04,
            bevelSize: 0.03,
            bevelSegments: 1,
          })
        );
      }
    }
    return geoms;
  }, []);
}

function Land() {
  const geoms = useLandGeometries();
  return (
    <group>
      {geoms.map((g, i) => (
        <mesh key={i} geometry={g} castShadow receiveShadow>
          <meshStandardMaterial
            color="#1a1c20"
            roughness={0.55}
            metalness={0.35}
            emissive="#0a1012"
            emissiveIntensity={0.75}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Точка угрозы + подпись города ──
function ThreatPoint({
  x,
  y,
  color,
  label,
  intensity,
  selected,
  interactive,
  onSelect,
}: {
  x: number;
  y: number;
  color: string;
  label: string;
  intensity: number;
  selected: boolean;
  interactive: boolean;
  onSelect?: (name: string | null) => void;
}) {
  const ring = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const dotR = 0.09 + intensity * 0.09;

  useFrame((s) => {
    const t = (s.clock.elapsedTime * 0.6) % 1; // 0..1
    if (ring.current && ringMat.current) {
      const sc = 1 + t * 2.4;
      ring.current.scale.set(sc, sc, sc);
      ringMat.current.opacity = (1 - t) * 0.4;
    }
  });

  return (
    <group position={[x, y, LAND_DEPTH]}>
      {/* пульсирующее кольцо на поверхности */}
      <mesh ref={ring} position={[0, 0, 0.02]}>
        <ringGeometry args={[dotR * 1.3, dotR * 1.7, 28]} />
        <meshBasicMaterial
          ref={ringMat}
          color={color}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* точка */}
      <mesh
        position={[0, 0, 0.12]}
        onClick={
          interactive
            ? (e) => {
                e.stopPropagation();
                onSelect?.(selected ? null : label);
              }
            : undefined
        }
        onPointerOver={interactive ? () => (document.body.style.cursor = "pointer") : undefined}
        onPointerOut={interactive ? () => (document.body.style.cursor = "auto") : undefined}
      >
        <sphereGeometry args={[selected ? dotR * 1.5 : dotR, 20, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={selected ? 2.4 : 1.5}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* подпись города над точкой — лёгкий текст без плашки */}
      <Html
        position={[0, 0, 0.42]}
        center
        distanceFactor={9}
        zIndexRange={[20, 0]}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            whiteSpace: "nowrap",
            font: `${selected ? 700 : 600} 11px var(--font-body, sans-serif)`,
            color: selected ? "#ffffff" : "#e6e6ec",
            textShadow:
              "0 1px 5px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.7)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 9999,
              background: color,
              boxShadow: `0 0 5px ${color}`,
            }}
          />
          {label}
        </div>
      </Html>
    </group>
  );
}

// маркеры городов без сигналов
function CityDots({ active }: { active: Set<string> }) {
  return (
    <>
      {CITIES_3D.filter((c) => !active.has(c.name)).map((c) => (
        <mesh key={c.name} position={[c.x, c.y, LAND_DEPTH + 0.02]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshBasicMaterial color="#585866" />
        </mesh>
      ))}
    </>
  );
}

function Points({
  data,
  selected,
  interactive,
  onSelect,
}: {
  data: RegionAggregate[];
  selected: string | null;
  interactive: boolean;
  onSelect?: (name: string | null) => void;
}) {
  const items = useMemo(() => {
    const byCity = new Map<string, RegionAggregate>();
    for (const r of data) {
      const cn = normalizeRegion(r.region);
      if (cn) byCity.set(cn, r);
    }
    const max = Math.max(1, ...[...byCity.values()].map((a) => a.total));
    return CITIES_3D.flatMap((c) => {
      const agg = byCity.get(c.name);
      if (!agg) return [];
      return [
        {
          name: c.name,
          x: c.x,
          y: c.y,
          color: SCHEME_COLOR[agg.topScheme as SchemeType],
          intensity: agg.total / max,
        },
      ];
    });
  }, [data]);

  return (
    <>
      {items.map((it) => (
        <ThreatPoint
          key={it.name}
          x={it.x}
          y={it.y}
          color={it.color}
          label={it.name}
          intensity={it.intensity}
          selected={selected === it.name}
          interactive={interactive}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

export interface KzSceneProps {
  data?: MapData | null;
  autoRotate?: boolean;
  interactive?: boolean;
  selected?: string | null;
  onSelectCity?: (name: string | null) => void;
  showChip?: boolean;
}

export default function KzScene({
  data: dataProp,
  autoRotate = true,
  interactive = false,
  selected = null,
  onSelectCity,
  showChip = true,
}: KzSceneProps) {
  const [fetched, setFetched] = useState<MapData | null>(null);
  const selfFetch = dataProp === undefined;

  useEffect(() => {
    if (!selfFetch) return;
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/map", { cache: "no-store" });
        if (alive) setFetched((await res.json()) as MapData);
      } catch {
        /* тихо */
      }
    };
    load();
    const t = setInterval(load, 8000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [selfFetch]);

  const data = selfFetch ? fetched : dataProp;

  const activeCities = useMemo(() => {
    const s = new Set<string>();
    for (const r of data?.regions ?? []) {
      const cn = normalizeRegion(r.region);
      if (cn) s.add(cn);
    }
    return s;
  }, [data]);

  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 9.5, 11.5], fov: 38 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      >
        <color attach="background" args={["#080809"]} />
        <fog attach="fog" args={["#080809", 12, 24]} />

        <ambientLight intensity={0.42} />
        <directionalLight
          position={[4, 10, 6]}
          intensity={1.55}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-6, 5, -4]} intensity={48} color="#6AACA4" distance={32} />
        <pointLight position={[6, 4, 6]} intensity={18} color="#2F5C58" distance={28} />
        <pointLight position={[0, 8, 2]} intensity={12} color="#F3EFE6" distance={20} />

        {/* карта лежит в плоскости XZ: наклоняем группу на -90° по X */}
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <Land />
          <CityDots active={activeCities} />
          {data && (
            <Points
              data={data.regions}
              selected={selected}
              interactive={interactive}
              onSelect={onSelectCity}
            />
          )}
        </group>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={interactive}
          autoRotate={autoRotate}
          autoRotateSpeed={0.28}
          minPolarAngle={Math.PI * 0.16}
          maxPolarAngle={Math.PI * 0.48}
          target={[0, 0, 0]}
          enableDamping
        />
      </Canvas>

      {showChip && (
        <div className="pointer-events-none absolute left-1 top-1 flex items-center gap-2 border border-[rgba(240,235,227,0.1)] bg-[#0A0A0B]/70 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5FA8A0] opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5FA8A0]" />
          </span>
          <span className="text-[12px] text-[#A39E96]">
            {data
              ? `${data.totals.reports} сигналов · ${data.totals.regions} регионов`
              : "загрузка…"}
          </span>
        </div>
      )}
    </>
  );
}
