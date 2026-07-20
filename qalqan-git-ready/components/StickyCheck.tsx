"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/** Mobile: tool is on /check — keep one tap away after leaving hero. */
export function StickyCheck() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setOn(window.scrollY > window.innerHeight * 0.85);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`sticky-check ${on ? "is-on" : ""}`} aria-hidden={!on}>
      <Link href="/check" className="sticky-check__btn" tabIndex={on ? 0 : -1}>
        Проверить сообщение
      </Link>
    </div>
  );
}
