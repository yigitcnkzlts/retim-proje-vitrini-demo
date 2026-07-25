import {
  approachSteps as staticApproachSteps,
  buildingProblemCards as staticProblemCards,
  discoveryReport as staticDiscoveryReport,
  discoverySteps as staticDiscoverySteps,
  homeDistricts as staticHomeDistricts,
  siteConfig,
  stats as staticStats,
} from "@/data/site";
import { getSupabaseAdmin, getSupabasePublic, isCmsConfigured } from "@/lib/cms/supabase";
import type { DbHomeContent } from "@/lib/cms/types";

export type ProblemsSectionContent = {
  label: string;
  title: string;
  description: string;
  cards: Array<{ id: string; title: string; description: string }>;
};

export type DiscoverySectionContent = {
  label: string;
  title: string;
  description: string;
  steps: Array<{
    step: number;
    title: string;
    description: string;
    highlights: string[];
  }>;
  report: {
    title: string;
    subtitle: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
};

export type HomeContent = {
  heroTitle: string;
  heroDescription: string;
  stats: Array<{ value: string; label: string }>;
  discoveryLead: string;
  approachSteps: Array<{ title: string; description: string }>;
  homeDistricts: string[];
  problemsSection: ProblemsSectionContent;
  discoverySection: DiscoverySectionContent;
};

const DEFAULT_APPROACH_STEPS = staticApproachSteps.map((s) => ({
  title: s.title,
  description: s.description,
}));

export const DEFAULT_PROBLEMS_SECTION: ProblemsSectionContent = {
  label: "Binanızın Sorun Haritası",
  title: "Binanızda Bu Sorunlar Gözden Kaçmasın",
  description:
    "Cephe çatlakları, çatı akıntıları, drenaj sorunları ve yalıtım problemleri zamanla daha büyük maliyetlere yol açabilir. Retim, bu sorunları yerinde ve teknoloji destekli keşif süreciyle tespit eder.",
  cards: staticProblemCards.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
  })),
};

export const DEFAULT_DISCOVERY_SECTION: DiscoverySectionContent = {
  label: "Keşif Süreci",
  title: "Teknoloji Destekli Ücretsiz Bina Keşfi",
  description:
    "Drone, termal kamera ve yapısal test yöntemleriyle binanızı iskele kurmadan analiz ediyoruz.",
  steps: staticDiscoverySteps.map((s) => ({
    step: s.step,
    title: s.title,
    description: s.description,
    highlights: [...s.highlights],
  })),
  report: { ...staticDiscoveryReport },
};

const DEFAULT_HOME: HomeContent = {
  heroTitle: "Yüzlerce Onarılan Binada Retim İmzası",
  heroDescription: siteConfig.description,
  stats: staticStats,
  discoveryLead: "Projeniz hakkında bilgi verin, en kısa sürede size dönüş yapalım.",
  approachSteps: DEFAULT_APPROACH_STEPS,
  homeDistricts: staticHomeDistricts,
  problemsSection: DEFAULT_PROBLEMS_SECTION,
  discoverySection: DEFAULT_DISCOVERY_SECTION,
};

function mergeProblemsSection(raw: unknown): ProblemsSectionContent {
  const base = DEFAULT_PROBLEMS_SECTION;
  if (!raw || typeof raw !== "object") return base;
  const o = raw as Partial<ProblemsSectionContent>;
  const cardMap = new Map(
    (Array.isArray(o.cards) ? o.cards : []).map((c) => [c.id, c])
  );
  return {
    label: o.label?.trim() || base.label,
    title: o.title?.trim() || base.title,
    description: o.description?.trim() || base.description,
    cards: base.cards.map((card) => {
      const override = cardMap.get(card.id);
      return {
        id: card.id,
        title: override?.title?.trim() || card.title,
        description: override?.description?.trim() || card.description,
      };
    }),
  };
}

function mergeDiscoverySection(raw: unknown): DiscoverySectionContent {
  const base = DEFAULT_DISCOVERY_SECTION;
  if (!raw || typeof raw !== "object") return base;
  const o = raw as Partial<DiscoverySectionContent>;
  const stepMap = new Map(
    (Array.isArray(o.steps) ? o.steps : []).map((s) => [s.step, s])
  );
  return {
    label: o.label?.trim() || base.label,
    title: o.title?.trim() || base.title,
    description: o.description?.trim() || base.description,
    steps: base.steps.map((step) => {
      const override = stepMap.get(step.step);
      return {
        step: step.step,
        title: override?.title?.trim() || step.title,
        description: override?.description?.trim() || step.description,
        highlights:
          Array.isArray(override?.highlights) && override.highlights.length > 0
            ? override.highlights.map((h) => String(h).trim()).filter(Boolean)
            : step.highlights,
      };
    }),
    report: {
      title: o.report?.title?.trim() || base.report.title,
      subtitle: o.report?.subtitle?.trim() || base.report.subtitle,
      description: o.report?.description?.trim() || base.report.description,
      ctaLabel: o.report?.ctaLabel?.trim() || base.report.ctaLabel,
      ctaHref: o.report?.ctaHref?.trim() || base.report.ctaHref,
    },
  };
}

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
    problemsSection: mergeProblemsSection(row.problems_section),
    discoverySection: mergeDiscoverySection(row.discovery_section),
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
    problems_section: input.problemsSection,
    discovery_section: input.discoverySection,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
}

/** Statik diyagram geometrisi + CMS metinlerini birleştir */
export function mergeProblemCardsForDisplay(problems: ProblemsSectionContent) {
  const textById = new Map(problems.cards.map((c) => [c.id, c]));
  return staticProblemCards.map((card) => {
    const text = textById.get(card.id);
    return {
      ...card,
      title: text?.title || card.title,
      description: text?.description || card.description,
    };
  });
}

export function mergeDiscoveryStepsForDisplay(discovery: DiscoverySectionContent) {
  const byStep = new Map(discovery.steps.map((s) => [s.step, s]));
  return staticDiscoverySteps.map((step) => {
    const override = byStep.get(step.step);
    return {
      ...step,
      title: override?.title || step.title,
      description: override?.description || step.description,
      highlights: override?.highlights?.length ? override.highlights : step.highlights,
    };
  });
}

export { DEFAULT_HOME as defaultHomeContent };
