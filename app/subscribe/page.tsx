"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { PLANS, REVIEWS, SAVED_SIGNALS } from "@/lib/plans";
import { PricingModal } from "@/components/PricingModal";

export default function SubscribePage() {
  const { t, lang } = useI18n();
  const L = lang === "kz" ? "kz" : "ru";
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto max-w-[1000px] px-5 pb-28 pt-24 md:px-8 md:pt-28">
      <p className="t-label text-[#6AACA4]">{t("nav.subscribe")}</p>
      <h1 className="t-heading mt-4 max-w-2xl text-[#F3EFE6]">
        {t("sub.title")}
      </h1>
      <p className="t-body mt-4 max-w-2xl text-[#9E998F]">{t("sub.sub")}</p>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border border-[rgba(243,239,230,0.1)] px-6 py-6">
        <div>
          <p className="t-heading text-[#6AACA4]">
            {SAVED_SIGNALS.toLocaleString("ru-KZ")}
          </p>
          <p className="t-caption mt-2 text-[#5C5852]">{t("sub.saved")}</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setOpen(true)}
        >
          {t("sub.cta")}
        </button>
      </div>

      {/* Inline preview cards (click opens modal) */}
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => setOpen(true)}
            className="pricing-card text-left"
            style={
              plan.id === "parents"
                ? { borderColor: "rgba(106,172,164,0.45)" }
                : undefined
            }
          >
            {plan.id === "parents" && (
              <span className="pricing-card__badge">{t("sub.featured")}</span>
            )}
            <p className="t-label" style={{ color: plan.accent }}>
              {t(plan.titleKey)}
            </p>
            <p className="pricing-card__price">{t(plan.priceKey)}</p>
            <p className="t-body-sm mt-3 text-[#9E998F]">{t(plan.descKey)}</p>
          </button>
        ))}
      </div>

      <section className="mt-16">
        <p className="t-label text-[#5C5852]">{t("sub.reviews")}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <blockquote
              key={i}
              className="border border-[rgba(243,239,230,0.1)] p-5"
            >
              <p className="t-body-sm text-[#C8C2B8]">«{r.text[L]}»</p>
              <footer className="t-caption mt-4 text-[#5C5852]">
                {r.who[L]}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <p className="t-caption mt-12 max-w-xl text-[#5C5852]">{t("sub.demo")}</p>

      <PricingModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
