import { NextResponse } from "next/server";
import { generateConsequences } from "@/lib/ai";

export const runtime = "nodejs";

// POST /api/consequences — сценарий → таймлайн последствий (ст. 232-1).
export async function POST(req: Request) {
  try {
    const { scenario } = (await req.json()) as { scenario?: string };
    const steps = await generateConsequences(scenario ?? "");
    return NextResponse.json({ steps });
  } catch (e) {
    console.error("[consequences] error:", e);
    return NextResponse.json({ error: "Ошибка генерации" }, { status: 500 });
  }
}
