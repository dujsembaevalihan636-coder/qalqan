// Общие типы данных Qalqan

export type SchemeType =
  | "dropper" // дропперство — «дай карту / прими и переведи»
  | "pyramid" // финансовая пирамида
  | "phishing" // фишинг / кража данных
  | "fake_job" // фейковая вакансия / «лёгкий заработок»
  | "other";

export type Verdict = "red" | "yellow" | "green";

export type ReportSource = "check" | "manual_report";

export type AccountKind = "card" | "wallet" | "phone" | "telegram" | "instagram";

export interface Report {
  id: string;
  created_at: string;
  scheme_type: SchemeType;
  region: string; // город/область
  verdict: Verdict;
  source: ReportSource;
  raw_text?: string | null;
}

export interface FlaggedAccount {
  id: string;
  created_at: string;
  value: string; // номер карты/кошелька/телефона/ник
  kind: AccountKind;
  report_count: number;
  note?: string | null;
}

// Ответ анализа сообщения (/api/analyze)
export interface AnalysisResult {
  verdict: Verdict;
  redFlags: string[];
  checklist: string[];
  schemeType: SchemeType;
  region?: string | null;
  /** 2–5 предложений простым языком для подростка */
  summary: string;
  engine: "claude" | "heuristic";
  /** Что сделать прямо сейчас */
  immediateActions?: string[];
  /** Короткий таймлайн (день / неделя / месяц / год), ст. 232-1 */
  timeline?: ConsequenceStep[];
}

// Шаг таймлайна последствий (/api/consequences)
export interface ConsequenceStep {
  time: string; // «сегодня», «через 2 месяца», «через год»
  event: string; // короткий заголовок события
  detail: string; // пояснение
  severity: "info" | "warning" | "danger"; // для цвета
}

export const SCHEME_LABELS: Record<SchemeType, string> = {
  dropper: "Дропперство",
  pyramid: "Финансовая пирамида",
  phishing: "Фишинг",
  fake_job: "Фейковая работа",
  other: "Другое",
};

export const KIND_LABELS: Record<AccountKind, string> = {
  card: "Карта",
  wallet: "Кошелёк",
  phone: "Телефон",
  telegram: "Telegram",
  instagram: "Instagram",
};

export const VERDICT_LABELS: Record<Verdict, string> = {
  red: "Опасно",
  yellow: "Подозрительно",
  green: "Похоже, чисто",
};
