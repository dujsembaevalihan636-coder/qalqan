import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildStatement, type StatementKind } from "@/lib/statements";

export const runtime = "nodejs";

const apiKey = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

/**
 * POST /api/statement — Claude generates formal appeal text;
 * falls back to local template if no key.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      kind?: StatementKind;
      lang?: "ru" | "kz";
      name?: string;
      phone?: string;
      card?: string;
      bank?: string;
      city?: string;
      what?: string;
    };

    const kind: StatementKind = body.kind === "police" ? "police" : "bank";
    const lang = body.lang === "kz" ? "kz" : "ru";
    const data = {
      name: body.name ?? "",
      phone: body.phone ?? "",
      card: body.card ?? "",
      bank: body.bank ?? "Kaspi",
      city: body.city ?? "",
      what: body.what ?? "",
    };

    const fallback = buildStatement(kind, data, lang);

    if (!apiKey) {
      return NextResponse.json({ text: fallback, engine: "template" });
    }

    try {
      const client = new Anthropic({ apiKey });
      const target =
        kind === "bank"
          ? lang === "kz"
            ? "банкке өтініш"
            : "заявление в банк"
          : lang === "kz"
            ? "полицияға өтініш"
            : "заявление в полицию";

      const msg = await client.messages.create({
        model: MODEL,
        max_tokens: 1200,
        temperature: 0.2,
        system: `Ты юрист-практик в Казахстане (не замена адвоката). Пишешь краткие, спокойные, конкретные тексты обращений по мошенничеству/дропперству (ст. 232-1 УК РК — только как ориентир).
Правила:
- Только готовый текст заявления, без markdown и пояснений.
- Язык: ${lang === "kz" ? "казахский" : "русский"}.
- Вставь данные пользователя; если поля пустые — оставь подчёркивания.
- Тон: спокойный, фактический, без истерики.
- Проси: блокировку карты/фиксацию обращения / проверку (по типу адресата).`,
        messages: [
          {
            role: "user",
            content: `Сгенерируй ${target}.

ФИО: ${data.name || "—"}
Телефон: ${data.phone || "—"}
Город: ${data.city || "—"}
Банк: ${data.bank || "—"}
Карта/счёт: ${data.card || "—"}
Что случилось: ${data.what || "вовлечение в схему с переводами / передача данных карты"}`,
          },
        ],
      });

      const text = msg.content
        .filter((b) => b.type === "text")
        .map((b) => (b as { text: string }).text)
        .join("\n")
        .trim();

      if (text.length > 40) {
        return NextResponse.json({ text, engine: "claude" });
      }
    } catch (e) {
      console.error("[statement] claude failed:", e);
    }

    return NextResponse.json({ text: fallback, engine: "template" });
  } catch (e) {
    console.error("[statement] error:", e);
    return NextResponse.json({ error: "Ошибка генерации" }, { status: 500 });
  }
}
