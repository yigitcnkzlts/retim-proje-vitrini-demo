import type { Project } from "@/data/projects";
import {
  projects as staticProjects,
  getProjectBySlug as getStaticProjectBySlug,
  getFeaturedProjects as getStaticFeaturedProjects,
} from "@/data/projects";
import { getSupabaseAdmin, getSupabasePublic, isCmsConfigured } from "@/lib/cms/supabase";
import type { DbProject, GalleryImage, ProjectInput } from "@/lib/cms/types";

function normalizeGallery(raw: unknown): GalleryImage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((item): GalleryImage | null => {
      const url = String(item.url || "");
      if (!url) return null;
      const kind: GalleryImage["kind"] =
        item.kind === "before" || item.kind === "after" || item.kind === "gallery"
          ? item.kind
          : "gallery";
      return {
        url,
        alt: String(item.alt || ""),
        kind,
      };
    })
    .filter((item): item is GalleryImage => item !== null);
}

function normalizeProjectRow(row: Record<string, unknown>): DbProject {
  return {
    ...(row as unknown as DbProject),
    gallery: normalizeGallery(row.gallery),
    seo_title: String(row.seo_title ?? ""),
    seo_description: String(row.seo_description ?? ""),
  };
}

function mapDbToProject(row: DbProject): Project {
  return {
    slug: row.slug,
    name: row.name,
    district: row.district,
    year: row.year,
    refNo: row.ref_no,
    service: row.service,
    serviceSlug: row.service_slug,
    buildingType: row.building_type,
    duration: row.duration,
    featured: row.featured,
    shortDescription: row.short_description,
    description: row.description,
    scope: row.scope ?? [],
    highlights: row.highlights ?? [],
    image: row.image_url || row.image_fallback || "/images/projects/boya.svg",
    imageFallback: row.image_fallback || "/images/projects/boya.svg",
    imageAlt: row.image_alt || `${row.name} proje uygulama görseli`,
    gallery: row.gallery ?? [],
    seoTitle: row.seo_title || "",
    seoDescription: row.seo_description || "",
  };
}

function mapInputToDb(input: ProjectInput) {
  return {
    ref_id: input.ref_id ?? null,
    slug: input.slug,
    name: input.name,
    district: input.district,
    year: input.year,
    ref_no: input.ref_no,
    service: input.service,
    service_slug: input.service_slug,
    building_type: input.building_type,
    duration: input.duration,
    featured: input.featured,
    published: input.published,
    short_description: input.short_description,
    description: input.description,
    scope: input.scope,
    highlights: input.highlights,
    image_url: input.image_url ?? null,
    image_fallback: input.image_fallback ?? null,
    image_alt: input.image_alt ?? null,
    gallery: input.gallery ?? [],
    seo_title: input.seo_title ?? "",
    seo_description: input.seo_description ?? "",
    updated_at: new Date().toISOString(),
  };
}

async function fetchPublishedProjects(): Promise<Project[] | null> {
  const client = getSupabasePublic() ?? getSupabaseAdmin();
  if (!client) return null;

  const { data, error } = await client
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("year", { ascending: false })
    .order("name", { ascending: true });

  if (error || !data) return null;
  return (data as Record<string, unknown>[]).map((row) => mapDbToProject(normalizeProjectRow(row)));
}

async function fetchAllProjectsAdmin(): Promise<DbProject[] | null> {
  const client = getSupabaseAdmin();
  if (!client) return null;

  const { data, error } = await client
    .from("projects")
    .select("*")
    .order("year", { ascending: false })
    .order("name", { ascending: true });

  if (error || !data) return null;
  return (data as Record<string, unknown>[]).map(normalizeProjectRow);
}

export async function getProjects(): Promise<Project[]> {
  if (!isCmsConfigured()) return staticProjects;
  const fromDb = await fetchPublishedProjects();
  // CMS bağlıysa DB sonucuna güven (boş liste = silinmiş demektir; statik fallback yapma)
  if (fromDb !== null) return fromDb;
  return staticProjects;
}

export async function getProjectsByService(serviceSlug: string): Promise<Project[]> {
  const all = await getProjects();
  return all.filter((p) => p.serviceSlug === serviceSlug);
}

