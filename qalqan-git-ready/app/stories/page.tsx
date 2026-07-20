"use client";

import { useI18n } from "@/lib/i18n/context";
import { STORIES } from "@/lib/stories";

export default function StoriesPage() {
  const { t, lang } = useI18n();
  const L = lang === "kz" ? "kz" : "ru";

  return (
    <div className="mx-auto max-w-[900px] px-5 pb-28 pt-24 md:px-8 md:pt-28">
      <p className="t-label text-[#6AACA4]">{t("nav.stories")}</p>
      <h1 className="t-heading mt-4 text-[#F3EFE6]">{t("stories.title")}</h1>
      <p className="t-body mt-4 max-w-2xl text-[#9E998F]">{t("stories.sub")}</p>

      <div className="mt-14 space-y-0 border-t border-[rgba(243,239,230,0.1)]">
        {STORIES.map((s, i) => (
          <article
            key={s.id}
            className="border-b border-[rgba(243,239,230,0.1)] py-10 md:py-12"
          >
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="t-heading-sm text-[#6AACA4]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="t-label text-[#5C5852]">
                {s.city} · {s.age}
              </span>
            </div>

            <div className="mt-6 grid gap-8 md:grid-cols-2">
              <div>
                <p className="t-label text-[#C9A227]">{t("stories.was")}</p>
                <p className="t-body-sm mt-3 text-[#C8C2B8]">{s.was[L]}</p>
              </div>
              <div>
                <p className="t-label text-[#E23D3D]">{t("stories.end")}</p>
                <p className="t-body-sm mt-3 text-[#C8C2B8]">{s.end[L]}</p>
              </div>
            </div>

            <div className="mt-6 border-l-2 border-[#6AACA4] pl-4">
              <p className="t-label text-[#6AACA4]">{t("stories.lesson")}</p>
              <p className="t-body-sm mt-2 text-[#F0EBE3]">{s.lesson[L]}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
