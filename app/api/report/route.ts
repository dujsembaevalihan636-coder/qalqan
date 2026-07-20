import { NextResponse } from "next/server";
import { insertReport, upsertFlagged } from "@/lib/store";
import { detectKind } from "@/lib/detect";
import type { SchemeType } from "@/lib/types";

export const runtime = "nodejs";

// POST /api/report — ручной репорт схемы → пишет в reports
// (и в flagged_accounts, если переданы реквизиты).
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      scheme_type?: SchemeType;
      region?: string;
      account?: string;
      note?: string;
    };
    const region = (body.region && body.region.trim()) || "Не указан";
    const scheme_type: SchemeType = body.scheme_type ?? "other";

    const report = await insertReport({
      scheme_type,
      region,
      verdict: "red",
      source: "manual_report",
      raw_text: null,
    });

    let flagged = null;
    if (body.account && body.account.trim()) {
      flagged = await upsertFlagged(
        body.account.trim(),
        detectKind(body.account),
        body.note?.trim() || null
      );
    }

    return NextResponse.json({ ok: true, report, flagged });
  } catch (e) {
    console.error("[report] error:", e);
    return NextResponse.json({ error: "Ошибка репорта" }, { status: 500 });
  }
}
