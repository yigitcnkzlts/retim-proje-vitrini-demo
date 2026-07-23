/**
 * Mevcut statik verileri Supabase'e aktarır.
 * Kullanım: .env.local dosyasını doldurduktan sonra `npm run seed`
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { projects } from "../src/data/projects";
import { references2023, references2024, referencesArchive } from "../src/data/references";
import { partners } from "../src/data/partners";
import { services } from "../src/data/services";
import { aboutText, approachSteps, homeDistricts, siteConfig, stats } from "../src/data/site";

function loadEnvFile(filename: string) {
  const path = resolve(process.cwd(), filename);
  if (!existsSync(path)) return;
  const content = readFileSync(path, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("HATA: NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli (.env.local)");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function upsertInBatches(
  table: "project_refs",
  rows: Array<Record<string, string | number>>,
  onConflict: string,
  batchSize = 200
) {
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase.from(table).upsert(batch, { onConflict });
    if (error) throw new Error(error.message);
  }
}

async function seedRefs() {
  const catalog = [...references2024, ...references2023].map((r) => ({
    ref_no: r.refNo,
    project_name: r.projectName,
    service: r.service,
    district: r.district,
    year: r.year,
    ref_type: "catalog",
  }));

  const archive = referencesArchive.map((r) => ({
    ref_no: r.refNo,
    project_name: r.projectName,
    service: r.service,
    district: r.district,
    year: r.year,
    ref_type: "archive",
  }));

  await upsertInBatches("project_refs", catalog, "ref_no,ref_type");
  await upsertInBatches("project_refs", archive, "ref_no,ref_type");

  console.log(`✓ Referanslar: ${catalog.length} katalog + ${archive.length} arşiv`);
}

async function seedProjects() {
  const rows = projects.map((p) => ({
    slug: p.slug,
    name: p.name,
    district: p.district,
    year: p.year,
    ref_no: p.refNo,
    service: p.service,
    service_slug: p.serviceSlug,
    building_type: p.buildingType,
    duration: p.duration,
    featured: p.featured,
    published: true,
    short_description: p.shortDescription,
    description: p.description,
    scope: p.scope,
    highlights: p.highlights,
    image_url: p.image,
    image_fallback: p.imageFallback,
    image_alt: p.imageAlt,
  }));

  const { error } = await supabase.from("projects").upsert(rows, { onConflict: "slug" });
  if (error) throw new Error(error.message);
  console.log(`✓ Projeler: ${rows.length} kayıt`);
}

async function seedPartners() {
  const rows = partners.map((p, i) => ({
    name: p.name,
    logo_url: p.logo,
    sort_order: i,
    active: true,
  }));

  await supabase.from("partners").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  const { error } = await supabase.from("partners").insert(rows);
  if (error) throw new Error(error.message);
  console.log(`✓ Çözüm ortakları: ${rows.length} kayıt`);
}

async function seedServices() {
  const rows = services.map((s, i) => ({
    slug: s.slug,
    name: s.name,
    description: s.description,
    detail: "",
    image_url: null,
    image_alt: "",
    project_types: s.projectTypes,
    sort_order: i,
    active: true,
    featured: false,
    seo_title: "",
    seo_description: "",
  }));

  const { error } = await supabase.from("services").upsert(rows, { onConflict: "slug" });
  if (error) throw new Error(error.message);
  console.log(`✓ Hizmetler: ${rows.length} kayıt`);
}

async function seedHomeContent() {
  const { error } = await supabase.from("home_content").upsert({
    id: 1,
    hero_title: "Yüzlerce Onarılan Binada Retim İmzası",
    hero_description: siteConfig.description,
    stats,
    discovery_lead: "Projeniz hakkında bilgi verin, en kısa sürede size dönüş yapalım.",
    approach_steps: approachSteps.map((s) => ({ title: s.title, description: s.description })),
    home_districts: homeDistricts,
  });
  if (error) throw new Error(error.message);
  console.log("✓ Ana sayfa içeriği");
}

async function seedAboutContent() {
  const { error } = await supabase.from("about_content").upsert({
    id: 1,
    intro: aboutText.intro,
    experience: aboutText.experience,
    team: aboutText.team,
    closing: aboutText.closing,
    founder_name: "Osman Babucci",
    founder_title: "Kurucu",
    founder_image: "/images/retim/hakkimizda/kurumsal.jpeg",
  });
  if (error) throw new Error(error.message);
  console.log("✓ Hakkımızda içeriği");
}

async function main() {
  console.log("Supabase seed başlıyor...\n");
  await seedRefs();
  await seedProjects();
  await seedPartners();
  await seedServices();
  await seedHomeContent();
  await seedAboutContent();
  console.log("\nTamamlandı! /admin adresinden giriş yapabilirsiniz.");
}

main().catch((err) => {
  console.error("Seed hatası:", err);
  process.exit(1);
});
