-- Retim Admin CMS — Supabase SQL Editor'da çalıştırın

create extension if not exists "pgcrypto";

create table if not exists project_refs (
  id uuid primary key default gen_random_uuid(),
  ref_no text not null,
  project_name text not null,
  service text not null,
  district text not null,
  year integer not null,
  ref_type text not null default 'catalog' check (ref_type in ('catalog', 'archive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ref_no, ref_type)
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  ref_id uuid references project_refs(id) on delete set null,
  slug text not null unique,
  name text not null,
  district text not null,
  year integer not null,
  ref_no text not null,
  service text not null,
  service_slug text not null,
  building_type text not null default 'Apartman',
  duration text not null default '—',
  featured boolean not null default false,
  published boolean not null default true,
  short_description text not null default '',
  description text not null default '',
  scope jsonb not null default '[]'::jsonb,
  highlights jsonb not null default '[]'::jsonb,
  image_url text,
  image_fallback text,
  image_alt text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text not null,
  building text,
  service text,
  message text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_published on projects (published, year desc);
create index if not exists idx_projects_featured on projects (featured) where featured = true;
create index if not exists idx_project_refs_type on project_refs (ref_type, year desc);
create index if not exists idx_partners_active on partners (active, sort_order);
create index if not exists idx_submissions_created on contact_submissions (created_at desc);

alter table project_refs enable row level security;
alter table projects enable row level security;
alter table partners enable row level security;
alter table contact_submissions enable row level security;
alter table site_settings enable row level security;

create policy "Public read published projects"
  on projects for select
  using (published = true);

create policy "Public read catalog refs"
  on project_refs for select
  using (true);

create policy "Public read active partners"
  on partners for select
  using (active = true);

create policy "Public read site settings"
  on site_settings for select
  using (true);

-- Service role bypasses RLS; anon key uses policies above.
-- contact_submissions: no public read (admin via service role only)

-- Storage bucket (Dashboard > Storage > New bucket: cms-uploads, public)
-- Or run in SQL:
-- insert into storage.buckets (id, name, public) values ('cms-uploads', 'cms-uploads', true);
