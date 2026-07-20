"use client";

import { useEffect, useRef } from "react";

// Подпись бренда: облако из тысяч крошечных треугольных частиц,
// собранных в форму ЩИТА (Qalqan). Анимированное поле точек-огоньков
// на чистом чёрном — в духе Dala, но переосмысленное под «щит», а не «мозг».

const PALETTE = [
  "#8052ff", // iris
  "#a78bff",
  "#ffb829", // saffron
  "#15846e", // verdant
  "#3ec9a7",
  "#ff5c8a",
  "#4d8bff",
];

// Контур щита в нормализованных координатах (x: -1..1, y: -1..1, y вниз).
const SHIELD: [number, number][] = [
  [-0.62, -0.82],
  [0.62, -0.82],
  [0.64, -0.08],
  [0.44, 0.5],
  [0, 0.95],
  [-0.44, 0.5],
  [-0.64, -0.08],
];

function inShield(x: number, y: number): boolean {
  let inside = false;
  for (let i = 0, j = SHIELD.length - 1; i < SHIELD.length; j = i++) {
    const [xi, yi] = SHIELD[i];
    const [xj, yj] = SHIELD[j];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

interface P {
  x: number;
  y: number;
  size: number;
  color: string;
  phase: number;
  speed: number;
  amp: number;
  rot: number;
  twinkle: number;
  ambient: boolean;
}

export function Constellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: P[] = [];
    let raf = 0;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function build() {
      const parent = canvas!.parentElement!;
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Масштаб щита относительно контейнера
      const s = Math.min(width, height) * 0.46;
      const cx = width / 2;
      const cy = height / 2 + s * 0.02;

      particles = [];
      // плотность зависит от площади, но с потолком ради производительности
      const target = Math.min(1400, Math.floor((width * height) / 320));

      let placed = 0;
      let guard = 0;
      while (placed < target && guard < target * 40) {
        guard++;
        const nx = (Math.random() * 2 - 1) * 1.05;
        const ny = (Math.random() * 2 - 1) * 1.05;
        if (!inShield(nx, ny)) continue;
        // плотнее к краю (контур щита)
        particles.push(makeParticle(cx + nx * s, cy + ny * s, false));
        placed++;
      }

      // Явный контур — частицы вдоль рёбер
      const edgeCount = 260;
      for (let i = 0; i < edgeCount; i++) {
        const t = i / edgeCount;
        const seg = t * SHIELD.length;
        const a = SHIELD[Math.floor(seg) % SHIELD.length];
        const b = SHIELD[(Math.floor(seg) + 1) % SHIELD.length];
        const f = seg - Math.floor(seg);
        const nx = a[0] + (b[0] - a[0]) * f;
        const ny = a[1] + (b[1] - a[1]) * f;
        const p = makeParticle(cx + nx * s, cy + ny * s, false);
        p.size *= 1.15;
        particles.push(p);
      }

      // Амбиентные частицы вокруг
      const ambient = Math.min(220, Math.floor((width * height) / 5000));
      for (let i = 0; i < ambient; i++) {
        particles.push(
          makeParticle(Math.random() * width, Math.random() * height, true)
        );
      }
    }

    function makeParticle(x: number, y: number, ambient: boolean): P {
      return {
        x,
        y,
        size: ambient ? 1 + Math.random() * 1.4 : 1.4 + Math.random() * 2.2,
        color: PALETTE[(Math.random() * PALETTE.length) | 0],
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.9,
        amp: ambient ? 6 + Math.random() * 10 : 1.5 + Math.random() * 3,
        rot: Math.random() * Math.PI,
        twinkle: 0.4 + Math.random() * 0.6,
        ambient,
      };
    }

    function triangle(x: number, y: number, r: number, rot: number) {
      ctx!.beginPath();
      for (let i = 0; i < 3; i++) {
        const a = rot + (i * Math.PI * 2) / 3;
        const px = x + Math.cos(a) * r;
        const py = y + Math.sin(a) * r;
        if (i === 0) ctx!.moveTo(px, py);
        else ctx!.lineTo(px, py);
      }
      ctx!.closePath();
    }

    let t = 0;
    function frame() {
      t += reduce ? 0 : 0.016;
      ctx!.clearRect(0, 0, width, height);

      for (const p of particles) {
        const dx = Math.cos(p.phase + t * p.speed) * p.amp;
        const dy = Math.sin(p.phase + t * p.speed * 0.8) * p.amp;
        let x = p.x + dx;
        let y = p.y + dy;

        // лёгкое отталкивание от курсора
        if (mouse.current.active && !p.ambient) {
          const mdx = x - mouse.current.x;
          const mdy = y - mouse.current.y;
          const dist2 = mdx * mdx + mdy * mdy;
          if (dist2 < 9000) {
            const f = (9000 - dist2) / 9000;
            x += (mdx / Math.sqrt(dist2 + 1)) * f * 14;
            y += (mdy / Math.sqrt(dist2 + 1)) * f * 14;
          }
        }

        const alpha =
          (p.ambient ? 0.28 : 0.85) *
          (0.55 + 0.45 * Math.sin(t * 1.6 * p.twinkle + p.phase));
        ctx!.globalAlpha = Math.max(0.05, alpha);
        ctx!.strokeStyle = p.color;
        ctx!.fillStyle = p.color;
        ctx!.lineWidth = 1;
        triangle(x, y, p.size, p.rot + t * 0.2);
        if (p.size > 2) ctx!.stroke();
        else ctx!.fill();
      }
      ctx!.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    }
    function onLeave() {
      mouse.current.active = false;
    }

    build();
    frame();
    const ro = new ResizeObserver(() => build());
    ro.observe(canvas.parentElement!);
    canvas.parentElement!.addEventListener("mousemove", onMove);
    canvas.parentElement!.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.parentElement?.removeEventListener("mousemove", onMove);
      canvas.parentElement?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
