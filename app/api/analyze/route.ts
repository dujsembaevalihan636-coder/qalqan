import { NextResponse } from "next/server";
import { analyzeMessage } from "@/lib/ai";
import { insertReport } from "@/lib/store";

export const runtime = "nodejs";

// POST /api/analyze — анализ текста сообщения → вердикт + флаги + чек-лист,
// плюс анонимная запись-репорт в reports (топливо для карты).
export async function POST(req: Request) {
  try {
    const { text, region } = (await req.json()) as {
      text?: string;
      region?: string;
    };
    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Пустой текст" }, { status: 400 });
    }

    const result = await analyzeMessage(text);
    const finalRegion = (region && region.trim()) || result.region || "Не указан";

    // Пишем репорт только если это не «зелёный» — карта показывает угрозы.
    if (result.verdict !== "green") {
      try {
        await insertReport({
          scheme_type: result.schemeType,
          region: finalRegion,
          verdict: result.verdict,
          source: "check",
          // Сырой текст не храним по умолчанию (приватность/анонимность).
          raw_text: null,
        });
      } catch (e) {
        console.error("[analyze] insertReport failed:", e);
      }
    }

    return NextResponse.json({ ...result, region: finalRegion });
  } catch (e) {
    console.error("[analyze] error:", e);
    return NextResponse.json({ error: "Ошибка анализа" }, { status: 500 });
  }
}
