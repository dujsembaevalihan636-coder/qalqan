"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export default function EmergencyPage() {
  const { t } = useI18n();

  const steps = [
    t("emergency.step1"),
    t("emergency.step2"),
    t("emergency.step3"),
    t("emergency.step4"),
    t("emergency.step5"),
    t("emergency.step6"),
  ];

  const phones = [
    t("emergency.kaspi"),
    t("emergency.halyk"),
    t("emergency.forte"),
    t("emergency.bcc"),
    t("emergency.police"),
    t("emergency.afm"),
  ];

  return (
    <div className="mx-auto max-w-[800px] px-5 pb-28 pt-24 md:px-8 md:pt-28">
      <p className="t-label text-[#E23D3D]">{t("nav.emergency")}</p>
      <h1 className="t-heading mt-4 text-[#F3EFE6]">{t("emergency.title")}</h1>
      <p className="t-body mt-4 max-w-xl text-[#9E998F]">{t("emergency.sub")}</p>

      <section className="mt-12 border border-[rgba(226,61,61,0.35)] bg-[rgba(226,61,61,0.06)] p-6 md:p-8">
        <p className="t-label text-[#E23D3D]">{t("emergency.now")}</p>
        <ol className="mt-6 space-y-5">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-4">
              <span className="t-heading-sm shrink-0 text-[#E23D3D]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="t-body pt-1 text-[#F0EBE3]">{s}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="border border-[rgba(243,239,230,0.1)] p-6">
          <p className="t-label text-[#6AACA4]">{t("emergency.call")}</p>
          <ul className="mt-5 space-y-3">
            {phones.map((p) => (
              <li key={p} className="t-body-sm text-[#C8C2B8]">
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-[rgba(243,239,230,0.1)] p-6">
          <p className="t-label text-[#6AACA4]">{t("emergency.say")}</p>
          <p className="t-body-sm mt-5 leading-relaxed text-[#C8C2B8]">
            {t("emergency.script")}
          </p>
        </div>
      </section>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href="/statement" className="btn-primary w-full sm:w-auto">
          {t("emergency.statement")}
        </Link>
        <Link href="/check" className="btn-ghost justify-center py-3">
          {t("nav.check")} →
        </Link>
      </div>
    </div>
  );
}
