import { NextResponse } from "next/server";
import { listReports } from "@/lib/store";
import type { SchemeType, Verdict } from "@/lib/types";

export const runtime = "nodejs";

export interface RegionAggregate {
  region: string;
  total: number;
  red: number;
  yellow: number;
  bySeheme: Record<SchemeType, number>;
  topScheme: SchemeType;
  lastAt: string;
}

// GET /api/map — агрегированные репорты по региону и типу для карты угроз.
export async function GET() {
  try {
    const reports = await listReports();
    const byRegion = new Map<string, RegionAggregate>();

    for (const r of reports) {
      const key = r.region || "Не указан";
      let agg = byRegion.get(key);
      if (!agg) {
        agg = {
          region: key,
          total: 0,
          red: 0,
          yellow: 0,
          bySeheme: { dropper: 0, pyramid: 0, phishing: 0, fake_job: 0, other: 0 },
          topScheme: "other",
          lastAt: r.created_at,
        };
        byRegion.set(key, agg);
      }
      agg.total += 1;
      if ((r.verdict as Verdict) === "red") agg.red += 1;
      if ((r.verdict as Verdict) === "yellow") agg.yellow += 1;
      agg.bySeheme[r.scheme_type] += 1;
      if (r.created_at > agg.lastAt) agg.lastAt = r.created_at;
    }

    const regions = [...byRegion.values()].map((agg) => {
      let top: SchemeType = "other";
      let best = -1;
      (Object.keys(agg.bySeheme) as SchemeType[]).forEach((k) => {
        if (agg.bySeheme[k] > best) { best = agg.bySeheme[k]; top = k; }
      });
      agg.topScheme = top;
      return agg;
    });

    regions.sort((a, b) => b.total - a.total);

    const totals = {
      reports: reports.length,
      regions: regions.length,
      red: reports.filter((r) => r.verdict === "red").length,
    };

    return NextResponse.json({ regions, totals, recent: reports.slice(0, 8) });
  } catch (e) {
    console.error("[map] error:", e);
    return NextResponse.json({ error: "Ошибка карты" }, { status: 500 });
  }
}
