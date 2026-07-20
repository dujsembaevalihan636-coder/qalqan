"use client";

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { PLANS, type PlanId } from "@/lib/plans";

type Props = {
  open: boolean;
  onClose: () => void;
  highlight?: PlanId;
};

/**
 * Modal Pricing — clean plan cards (21st.dev Modal Pricing vibe).
 */
export function PricingModal({ open, onClose, highlight = "parents" }: Props) {
  const { t } = useI18n();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="pricing-modal" role="dialog" aria-modal="true" aria-label={t("sub.title")}>
      <button
        type="button"
        className="pricing-modal__backdrop"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="pricing-modal__panel">
        <div className="pricing-modal__head">
          <div>
            <p className="t-label text-[#6AACA4]">{t("nav.subscribe")}</p>
            <h2 className="t-heading-sm mt-2 text-[#F3EFE6]">{t("sub.title")}</h2>
            <p className="t-body-sm mt-2 max-w-md text-[#9E998F]">{t("sub.sub")}</p>
          </div>
          <button
            type="button"
            className="pricing-modal__x"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="pricing-modal__grid">
          {PLANS.map((plan) => {
            const featured = plan.id === highlight;
            return (
              <div
                key={plan.id}
                className={`pricing-card ${featured ? "is-featured" : ""}`}
              >
                {featured && (
                  <span className="pricing-card__badge">{t("sub.featured")}</span>
                )}
                <p className="t-label" style={{ color: plan.accent }}>
                  {t(plan.titleKey)}
                </p>
                <p className="pricing-card__price">{t(plan.priceKey)}</p>
                <p className="t-body-sm mt-3 text-[#9E998F]">{t(plan.descKey)}</p>
                <ul className="pricing-card__features">
                  {(plan.id === "parents"
                    ? [
                        t("sub.f1"),
                        t("sub.f2"),
                        t("sub.f3"),
                      ]
                    : plan.id === "students"
                      ? [t("sub.f4"), t("sub.f5"), t("sub.f1")]
                      : [t("sub.f6"), t("sub.f2"), t("sub.f5")]
                  ).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={featured ? "btn-primary w-full" : "pricing-card__ghost"}
                >
                  {t("sub.cta")}
                </button>
              </div>
            );
          })}
        </div>
        <p className="t-caption mt-6 text-center text-[#5C5852]">{t("sub.demo")}</p>
      </div>
    </div>
  );
}
