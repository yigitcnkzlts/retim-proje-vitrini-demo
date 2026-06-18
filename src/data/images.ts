import type { RetimImageSource } from "@/data/mediaAssets";
import { mediaAssets } from "@/data/mediaAssets";

/** @deprecated Yerine mediaAssets kullanın */
export const projectImages = {
  hero: mediaAssets.hero.primary,
  logo: mediaAssets.logo.primary,
  mantolama: mediaAssets.services.mantolama.fallback,
  boya: mediaAssets.services["boya-onarim"].fallback,
  cati: mediaAssets.services["cati-yalitim"].fallback,
  restorasyon: mediaAssets.services["tarihi-bina-restorasyonu"].fallback,
  guclendirme: mediaAssets.services["yapi-guclendirme"].fallback,
  teras: mediaAssets.services.teras.fallback,
  site: mediaAssets.services.drenaj.fallback,
  insaat: mediaAssets.services["istinat-duvari"].fallback,
  diger: mediaAssets.services["diger-uygulamalar"].fallback,
} as const;

const serviceImageMap: Record<string, string> = {
  mantolama: projectImages.mantolama,
  "boya-onarim": projectImages.boya,
  "cati-yalitim": projectImages.cati,
  "tarihi-bina-restorasyonu": projectImages.restorasyon,
  "yapi-guclendirme": projectImages.guclendirme,
  teras: projectImages.teras,
  drenaj: projectImages.site,
  "su-deposu": projectImages.site,
  "istinat-duvari": projectImages.insaat,
  "3d-modelleme": projectImages.diger,
  "diger-uygulamalar": projectImages.diger,
};

export function getServiceHeroImage(slug: string): string {
  return mediaAssets.services[slug]?.primary ?? mediaAssets.hero.primary;
}

export function getServiceHeroImageSource(slug: string): RetimImageSource {
  return mediaAssets.services[slug] ?? mediaAssets.services["boya-onarim"];
}

export function getServiceSlugFromText(service: string): string {
  const s = service.toUpperCase();
  if (s.includes("MANTOLAMA")) return "mantolama";
  if (s.includes("GÜÇLENDİRME") || s.includes("GÜÇLENDİRME")) return "yapi-guclendirme";
  if (s.includes("RESTORASYON") || s.includes("AHŞAP")) return "tarihi-bina-restorasyonu";
  if (s.includes("TERAS")) return "teras";
  if (s.includes("ÇATI")) return "cati-yalitim";
  if (s.includes("DRENaj") || s.includes("DRENAJ")) return "drenaj";
  if (s.includes("İSTİNAT") || s.includes("ISTINAT")) return "istinat-duvari";
  if (s.includes("İNŞAATI") || s.includes("TAŞ BİNA")) return "istinat-duvari";
  if (s.includes("KOMPOZİT")) return "diger-uygulamalar";
  if (s.includes("ZEMİN") || s.includes("BAHÇE")) return "drenaj";
  return "boya-onarim";
}

export function getProjectImage(serviceSlug: string): string {
  return serviceImageMap[serviceSlug] || projectImages.boya;
}

export function formatDistrict(district: string): string {
  const normalized = district.replace("4.LEVENT", "4. Levent");
  return normalized
    .toLocaleLowerCase("tr-TR")
    .split(" ")
    .map((w) => w.charAt(0).toLocaleUpperCase("tr-TR") + w.slice(1))
    .join(" ");
}

export function formatProjectName(name: string): string {
  const lower = name.toLocaleLowerCase("tr-TR");
  return lower
    .split(" ")
    .map((word) => {
      if (word.length === 0) return word;
      return word.charAt(0).toLocaleUpperCase("tr-TR") + word.slice(1);
    })
    .join(" ");
}

export function createSlug(name: string, refNo: string): string {
  const base = name
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${base}-${refNo}`;
}

export const featuredSlugs = new Set([
  "rusen-unsal-binasi-2282",
  "ocak-apt-2283",
  "kantarcioglu-apt-2280",
  "modern-apt-2284",
  "mithat-tekstil-binasi-2281",
]);

export const slugAliases: Record<string, string> = {
  "rusen-unsal-binasi": "rusen-unsal-binasi-2282",
  "ocak-apt": "ocak-apt-2283",
  "kantarcioglu-apt": "kantarcioglu-apt-2280",
  "modern-apt": "modern-apt-2284",
  "mithat-tekstil-binasi": "mithat-tekstil-binasi-2281",
  "kaya-alp-apt": "kaya-alp-apt-2335",
  "iletisim-sark-han": "iletisim-sark-han-2353",
  "mesa-kemerburgaz-sitesi": "mesa-kemerburgaz-sitesi-2366",
  "defne-apt": "defne-apt-2376",
  "pirelli-apt": "pirelli-apt-2340",
  "asmalimescit-no-28": "asmalimescit-no-28-2359",
  "istanbloom": "istanbloom-2369",
};
