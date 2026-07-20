"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { StatementKind } from "@/lib/statements";
import { Spinner } from "@/components/Spinner";

export default function StatementPage() {
  const { t, lang } = useI18n();
  const [kind, setKind] = useState<StatementKind>("bank");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [card, setCard] = useState("");
  const [bank, setBank] = useState("Kaspi");
  const [city, setCity] = useState("");
  const [what, setWhat] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [engine, setEngine] = useState<string>("");

  async function generate() {
    setLoading(true);
    setCopied(false);
    try {
      const res = await fetch("/api/statement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          lang: lang === "kz" ? "kz" : "ru",
          name,
          phone,
          card,
          bank,
          city,
          what,
        }),
      });
      const data = await res.json();
      if (data.text) {
        setOut(data.text);
        setEngine(data.engine ?? "");
      }
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!out) return;
    try {
      await navigator.clipboard.writeText(out);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mx-auto max-w-[800px] px-5 pb-28 pt-24 md:px-8 md:pt-28">
      <p className="t-label text-[#E23D3D]">Red button</p>
      <h1 className="t-heading mt-4 text-[#F3EFE6]">{t("statement.title")}</h1>
      <p className="t-body mt-4 text-[#9E998F]">{t("statement.sub")}</p>

      <div className="mt-8 inline-flex border border-[rgba(243,239,230,0.12)] p-1">
        {(["bank", "police"] as StatementKind[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className="t-label px-4 py-2 transition-colors"
            style={{
              color: kind === k ? "#F3EFE6" : "#5C5852",
              background: kind === k ? "rgba(226,61,61,0.15)" : "transparent",
            }}
          >
            {k === "bank" ? t("statement.toBank") : t("statement.toPolice")}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {(
          [
            ["name", name, setName, t("statement.name")],
            ["phone", phone, setPhone, t("statement.phone")],
            ["card", card, setCard, t("statement.card")],
            ["bank", bank, setBank, t("statement.bank")],
            ["city", city, setCity, t("statement.city")],
          ] as const
        ).map(([id, val, set, label]) => (
          <label key={id} className="block">
            <span className="t-caption text-[#9E998F]">{label}</span>
            <input
              className="field mt-2 !py-3"
              value={val}
              onChange={(e) => set(e.target.value)}
            />
          </label>
        ))}
      </div>

      <label className="mt-4 block">
        <span className="t-caption text-[#9E998F]">{t("statement.what")}</span>
        <textarea
          className="field mt-2 min-h-[100px] resize-none"
          value={what}
          onChange={(e) => setWhat(e.target.value)}
        />
      </label>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          className="btn-primary"
          onClick={generate}
          disabled={loading}
        >
          {loading ? <Spinner /> : null}
          {loading ? t("common.loading") : t("statement.gen")}
        </button>
        <button
          type="button"
          className="btn-ghost py-3"
          onClick={copy}
          disabled={!out}
        >
          {copied ? t("common.copied") : t("common.copy")}
        </button>
      </div>

      {out && (
        <div className="mt-10 border border-[rgba(243,239,230,0.1)] p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="t-label text-[#6AACA4]">{t("statement.out")}</p>
            {engine && (
              <span className="t-caption text-[#5C5852]">
                {engine === "claude" ? "Claude" : "template"}
              </span>
            )}
          </div>
          <pre className="whitespace-pre-wrap font-sans text-[14px] leading-relaxed text-[#C8C2B8]">
            {out}
          </pre>
        </div>
      )}
    </div>
  );
}