function staticProjectsAsDb(): DbProject[] {
  const now = new Date().toISOString();
  return staticProjects.map((p) => ({
    id: `static-${p.slug}`,
    ref_id: null,
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
    gallery: p.gallery ?? [],
    seo_title: p.seoTitle ?? "",
    seo_description: p.seoDescription ?? "",
    created_at: now,
    updated_at: now,
  }));
}

const EXCLUDED_SLUGS_KEY = "excluded_project_slugs";

function projectToDbRow(p: Project) {
  return {
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
    gallery: p.gallery ?? [],
    seo_title: p.seoTitle ?? "",
    seo_description: p.seoDescription ?? "",
  };
}

async function getExcludedProjectSlugs(): Promise<Set<string>> {
  const client = getSupabaseAdmin();
  if (!client) return new Set();
  const { data } = await client
    .from("site_settings")
    .select("value")
    .eq("key", EXCLUDED_SLUGS_KEY)
    .maybeSingle();
  const value = data?.value;
  if (Array.isArray(value)) return new Set(value.map(String));
  return new Set();
}

async function addExcludedProjectSlug(slug: string): Promise<void> {
  const client = getSupabaseAdmin();
  if (!client) return;
  const excluded = await getExcludedProjectSlugs();
  excluded.add(slug);
  await client.from("site_settings").upsert({
    key: EXCLUDED_SLUGS_KEY,
    value: Array.from(excluded),
    updated_at: new Date().toISOString(),
  });
}

/**
 * Sitede görünen öne çıkan 10 projeyi panele aktarır;
 * katalogdan gelen fazla projeleri siler (panel = site).
 * Panelden elle eklenen (katalog dışı) projeler korunur.
 * Daha önce silinen öne çıkanlar (excluded) tekrar eklenmez.
 */
export async function syncSiteProjectsToAdmin(): Promise<{
  imported: number;
  removed: number;
  total: number;
}> {
  const client = getSupabaseAdmin();
  if (!client) return { imported: 0, removed: 0, total: 0 };

  const excluded = await getExcludedProjectSlugs();
  const siteProjects = getStaticFeaturedProjects().filter((p) => !excluded.has(p.slug));
  const keepFeatured = new Set(siteProjects.map((p) => p.slug));
  const catalogSlugs = new Set(staticProjects.map((p) => p.slug));

  const { data: existing } = await client.from("projects").select("slug");
  const existingSlugs = (existing ?? []).map((r) => r.slug as string);
  const have = new Set(existingSlugs);

  const missing = siteProjects.filter((p) => !have.has(p.slug)).map(projectToDbRow);
  if (missing.length > 0) {
    const { error } = await client.from("projects").insert(missing);
    if (error) throw new Error(error.message);
  }

  // Katalogdaki ama sitede görünmeyen (öne çıkmayan) fazla kayıtları temizle
  const extras = existingSlugs.filter(
    (slug) => catalogSlugs.has(slug) && !keepFeatured.has(slug)
  );
  let removed = 0;
  if (extras.length > 0) {
    const { error, data } = await client.from("projects").delete().in("slug", extras).select("id");
    if (error) throw new Error(error.message);
    removed = data?.length ?? extras.length;
  }

  return { imported: missing.length, removed, total: keepFeatured.size };
}

function featuredStaticAsDb(): DbProject[] {
  const bySlug = new Map(staticProjectsAsDb().map((p) => [p.slug, p]));
  return getStaticFeaturedProjects()
    .map((p) => bySlug.get(p.slug))
    .filter((p): p is DbProject => Boolean(p));
}

/** Admin açılınca sitedeki 10 proje ile paneli eşitle. */
async function ensureSiteProjectsSynced(): Promise<void> {
  try {
    await syncSiteProjectsToAdmin();
  } catch (error) {
    console.error("Proje senkron hatası:", error instanceof Error ? error.message : error);
  }
}

