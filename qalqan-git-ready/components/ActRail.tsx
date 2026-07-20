"use client";

import { useEffect, useState } from "react";
import { FILMS } from "@/lib/films";

const ACTS = [
  ...FILMS.map((f) => ({ id: f.id, n: f.act, label: f.label })),
  { id: "act-tool", n: "··", label: "Проверка" },
];

export function ActRail() {
  const [active, setActive] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sections = ACTS.map((a) => document.getElementById(a.id)).filter(
      Boolean
    ) as HTMLElement[];

    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.55);
      let current = "";
      for (const el of sections) {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.5) {
          current = el.id;
        }
      }
      if (current) setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`act-rail ${visible ? "is-on" : ""}`} aria-label="Акты">
      {ACTS.map((a) => (
        <a
          key={a.id}
          href={a.id === "act-tool" ? "/check" : `#${a.id}`}
          className={`act-rail__item ${active === a.id ? "is-active" : ""}`}
        >
          <span className="act-rail__n">{a.n}</span>
          <span className="act-rail__dot" />
        </a>
      ))}
    </nav>
  );
}
