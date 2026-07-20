import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Report, FlaggedAccount, AccountKind } from "./types";
import { SEED_REPORTS, SEED_FLAGGED } from "./seed";

// ─────────────────────────────────────────────────────────────
// Слой хранения. Если Supabase настроен (env заданы) — пишем/читаем его.
// Иначе — работаем на in-memory сид-данных, чтобы демо не зависело от сети.
// ВСЕ вызовы отсюда происходят ТОЛЬКО на сервере (server-only).
// ─────────────────────────────────────────────────────────────

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseEnabled = Boolean(url && serviceKey);

let _client: SupabaseClient | null = null;
function db(): SupabaseClient {
  if (!_client) {
    _client = createClient(url!, serviceKey!, {
      auth: { persistSession: false },
    });
  }
  return _client;
}

// ── In-memory fallback (живёт в процессе dev-сервера) ──
const mem = {
  reports: [...SEED_REPORTS] as Report[],
  flagged: [...SEED_FLAGGED] as FlaggedAccount[],
};

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeValue(v: string) {
  return v.replace(/\s+/g, "").toLowerCase();
}

// ── Reports ──

export async function insertReport(
  r: Omit<Report, "id" | "created_at">
): Promise<Report> {
  const row: Report = {
    ...r,
    id: uid("r"),
    created_at: new Date().toISOString(),
  };
  if (supabaseEnabled) {
    const { data, error } = await db()
      .from("reports")
      .insert({
        scheme_type: r.scheme_type,
        region: r.region,
        verdict: r.verdict,
        source: r.source,
        raw_text: r.raw_text ?? null,
      })
      .select()
      .single();
    if (!error && data) return data as Report;
    // при ошибке — не роняем демо, откатываемся в память
  }
  mem.reports.unshift(row);
  return row;
}

export async function listReports(): Promise<Report[]> {
  if (supabaseEnabled) {
    const { data, error } = await db()
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (!error && data) return data as Report[];
  }
  return mem.reports;
}

// ── Flagged accounts ──

export async function findFlagged(value: string): Promise<FlaggedAccount | null> {
  const needle = normalizeValue(value);
  if (supabaseEnabled) {
    const { data } = await db().from("flagged_accounts").select("*").limit(1000);
    if (data) {
      const hit = (data as FlaggedAccount[]).find(
        (a) => normalizeValue(a.value) === needle
      );
      return hit ?? null;
    }
  }
  return mem.flagged.find((a) => normalizeValue(a.value) === needle) ?? null;
}

export async function listFlagged(query?: string): Promise<FlaggedAccount[]> {
  let rows: FlaggedAccount[];
  if (supabaseEnabled) {
    const { data, error } = await db()
      .from("flagged_accounts")
      .select("*")
      .order("report_count", { ascending: false })
      .limit(1000);
    rows = !error && data ? (data as FlaggedAccount[]) : mem.flagged;
  } else {
    rows = [...mem.flagged].sort((a, b) => b.report_count - a.report_count);
  }
  if (query && query.trim()) {
    const q = normalizeValue(query);
    rows = rows.filter(
      (a) => normalizeValue(a.value).includes(q) || (a.note ?? "").toLowerCase().includes(query.toLowerCase())
    );
  }
  return rows;
}

export async function upsertFlagged(
  value: string,
  kind: AccountKind,
  note?: string | null
): Promise<FlaggedAccount> {
  const existing = await findFlagged(value);
  if (existing) {
    const nextCount = existing.report_count + 1;
    if (supabaseEnabled) {
      const { data } = await db()
        .from("flagged_accounts")
        .update({ report_count: nextCount })
        .eq("id", existing.id)
        .select()
        .single();
      if (data) return data as FlaggedAccount;
    } else {
      existing.report_count = nextCount;
    }
    return existing;
  }
  const row: FlaggedAccount = {
    id: uid("f"),
    created_at: new Date().toISOString(),
    value,
    kind,
    report_count: 1,
    note: note ?? null,
  };
  if (supabaseEnabled) {
    const { data } = await db()
      .from("flagged_accounts")
      .insert({ value, kind, report_count: 1, note: note ?? null })
      .select()
      .single();
    if (data) return data as FlaggedAccount;
  }
  mem.flagged.unshift(row);
  return row;
}
