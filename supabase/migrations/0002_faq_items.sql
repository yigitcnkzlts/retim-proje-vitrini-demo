-- Bilgi Merkezi SSS (soru-cevap) tablosu
-- Supabase SQL Editor'da çalıştırın (idempotent).

create table if not exists faq_items (
  id uuid primary key default gen_random_uuid(),
  category_slug text not null,
  category_title text not null,
  question text not null,
  answer text not null default '',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_faq_items_active on faq_items (active, category_slug, sort_order);

alter table faq_items enable row level security;

drop policy if exists "Public read active faq items" on faq_items;
create policy "Public read active faq items"
  on faq_items for select
  using (active = true);
