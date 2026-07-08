import { partners as staticPartners, type Partner } from "@/data/partners";
import { getSupabaseAdmin, getSupabasePublic, isCmsConfigured } from "@/lib/cms/supabase";
import type { DbPartner } from "@/lib/cms/types";

function mapDbToPartner(row: DbPartner): Partner {
  return { name: row.name, logo: row.logo_url };
}

export async function getPartners(): Promise<Partner[]> {
  if (!isCmsConfigured()) return staticPartners;

  const client = getSupabasePublic() ?? getSupabaseAdmin();
  if (!client) return staticPartners;

  const { data, error } = await client
    .from("partners")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return staticPartners;
  return (data as DbPartner[]).map(mapDbToPartner);
}

export async function getAllPartnersAdmin(): Promise<DbPartner[]> {
  const client = getSupabaseAdmin();
  if (!client) return [];
  const { data } = await client
    .from("partners")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data as DbPartner[]) ?? [];
}

export async function createPartner(input: {
  name: string;
  logo_url: string;
  sort_order?: number;
  active?: boolean;
}): Promise<DbPartner | null> {
  const client = getSupabaseAdmin();
  if (!client) return null;
  const { data, error } = await client
    .from("partners")
    .insert({
      name: input.name,
      logo_url: input.logo_url,
      sort_order: input.sort_order ?? 0,
      active: input.active ?? true,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as DbPartner;
}

export async function updatePartner(
  id: string,
  input: Partial<{ name: string; logo_url: string; sort_order: number; active: boolean }>
): Promise<DbPartner | null> {
  const client = getSupabaseAdmin();
  if (!client) return null;
  const { data, error } = await client
    .from("partners")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as DbPartner;
}

export async function deletePartner(id: string): Promise<void> {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("CMS yapılandırılmamış");
  const { error } = await client.from("partners").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
