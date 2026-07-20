"use client";

import { useState } from "react";
import { SCHEME_LABELS, type SchemeType } from "@/lib/types";
import { KZ_CITY_NAMES } from "@/lib/kz";
import { Spinner } from "./Spinner";

export function ReportForm() {
  const [scheme, setScheme] = useState<SchemeType>("dropper");
  const [region, setRegion] = useState("");
  const [account, setAccount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheme_type: scheme,
          region,
          account,
          note,
        }),
      });
      if (res.ok) {
        setDone(true);
        setAccount("");
        setNote("");
      }
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="fade-up border border-[rgba(95,168,160,0.35)] p-8" style={{ background: "rgba(95,168,160,0.06)" }}>
        <p className="t-label text-[#5FA8A0]">Спасибо</p>
        <p className="t-subheading mt-2 text-[#F0EBE3]">
          Сигнал добавлен. Он появится на карте и защитит других.
        </p>
        <button onClick={() => setDone(false)} className="btn-ghost mt-4">
          Сообщить ещё →
        </button>
      </div>
    );
  }

  return (
    <div className="panel p-6 md:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="t-caption text-[#A39E96]">Тип схемы</span>
          <select
            value={scheme}
            onChange={(e) => setScheme(e.target.value as SchemeType)}
            className="field mt-2 !py-3.5 !text-[15px]"
          >
            {(Object.keys(SCHEME_LABELS) as SchemeType[]).map((s) => (
              <option key={s} value={s} className="bg-black">
                {SCHEME_LABELS[s]}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="t-caption text-[#A39E96]">Город</span>
          <input
            list="kz-cities"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="Например, Алматы"
            className="field mt-2 !py-3.5 !text-[15px]"
          />
          <datalist id="kz-cities">
            {KZ_CITY_NAMES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="t-caption text-[#A39E96]">
          Реквизит мошенника (необязательно)
        </span>
        <input
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          placeholder="Карта / кошелёк / телефон / @ник"
          className="field mt-2 !py-3.5 !text-[15px]"
        />
      </label>

      <label className="mt-4 block">
        <span className="t-caption text-[#A39E96]">Что произошло (кратко)</span>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Например: просил принять перевод и оставить 10%"
          className="field mt-2 !py-3.5 !text-[15px]"
        />
      </label>

      <button
        onClick={submit}
        disabled={loading || !region.trim()}
        className="btn-iris mt-6"
      >
        {loading ? <Spinner /> : null}
        {loading ? "Отправляю…" : "Добавить сигнал на карту"}
      </button>
    </div>
  );
}
