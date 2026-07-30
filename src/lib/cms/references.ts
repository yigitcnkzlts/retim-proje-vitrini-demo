import {
  referencesArchive,
  references2023,
  references2024,
  type Reference,
} from "@/data/references";
import { getSupabaseAdmin, getSupabasePublic, isCmsConfigured } from "@/lib/cms/supabase";
import type { DbProjectRef, ProjectRefInput, RefType } from "@/lib/cms/types";
import {
  createSlug,
  formatDistrict,
  formatProjectName,
  getServiceSlugFromText,
} from "@/data/images";
import { getProjectImageSource } from "@/data/mediaAssets";
import { createProject, getProjectBySlugAdmin } from "@/lib/cms/projects";

const EXCLUDED_REFS_KEY = "excluded_project_refs";
const PAGE_SIZE = 1000;
const UPSERT_BATCH = 200;

/** Statik arşivden kalıcı silinen ref'ler — DB'de kalsa bile panel/sitede görünmesin */
const REMOVED_ARCHIVE_REF_NOS = new Set(["2412-2"]);

function mapDbToReference(row: DbProjectRef): Reference {
  return {
    refNo: row.ref_no,
    projectName: row.project_name,
    service: row.service,
    district: row.district,
    year: row.year,
  };
}

function staticCatalogRefs(): Reference[] {
  return [...references2024, ...references2023];
}

function excludedKey(refType: RefType, refNo: string): string {
  return `${refType}:${refNo}`;
}

async function getExcludedRefKeys(): Promise<Set<string>> {
  const client = getSupabaseAdmin();
  if (!client) return new Set();
  const { data } = await client
    .from("site_settings")
    .select("value")
    .eq("key", EXCLUDED_REFS_KEY)
    .maybeSingle();
  const value = data?.value;
  if (Array.isArray(value)) return new Set(value.map(String));
  return new Set();
}

async function addExcludedRef(refType: RefType, refNo: string): Promise<void> {
  const client = getSupabaseAdmin();
  if (!client) return;
  const excluded = await getExcludedRefKeys();
  excluded.add(excludedKey(refType, refNo));
  await client.from("site_settings").upsert({
    key: EXCLUDED_REFS_KEY,
    value: Array.from(excluded),
    updated_at: new Date().toISOString(),
  });
}

type AdminClient = NonNullable<ReturnType<typeof getSupabaseAdmin>>;

