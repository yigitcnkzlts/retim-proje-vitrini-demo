-- Site ziyaretçi / sayfa görüntüleme takibi
-- Supabase SQL Editor'da çalıştırın (idempotent).

create table if not exists site_visits (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  path text not null default '/',
  visit_date date not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_site_visits_date on site_visits (visit_date desc);
create index if not exists idx_site_visits_visitor_date on site_visits (visit_date, visitor_id);

alter table site_visits enable row level security;

-- Anon okuma yok; yazma yalnızca service role (API) ile.
drop policy if exists "No public access site visits" on site_visits;
