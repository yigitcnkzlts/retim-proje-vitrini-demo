import { approachSteps as staticApproachSteps, homeDistricts as staticHomeDistricts, siteConfig, stats as staticStats } from "@/data/site";
import { getSupabaseAdmin, getSupabasePublic, isCmsConfigured } from "@/lib/cms/supabase";
import type { DbHomeContent } from "@/lib/cms/types";

export type HomeContent = {
  heroTitle: string;
  heroDescription: string;
  stats: Array<{ value: string; label: string }>;
  discoveryLead: string;
  approachSteps: Array<{ title: string; description: string }>;
  homeDistricts: string[];
};

const DEFAULT_APPROACH_STEPS = staticApproachSteps.map((s) => ({
  title: s.title,
  description: s.description,
}));

const DEFAULT_HOME: HomeContent = {
  heroTitle: "Yüzlerce Onarılan Binada Retim İmzası",
  heroDescription: siteConfig.description,
  stats: staticStats,
  discoveryLead: "Projeniz hakkında bilgi verin, en kısa sürede size dönüş yapalım.",
  approachSteps: DEFAULT_APPROACH_STEPS,
  homeDistricts: staticHomeDistricts,
};

function mapRow(row: DbHomeContent): HomeContent {
  return {
    heroTitle: row.hero_title || DEFAULT_HOME.heroTitle,
    heroDescription: row.hero_description || DEFAULT_HOME.heroDescription,
    stats: Array.isArray(row.stats) && row.stats.length > 0 ? row.stats : DEFAULT_HOME.stats,
    discoveryLead: row.discovery_lead || DEFAULT_HOME.discoveryLead,
    approachSteps:
      Array.isArray(row.approach_steps) && row.approach_steps.length > 0
        ? row.approach_steps
        : DEFAULT_HOME.approachSteps,
    homeDistricts:
      Array.isArray(row.home_districts) && row.home_districts.length > 0
        ? row.home_districts
        : DEFAULT_HOME.homeDistricts,
  };
}

export async function getHomeContent(): Promise<HomeContent> {
  if (!isCmsConfigured()) return DEFAULT_HOME;

  const client = getSupabasePublic() ?? getSupabaseAdmin();
  if (!client) return DEFAULT_HOME;

  const { data, error } = await client.from("home_content").select("*").eq("id", 1).maybeSingle();
  if (error || !data) return DEFAULT_HOME;
  return mapRow(data as DbHomeContent);
}

export async function upsertHomeContent(input: HomeContent): Promise<void> {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("CMS yapılandırılmamış");

  const { error } = await client.from("home_content").upsert({
    id: 1,
    hero_title: input.heroTitle,
    hero_description: input.heroDescription,
    stats: input.stats,
    discovery_lead: input.discoveryLead,
    approach_steps: input.approachSteps,
    home_districts: input.homeDistricts,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
}

export { DEFAULT_HOME as defaultHomeContent };
