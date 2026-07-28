import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/site-url";

const siteUrl = getSiteUrl();

const staticPages: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/hizmetler", changeFrequency: "weekly", priority: 0.9 },
  { path: "/hakkimizda", changeFrequency: "monthly", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return staticPages.map((page) => ({
    url: `${siteUrl}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
