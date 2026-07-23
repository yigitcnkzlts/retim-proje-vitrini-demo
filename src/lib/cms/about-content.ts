import { aboutText } from "@/data/site";
import { getSupabaseAdmin, getSupabasePublic, isCmsConfigured } from "@/lib/cms/supabase";
import type { DbAboutContent } from "@/lib/cms/types";

export type AboutContent = {
  intro: string;
  experience: string;
  team: string;
  closing: string;
  founderName: string;
  founderTitle: string;
  founderImage: string;
};

const DEFAULT_ABOUT: AboutContent = {
  intro: aboutText.intro,
  experience: aboutText.experience,
  team: aboutText.team,
  closing: aboutText.closing,
  founderName: "Osman Babucci",
  founderTitle: "Kurucu",
  founderImage: "/images/retim/hakkimizda/kurumsal.jpeg",
};

function mapRow(row: DbAboutContent): AboutContent {
  return {
    intro: row.intro || DEFAULT_ABOUT.intro,
    experience: row.experience || DEFAULT_ABOUT.experience,
    team: row.team || DEFAULT_ABOUT.team,
    closing: row.closing || DEFAULT_ABOUT.closing,
    founderName: row.founder_name || DEFAULT_ABOUT.founderName,
    founderTitle: row.founder_title || DEFAULT_ABOUT.founderTitle,
    founderImage: row.founder_image || DEFAULT_ABOUT.founderImage,
  };
}

export async function getAboutContent(): Promise<AboutContent> {
  if (!isCmsConfigured()) return DEFAULT_ABOUT;

  const client = getSupabasePublic() ?? getSupabaseAdmin();
  if (!client) return DEFAULT_ABOUT;

  const { data, error } = await client.from("about_content").select("*").eq("id", 1).maybeSingle();
  if (error || !data) return DEFAULT_ABOUT;
  return mapRow(data as DbAboutContent);
}

export async function upsertAboutContent(input: AboutContent): Promise<void> {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("CMS yapılandırılmamış");

  const { error } = await client.from("about_content").upsert({
    id: 1,
    intro: input.intro,
    experience: input.experience,
    team: input.team,
    closing: input.closing,
    founder_name: input.founderName,
    founder_title: input.founderTitle,
    founder_image: input.founderImage,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
}

export { DEFAULT_ABOUT as defaultAboutContent };
