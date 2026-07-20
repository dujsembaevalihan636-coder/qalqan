"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HeroMap } from "./HeroMap";

/**
 * Opening with 3D threat map (kept as signature stage).
 * Videos live as full-page reels below — not in the hero.
 */
export function LandingHero() {
  const worldRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"boot" | "present" | "title" | "ready">(
    "boot"
  );

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("ready");
      return;
    }
    const t1 = window.setTimeout(() => setPhase("present"), 320);
    const t2 = window.setTimeout(() => setPhase("title"), 1200);
    const t3 = window.setTimeout(() => setPhase("ready"), 2300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const el = worldRef.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 12;
        const y = (e.clientY / window.innerHeight - 0.5) * 8;
        el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.03)`;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const showPresent = phase !== "boot";
  const showTitle = phase === "title" || phase === "ready";
  const showReady = phase === "ready";

  return (
    <section className="mm-hero" aria-label="Вступление">
      <div className="mm-hero__world" aria-hidden>
        <div className="mm-hero__map" ref={worldRef}>
          <HeroMap />
        </div>
        <div className="mm-hero__light" />
        <div className="mm-hero__vignette" />
        <div className="mm-hero__grain" />
      </div>

      <div className="mm-frame" aria-hidden>
        <i className="mm-frame__c mm-frame__c--tl" />
        <i className="mm-frame__c mm-frame__c--tr" />
        <i className="mm-frame__c mm-frame__c--bl" />
        <i className="mm-frame__c mm-frame__c--br" />
      </div>

      <div className="mm-hero__stage">
        <p className={`mm-kicker ${showPresent ? "is-in" : ""}`}>
          qalqan presents
        </p>

        <h1 className="mm-title">
          <span
            className={`mm-line ${showTitle ? "is-in" : ""}`}
            style={{ transitionDelay: "0ms" }}
          >
            Тебя
          </span>
          <span
            className={`mm-line ${showTitle ? "is-in" : ""}`}
            style={{ transitionDelay: "140ms" }}
          >
            вербуют.
          </span>
          <span
            className={`mm-line mm-line--soft ${showTitle ? "is-in" : ""}`}
            style={{ transitionDelay: "320ms" }}
          >
            Не отдавай
          </span>
          <span
            className={`mm-line mm-line--soft ${showTitle ? "is-in" : ""}`}
            style={{ transitionDelay: "460ms" }}
          >
            карту.
          </span>
        </h1>

        <p className={`mm-sub ${showReady ? "is-in" : ""}`}>
          Цифровой щит от дропперских схем.
          <br className="hidden sm:block" />
          Четыре ролика ниже — потом проверка.
        </p>

        <div className={`mm-actions ${showReady ? "is-in" : ""}`}>
          <a href="#films" className="mm-enter">
            <span>Смотреть</span>
            <span className="mm-enter__bar" aria-hidden />
          </a>
          <Link href="/check" className="mm-ghost">
            Сразу к проверке
          </Link>
        </div>
      </div>

      <div className={`mm-meta ${showReady ? "is-in" : ""}`}>
        <span>Қалқан · Live map</span>
        <span className="mm-meta__live">
          <i /> KZ
        </span>
        <span className="mm-meta__scroll hidden sm:inline-flex">
          <span className="mm-meta__scroll-line" />
          Scroll
        </span>
      </div>
    </section>
  );
}
