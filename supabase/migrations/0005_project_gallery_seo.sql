-- Proje galerisi (önce/sonra + ek görseller) ve SEO alanları

alter table projects
  add column if not exists gallery jsonb not null default '[]'::jsonb;

alter table projects
  add column if not exists seo_title text not null default '';

alter table projects
  add column if not exists seo_description text not null default '';

comment on column projects.gallery is
  'JSON dizi: [{ "url": "...", "alt": "...", "kind": "before"|"after"|"gallery" }]';
