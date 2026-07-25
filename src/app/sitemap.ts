import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { getSiteUrl } from "@/lib/seo/site-url";

const siteUrl = getSiteUrl();

const staticPages: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/hizmetler", changeFrequency: "weekly", priority: 0.9 },
  { path: "/iletisim", changeFrequency: "monthly", priority: 0.6 },
  { path: "/hakkimizda", changeFrequency: "yearly", priority: 0.4 },
  { path: "/projeler", changeFrequency: "monthly", priority: 0.4 },
  { path: "/referanslar", changeFrequency: "monthly", priority: 0.35 },
  { path: "/cozum-ortaklari", changeFrequency: "yearly", priority: 0.3 },
  { path: "/bilgi-merkezi", changeFrequency: "monthly", priority: 0.35 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${siteUrl}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/projeler/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.25,
  }));

  return [...pages, ...projectPages];
}
