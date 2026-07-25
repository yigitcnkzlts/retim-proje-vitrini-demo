import { partners as staticPartners, type Partner } from "@/data/partners";
import { getSupabaseAdmin, getSupabasePublic, isCmsConfigured } from "@/lib/cms/supabase";
import type { DbPartner } from "@/lib/cms/types";

const EXCLUDED_PARTNERS_KEY = "excluded_partner_names";

function mapDbToPartner(row: DbPartner): Partner {
  return { name: row.name, logo: row.logo_url };
}

function staticPartnersAsDb(): DbPartner[] {
  const now = new Date().toISOString();
  return staticPartners.map((p, i) => ({
    id: `static-partner-${i}`,
    name: p.name,
    logo_url: p.logo,
    sort_order: i,
    active: true,
    created_at: now,
    updated_at: now,
  }));
}

async function getExcludedPartnerNames(): Promise<Set<string>> {
  const client = getSupabaseAdmin();
  if (!client) return new Set();
  const { data } = await client
    .from("site_settings")
    .select("value")
    .eq("key", EXCLUDED_PARTNERS_KEY)
    .maybeSingle();
  const value = data?.value;
  if (Array.isArray(value)) return new Set(value.map(String));
  return new Set();
}

async function addExcludedPartnerName(name: string): Promise<void> {
  const client = getSupabaseAdmin();
  if (!client) return;
  const excluded = await getExcludedPartnerNames();
  excluded.add(name);
  await client.from("site_settings").upsert({
    key: EXCLUDED_PARTNERS_KEY,
    value: Array.from(excluded),
    updated_at: new Date().toISOString(),
  });
}

/**
 * Sitedeki çözüm ortaklarını panele aktarır (eksik olanlar).
 * Silinenler (excluded) tekrar eklenmez.
 */
export async function syncSitePartnersToAdmin(): Promise<{
  imported: number;
  total: number;
}> {
  const client = getSupabaseAdmin();
  if (!client) return { imported: 0, total: 0 };

  const excluded = await getExcludedPartnerNames();
  const source = staticPartners.filter((p) => !excluded.has(p.name));

  const { data: existing, error: readError } = await client.from("partners").select("name");
  if (readError) throw new Error(readError.message);

  const have = new Set((existing ?? []).map((r) => r.name as string));
  const missing = source
    .filter((p) => !have.has(p.name))
    .map((p, i) => ({
      name: p.name,
      logo_url: p.logo,
      sort_order: i,
      active: true,
    }));

  if (missing.length > 0) {
    const { error } = await client.from("partners").insert(missing);
    if (error) throw new Error(error.message);
  }

  return { imported: missing.length, total: source.length };
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
  const siteRows = staticPartnersAsDb();
  const client = getSupabaseAdmin();
  if (!client) return siteRows;

  let excluded = new Set<string>();
  try {
    excluded = await getExcludedPartnerNames();
  } catch {
    /* site_settings yoksa devam */
  }

  let visibleSite = siteRows.filter((p) => !excluded.has(p.name));
  if (visibleSite.length === 0) visibleSite = siteRows;

  try {
    const { data, error } = await client
      .from("partners")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return visibleSite;

    const dbRows = (data as DbPartner[]).filter((p) => !excluded.has(p.name));
    const byName = new Map(dbRows.map((r) => [r.name, r]));
    const merged = visibleSite.map((r) => byName.get(r.name) ?? r);

    const siteNames = new Set(visibleSite.map((r) => r.name));
    for (const row of dbRows) {
      if (!siteNames.has(row.name)) merged.push(row);
    }
    return merged.sort((a, b) => a.sort_order - b.sort_order);
  } catch {
    return visibleSite;
  }
}

/** Güvenli admin listesi — hata olsa bile sitedeki markalar döner */
export async function getAllPartnersAdminSafe(): Promise<DbPartner[]> {
  try {
    const rows = await getAllPartnersAdmin();
    return rows.length > 0 ? rows : staticPartnersAsDb();
  } catch {
    return staticPartnersAsDb();
  }
}

export function getSitePartnerCount(): number {
  return staticPartners.length;
}

export async function createPartner(input: {
  name: string;
  logo_url: string;
  sort_order?: number;
  active?: boolean;
}): Promise<DbPartner | null> {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("CMS yapılandırılmamış");
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
  if (!client) throw new Error("CMS yapılandırılmamış");
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

  const { data: existing } = await client
    .from("partners")
    .select("name")
    .eq("id", id)
    .maybeSingle();

  const { error } = await client.from("partners").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (existing?.name) {
    await addExcludedPartnerName(existing.name as string);
  }
}
