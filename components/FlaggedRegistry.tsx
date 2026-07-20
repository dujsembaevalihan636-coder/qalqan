"use client";

import { useEffect, useState } from "react";
import { KIND_LABELS, type FlaggedAccount } from "@/lib/types";

export function FlaggedRegistry() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<FlaggedAccount[]>([]);
  const [loading, setLoading] = useState(false);

  async function load(query: string) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/flagged${query ? `?q=${encodeURIComponent(query)}` : ""}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      setRows(json.accounts ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load("");
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Поиск по номеру карты, телефону, @нику…"
        className="field"
      />
      <div className="mt-5 space-y-2">
        {loading && rows.length === 0 ? (
          <p className="t-body-sm text-[#6b6b6b]">Загрузка…</p>
        ) : rows.length === 0 ? (
          <p className="t-body-sm text-[#6b6b6b]">
            Ничего не найдено. Возможно, схема ещё не засвечена — сообщи о ней.
          </p>
        ) : (
          rows.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-[16px] border border-white/10 px-5 py-4"
            >
              <span className="rounded-full border border-white/12 px-2.5 py-1 text-[11px] uppercase tracking-[0.1em] text-[#bdbdbd]">
                {KIND_LABELS[a.kind]}
              </span>
              <span className="break-all font-medium text-white">{a.value}</span>
              {a.note && (
                <span className="t-caption w-full text-[#9a9a9a] sm:w-auto sm:flex-1">
                  {a.note}
                </span>
              )}
              <span className="ml-auto flex items-center gap-2 text-[13px]">
                <span className="text-[#ff4d4d]">●</span>
                <span className="text-white">{a.report_count}</span>
                <span className="text-[#6b6b6b]">жалоб</span>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
