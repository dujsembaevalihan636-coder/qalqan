"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type ChapterProps = {
  act: string;
  label: string;
  children: ReactNode;
  className?: string;
  id?: string;
};

/**
 * Structural “act” frame — Triadic Ballet pacing.
 * Quiet entrance when the chapter crosses the viewport; never bounce.
 */
export function Chapter({ act, label, children, className = "", id }: ChapterProps) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      data-act={act}
      className={`chapter ${on ? "chapter--on" : ""} ${className}`}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <div className="chapter__meta">
        <span className="chapter__act">{act}</span>
        <span className="chapter__rule" aria-hidden />
        <span className="chapter__label">{label}</span>
      </div>
      <div className="chapter__body">{children}</div>
    </section>
  );
}
