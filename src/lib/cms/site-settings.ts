import { siteConfig } from "@/data/site";
import { getSupabaseAdmin, getSupabasePublic, isCmsConfigured } from "@/lib/cms/supabase";

export type SiteSettingsMap = {
  phone: string;
  officePhone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
};

const DEFAULT_SETTINGS: SiteSettingsMap = {
  phone: siteConfig.phone,
  officePhone: siteConfig.officePhone,
  whatsapp: siteConfig.whatsapp,
  email: siteConfig.email,
  address: siteConfig.address,
  workingHours: siteConfig.workingHours,
};

export async function getSiteSettings(): Promise<SiteSettingsMap> {
  if (!isCmsConfigured()) return DEFAULT_SETTINGS;

  const client = getSupabasePublic() ?? getSupabaseAdmin();
  if (!client) return DEFAULT_SETTINGS;

  const { data } = await client.from("site_settings").select("key, value");
  if (!data || data.length === 0) return DEFAULT_SETTINGS;

  const merged = { ...DEFAULT_SETTINGS };
  for (const row of data as { key: string; value: unknown }[]) {
    if (row.key in merged && typeof row.value === "string") {
      merged[row.key as keyof SiteSettingsMap] = row.value;
    }
  }
  return merged;
}

export async function updateSiteSettings(settings: Partial<SiteSettingsMap>): Promise<void> {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("CMS yapılandırılmamış");

  const rows = Object.entries(settings).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await client.from("site_settings").upsert(rows);
  if (error) throw new Error(error.message);
}
