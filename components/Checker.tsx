"use client";

import { useState } from "react";
import type { AnalysisResult, FlaggedAccount, ConsequenceStep } from "@/lib/types";
import { KIND_LABELS } from "@/lib/types";
import { detectCity } from "@/lib/geo";
import { VerdictCard } from "./VerdictCard";
import { ConsequenceTimeline } from "./ConsequenceTimeline";
import { Spinner } from "./Spinner";
import { recordCheck } from "@/lib/shield-profile";

type Mode = "text" | "account";

const EXAMPLES = [
  "Привет! Ищу подработку студентам. Нужно просто принять перевод на свою карту Kaspi и перекинуть дальше — оставляешь себе 10%. Работа на дому, без опыта, до 300к в месяц. Только сегодня набираю, пиши в тг.",
  "Здравствуйте, это служба безопасности банка. По вашей карте подозрительная операция. Чтобы отменить, срочно продиктуйте код из SMS и срок действия карты.",
  "Инвест-платформа: вкладываешь 50 000 ₸ — через месяц гарантированно 30% сверху. Приведёшь друга — ещё бонус. Мест мало, успей зайти.",
];

const ACCOUNT_EXAMPLES = ["4400 4302 1122 3344", "@easy_money_kz", "+7 707 555 21 43"];

