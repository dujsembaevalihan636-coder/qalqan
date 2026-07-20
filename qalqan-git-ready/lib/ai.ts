import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type {
  AnalysisResult,
  ConsequenceStep,
  SchemeType,
  Verdict,
} from "./types";
import { normalizeRegion } from "./kz";
import {
  buildAnalyzeSystemPrompt,
  buildConsequencesSystemPrompt,
} from "./prompts/kz-dropper-knowledge";

const apiKey = process.env.ANTHROPIC_API_KEY;
/** Prefer env; sonnet-class models handle long expert system prompts well. */
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

export const claudeEnabled = Boolean(apiKey);

let _client: Anthropic | null = null;
function claude(): Anthropic {
  if (!_client) _client = new Anthropic({ apiKey });
  return _client;
}

function safeParseJson<T>(raw: string): T | null {
  let s = raw.trim();
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) s = fence[1].trim();
  const first = s.indexOf("{");
  const firstArr = s.indexOf("[");
  const start =
    first === -1
      ? firstArr
      : firstArr === -1
        ? first
        : Math.min(first, firstArr);
  if (start > 0) s = s.slice(start);
  const lastObj = s.lastIndexOf("}");
  const lastArr = s.lastIndexOf("]");
  const end = Math.max(lastObj, lastArr);
  if (end !== -1) s = s.slice(0, end + 1);
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

type ClaudeAnalyzePayload = {
  verdict?: Verdict;
  summary?: string;
  redFlags?: string[];
  checklist?: string[];
  schemeType?: SchemeType;
  region?: string | null;
  immediateActions?: string[];
  timeline?: ConsequenceStep[];
};

function normalizeVerdict(v: unknown): Verdict | null {
  if (v === "red" || v === "yellow" || v === "green") return v;
  if (typeof v !== "string") return null;
  const s = v.toLowerCase();
  if (s.includes("red") || s.includes("красн")) return "red";
  if (s.includes("yellow") || s.includes("жёлт") || s.includes("желт"))
    return "yellow";
  if (s.includes("green") || s.includes("зелён") || s.includes("зелен"))
    return "green";
  return null;
}

function normalizeScheme(v: unknown): SchemeType {
  const s = String(v ?? "other").toLowerCase();
  if (s.includes("drop")) return "dropper";
  if (s.includes("pyramid") || s.includes("пирамид") || s.includes("invest"))
    return "pyramid";
  if (s.includes("phish") || s.includes("фиш")) return "phishing";
  if (s.includes("fake") || s.includes("job") || s.includes("вак"))
    return "fake_job";
  if (
    s === "dropper" ||
    s === "pyramid" ||
    s === "phishing" ||
    s === "fake_job" ||
    s === "other"
  )
    return s;
  return "other";
}

function normalizeTimeline(raw: unknown): ConsequenceStep[] | undefined {
  if (!Array.isArray(raw) || !raw.length) return undefined;
  return raw.slice(0, 6).map((s) => {
    const row = s as ConsequenceStep;
    const sev = row.severity;
    return {
      time: String(row.time ?? ""),
      event: String(row.event ?? ""),
      detail: String(row.detail ?? ""),
      severity: (["info", "warning", "danger"] as const).includes(
        sev as "info"
      )
        ? (sev as ConsequenceStep["severity"])
        : "warning",
    };
  });
}

// ─────────────────────────────────────────────────────────────
// АНАЛИЗ СООБЩЕНИЯ
// ─────────────────────────────────────────────────────────────

const ANALYZE_SYSTEM = buildAnalyzeSystemPrompt();

