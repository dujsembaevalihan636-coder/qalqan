"use client";

import { useI18n } from "@/lib/i18n/context";
import type { Lang } from "@/lib/i18n/types";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useI18n();
  const opts: Lang[] = ["ru", "kz"];

  return (
    <div
      className="inline-flex border border-[rgba(243,239,230,0.12)] p-0.5"
      role="group"
      aria-label="Language"
    >
      {opts.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className="t-label px-2.5 py-1.5 transition-colors duration-300"
          style={{
            color: lang === l ? "#F3EFE6" : "#5C5852",
            background: lang === l ? "rgba(106,172,164,0.16)" : "transparent",
          }}
        >
          {l === "ru" ? (compact ? "RU" : "RU") : compact ? "KZ" : "ҚАЗ"}
        </button>
      ))}
    </div>
  );
}
