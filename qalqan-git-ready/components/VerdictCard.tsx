import type { AnalysisResult } from "@/lib/types";
import { SCHEME_LABELS, VERDICT_LABELS } from "@/lib/types";
import { ConsequenceTimeline } from "./ConsequenceTimeline";

const SIGNAL: Record<
  string,
  { color: string; bg: string; border: string; mark: string; label: string }
> = {
  red: {
    color: "#E23D3D",
    bg: "rgba(226,61,61,0.06)",
    border: "rgba(226,61,61,0.35)",
    mark: "✕",
    label: "Красный",
  },
  yellow: {
    color: "#C9A227",
    bg: "rgba(201,162,39,0.06)",
    border: "rgba(201,162,39,0.35)",
    mark: "!",
    label: "Жёлтый",
  },
  green: {
    color: "#5FA8A0",
    bg: "rgba(95,168,160,0.06)",
    border: "rgba(95,168,160,0.35)",
    mark: "✓",
    label: "Зелёный",
  },
};

export function VerdictCard({ result }: { result: AnalysisResult }) {
  const s = SIGNAL[result.verdict];
  return (
    <article
      className="fade-up p-6 md:p-8"
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
      }}
      aria-live="polite"
    >
      <div className="flex flex-wrap items-start gap-4">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center text-lg font-semibold"
          style={{
            color: s.color,
            border: `1px solid ${s.border}`,
            background: "rgba(10,10,11,0.4)",
          }}
          aria-hidden
        >
          {s.mark}
        </span>
        <div className="min-w-0 flex-1">
          <p className="t-label" style={{ color: s.color }}>
            Вердикт: {s.label} · {SCHEME_LABELS[result.schemeType]}
          </p>
          <p className="t-body mt-3 max-w-2xl whitespace-pre-line text-[#F0EBE3]">
            {result.summary}
          </p>
        </div>
      </div>

      {result.redFlags.length > 0 && (
        <div className="mt-8">
          <p className="t-label mb-4 text-[#E23D3D]">Красные флаги</p>
          <ul className="space-y-3">
            {result.redFlags.map((f, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full"
                  style={{ background: s.color }}
                  aria-hidden
                />
                <span className="t-body-sm text-[#C8C2B8]">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.checklist.length > 0 && (
        <div className="mt-8 border-t border-[rgba(240,235,227,0.08)] pt-8">
          <p className="t-label mb-4 text-[#5FA8A0]">
            3 жёстких вопроса до согласия
          </p>
          <ol className="space-y-4">
            {result.checklist.map((q, i) => (
              <li key={i} className="flex gap-3">
                <span className="t-caption mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-[rgba(240,235,227,0.18)] text-[#A39E96]">
                  {i + 1}
                </span>
                <span className="t-body-sm text-[#C8C2B8]">{q}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {result.immediateActions && result.immediateActions.length > 0 && (
        <div className="mt-8 border-t border-[rgba(240,235,227,0.08)] pt-8">
          <p className="t-label mb-4 text-[#6AACA4]">Что делать прямо сейчас</p>
          <ol className="space-y-3">
            {result.immediateActions.map((a, i) => (
              <li key={i} className="flex gap-3">
                <span className="t-caption mt-0.5 text-[#6AACA4]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="t-body-sm text-[#C8C2B8]">{a}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {result.timeline && result.timeline.length > 0 && (
        <div className="mt-8 border-t border-[rgba(240,235,227,0.08)] pt-8">
          <p className="t-label mb-1 text-[#E23D3D]">Таймлайн последствий</p>
          <p className="t-body-sm mb-2 max-w-xl text-[#9E998F]">
            Если согласиться. В т.ч. риски по ст. 232-1 УК РК.
          </p>
          <ConsequenceTimeline steps={result.timeline} />
        </div>
      )}

      <p className="mt-7 text-[11px] uppercase tracking-[0.14em] text-[#6B6760]">
        {result.engine === "claude"
          ? "Анализ: Claude · эксперт KZ"
          : "Анализ: эвристика · демо"}{" "}
        · регион: {result.region ?? "—"}
      </p>
    </article>
  );
}
