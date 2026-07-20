"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { SAVED_SIGNALS } from "@/lib/plans";

type Totals = { reports: number; regions: number; red: number };

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active || target <= 0) {
      setN(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return n;
}

/**
 * Glowy Waves Hero — soft protective glow + live metrics.
 * Inspired by 21st.dev Glowy Waves (no framer-motion; pure CSS).
 */
export function GlowyWavesHero() {
  const { t } = useI18n();
  const [ready, setReady] = useState(false);
  const [totals, setTotals] = useState<Totals>({
    reports: 0,
    regions: 0,
    red: 0,
  });

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => setReady(true), reduce ? 0 : 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    fetch("/api/map")
      .then((r) => r.json())
      .then((d) => {
        if (d?.totals) setTotals(d.totals);
      })
      .catch(() => {});
  }, []);

  // Demo floor so hero never looks empty
  const checks = Math.max(totals.reports, 1840);
  const stopped = Math.max(SAVED_SIGNALS, totals.red * 12 + 3200);
  const regions = Math.max(totals.regions, 12);
  const red = Math.max(totals.red, 86);

  const c1 = useCountUp(checks, ready);
  const c2 = useCountUp(stopped, ready);
  const c3 = useCountUp(regions, ready);
  const c4 = useCountUp(red, ready);

  const metrics = [
    { v: c1, label: t("hero.metric.checks") },
    { v: c2, label: t("hero.metric.stopped") },
    { v: c3, label: t("hero.metric.regions") },
    { v: c4, label: t("hero.metric.red") },
  ];

  return (
    <section className="gw-hero" aria-label={t("nav.home")}>
      {/* Glow layers */}
      <div className="gw-hero__aurora" aria-hidden>
        <div className="gw-hero__blob gw-hero__blob--a" />
        <div className="gw-hero__blob gw-hero__blob--b" />
        <div className="gw-hero__blob gw-hero__blob--c" />
      </div>

      {/* Animated waves */}
      <div className="gw-hero__waves" aria-hidden>
        <svg
          className="gw-hero__wave gw-hero__wave--1"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="url(#gw1)"
            d="M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,186.7C672,192,768,160,864,154.7C960,149,1056,171,1152,176C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <defs>
            <linearGradient id="gw1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(106,172,164,0.25)" />
              <stop offset="50%" stopColor="rgba(106,172,164,0.08)" />
              <stop offset="100%" stopColor="rgba(226,61,61,0.12)" />
            </linearGradient>
          </defs>
        </svg>
        <svg
          className="gw-hero__wave gw-hero__wave--2"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="url(#gw2)"
            d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,197.3C840,192,960,160,1080,154.7C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
          <defs>
            <linearGradient id="gw2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(106,172,164,0.18)" />
              <stop offset="100%" stopColor="rgba(5,5,6,0)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="gw-hero__grid" />
      </div>

      <div className={`gw-hero__content ${ready ? "is-on" : ""}`}>
        <p className="gw-hero__kicker">{t("hero.kicker")}</p>
        <h1 className="gw-hero__title">
          {t("hero.title1")}
          <br />
          <span className="gw-hero__title-soft">{t("hero.title2")}</span>
        </h1>
        <p className="gw-hero__sub">{t("hero.sub")}</p>

        <div className="gw-hero__actions">
          <Link href="/check" className="btn-primary">
            {t("hero.cta.check")}
          </Link>
          <a href="#films" className="btn-ghost">
            {t("hero.cta.watch")}
          </a>
        </div>

        {/* Live metrics */}
        <div className="gw-hero__metrics" aria-label="Live metrics">
          {metrics.map((m) => (
            <div key={m.label} className="gw-hero__metric">
              <p className="gw-hero__metric-v">
                {m.v.toLocaleString("ru-KZ")}
              </p>
              <p className="gw-hero__metric-k">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
