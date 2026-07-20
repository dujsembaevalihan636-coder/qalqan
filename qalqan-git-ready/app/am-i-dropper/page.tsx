"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { KIND_LABELS, type FlaggedAccount } from "@/lib/types";
import { Spinner } from "@/components/Spinner";

export default function AmIDropperPage() {
  const { t } = useI18n();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    found: boolean;
    kind: string;
    account: FlaggedAccount | null;
  } | null>(null);

  async function run() {
    if (!value.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/check-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      const data = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-[720px] px-5 pb-28 pt-24 md:px-8 md:pt-28">
      <p className="t-label text-[#6AACA4]">Drop-check</p>
      <h1 className="t-heading mt-4 text-[#F3EFE6]">{t("dropper.title")}</h1>
      <p className="t-body mt-4 text-[#9E998F]">{t("dropper.sub")}</p>
      <p className="t-body-sm mt-3 text-[#C9A227]">{t("dropper.hint")}</p>

      <div className="mt-10">
        <label className="sr-only" htmlFor="drop-input">
          {t("dropper.placeholder")}
        </label>
        <input
          id="drop-input"
          className="field"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run()}
          placeholder={t("dropper.placeholder")}
          autoComplete="off"
        />
        <button
          type="button"
          className="btn-primary mt-4 w-full sm:w-auto"
          disabled={loading || !value.trim()}
          onClick={run}
        >
          {loading ? <Spinner /> : null}
          {loading ? t("common.loading") : t("common.check")}
        </button>
      </div>

      {result && (
        <div
          className="mt-10 p-6 md:p-8"
          style={{
            border: result.found
              ? "1px solid rgba(226,61,61,0.4)"
              : "1px solid rgba(106,172,164,0.35)",
            background: result.found
              ? "rgba(226,61,61,0.06)"
              : "rgba(106,172,164,0.06)",
          }}
        >
          <p
            className="t-label"
            style={{ color: result.found ? "#E23D3D" : "#6AACA4" }}
          >
            {result.found ? t("dropper.found") : t("dropper.notFound")}
          </p>
          {result.found && result.account && (
            <p className="t-heading-sm mt-3 break-all text-[#F3EFE6]">
              {result.account.value}
            </p>
          )}
          <p className="t-body-sm mt-4 text-[#C8C2B8]">
            {result.found ? t("dropper.foundBody") : t("dropper.notFoundBody")}
          </p>
          {result.found && result.account && (
            <p className="t-caption mt-3 text-[#6B6760]">
              {KIND_LABELS[result.account.kind] ?? result.kind} ·{" "}
              {result.account.report_count} reports
            </p>
          )}
          {result.found && (
            <Link
              href="/emergency"
              className="btn-primary mt-6 inline-flex !bg-[#E23D3D] !text-white"
            >
              {t("emergency.btn")}
            </Link>
          )}
        </div>
      )}

      <p className="t-caption mt-8 text-[#5C5852]">{t("dropper.disclaimer")}</p>
    </div>
  );
}
