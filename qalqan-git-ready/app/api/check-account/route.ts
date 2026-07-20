import { NextResponse } from "next/server";
import { findFlagged } from "@/lib/store";
import { detectKind } from "@/lib/detect";

export const runtime = "nodejs";

// POST /api/check-account — проверка реквизита по народной базе flagged_accounts.
export async function POST(req: Request) {
  try {
    const { value } = (await req.json()) as { value?: string };
    if (!value || !value.trim()) {
      return NextResponse.json({ error: "Пустой запрос" }, { status: 400 });
    }
    const hit = await findFlagged(value);
    return NextResponse.json({
      found: Boolean(hit),
      kind: hit?.kind ?? detectKind(value),
      account: hit ?? null,
    });
  } catch (e) {
    console.error("[check-account] error:", e);
    return NextResponse.json({ error: "Ошибка проверки" }, { status: 500 });
  }
}
