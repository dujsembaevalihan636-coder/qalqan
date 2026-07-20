"use client";

import { useEffect, useState } from "react";

/** Quiet live counters — production feel, not dashboard noise. */
export function LivePulse() {
  const [totals, setTotals] = useState<{
    reports: number;
    regions: number;
    red: number;
  } | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/map")
      .then((r) => r.json())
      .then((d) => {
        if (alive && d?.totals) setTotals(d.totals);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const items = [
    { k: "Сигналов", v: totals?.reports ?? "—" },
    { k: "Регионов", v: totals?.regions ?? "—" },
    { k: "Красных", v: totals?.red ?? "—" },
  ];

  return (
    <div className="live-pulse" aria-label="Живые показатели">
      {items.map((it) => (
        <div key={it.k} className="live-pulse__cell">
          <p className="live-pulse__v">{it.v}</p>
          <p className="live-pulse__k">{it.k}</p>
        </div>
      ))}
    </div>
  );
}
