import type { Project } from "@/data/projects";
import {
  projects as staticProjects,
  getProjectBySlug as getStaticProjectBySlug,
  getFeaturedProjects as getStaticFeaturedProjects,
} from "@/data/projects";
import { getSupabaseAdmin, getSupabasePublic, isCmsConfigured } from "@/lib/cms/supabase";
import type { DbProject, ProjectInput } from "@/lib/cms/types";

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
  return (data as DbProject[]).map(mapDbToProject);
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
  return data as DbProject[];
}

export async function getProjects(): Promise<Project[]> {
  if (!isCmsConfigured()) return staticProjects;
  const fromDb = await fetchPublishedProjects();
  return fromDb && fromDb.length > 0 ? fromDb : staticProjects;
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
    created_at: now,
    updated_at: now,
  }));
}

/** Sitedeki statik projeleri veritabanına aktarır (boşsa). */
async function syncStaticProjectsIfEmpty(): Promise<void> {
  const client = getSupabaseAdmin();
  if (!client) return;

  const { count } = await client.from("projects").select("*", { count: "exact", head: true });
  if ((count ?? 0) > 0) return;

  const rows = staticProjects.map((p) => ({
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

  const { error } = await client.from("projects").upsert(rows, { onConflict: "slug" });
  if (error) console.error("Proje senkron hatası:", error.message);
}

export async function getAllProjectsAdmin(): Promise<DbProject[]> {
  const client = getSupabaseAdmin();
  if (!client) return staticProjectsAsDb();

  await syncStaticProjectsIfEmpty();

  const fromDb = await fetchAllProjectsAdmin();
  if (fromDb && fromDb.length > 0) return fromDb;
  return staticProjectsAsDb();
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  if (!isCmsConfigured()) return getStaticProjectBySlug(slug);

  const client = getSupabasePublic() ?? getSupabaseAdmin();
  if (!client) return getStaticProjectBySlug(slug);

  const { data } = await client.from("projects").select("*").eq("slug", slug).maybeSingle();
  if (data) return mapDbToProject(data as DbProject);
  return getStaticProjectBySlug(slug);
}

export async function getProjectBySlugAdmin(slug: string): Promise<DbProject | null> {
  const client = getSupabaseAdmin();
  if (!client) return null;
  const { data } = await client.from("projects").select("*").eq("slug", slug).maybeSingle();
  return (data as DbProject) ?? null;
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
  return data as DbProject;
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
  if (input.ref_id !== undefined) payload.ref_id = input.ref_id;

  const { data, error } = await client
    .from("projects")
    .update(payload)
    .eq("slug", slug)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as DbProject;
}

export async function deleteProject(slug: string): Promise<void> {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("CMS yapılandırılmamış");
  const { error } = await client.from("projects").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
}

export async function getProjectSlugs(): Promise<string[]> {
  const projects = await getProjects();
  return projects.map((p) => p.slug);
}

export { mapDbToProject, mapInputToDb };
