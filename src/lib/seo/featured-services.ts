/** Google sitelink odaklı öne çıkarılacak hizmet alt sayfaları */
export const FEATURED_SERVICE_SLUGS = [
  "mantolama",
  "cati-yalitim",
  "boya-onarim",
  "drenaj",
  "yapi-guclendirme",
  "istinat-duvari",
  "diger-uygulamalar",
] as const;

/** Sitelink rekabetini azaltmak için ana sayfa / sitemap'te öne çıkarılmayan hizmetler */
export const DEEMPHASIZED_SERVICE_SLUGS = ["tarihi-bina-restorasyonu"] as const;

export type FeaturedServiceSlug = (typeof FEATURED_SERVICE_SLUGS)[number];

export function isFeaturedServiceSlug(slug: string): boolean {
  return (FEATURED_SERVICE_SLUGS as readonly string[]).includes(slug);
}

export function isDeemphasizedServiceSlug(slug: string): boolean {
  return (DEEMPHASIZED_SERVICE_SLUGS as readonly string[]).includes(slug);
}

export function servicePagePath(slug: string): string {
  return `/hizmetler/${slug}`;
}

export function getFeaturedServices<T extends { slug: string }>(services: T[]): T[] {
  const order = new Map<string, number>(FEATURED_SERVICE_SLUGS.map((s, i) => [s, i]));
  return services
    .filter((s) => isFeaturedServiceSlug(s.slug))
    .sort((a, b) => (order.get(a.slug) ?? 99) - (order.get(b.slug) ?? 99));
}