export async function analyzeMessage(text: string): Promise<AnalysisResult> {
  const cleaned = text.trim().slice(0, 8000);

  if (claudeEnabled) {
    try {
      const msg = await claude().messages.create({
        model: MODEL,
        max_tokens: 1600,
        temperature: 0.2,
        system: ANALYZE_SYSTEM,
        messages: [
          {
            role: "user",
            content: `Проанализируй это сообщение (может быть на русском, казахском или смеси; могут быть опечатки и сленг):\n\n---\n${cleaned}\n---`,
          },
        ],
      });
      const raw = msg.content
        .filter((b) => b.type === "text")
        .map((b) => (b as { text: string }).text)
        .join("\n");
      const parsed = safeParseJson<ClaudeAnalyzePayload>(raw);
      const verdict = normalizeVerdict(parsed?.verdict);
      if (parsed && verdict) {
        const redFlags = (parsed.redFlags ?? [])
          .map(String)
          .filter(Boolean)
          .slice(0, 6);
        const checklist = (parsed.checklist ?? [])
          .map(String)
          .filter(Boolean)
          .slice(0, 3);
        while (checklist.length < 3) {
          checklist.push(
            "Могу ли я показать это сообщение родителям — и если нет, почему?"
          );
        }
        return {
          verdict,
          summary:
            String(parsed.summary ?? "").trim() ||
            defaultSummary(verdict),
          redFlags:
            redFlags.length > 0
              ? redFlags
              : verdict === "green"
                ? [
                    "Явных маркеров схемы не видно — всё равно проверь, кто платит и за что.",
                  ]
                : [
                    "Есть признаки схемы, но модель не выделила цитаты — не соглашайся и не давай карту.",
                  ],
          checklist,
          schemeType: normalizeScheme(parsed.schemeType),
          region:
            normalizeRegion(parsed.region) ??
            normalizeRegion(cleaned) ??
            (parsed.region ? String(parsed.region) : null),
          immediateActions: (parsed.immediateActions ?? [])
            .map(String)
            .filter(Boolean)
            .slice(0, 4),
          timeline: normalizeTimeline(parsed.timeline),
          engine: "claude",
        };
      }
      console.error("[ai] analyze parse failed, raw head:", raw.slice(0, 400));
    } catch (e) {
      console.error("[ai] analyze via claude failed, falling back:", e);
    }
  }
  return heuristicAnalyze(cleaned);
}

function defaultSummary(v: Verdict): string {
  if (v === "red")
    return "Это похоже на вербовку в схему. Карту, код из SMS и переводы «дальше» — не делай.";
  if (v === "yellow")
    return "Есть подозрительные признаки. Не спеши: сначала проверь, кто это и зачем им ты.";
  return "Явных признаков развода не видно, но сохраняй осторожность.";
}

// ── Эвристика (без ключа / fallback): усиленные маркеры KZ ──
// \w/\b не матчат кириллицу — используем [а-яёa-z]
const W = "[а-яёa-zәіңғүұқөһ]";

