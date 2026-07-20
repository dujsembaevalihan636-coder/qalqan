"use client";

import { useEffect, useState } from "react";
import { KZ_CITIES, normalizeRegion } from "@/lib/kz";
import { SCHEME_COLOR } from "@/lib/mapgeo";
import { detectCity } from "@/lib/geo";
import { SCHEME_LABELS, type SchemeType } from "@/lib/types";
import type { RegionAggregate } from "@/app/api/map/route";
import { Map3D } from "./Map3D";
import { Spinner } from "./Spinner";

interface MapData {
  regions: RegionAggregate[];
  totals: { reports: number; regions: number; red: number };
  recent: {
    id: string;
    scheme_type: SchemeType;
    region: string;
    verdict: string;
    created_at: string;
  }[];
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "только что";
  if (m < 60) return `${m} мин назад`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ч назад`;
  return `${Math.floor(h / 24)} дн назад`;
}

export function ThreatMap() {
  const [data, setData] = useState<MapData | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [myCity, setMyCity] = useState<{ name: string; km: number } | null>(null);
  const [geoState, setGeoState] = useState<"idle" | "loading" | "error">("idle");

  async function load() {
    try {
      const res = await fetch("/api/map", { cache: "no-store" });
      setData((await res.json()) as MapData);
    } catch {
      /* тихо */
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, []);

  async function locate() {
    setGeoState("loading");
    const r = await detectCity();
    if (r.ok) {
      setMyCity({ name: r.city.name, km: Math.round(r.km) });
      setSelected(r.city.name);
      setGeoState("idle");
    } else {
      setGeoState("error");
    }
  }

  const activeRegion = selected
    ? data?.regions.find((r) => normalizeRegion(r.region) === selected)
    : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      {/* ── 3D-КАРТА ── */}
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-b from-[#0a0a0f] to-[#050505]">
        <div className="h-[420px] w-full md:h-[560px]">
          <Map3D
            data={data}
            interactive
            autoRotate={false}
            selected={selected}
            onSelectCity={setSelected}
            showChip={false}
          />
        </div>

        <div className="pointer-events-none absolute bottom-3 right-4 text-[11px] uppercase tracking-[0.14em] text-[#6b6b6b]">
          потяни, чтобы повернуть · кликни город
        </div>

        {/* легенда */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 px-4 pb-3 pt-1">
          {(Object.keys(SCHEME_LABELS) as SchemeType[]).map((s) => (
            <span
              key={s}
              className="flex items-center gap-2 text-[12px] text-[#9a9a9a]"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: SCHEME_COLOR[s] }}
              />
              {SCHEME_LABELS[s]}
            </span>
          ))}
        </div>
      </div>

      {/* ── ПАНЕЛЬ ── */}
      <div>
        {/* геолокация */}
        <button onClick={locate} disabled={geoState === "loading"} className="btn-iris w-full !justify-center">
          {geoState === "loading" ? <Spinner /> : "📍"}
          {geoState === "loading" ? "Определяю…" : "Определить мой город"}
        </button>
        {myCity && (
          <p className="mt-2 t-body-sm text-[#5FA8A0]">
            Ты рядом с городом <b>{myCity.name}</b> (~{myCity.km} км). Показываю
            обстановку здесь.
          </p>
        )}
        {geoState === "error" && (
          <p className="mt-2 t-body-sm text-[#9a9a9a]">
            Не удалось определить местоположение. Выбери город вручную ниже.
          </p>
        )}

        {/* тоталы */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { k: "Проверок", v: data?.totals.reports ?? "—" },
            { k: "Регионов", v: data?.totals.regions ?? "—" },
            { k: "Красных", v: data?.totals.red ?? "—" },
          ].map((s) => (
            <div key={s.k} className="rounded-[18px] border border-white/10 p-4">
              <p className="t-heading-sm text-white">{s.v}</p>
              <p className="t-caption mt-1 text-[#9a9a9a]">{s.k}</p>
            </div>
          ))}
        </div>

        {/* фильтр по региону */}
        <div className="mt-6">
          <p className="t-label mb-3 text-[#5FA8A0]">В твоём регионе</p>
          <select
            value={selected ?? ""}
            onChange={(e) => setSelected(e.target.value || null)}
            className="field !py-3.5 !text-[15px]"
          >
            <option value="">Выбери город…</option>
            {KZ_CITIES.map((c) => (
              <option key={c.name} value={c.name} className="bg-black">
                {c.name}
              </option>
            ))}
          </select>

          {selected && activeRegion ? (
            <div
              className="fade-up mt-4 rounded-[20px] p-5"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,77,77,0.10), rgba(255,255,255,0.015))",
                border: "1px solid rgba(255,77,77,0.35)",
              }}
            >
              <p className="t-body-sm text-[#9a9a9a]">
                В городе <b className="text-white">{selected}</b> сейчас активна
                схема:
              </p>
              <p
                className="t-subheading mt-1"
                style={{ color: SCHEME_COLOR[activeRegion.topScheme] }}
              >
                {SCHEME_LABELS[activeRegion.topScheme]}
              </p>
              <p className="t-caption mt-2 text-[#9a9a9a]">
                {activeRegion.total} сигнал(ов), из них {activeRegion.red}{" "}
                красных. Последний — {timeAgo(activeRegion.lastAt)}.
              </p>
            </div>
          ) : selected ? (
            <div className="mt-4 border border-[rgba(95,168,160,0.3)] p-5" style={{ background: "rgba(95,168,160,0.06)" }}>
              <p className="t-body-sm text-[#5FA8A0]">
                В городе {selected} пока нет сигналов. Это хорошо — но будь
                внимателен.
              </p>
            </div>
          ) : null}
        </div>

        {/* лента */}
        <div className="mt-7">
          <p className="t-label mb-3 text-[#5FA8A0]">Живая лента проверок</p>
          <ul className="space-y-2">
            {(data?.recent ?? []).map((r) => (
              <li
                key={r.id}
                className="flex items-center gap-3 rounded-[14px] border border-white/8 px-4 py-3"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: SCHEME_COLOR[r.scheme_type] }}
                />
                <span className="t-body-sm text-white">
                  {SCHEME_LABELS[r.scheme_type]}
                </span>
                <span className="t-caption text-[#9a9a9a]">· {r.region}</span>
                <span className="t-caption ml-auto text-[#6b6b6b]">
                  {timeAgo(r.created_at)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
