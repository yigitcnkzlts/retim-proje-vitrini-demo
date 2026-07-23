-- RETİM Admin CMS — Başlangıç Migration'ı
-- Yeni bir Supabase projesinde SQL Editor'da BAŞTAN SONA tek seferde çalıştırın.
-- Tüm komutlar idempotenttir (tekrar çalıştırılsa da hata vermez).

create extension if not exists "pgcrypto";

-- ============================================================================
-- 1) project_refs — Referans No / Katalog listesi ("Referanslar" admin bölümü)
-- ============================================================================
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

-- ============================================================================
-- 2) projects — Proje detay sayfaları ("Projeler" admin bölümü)
-- ============================================================================
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

-- ============================================================================
-- 3) partners — Çözüm ortakları / logolar
-- ============================================================================
create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 4) contact_submissions — İletişim / keşif talep formu kayıtları
-- ============================================================================
create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text not null,
  building text,
  service text,
  message text,
  is_read boolean not null default false,
  status text not null default 'new',
  admin_note text not null default '',
  created_at timestamptz not null default now()
);

alter table contact_submissions add column if not exists status text not null default 'new';
alter table contact_submissions add column if not exists admin_note text not null default '';

do $$ begin
  alter table contact_submissions
    add constraint contact_submissions_status_check
    check (status in ('new', 'contacted', 'in_progress', 'closed'));
exception when duplicate_object then null;
end $$;

-- ============================================================================
-- 5) site_settings — İletişim bilgileri (telefon, adres, WhatsApp, harita vb.)
--    key/value yapısı; "Site Ayarları" admin bölümü tarafından yönetilir.
-- ============================================================================
create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 6) services — Hizmetler sayfası ve ana sayfa hizmet kartları
-- ============================================================================
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  detail text not null default '',
  image_url text,
  image_alt text not null default '',
  project_types jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  active boolean not null default true,
  featured boolean not null default false,
  seo_title text not null default '',
  seo_description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 7) home_content — Ana sayfa içeriği (hero, istatistikler, süreç kartları, semtler)
--    Tek satırlık içerik tablosu (id sabit 1)
-- ============================================================================
create table if not exists home_content (
  id integer primary key default 1 check (id = 1),
  hero_title text not null default '',
  hero_description text not null default '',
  stats jsonb not null default '[]'::jsonb,
  discovery_lead text not null default '',
  approach_steps jsonb not null default '[]'::jsonb,
  home_districts jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table home_content add column if not exists approach_steps jsonb not null default '[]'::jsonb;
alter table home_content add column if not exists home_districts jsonb not null default '[]'::jsonb;

-- ============================================================================
-- 8) about_content — Hakkımızda sayfası metinleri ve kurucu bilgisi
-- ============================================================================
create table if not exists about_content (
  id integer primary key default 1 check (id = 1),
  intro text not null default '',
  experience text not null default '',
  team text not null default '',
  closing text not null default '',
  founder_name text not null default 'Osman Babucci',
  founder_title text not null default 'Kurucu',
  founder_image text not null default '/images/retim/hakkimizda/kurumsal.jpeg',
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 9) media — Supabase Storage'a yüklenen tüm görsellerin kaydı (admin medya takibi)
-- ============================================================================
create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'cms-uploads',
  path text not null,
  url text not null,
  folder text not null default 'general',
  file_name text not null,
  mime_type text,
  size_bytes integer,
  alt_text text not null default '',
  created_at timestamptz not null default now(),
  unique (bucket, path)
);

-- ============================================================================
-- İndeksler
-- ============================================================================
create index if not exists idx_projects_published on projects (published, year desc);
create index if not exists idx_projects_featured on projects (featured) where featured = true;
create index if not exists idx_project_refs_type on project_refs (ref_type, year desc);
create index if not exists idx_partners_active on partners (active, sort_order);
create index if not exists idx_submissions_created on contact_submissions (created_at desc);
create index if not exists idx_services_active on services (active, sort_order);
create index if not exists idx_media_folder on media (folder, created_at desc);

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table project_refs enable row level security;
alter table projects enable row level security;
alter table partners enable row level security;
alter table contact_submissions enable row level security;
alter table site_settings enable row level security;
alter table services enable row level security;
alter table home_content enable row level security;
alter table about_content enable row level security;
alter table media enable row level security;

-- Public (anon key) sadece SELECT yapabilir — INSERT/UPDATE/DELETE yalnızca
-- server tarafındaki SUPABASE_SERVICE_ROLE_KEY ile (RLS'i bypass eder).

drop policy if exists "Public read published projects" on projects;
create policy "Public read published projects"
  on projects for select
  using (published = true);

drop policy if exists "Public read catalog refs" on project_refs;
create policy "Public read catalog refs"
  on project_refs for select
  using (true);

drop policy if exists "Public read active partners" on partners;
create policy "Public read active partners"
  on partners for select
  using (active = true);

drop policy if exists "Public read site settings" on site_settings;
create policy "Public read site settings"
  on site_settings for select
  using (true);

drop policy if exists "Public read active services" on services;
create policy "Public read active services"
  on services for select
  using (active = true);

drop policy if exists "Public read home content" on home_content;
create policy "Public read home content"
  on home_content for select
  using (true);

drop policy if exists "Public read about content" on about_content;
create policy "Public read about content"
  on about_content for select
  using (true);

-- contact_submissions ve media: herkese açık okuma politikası YOK.
-- Sadece admin panel (service role) okuyup yazabilir — bu tasarlanmış davranıştır.

-- ============================================================================
-- Storage — görsel yükleme bucket'ı
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('cms-uploads', 'cms-uploads', true)
on conflict (id) do update set public = true;

-- Not: Bucket "public" olduğu için görseller RLS'e bakılmaksızın herkese
-- açık URL üzerinden okunabilir. Yükleme/silme işlemleri sadece admin API
-- route'ları üzerinden SUPABASE_SERVICE_ROLE_KEY ile yapılır (RLS bypass).

-- ============================================================================
-- Bitti. Aşağıdaki sorgu ile tabloların oluştuğunu doğrulayabilirsiniz:
-- select table_name from information_schema.tables
-- where table_schema = 'public' order by table_name;
-- ============================================================================
