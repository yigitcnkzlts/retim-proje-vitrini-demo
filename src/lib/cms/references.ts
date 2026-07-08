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

async function fetchRefs(type?: RefType): Promise<DbProjectRef[] | null> {
  const client = getSupabasePublic() ?? getSupabaseAdmin();
  if (!client) return null;

  let query = client.from("project_refs").select("*").order("year", { ascending: false });
  if (type) query = query.eq("ref_type", type);

  const { data, error } = await query;
  if (error || !data) return null;
  return data as DbProjectRef[];
}

export async function getCatalogReferences(): Promise<Reference[]> {
  if (!isCmsConfigured()) return staticCatalogRefs();
  const rows = await fetchRefs("catalog");
  return rows && rows.length > 0 ? rows.map(mapDbToReference) : staticCatalogRefs();
}

export async function getArchiveReferences(): Promise<Reference[]> {
  if (!isCmsConfigured()) return referencesArchive;
  const rows = await fetchRefs("archive");
  return rows && rows.length > 0 ? rows.map(mapDbToReference) : referencesArchive;
}

export async function getAllRefsAdmin(type?: RefType): Promise<DbProjectRef[]> {
  const client = getSupabaseAdmin();
  if (!client) return [];
  let query = client.from("project_refs").select("*").order("year", { ascending: false });
  if (type) query = query.eq("ref_type", type);
  const { data } = await query;
  return (data as DbProjectRef[]) ?? [];
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
  const { error } = await client.from("project_refs").delete().eq("id", id);
  if (error) throw new Error(error.message);
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
