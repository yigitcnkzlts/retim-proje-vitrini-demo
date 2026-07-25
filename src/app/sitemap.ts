import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { FEATURED_SERVICE_SLUGS } from "@/lib/seo/featured-services";
import { getSiteUrl } from "@/lib/seo/site-url";

const siteUrl = getSiteUrl();

const staticPages: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/hizmetler", changeFrequency: "weekly", priority: 0.95 },
  { path: "/iletisim", changeFrequency: "monthly", priority: 0.55 },
  { path: "/hakkimizda", changeFrequency: "yearly", priority: 0.3 },
  { path: "/projeler", changeFrequency: "monthly", priority: 0.3 },
  { path: "/referanslar", changeFrequency: "monthly", priority: 0.25 },
  { path: "/cozum-ortaklari", changeFrequency: "yearly", priority: 0.2 },
  { path: "/bilgi-merkezi", changeFrequency: "monthly", priority: 0.25 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${siteUrl}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const servicePages: MetadataRoute.Sitemap = FEATURED_SERVICE_SLUGS.map((slug) => ({
    url: `${siteUrl}/hizmetler/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/projeler/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.15,
  }));

  return [...pages, ...servicePages, ...projectPages];
}
