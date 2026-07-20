import { NextResponse } from "next/server";
import { listFlagged } from "@/lib/store";

export const runtime = "nodejs";

// GET /api/flagged?q=... — народный реестр мошенников (поиск/список).
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? undefined;
    const accounts = await listFlagged(q);
    return NextResponse.json({ accounts });
  } catch (e) {
    console.error("[flagged] error:", e);
    return NextResponse.json({ error: "Ошибка реестра" }, { status: 500 });
  }
}
