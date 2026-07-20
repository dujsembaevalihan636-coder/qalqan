"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  LEVELS,
  levelFor,
  loadProfile,
  resetProfile,
  type ShieldProfile,
} from "@/lib/shield-profile";

export default function ShieldPage() {
  const { t } = useI18n();
  const [p, setP] = useState<ShieldProfile | null>(null);

  useEffect(() => {
    setP(loadProfile());
  }, []);

  if (!p) {
    return (
      <div className="mx-auto max-w-[720px] px-5 py-28 text-[#9E998F]">
        {t("common.loading")}
      </div>
    );
  }

  const { current, next, progressToNext, remaining } = levelFor(p.checks);
  const pct = Math.round(progressToNext * 100);

  return (
    <div className="mx-auto max-w-[720px] px-5 pb-28 pt-24 md:px-8 md:pt-28">
      <p className="t-label text-[#6AACA4]">{t("nav.shield")}</p>
      <h1 className="t-heading mt-4 text-[#F3EFE6]">{t("shield.title")}</h1>
      <p className="t-body mt-4 text-[#9E998F]">{t("shield.sub")}</p>

      <div className="mt-12 grid gap-px bg-[rgba(243,239,230,0.1)] sm:grid-cols-3">
        {[
          { k: t("shield.checks"), v: p.checks },
          { k: t("shield.caught"), v: p.schemesCaught },
          { k: t("shield.level"), v: t(current.labelKey) },
        ].map((c) => (
          <div key={c.k} className="bg-[#0A0A0C] p-6">
            <p className="t-label text-[#5C5852]">{c.k}</p>
            <p className="t-heading-sm mt-3 text-[#F3EFE6]">{c.v}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 border border-[rgba(243,239,230,0.1)] p-6 md:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="t-label text-[#6AACA4]">{t("shield.level")}</p>
            <p className="t-heading-sm mt-2 text-[#F3EFE6]">
              {t(current.labelKey)}
            </p>
          </div>
          {next && (
            <p className="t-caption text-right text-[#5C5852]">
              {t("shield.next")}: {t(next.labelKey)}
              <br />
              {remaining} →
            </p>
          )}
        </div>
        <div className="mt-6 h-1 w-full bg-[rgba(243,239,230,0.08)]">
          <div
            className="h-full bg-[#6AACA4] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {LEVELS.map((lv) => {
            const active = lv.id === current.id;
            const done = p.checks >= lv.minChecks;
            return (
              <li
                key={lv.id}
                className="flex items-center justify-between border border-[rgba(243,239,230,0.08)] px-4 py-3"
                style={{
                  borderColor: active
                    ? "rgba(106,172,164,0.45)"
                    : "rgba(243,239,230,0.08)",
                }}
              >
                <span
                  className="t-body-sm"
                  style={{ color: done ? "#F3EFE6" : "#5C5852" }}
                >
                  {t(lv.labelKey)}
                </span>
                <span className="t-caption text-[#5C5852]">
                  {lv.minChecks}+
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="t-body-sm mt-8 text-[#6B6760]">{t("shield.tip")}</p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link href="/check" className="btn-primary w-full sm:w-auto">
          {t("shield.cta")}
        </Link>
        <button
          type="button"
          className="btn-ghost justify-center py-3"
          onClick={() => setP(resetProfile())}
        >
          {t("shield.reset")}
        </button>
      </div>
    </div>
  );
}