export function Checker() {
  const [mode, setMode] = useState<Mode>("text");
  const [input, setInput] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [account, setAccount] = useState<{
    found: boolean;
    kind: string;
    account: FlaggedAccount | null;
  } | null>(null);

  const [conseq, setConseq] = useState<ConsequenceStep[] | null>(null);
  const [conseqLoading, setConseqLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  async function useMyLocation() {
    setLocating(true);
    const r = await detectCity();
    if (r.ok) setRegion(r.city.name);
    setLocating(false);
  }

  function reset() {
    setAnalysis(null);
    setAccount(null);
    setConseq(null);
    setError(null);
  }

  async function run() {
    if (!input.trim()) return;
    setLoading(true);
    reset();
    try {
      if (mode === "text") {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: input, region }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Ошибка");
        const analysis = data as AnalysisResult;
        setAnalysis(analysis);
        try {
          recordCheck(analysis.verdict);
        } catch {
          /* profile is optional */
        }
      } else {
        const res = await fetch("/api/check-account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: input }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Ошибка");
        setAccount(data);
        try {
          // Реквизит из народной базы = распознанный риск
          recordCheck(data.found ? "red" : "green");
        } catch {
          /* optional */
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Что-то пошло не так");
    } finally {
      setLoading(false);
    }
  }

  async function showConsequences() {
    setConseqLoading(true);
    try {
      const res = await fetch("/api/consequences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario:
            analysis?.summary ??
            "Согласился стать дроппером: дал карту и принял чужой перевод за процент.",
        }),
      });
      const data = await res.json();
      setConseq(data.steps as ConsequenceStep[]);
    } finally {
      setConseqLoading(false);
    }
  }

  const showConseqButton = analysis && analysis.verdict !== "green" && !conseq;

  return (
    <div id="checker" className="scroll-mt-28">
      <div
        className="inline-flex w-full border border-[rgba(243,239,230,0.12)] p-1 sm:w-auto"
        role="tablist"
        aria-label="Тип проверки"
      >
        {(["text", "account"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => {
              setMode(m);
              setInput("");
              reset();
            }}
            className="t-label flex-1 px-5 py-2.5 transition-colors duration-300 sm:flex-none"
            style={{
              background: mode === m ? "rgba(106,172,164,0.14)" : "transparent",
              color: mode === m ? "#6AACA4" : "#5C5852",
            }}
          >
            {m === "text" ? "Сообщение" : "Реквизит"}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <label className="sr-only" htmlFor="qalqan-input">
          {mode === "text" ? "Текст сообщения" : "Реквизит"}
        </label>
        {mode === "text" ? (
          <textarea
            id="qalqan-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                run();
              }
            }}
            placeholder="Вставь сообщение из Telegram, WhatsApp или Instagram…"
            rows={5}
            className="field min-h-[140px] resize-none sm:min-h-[160px]"
          />
        ) : (
          <input
            id="qalqan-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                run();
              }
            }}
            placeholder="Номер карты, кошелёк, телефон или @ник"
            className="field"
            autoComplete="off"
          />
        )}
        <div className="mt-2 flex items-center justify-between">
          <p className="t-caption text-[#5C5852]">
            {mode === "text" ? "⌘ + Enter — проверить" : "Enter — проверить"}
          </p>
          <p className="t-caption tabular-nums text-[#5C5852]">
            {input.trim().length > 0 ? `${input.trim().length} зн.` : ""}
          </p>
        </div>
      </div>

      {mode === "text" && (
        <div className="mt-3 flex gap-2">
          <label className="sr-only" htmlFor="qalqan-city">
            Город
          </label>
          <input
            id="qalqan-city"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="Город (необязательно) — усилит карту угроз"
            className="field !py-3 !text-[15px]"
          />
          <button
            type="button"
            onClick={useMyLocation}
            disabled={locating}
            title="Определить город"
            aria-label="Определить мой город"
            className="shrink-0 rounded-[4px] border border-[rgba(240,235,227,0.12)] px-4 text-[13px] text-[#A39E96] transition-colors hover:border-[rgba(240,235,227,0.28)] hover:text-[#F0EBE3]"
          >
            {locating ? <Spinner /> : "Гео"}
          </button>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="t-label text-[#5C5852]">Пример</span>
        {(mode === "text" ? EXAMPLES : ACCOUNT_EXAMPLES).map((ex, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setInput(ex)}
            className="border border-[rgba(243,239,230,0.1)] px-3 py-1.5 text-[12px] text-[#9E998F] transition-colors duration-300 hover:border-[rgba(106,172,164,0.45)] hover:text-[#F3EFE6]"
          >
            {mode === "text"
              ? ["Дроппер", "Фишинг", "Пирамида"][i] ?? `Схема ${i + 1}`
              : ex}
          </button>
        ))}
      </div>

      {/* Sticky primary action on mobile */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
        <button
          type="button"
          onClick={run}
          disabled={loading || !input.trim()}
          className="btn-primary w-full sm:w-auto"
        >
          {loading ? <Spinner /> : null}
          {loading
            ? "Проверяю…"
            : mode === "text"
              ? "Проверить сообщение"
              : "Проверить по базе"}
        </button>
        {(analysis || account) && (
          <button type="button" onClick={reset} className="btn-ghost justify-center py-2">
            Очистить
          </button>
        )}
      </div>

      {error && (
        <p className="mt-5 text-[14px] text-[#E23D3D]" role="alert">
          {error}
        </p>
      )}

      {analysis && (
        <div className="mt-8 border-t border-[rgba(240,235,227,0.08)] pt-8">
          <VerdictCard result={analysis} />

          {showConseqButton && (
            <div className="mt-6">
              <button
                type="button"
                onClick={showConsequences}
                disabled={conseqLoading}
                className="btn-primary w-full sm:w-auto"
              >
                {conseqLoading ? <Spinner /> : null}
                {conseqLoading ? "Считаю траекторию…" : "Показать последствия"}
              </button>
              <p className="t-caption mt-2 text-[#6B6760]">
                Что реально будет, если согласиться. По ст. 232-1 УК РК.
              </p>
            </div>
          )}

          {conseq && (
            <div className="mt-10">
              <p className="t-label mb-1 text-[#E23D3D]">Траектория</p>
              <p className="t-heading-sm max-w-xl text-[#F0EBE3]">
                5 000 ₸ сегодня — и до 7 лет потом.
              </p>
              <ConsequenceTimeline steps={conseq} />
            </div>
          )}
        </div>
      )}

      {account && (
        <div className="mt-8 border-t border-[rgba(240,235,227,0.08)] pt-8">
          {account.found && account.account ? (
            <div
              className="fade-up border border-[rgba(226,61,61,0.35)] p-6 md:p-8"
              style={{ background: "rgba(226,61,61,0.06)" }}
            >
              <p className="t-label text-[#E23D3D]">Найдено в народной базе</p>
              <p className="t-heading-sm mt-2 break-all text-[#F0EBE3]">
                {account.account.value}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-[14px] text-[#A39E96]">
                <span>Тип: {KIND_LABELS[account.account.kind]}</span>
                <span>
                  Жалоб:{" "}
                  <b className="font-semibold text-[#F0EBE3]">
                    {account.account.report_count}
                  </b>
                </span>
              </div>
              {account.account.note && (
                <p className="t-body-sm mt-4 text-[#C8C2B8]">
                  «{account.account.note}»
                </p>
              )}
              <p className="t-body-sm mt-5 text-[#E88A8A]">
                Не переводи деньги и не давай данные. Этот реквизит уже
                засветился в схемах.
              </p>
            </div>
          ) : (
            <div
              className="fade-up border border-[rgba(95,168,160,0.3)] p-6 md:p-8"
              style={{ background: "rgba(95,168,160,0.06)" }}
            >
              <p className="t-label text-[#5FA8A0]">В базе пока нет</p>
              <p className="t-subheading mt-2 max-w-xl text-[#F0EBE3]">
                Этого реквизита нет в народной базе — но это не гарантия. Новые
                схемы появляются каждый день.
              </p>
              <p className="t-body-sm mt-4 text-[#A39E96]">
                Тип:{" "}
                {KIND_LABELS[account.kind as keyof typeof KIND_LABELS] ??
                  account.kind}
                . Если тебя разводят — добавь реквизит через карту угроз.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