const MARKERS: {
  re: RegExp;
  scheme: SchemeType;
  flag: string;
  weight: number;
}[] = [
  // Dropper core
  {
    re: new RegExp(
      `(дай|нужн${W}*|скинь|отправь|фото|дать|давай|бер|берші|картаң)[^.!?]{0,20}(карт|kaspi|каспи|каспий|gold)`,
      "i"
    ),
    scheme: "dropper",
    flag: "Просят твою карту / Kaspi — классика дропперской схемы",
    weight: 4,
  },
  {
    re: new RegExp(
      `при[нм]${W}*[ \\u00A0]*(перевод|ақша|деньг)|перекин|перевед${W}*[ \\u00A0]*дальше|жібер|прогон|обнал|drop\\b`,
      "i"
    ),
    scheme: "dropper",
    flag: "«Прими и переведи / прогон» — тебя делают дроппером (ст. 232-1 УК РК)",
    weight: 4,
  },
  {
    re: new RegExp(
      `(остав${W}*|получ${W}*|себе|өзіңе|сенікі)[^.!?]{0,14}\\d{1,2}\\s*%|\\d{1,2}\\s*%[^.!?]{0,12}(остав|себе|процент|үле)`,
      "i"
    ),
    scheme: "dropper",
    flag: "Обещают процент за «прогон» денег через тебя",
    weight: 3,
  },
  {
    re: new RegExp(
      `(карт${W}*)[^.!?]{0,16}(на |на\\s+)?(\\d|пару|несколько|2|3)[^.!?]{0,10}(день|дня|дн|час|күн)|на время|времянн`,
      "i"
    ),
    scheme: "dropper",
    flag: "«Карта на время / на N дней» — отдают твой счёт под чужие операции",
    weight: 4,
  },
  {
    re: new RegExp(
      `p2p|usdt|trc-?20|крипт${W}*[^.!?]{0,20}(карт|kaspi)|обменник`,
      "i"
    ),
    scheme: "dropper",
    flag: "P2P/крипта через личную карту — частый контур дропа",
    weight: 2,
  },
  {
    re: new RegExp(
      `логин|парол|код\\s*из\\s*(смс|sms)|смс[- ]?код|cvv|cvc|срок действия|face\\s*id|подтверд${W}*[^.!?]{0,10}код`,
      "i"
    ),
    scheme: "phishing",
    flag: "Просят код SMS / данные входа — кража доступа к деньгам",
    weight: 4,
  },
  {
    re: new RegExp(
      `служб${W}*[^.!?]{0,14}безопасност|банк${W}*[^.!?]{0,18}(заблок|подозрит)|подозрит${W}*[^.!?]{0,12}операц|разблок`,
      "i"
    ),
    scheme: "phishing",
    flag: "«Служба безопасности / разблокировка» — типичный фишинг",
    weight: 3,
  },
  {
    re: new RegExp(
      `(20|25|30|40|50)\\s*%[^.!?]{0,14}(в месяц|в неделю|мес|айда|прибыл|доход)|гарантир${W}*[^.!?]{0,18}(доход|процент|прибыл|қайтар)`,
      "i"
    ),
    scheme: "pyramid",
    flag: "Гарантированная сверхприбыль — признак пирамиды",
    weight: 4,
  },
  {
    re: new RegExp(
      `пирамид|привед${W}*[^.!?]{0,12}(друг|дос)|реферал|дос\\s*әкел|mlm|сетев${W}*\\s*маркет`,
      "i"
    ),
    scheme: "pyramid",
    flag: "Доход «за приглашённых» — пирамида / MLM-риск",
    weight: 3,
  },
  {
    re: new RegExp(
      `л[её]гк${W}*[ \\u00A0]+(заработ|деньг|ақша)|быстр${W}*[ \\u00A0]+заработ|удал[её]нк|без опыта|тәжірибе\\s*керек\\s*емес`,
      "i"
    ),
    scheme: "fake_job",
    flag: "«Лёгкий заработок / без опыта» — частая обёртка вербовки",
    weight: 2,
  },
  {
    re: new RegExp(
      `(150|200|250|300|400|500|600|700)\\s*к(?!${W})|\\d{2,3}\\s*000\\s*(тенге|₸|тг|в месяц|в день)`,
      "i"
    ),
    scheme: "fake_job",
    flag: "Нереально высокая оплата за «простую» задачу",
    weight: 2,
  },
  {
    re: new RegExp(
      `залог|предоплат|внеси|оплати[^.!?]{0,20}(лиценз|доступ|форм|сумк|обучен)|алдын\\s*ала\\s*төле`,
      "i"
    ),
    scheme: "fake_job",
    flag: "Предоплата/залог «за работу» — частый развод",
    weight: 3,
  },
  {
    re: new RegExp(
      `срочно|только сегодня|тек бүгін|мест${W}*[^.!?]{0,10}(мало|остал)|успей|поспеш`,
      "i"
    ),
    scheme: "other",
    flag: "Давят срочностью, чтобы ты не успел подумать",
    weight: 1,
  },
  {
    re: new RegExp(
      `никому не говор|это секрет|не рассказ${W}*[^.!?]{0,16}(родител|мама|пап|друз)|конфиденц`,
      "i"
    ),
    scheme: "other",
    flag: "Просят молчать — чтобы никто не отговорил",
    weight: 2,
  },
  {
    re: new RegExp(
      `помог${W}*[^.!?]{0,20}(карт|перевод|заблок)|заблокир${W}*[^.!?]{0,16}карт|друг${W}*[^.!?]{0,16}(карт|перевод)`,
      "i"
    ),
    scheme: "dropper",
    flag: "«Помоги, карта заблокирована / другу» — социальная инженерия",
    weight: 3,
  },
];

/** Легальные маркеры слегка снижают score (анти-false-positive) */
const SAFE_HINTS =
  /enbek\.kz|трудовой договор|договор гпх|ип\b|тоо\b|glovo|wolt|яндекс\s*еда|beeline|tele2|kcell|репетитор|бариста|call[- ]?центр|официальн/i;