/** Supabase varsayılan 1000 satır limitini aşmak için sayfalı çekim */
async function fetchAllRefRows(client: AdminClient, type?: RefType): Promise<DbProjectRef[]> {
  const rows: DbProjectRef[] = [];
  let from = 0;

  while (true) {
    let query = client
      .from("project_refs")
      .select("*")
      .order("year", { ascending: false })
      .order("ref_no", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);
    if (type) query = query.eq("ref_type", type);

    const { data, error } = await query;
    if (error) {
      console.error("Referans okuma hatası:", error.message);
      return rows.length > 0 ? rows : [];
    }
    if (!data?.length) break;
    rows.push(...(data as DbProjectRef[]));
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return rows;
}

async function fetchAllRefNos(client: AdminClient, type: RefType): Promise<Set<string>> {
  const nos = new Set<string>();
  let from = 0;

  while (true) {
    const { data, error } = await client
      .from("project_refs")
      .select("ref_no")
      .eq("ref_type", type)
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw new Error(error.message);
    if (!data?.length) break;
    for (const row of data) nos.add(row.ref_no as string);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return nos;
}

async function upsertRefBatches(
  client: AdminClient,
  rows: Array<{
    ref_no: string;
    project_name: string;
    service: string;
    district: string;
    year: number;
    ref_type: RefType;
  }>
): Promise<void> {
  for (let i = 0; i < rows.length; i += UPSERT_BATCH) {
    const batch = rows.slice(i, i + UPSERT_BATCH);
    const { error } = await client.from("project_refs").upsert(batch, {
      onConflict: "ref_no,ref_type",
    });
    if (error) throw new Error(error.message);
  }
}

function toDbRow(r: Reference, refType: RefType) {
  return {
    ref_no: r.refNo,
    project_name: r.projectName,
    service: r.service,
    district: r.district,
    year: r.year,
    ref_type: refType,
  };
}

/**
 * Sitedeki referansları panele aktarır (eksik olanlar).
 * maxInserts ile parça parça çalışır (Vercel timeout önlemi); tekrar çağrılabilir.
 */
export async function syncSiteRefsToAdmin(maxInserts = 600): Promise<{
  importedCatalog: number;
  importedArchive: number;
  totalCatalog: number;
  totalArchive: number;
  remaining: number;
  done: boolean;
}> {
  const client = getSupabaseAdmin();
  if (!client) {
    return {
      importedCatalog: 0,
      importedArchive: 0,
      totalCatalog: 0,
      totalArchive: 0,
      remaining: 0,
      done: true,
    };
  }

  const excluded = await getExcludedRefKeys();

  const catalogSource = staticCatalogRefs().filter(
    (r) => !excluded.has(excludedKey("catalog", r.refNo))
  );
  const archiveSource = referencesArchive.filter(
    (r) =>
      !REMOVED_ARCHIVE_REF_NOS.has(r.refNo) &&
      !excluded.has(excludedKey("archive", r.refNo))
  );

  const haveCatalog = await fetchAllRefNos(client, "catalog");
  const haveArchive = await fetchAllRefNos(client, "archive");

  const missingCatalog = catalogSource
    .filter((r) => !haveCatalog.has(r.refNo))
    .map((r) => toDbRow(r, "catalog"));
  const missingArchive = archiveSource
    .filter((r) => !haveArchive.has(r.refNo))
    .map((r) => toDbRow(r, "archive"));

  let budget = maxInserts;
  const catalogBatch = missingCatalog.slice(0, budget);
  budget -= catalogBatch.length;
  const archiveBatch = missingArchive.slice(0, Math.max(0, budget));

  if (catalogBatch.length > 0) await upsertRefBatches(client, catalogBatch);
  if (archiveBatch.length > 0) await upsertRefBatches(client, archiveBatch);

  const remaining =
    missingCatalog.length - catalogBatch.length + (missingArchive.length - archiveBatch.length);

  return {
    importedCatalog: catalogBatch.length,
    importedArchive: archiveBatch.length,
    totalCatalog: catalogSource.length,
    totalArchive: archiveSource.length,
    remaining,
    done: remaining === 0,
  };
}

async function fetchRefs(type?: RefType): Promise<DbProjectRef[] | null> {
  const client = getSupabasePublic() ?? getSupabaseAdmin();
  if (!client) return null;

  const rows = await fetchAllRefRows(client, type);
  return rows;
}

export async function getCatalogReferences(): Promise<Reference[]> {
  if (!isCmsConfigured()) return staticCatalogRefs();
  const rows = await fetchRefs("catalog");
  if (rows === null) return staticCatalogRefs();
  if (rows.length === 0) return staticCatalogRefs();
  return rows.map(mapDbToReference);
}

export async function getArchiveReferences(): Promise<Reference[]> {
  const withoutRemoved = (items: Reference[]) =>
    items.filter((r) => !REMOVED_ARCHIVE_REF_NOS.has(r.refNo));

  if (!isCmsConfigured()) return withoutRemoved(referencesArchive);
  const rows = await fetchRefs("archive");
  if (rows === null) return withoutRemoved(referencesArchive);
  // DB boş/eksikse sitede tam arşiv görünsün
  if (rows.length === 0) return withoutRemoved(referencesArchive);
  if (rows.length < referencesArchive.length * 0.9) return withoutRemoved(referencesArchive);
  return withoutRemoved(rows.map(mapDbToReference));
}

export type { FooterProjectLink } from "@/lib/cms/projects";
export { getFooterLatestProjects } from "@/lib/cms/projects";

function staticRefsAsDb(type?: RefType): DbProjectRef[] {
  const now = new Date().toISOString();
  const mapRow = (r: Reference, refType: RefType, prefix: string): DbProjectRef => ({
    id: `${prefix}-${r.refNo}`,
    ref_no: r.refNo,
    project_name: r.projectName,
    service: r.service,
    district: r.district,
    year: r.year,
    ref_type: refType,
    created_at: now,
    updated_at: now,
  });

  const catalog = staticCatalogRefs().map((r) => mapRow(r, "catalog", "static-catalog"));
  const archive = referencesArchive.map((r) => mapRow(r, "archive", "static-archive"));

  if (type === "catalog") return catalog;
  if (type === "archive") return archive;
  return [...catalog, ...archive];
}

/**
 * Panelde sitedeki liste birebir görünsün:
 * site arşivi (~2414) temel alınır, DB'deki UUID/güncellemeler üzerine yazılır.
 */
async function mergeSiteArchiveWithDb(client: AdminClient | null): Promise<DbProjectRef[]> {
  const excluded = client ? await getExcludedRefKeys() : new Set<string>();
  const siteRows = staticRefsAsDb("archive").filter(
    (r) =>
      !REMOVED_ARCHIVE_REF_NOS.has(r.ref_no) &&
      !excluded.has(excludedKey("archive", r.ref_no))
  );

  if (!client) return siteRows;

  const dbRows = await fetchAllRefRows(client, "archive");
  const byNo = new Map(dbRows.map((r) => [r.ref_no, r]));

  const merged = siteRows.map((r) => byNo.get(r.ref_no) ?? r);

  // Panelden elle eklenen (sitede olmayan) arşiv kayıtları
  const siteNos = new Set(siteRows.map((r) => r.ref_no));
  for (const row of dbRows) {
    if (
      !REMOVED_ARCHIVE_REF_NOS.has(row.ref_no) &&
      !siteNos.has(row.ref_no) &&
      !excluded.has(excludedKey("archive", row.ref_no))
    ) {
      merged.push(row);
    }
  }

  return merged;
}

export async function getAllRefsAdmin(type?: RefType): Promise<DbProjectRef[]> {
  const client = getSupabaseAdmin();

  // Arşiv = sitedeki /referanslar (~2414) — her zaman tam liste
  if (type === "archive") {
    return mergeSiteArchiveWithDb(client);
  }

  if (!client) return staticRefsAsDb(type);

  // Katalog küçük — eksikleri sessizce tamamla
  if (type === "catalog" || type === undefined) {
    try {
      const excluded = await getExcludedRefKeys();
      const catalogSource = staticCatalogRefs().filter(
        (r) => !excluded.has(excludedKey("catalog", r.refNo))
      );
      const haveCatalog = await fetchAllRefNos(client, "catalog");
      const missingCatalog = catalogSource
        .filter((r) => !haveCatalog.has(r.refNo))
        .map((r) => toDbRow(r, "catalog"));
      if (missingCatalog.length > 0) await upsertRefBatches(client, missingCatalog);
    } catch (error) {
      console.error("Katalog senkron hatası:", error instanceof Error ? error.message : error);
    }
  }

  if (type === "catalog") {
    const rows = await fetchAllRefRows(client, "catalog");
    return rows.length > 0 ? rows : staticRefsAsDb("catalog");
  }

  // type yok: katalog + tam arşiv
  const [catalogRows, archiveRows] = await Promise.all([
    fetchAllRefRows(client, "catalog"),
    mergeSiteArchiveWithDb(client),
  ]);
  const catalog = catalogRows.length > 0 ? catalogRows : staticRefsAsDb("catalog");
  return [...catalog, ...archiveRows];
}

/** Sitedeki arşiv referans sayısı (panel sayacı için) */
export function getSiteArchiveCount(): number {
  return referencesArchive.length;
}

export async function createReference(
  input: ProjectRefInput,
  createLinkedProject = true
): Promise<DbProjectRef | null> {
  const client = getSupabaseAdmin();
  if (!client) return null;

  const { data, error } = await client
    .from("project_refs")
    .insert({
      ref_no: input.ref_no,
      project_name: input.project_name,
      service: input.service,
      district: input.district,
      year: input.year,
      ref_type: input.ref_type,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  const ref = data as DbProjectRef;

  if (createLinkedProject && input.ref_type === "catalog") {
    await ensureProjectFromReference(ref);
  }

  return ref;
}

export async function updateReference(
  id: string,
  input: Partial<ProjectRefInput>
): Promise<DbProjectRef | null> {
  const client = getSupabaseAdmin();
  if (!client) return null;

  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.ref_no !== undefined) payload.ref_no = input.ref_no;
  if (input.project_name !== undefined) payload.project_name = input.project_name;
  if (input.service !== undefined) payload.service = input.service;
  if (input.district !== undefined) payload.district = input.district;
  if (input.year !== undefined) payload.year = input.year;
  if (input.ref_type !== undefined) payload.ref_type = input.ref_type;

  const { data, error } = await client
    .from("project_refs")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as DbProjectRef;
}

export async function deleteReference(id: string): Promise<void> {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("CMS yapılandırılmamış");

  const { data: existing } = await client
    .from("project_refs")
    .select("ref_no, ref_type")
    .eq("id", id)
    .maybeSingle();

  const { error } = await client.from("project_refs").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (existing?.ref_no && existing?.ref_type) {
    await addExcludedRef(existing.ref_type as RefType, existing.ref_no as string);
  }
}

function buildingTypeFromName(name: string): string {
  const n = name.toUpperCase();
  if (n.includes("SİTESİ") || n.includes("SİT.")) return "Site";
  if (n.includes("HAN")) return "Tarihi Han";
  if (n.includes("İNŞ")) return "Ticari Bina";
  return "Apartman";
}

export async function ensureProjectFromReference(ref: DbProjectRef): Promise<void> {
  const slug = createSlug(ref.project_name, ref.ref_no);
  const existing = await getProjectBySlugAdmin(slug);
  if (existing) return;

  const name = formatProjectName(ref.project_name);
  const district = formatDistrict(ref.district);
  const serviceSlug = getServiceSlugFromText(ref.service);
  const imageSource = getProjectImageSource(slug, serviceSlug);

  await createProject({
    ref_id: ref.id,
    slug,
    name,
    district,
    year: ref.year,
    ref_no: ref.ref_no,
    service: ref.service,
    service_slug: serviceSlug,
    building_type: buildingTypeFromName(ref.project_name),
    duration: "—",
    featured: false,
    published: true,
    short_description: `${district} — ${ref.service}`,
    description: `${name} projesinde ${district} bölgesinde ${ref.service.toLowerCase()} uygulaması Retim tarafından tamamlanmıştır. Referans No: ${ref.ref_no}`,
    scope: [
      "Keşif ve mevcut durum analizi",
      ref.service,
      "Kontrollü saha uygulaması",
      "Teslim ve kontrol süreci",
    ],
    highlights: ["Retim referans projesi", `${ref.year} yılı uygulaması`, `${district} bölgesi`],
    image_url: imageSource.primary,
    image_fallback: imageSource.fallback,
    image_alt: imageSource.alt,
  });
}
