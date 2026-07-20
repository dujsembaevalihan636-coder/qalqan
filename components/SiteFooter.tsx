"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { useI18n } from "@/lib/i18n/context";

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-[rgba(243,239,230,0.08)]">
      <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Logo size={32} />
              <span className="text-[15px] font-medium tracking-[0.04em] text-[#F3EFE6]">
                Qalqan
              </span>
            </div>
            <p className="t-body-sm mt-5 max-w-sm text-[#9E998F]">
              {t("footer.tagline")}
            </p>
            <p className="mt-4 max-w-sm text-[12px] leading-relaxed text-[#5C5852]">
              {t("footer.disclaimer")}
            </p>
          </div>

          <div>
            <p className="t-label mb-4 text-[#5C5852]">{t("footer.sections")}</p>
            <ul className="space-y-3 text-[14px] text-[#9E998F]">
              <li>
                <Link className="hover:text-[#F3EFE6]" href="/check">
                  {t("nav.check")}
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#F3EFE6]" href="/shield">
                  {t("nav.shield")}
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#F3EFE6]" href="/stories">
                  {t("nav.stories")}
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#F3EFE6]" href="/emergency">
                  {t("nav.emergency")}
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#F3EFE6]" href="/statement">
                  Statement
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#F3EFE6]" href="/subscribe">
                  {t("nav.subscribe")}
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#F3EFE6]" href="/map">
                  {t("nav.map")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="t-label mb-4 text-[#5C5852]">{t("footer.help")}</p>
            <ul className="space-y-3 text-[14px] text-[#9E998F]">
              <li>{t("footer.afm")}</li>
              <li>{t("footer.police")}</li>
              <li className="text-[#5C5852]">{t("footer.law")}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-[rgba(243,239,230,0.08)] pt-6 text-[12px] text-[#5C5852] sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} Qalqan · {t("footer.copy")}
          </span>
          <span>
            {t("footer.for")} · RU / ҚАЗ
          </span>
        </div>
      </div>
    </footer>
  );
}
