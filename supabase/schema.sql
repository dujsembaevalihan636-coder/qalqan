-- Qalqan — схема Supabase (Postgres)
-- Выполни в Supabase SQL Editor. Затем seed.sql для демо-данных.

-- ── enums ──
do $$ begin
  create type scheme_type as enum ('dropper','pyramid','phishing','fake_job','other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type verdict_type as enum ('red','yellow','green');
exception when duplicate_object then null; end $$;

do $$ begin
  create type report_source as enum ('check','manual_report');
exception when duplicate_object then null; end $$;

do $$ begin
  create type account_kind as enum ('card','wallet','phone','telegram','instagram');
exception when duplicate_object then null; end $$;

-- ── reports (проверки + репорты, топливо для карты) ──
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  scheme_type scheme_type not null default 'other',
  region text not null default 'Не указан',
  verdict verdict_type not null,
  source report_source not null default 'check',
  raw_text text
);
create index if not exists reports_region_idx on reports (region);
create index if not exists reports_created_idx on reports (created_at desc);

-- ── flagged_accounts (народная база мошенников) ──
create table if not exists flagged_accounts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  value text not null,
  kind account_kind not null,
  report_count int not null default 1,
  note text
);
create index if not exists flagged_value_idx on flagged_accounts (value);

-- ── RLS ──
-- Публичное чтение (anon), запись — только через сервер (service-role обходит RLS).
alter table reports enable row level security;
alter table flagged_accounts enable row level security;

drop policy if exists reports_read on reports;
create policy reports_read on reports for select using (true);

drop policy if exists flagged_read on flagged_accounts;
create policy flagged_read on flagged_accounts for select using (true);