function heuristicAnalyze(text: string): AnalysisResult {
  const flags: string[] = [];
  const schemeScore: Record<SchemeType, number> = {
    dropper: 0,
    pyramid: 0,
    phishing: 0,
    fake_job: 0,
    other: 0,
  };
  let score = 0;
  for (const m of MARKERS) {
    if (m.re.test(text)) {
      flags.push(m.flag);
      score += m.weight;
      schemeScore[m.scheme] += m.weight;
    }
  }
  if (SAFE_HINTS.test(text) && score < 5) {
    score = Math.max(0, score - 2);
  }

  let scheme: SchemeType = "other";
  let best = 0;
  (Object.keys(schemeScore) as SchemeType[]).forEach((k) => {
    if (schemeScore[k] > best) {
      best = schemeScore[k];
      scheme = k;
    }
  });

  // Более чувствительные пороги под дропперство
  let verdict: Verdict = "green";
  if (score >= 4) verdict = "red";
  else if (score >= 2) verdict = "yellow";

  // Ультракороткие прямые сигналы
  if (
    /карт[аыу]?\s*\+?\s*%|смс\s*код|код\s*из\s*смс|drop\b|прогон/i.test(text)
  ) {
    verdict = "red";
    if (!flags.length) flags.push("Короткое сообщение с прямым маркером схемы");
  }

  const checklist =
    verdict === "green"
      ? [
          "Кто платит и за какую конкретную работу (не «просто переводы»)?",
          "Есть ли договор / ИП / ТОО и нормальные контакты, не только Telegram?",
          "Не попросят ли на следующем шаге карту, код из SMS или предоплату?",
        ]
      : [
          "Зачем им МОЯ карта или код из SMS, если это «просто работа»?",
          "Что будет со мной по ст. 232-1, если через меня пройдут чужие деньги?",
          "Почему меня просят никому не рассказывать — в том числе родителям?",
        ];

  const immediateActions =
    verdict === "red"
      ? [
          "Не отвечай, не переводи, не давай карту и не присылай код из SMS.",
          "Сохрани скрин и покажи взрослому / напиши на 1424 (АФМ).",
          "Заблокируй чат и не переходи по ссылкам «для оформления».",
        ]
      : verdict === "yellow"
        ? [
            "Не соглашайся «на быстрый тест» с картой или переводом.",
            "Проверь компанию вне Telegram (сайт, Бин/ИИН, отзывы).",
            "Покажи переписку кому-то, кому доверяешь.",
          ]
        : [
            "Если появятся просьбы карты/кода/залога — остановись и проверь снова здесь.",
          ];

  return {
    verdict,
    summary: defaultSummary(verdict),
    redFlags: flags.slice(0, 6).length
      ? flags.slice(0, 6)
      : [
          "Явных маркеров вербовки не найдено — но проверь, кто и за что платит.",
        ],
    checklist,
    schemeType: scheme,
    region: normalizeRegion(text),
    immediateActions,
    timeline:
      verdict === "green" ? undefined : DEFAULT_CONSEQUENCES.slice(0, 4),
    engine: "heuristic",
  };
}

// ─────────────────────────────────────────────────────────────
// ПОСЛЕДСТВИЯ (таймлайн по ст. 232-1)
// ─────────────────────────────────────────────────────────────

const CONSEQ_SYSTEM = buildConsequencesSystemPrompt();

export async function generateConsequences(
  scenario: string
): Promise<ConsequenceStep[]> {
  if (claudeEnabled) {
    try {
      const msg = await claude().messages.create({
        model: MODEL,
        max_tokens: 1000,
        temperature: 0.3,
        system: CONSEQ_SYSTEM,
        messages: [
          {
            role: "user",
            content:
              scenario ||
              "Согласился стать дроппером: дал свою карту Kaspi и принял чужой перевод за 10%.",
          },
        ],
      });
      const raw = msg.content
        .filter((b) => b.type === "text")
        .map((b) => (b as { text: string }).text)
        .join("\n");
      const parsed = safeParseJson<ConsequenceStep[]>(raw);
      const tl = normalizeTimeline(parsed);
      if (tl?.length) return tl;
    } catch (e) {
      console.error("[ai] consequences via claude failed, falling back:", e);
    }
  }
  return DEFAULT_CONSEQUENCES;
}

const DEFAULT_CONSEQUENCES: ConsequenceStep[] = [
  {
    time: "Сегодня",
    event: "Первые «лёгкие» деньги",
    detail:
      "Ты принял перевод или дал карту и взял процент. Кажется, что всё просто и без последствий.",
    severity: "info",
  },
  {
    time: "Через несколько дней — 2 недели",
    event: "Ещё переводы, выше суммы",
    detail:
      "Тебя просят чаще и на большие чеки. Привыкаешь. Выйти «неудобно» — так удерживают.",
    severity: "warning",
  },
  {
    time: "Через 2–8 недель",
    event: "Блокировка Kaspi / счёта",
    detail:
      "Банк и мониторинг видят цепочку: деньги чужие, маршрут через тебя. Карта и приложение могут заморозить.",
    severity: "warning",
  },
  {
    time: "Через 1–3 месяца",
    event: "АФМ / полиция",
    detail:
      "Вызов на объяснения: по документам операции шли через твой счёт. «Мне сказали так работать» — слабая защита.",
    severity: "danger",
  },
  {
    time: "Далее",
    event: "Дело по ст. 232-1 УК РК",
    detail:
      "Дропперство — риск реального срока (до 7 лет в тяжёлых случаях), судимость, проблемы с учёбой, работой, кредитами и выездом.",
    severity: "danger",
  },
];
