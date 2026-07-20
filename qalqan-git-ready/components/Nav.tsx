"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useI18n } from "@/lib/i18n/context";
import { loadProfile, levelFor } from "@/lib/shield-profile";

export function Nav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [levelLabel, setLevelLabel] = useState("");
  const isHome = pathname === "/";

  // Главная first · shield account on the right
  const LINKS = [
    { href: "/", label: t("nav.home") },
    { href: "/check", label: t("nav.check") },
    { href: "/stories", label: t("nav.stories") },
    { href: "/map", label: t("nav.map") },
    { href: "/subscribe", label: t("nav.subscribe") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    try {
      const p = loadProfile();
      const { current } = levelFor(p.checks);
      setLevelLabel(t(current.labelKey));
    } catch {
      setLevelLabel(t("shield.levels.novice"));
    }
  }, [t, pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const transparent = isHome && !scrolled && !open;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-[background,border-color,backdrop-filter] duration-700"
      style={{
        background: transparent ? "transparent" : "rgba(5,5,6,0.9)",
        borderBottom: transparent
          ? "1px solid transparent"
          : "1px solid rgba(243,239,230,0.06)",
        backdropFilter: transparent ? "none" : "blur(16px)",
        WebkitBackdropFilter: transparent ? "none" : "blur(16px)",
      }}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-5 py-4 md:px-8 md:py-5">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <Logo size={26} />
          <span
            className="text-[13px] font-medium tracking-[0.22em] uppercase transition-opacity duration-500"
            style={{ color: "#F3EFE6", opacity: transparent ? 0.72 : 1 }}
          >
            Qalqan
          </span>
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-7 lg:flex"
          aria-label="Main"
        >
          {LINKS.map((l) => {
            const active =
              l.href === pathname || (l.href === "/" && pathname === "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className="t-label transition-colors duration-500"
                style={{
                  color: active
                    ? "#F3EFE6"
                    : transparent
                      ? "rgba(243,239,230,0.45)"
                      : "#5C5852",
                }}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/emergency"
            className="t-label transition-colors duration-500"
            style={{ color: "#E23D3D" }}
          >
            {t("nav.emergency")}
          </Link>
        </nav>

        {/* Right: lang + shield profile account */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher compact />
          </div>
          <Link
            href="/shield"
            className="nav-account"
            title={t("nav.account")}
          >
            <span className="nav-account__avatar" aria-hidden>
              <Logo size={16} />
            </span>
            <span className="nav-account__meta hidden md:flex">
              <span className="nav-account__name">{t("nav.account")}</span>
              <span className="nav-account__level">{levelLabel}</span>
            </span>
          </Link>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t("nav.close") : t("nav.menu")}
            aria-expanded={open}
          >
            <span className="relative block h-3.5 w-5">
              <span
                className="absolute left-0 top-0 block h-px w-full bg-[#F3EFE6] transition-transform duration-300"
                style={{
                  transform: open ? "translateY(6.5px) rotate(45deg)" : "none",
                }}
              />
              <span
                className="absolute left-0 top-[6.5px] block h-px w-full bg-[#F3EFE6] transition-opacity duration-300"
                style={{ opacity: open ? 0 : 1 }}
              />
              <span
                className="absolute bottom-0 left-0 block h-px w-full bg-[#F3EFE6] transition-transform duration-300"
                style={{
                  transform: open
                    ? "translateY(-6.5px) rotate(-45deg)"
                    : "none",
                }}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[rgba(243,239,230,0.06)] bg-[#050506] lg:hidden">
          <nav className="mx-auto flex max-h-[calc(100dvh-4.5rem)] max-w-[1280px] flex-col overflow-y-auto px-5 py-6">
            <div className="mb-4">
              <LanguageSwitcher />
            </div>
            {[
              ...LINKS,
              { href: "/shield", label: t("nav.shield") },
              { href: "/emergency", label: t("nav.emergency") },
              { href: "/am-i-dropper", label: "Drop-check" },
              { href: "/statement", label: "Statement" },
            ].map((l, i) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-[rgba(243,239,230,0.06)] py-4"
              >
                <span className="t-label text-[#5C5852]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="t-heading-sm mt-1 block"
                  style={{
                    color: l.href === "/emergency" ? "#E23D3D" : "#F3EFE6",
                  }}
                >
                  {l.label}
                </span>
              </Link>
            ))}
            <Link
              href="/check"
              onClick={() => setOpen(false)}
              className="btn-primary mt-6 w-full"
            >
              {t("nav.check")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
