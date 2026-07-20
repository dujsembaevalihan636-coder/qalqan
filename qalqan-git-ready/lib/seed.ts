import type { Report, FlaggedAccount } from "./types";

// Демо-данные, чтобы карта и народная база не были пустыми на защите.
// Те же данные используются как SQL-сид для Supabase (см. supabase/seed.sql).

const now = Date.now();
const ago = (hours: number) => new Date(now - hours * 3600_000).toISOString();

export const SEED_REPORTS: Report[] = [
  { id: "r1", created_at: ago(2), scheme_type: "dropper", region: "Алматы", verdict: "red", source: "check", raw_text: null },
  { id: "r2", created_at: ago(5), scheme_type: "dropper", region: "Алматы", verdict: "red", source: "manual_report", raw_text: null },
  { id: "r3", created_at: ago(8), scheme_type: "fake_job", region: "Астана", verdict: "red", source: "check", raw_text: null },
  { id: "r4", created_at: ago(11), scheme_type: "pyramid", region: "Шымкент", verdict: "yellow", source: "check", raw_text: null },
  { id: "r5", created_at: ago(14), scheme_type: "dropper", region: "Шымкент", verdict: "red", source: "check", raw_text: null },
  { id: "r6", created_at: ago(20), scheme_type: "phishing", region: "Караганда", verdict: "red", source: "manual_report", raw_text: null },
  { id: "r7", created_at: ago(23), scheme_type: "fake_job", region: "Караганда", verdict: "yellow", source: "check", raw_text: null },
  { id: "r8", created_at: ago(28), scheme_type: "pyramid", region: "Актобе", verdict: "red", source: "check", raw_text: null },
  { id: "r9", created_at: ago(33), scheme_type: "dropper", region: "Астана", verdict: "red", source: "check", raw_text: null },
  { id: "r10", created_at: ago(40), scheme_type: "phishing", region: "Павлодар", verdict: "yellow", source: "manual_report", raw_text: null },
  { id: "r11", created_at: ago(46), scheme_type: "dropper", region: "Усть-Каменогорск", verdict: "red", source: "check", raw_text: null },
  { id: "r12", created_at: ago(52), scheme_type: "fake_job", region: "Алматы", verdict: "red", source: "check", raw_text: null },
  { id: "r13", created_at: ago(60), scheme_type: "pyramid", region: "Тараз", verdict: "yellow", source: "check", raw_text: null },
  { id: "r14", created_at: ago(70), scheme_type: "dropper", region: "Костанай", verdict: "red", source: "manual_report", raw_text: null },
  { id: "r15", created_at: ago(80), scheme_type: "phishing", region: "Атырау", verdict: "red", source: "check", raw_text: null },
];

export const SEED_FLAGGED: FlaggedAccount[] = [
  { id: "f1", created_at: ago(3), value: "4400 4302 1122 3344", kind: "card", report_count: 7, note: "«Прими перевод и оставь 10%» — классический дроп" },
  { id: "f2", created_at: ago(6), value: "@easy_money_kz", kind: "telegram", report_count: 12, note: "Вербует школьников под «удалённую работу»" },
  { id: "f3", created_at: ago(9), value: "+7 707 555 21 43", kind: "phone", report_count: 5, note: "Звонит от имени «службы безопасности Kaspi»" },
  { id: "f4", created_at: ago(15), value: "5169 4931 0088 7766", kind: "card", report_count: 9, note: "Карта-дроп, счёт заморожен АФМ" },
  { id: "f5", created_at: ago(19), value: "@rabota_almaty_2026", kind: "telegram", report_count: 8, note: "«500к в месяц без опыта», просит фото карты" },
  { id: "f6", created_at: ago(26), value: "+7 771 342 88 90", kind: "phone", report_count: 4, note: "Инвест-пирамида, обещает 30% в месяц" },
  { id: "f7", created_at: ago(31), value: "invest.pro.kz", kind: "instagram", report_count: 6, note: "Пирамида под видом «крипто-платформы»" },
  { id: "f8", created_at: ago(44), value: "TBn9...x7Qk (USDT)", kind: "wallet", report_count: 3, note: "Кошелёк для «депозита», деньги не возвращают" },
  { id: "f9", created_at: ago(55), value: "@work_dostyk", kind: "telegram", report_count: 10, note: "Массовая вербовка дропов по вузам" },
  { id: "f10", created_at: ago(66), value: "4405 6201 9911 0022", kind: "card", report_count: 5, note: "«Твоя карта нужна на один перевод»" },
];
