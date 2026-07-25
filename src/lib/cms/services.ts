import { services as staticServices, type Service } from "@/data/services";
import { getSupabaseAdmin, getSupabasePublic, isCmsConfigured } from "@/lib/cms/supabase";
import type { DbService } from "@/lib/cms/types";

function mapDbToService(row: DbService): Service {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    projectTypes: Array.isArray(row.project_types) ? row.project_types : [],
    imageUrl: row.image_url || null,
    imageAlt: row.image_alt || "",
  };
}

function normalizeRow(row: Record<string, unknown>): DbService {
  return {
    ...(row as unknown as DbService),
    project_types: Array.isArray(row.project_types)
      ? (row.project_types as string[])
      : [],
  };
}

export async function getServices(): Promise<Service[]> {
  if (!isCmsConfigured()) return staticServices;

  const client = getSupabasePublic() ?? getSupabaseAdmin();
  if (!client) return staticServices;

  const { data, error } = await client
    .from("services")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return staticServices;
  return (data as Record<string, unknown>[]).map((r) => mapDbToService(normalizeRow(r)));
}

export async function getServiceBySlugCms(slug: string): Promise<Service | undefined> {
  const all = await getServices();
  return all.find((s) => s.slug === slug);
}

async function syncStaticServicesIfEmpty(): Promise<void> {
  const client = getSupabaseAdmin();
  if (!client) return;
  const { count } = await client.from("services").select("*", { count: "exact", head: true });
  if ((count ?? 0) > 0) return;

  const rows = staticServices.map((s, i) => ({
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
  const { error } = await client.from("services").upsert(rows, { onConflict: "slug" });
  if (error) console.error("Hizmet senkron hatası:", error.message);
}

export async function getAllServicesAdmin(): Promise<DbService[]> {
  const client = getSupabaseAdmin();
  if (!client) {
    return staticServices.map((s, i) => ({
      id: `static-${s.slug}`,
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  }

  await syncStaticServicesIfEmpty();
  const { data } = await client.from("services").select("*").order("sort_order", { ascending: true });
  return ((data as Record<string, unknown>[]) ?? []).map(normalizeRow);
}

export type ServiceInput = {
  slug: string;
  name: string;
  description: string;
  detail?: string;
  image_url?: string | null;
  image_alt?: string;
  project_types?: string[];
  sort_order?: number;
  active?: boolean;
  featured?: boolean;
  seo_title?: string;
  seo_description?: string;
};

export async function createService(input: ServiceInput): Promise<DbService | null> {
  const client = getSupabaseAdmin();
  if (!client) return null;
  const { data, error } = await client
    .from("services")
    .insert({
      slug: input.slug,
      name: input.name,
      description: input.description,
      detail: input.detail ?? "",
      image_url: input.image_url ?? null,
      image_alt: input.image_alt ?? "",
      project_types: input.project_types ?? [],
      sort_order: input.sort_order ?? 0,
      active: input.active ?? true,
      featured: input.featured ?? false,
      seo_title: input.seo_title ?? "",
      seo_description: input.seo_description ?? "",
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return normalizeRow(data as Record<string, unknown>);
}

export async function updateService(
  id: string,
  input: Partial<ServiceInput>
): Promise<DbService | null> {
  const client = getSupabaseAdmin();
  if (!client) return null;
  const { data, error } = await client
    .from("services")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return normalizeRow(data as Record<string, unknown>);
}

export async function deleteService(id: string): Promise<void> {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("CMS yapılandırılmamış");
  const { error } = await client.from("services").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
