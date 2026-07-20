"use client";

import { useEffect, useRef, useState } from "react";
import type { Film } from "@/lib/films";

/**
 * Full-viewport reel. Copy is native title-card type in the recess —
 * no cards, no boxes — just type sitting in the frame.
 */
export function FilmStage({
  film,
  priority = false,
}: {
  film: Film;
  priority?: boolean;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio >= 0.4) {
          setOn(true);
          if (!reduce) {
            video
              .play()
              .then(() => setPlaying(true))
              .catch(() => setPlaying(false));
          }
        } else {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: [0.25, 0.45, 0.6] }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  function toggle() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  return (
    <section
      ref={rootRef}
      id={film.id}
      data-act={film.act}
      className={`film-full ${on ? "is-on" : ""}`}
      aria-labelledby={`${film.id}-title`}
    >
      <div className="film-full__world">
        <video
          ref={videoRef}
          className="film-full__video"
          src={film.src}
          muted
          loop
          playsInline
          preload={priority ? "auto" : "metadata"}
        />
        {/* Soft directional shade under the recess only — not a box */}
        <div
          className={`film-full__shade film-full__shade--${film.recess}`}
          aria-hidden
        />
      </div>

      <div className="film-full__strip">
        <span>
          ACT {film.act} · {film.label}
        </span>
        <button
          type="button"
          className="film-full__toggle"
          onClick={toggle}
          aria-label={playing ? "Пауза" : "Воспроизвести"}
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>

      {/* Native type in the frame recess — no plate */}
      <div
        className={`film-full__copy film-full__copy--${film.recess} ${
          on ? "is-in" : ""
        }`}
      >
        <p className="film-full__kicker">{film.label}</p>
        <h2 id={`${film.id}-title`} className="film-full__title">
          {film.title}
          {film.titleLine2 && (
            <>
              <br />
              <span className="film-full__title-dim">{film.titleLine2}</span>
            </>
          )}
        </h2>
        <p className="film-full__body">{film.body}</p>
        {film.points && film.points.length > 0 && (
          <ul className="film-full__points">
            {film.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
