/**
 * site_visits tablosunu kontrol eder; SUPABASE_DB_URL varsa migration'ı uygular.
 * Kullanım: npm run setup:analytics
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

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

async function tableReady(url: string, key: string): Promise<boolean> {
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error, count } = await client
    .from("site_visits")
    .select("id", { head: true, count: "exact" })
    .limit(1);
  // Tablo yokken Supabase bazen error döndürmez; count null kalır
  if (error) return false;
  return count !== null;
}

async function applyMigrationWithPg(dbUrl: string): Promise<void> {
  const sqlPath = resolve(process.cwd(), "supabase/migrations/0003_site_visits.sql");
  const sql = readFileSync(sqlPath, "utf8");

  let pg: typeof import("pg");
  try {
    pg = await import("pg");
  } catch {
    console.error("pg paketi yok. Önce: npm install --save-dev pg");
    process.exit(1);
  }

  const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query(sql);
  } finally {
    await client.end();
  }
}

async function main() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("HATA: NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli (.env.local)");
    process.exit(1);
  }

  if (await tableReady(url, key)) {
    const client = createClient(url, key, { auth: { persistSession: false } });
    const { count } = await client.from("site_visits").select("*", { count: "exact", head: true });
    console.log(`✓ site_visits tablosu hazır (${count ?? 0} kayıt)`);
    return;
  }

  const dbUrl = process.env.SUPABASE_DB_URL;
  if (dbUrl) {
    console.log("site_visits bulunamadı — migration uygulanıyor…");
    await applyMigrationWithPg(dbUrl);
    if (await tableReady(url, key)) {
      console.log("✓ Migration tamamlandı, site_visits tablosu oluşturuldu.");
      return;
    }
    console.error("Migration sonrası tablo hâlâ okunamıyor.");
    process.exit(1);
  }

  console.log("\n⚠ site_visits tablosu yok.\n");
  console.log("Supabase → SQL Editor → şu dosyayı yapıştırıp Run:");
  console.log("  supabase/migrations/0003_site_visits.sql\n");
  console.log("Otomatik kurulum için .env.local'e ekleyin:");
  console.log("  SUPABASE_DB_URL=postgresql://postgres.[ref]:[şifre]@...supabase.com:6543/postgres");
  console.log("(Supabase → Project Settings → Database → Connection string → URI)\n");
  process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