export async function getAllProjectsAdmin(): Promise<DbProject[]> {
  const client = getSupabaseAdmin();
  if (!client) return featuredStaticAsDb();

  await ensureSiteProjectsSynced();

  const fromDb = await fetchAllProjectsAdmin();
  if (!fromDb || fromDb.length === 0) return featuredStaticAsDb();

  // Panelde sadece sitedeki öne çıkanlar + panelden elle eklenenler
  const featuredSlugs = new Set(getStaticFeaturedProjects().map((p) => p.slug));
  const catalogSlugs = new Set(staticProjects.map((p) => p.slug));
  return fromDb.filter((p) => featuredSlugs.has(p.slug) || !catalogSlugs.has(p.slug));
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  if (!isCmsConfigured()) return getStaticProjectBySlug(slug);

  const client = getSupabasePublic() ?? getSupabaseAdmin();
  if (!client) return getStaticProjectBySlug(slug);

  const { data } = await client.from("projects").select("*").eq("slug", slug).maybeSingle();
  if (data) return mapDbToProject(normalizeProjectRow(data as Record<string, unknown>));
  return getStaticProjectBySlug(slug);
}

export async function getProjectBySlugAdmin(slug: string): Promise<DbProject | null> {
  const client = getSupabaseAdmin();
  if (!client) return null;
  const { data } = await client.from("projects").select("*").eq("slug", slug).maybeSingle();
  if (!data) return null;
  return normalizeProjectRow(data as Record<string, unknown>);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getProjects();
  const featured = all.filter((p) => p.featured);
  if (featured.length > 0) return featured;
  if (!isCmsConfigured()) return getStaticFeaturedProjects();
  return featured;
}

export async function createProject(input: ProjectInput): Promise<DbProject | null> {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("CMS yapılandırılmamış — proje kaydedilemedi.");
  const { data, error } = await client
    .from("projects")
    .insert(mapInputToDb(input))
    .select()
    .single();
  if (error) throw new Error(error.message);
  return normalizeProjectRow(data as Record<string, unknown>);
}

export async function updateProject(slug: string, input: Partial<ProjectInput>): Promise<DbProject | null> {
  const client = getSupabaseAdmin();
  if (!client) return null;
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) payload.name = input.name;
  if (input.district !== undefined) payload.district = input.district;
  if (input.year !== undefined) payload.year = input.year;
  if (input.ref_no !== undefined) payload.ref_no = input.ref_no;
  if (input.service !== undefined) payload.service = input.service;
  if (input.service_slug !== undefined) payload.service_slug = input.service_slug;
  if (input.building_type !== undefined) payload.building_type = input.building_type;
  if (input.duration !== undefined) payload.duration = input.duration;
  if (input.featured !== undefined) payload.featured = input.featured;
  if (input.published !== undefined) payload.published = input.published;
  if (input.short_description !== undefined) payload.short_description = input.short_description;
  if (input.description !== undefined) payload.description = input.description;
  if (input.scope !== undefined) payload.scope = input.scope;
  if (input.highlights !== undefined) payload.highlights = input.highlights;
  if (input.image_url !== undefined) payload.image_url = input.image_url;
  if (input.image_fallback !== undefined) payload.image_fallback = input.image_fallback;
  if (input.image_alt !== undefined) payload.image_alt = input.image_alt;
  if (input.gallery !== undefined) payload.gallery = input.gallery;
  if (input.seo_title !== undefined) payload.seo_title = input.seo_title;
  if (input.seo_description !== undefined) payload.seo_description = input.seo_description;
  if (input.ref_id !== undefined) payload.ref_id = input.ref_id;

  const { data, error } = await client
    .from("projects")
    .update(payload)
    .eq("slug", slug)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return normalizeProjectRow(data as Record<string, unknown>);
}

export async function deleteProject(slug: string): Promise<void> {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("CMS yapılandırılmamış");

  const { data, error } = await client.from("projects").delete().eq("slug", slug).select("id");
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error("Proje bulunamadı veya zaten silinmiş.");
  }

  // Sitedeki öne çıkan listeden tekrar otomatik eklenmesin
  await addExcludedProjectSlug(slug);
}

export async function getProjectSlugs(): Promise<string[]> {
  const projects = await getProjects();
  return projects.map((p) => p.slug);
}

export { mapDbToProject, mapInputToDb };
