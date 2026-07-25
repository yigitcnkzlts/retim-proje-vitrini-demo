-- Ana sayfa: Sorun Haritası + Keşif Süreci CMS alanları
-- Supabase SQL Editor'da çalıştırın (idempotent).

alter table home_content
  add column if not exists problems_section jsonb not null default '{}'::jsonb;

alter table home_content
  add column if not exists discovery_section jsonb not null default '{}'::jsonb;
