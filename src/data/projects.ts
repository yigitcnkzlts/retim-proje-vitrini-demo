import { references2024, references2023, type Reference } from "./references";
import {
  createSlug,
  formatDistrict,
  formatProjectName,
  getProjectImage,
  getServiceSlugFromText,
  featuredSlugs,
  slugAliases,
} from "./images";

export interface Project {
  slug: string;
  name: string;
  district: string;
  year: number;
  refNo: string;
  service: string;
  serviceSlug: string;
  buildingType: string;
  duration: string;
  featured: boolean;
  shortDescription: string;
  description: string;
  scope: string[];
  highlights: string[];
  image: string;
}

function buildingTypeFromName(name: string): string {
  const n = name.toUpperCase();
  if (n.includes("SİTESİ") || n.includes("SİT.")) return "Site";
  if (n.includes("HAN")) return "Tarihi Han";
  if (n.includes("İNŞ")) return "Ticari Bina";
  return "Apartman";
}

function projectFromReference(ref: Reference): Project {
  const slug = createSlug(ref.projectName, ref.refNo);
  const name = formatProjectName(ref.projectName);
  const district = formatDistrict(ref.district);
  const serviceSlug = getServiceSlugFromText(ref.service);
  const featured = featuredSlugs.has(slug);

  return {
    slug,
    name,
    district,
    year: ref.year,
    refNo: ref.refNo,
    service: ref.service,
    serviceSlug,
    buildingType: buildingTypeFromName(ref.projectName),
    duration: "—",
    featured,
    shortDescription: `${district} — ${ref.service}`,
    description: `${name} projesinde ${district} bölgesinde ${ref.service.toLowerCase()} uygulaması Retim tarafından tamamlanmıştır. Referans No: ${ref.refNo}`,
    scope: [
      "Keşif ve mevcut durum analizi",
      ref.service,
      "Kontrollü saha uygulaması",
      "Teslim ve kontrol süreci",
    ],
    highlights: [
      "Retim referans projesi",
      `${ref.year} yılı uygulaması`,
      `${district} bölgesi`,
    ],
    image: getProjectImage(serviceSlug),
  };
}

const catalogRefs: Reference[] = [...references2024, ...references2023];

export const projects: Project[] = catalogRefs.map(projectFromReference);

export function resolveSlug(slug: string): string {
  return slugAliases[slug] || slug;
}

export function getProjectBySlug(slug: string): Project | undefined {
  const resolved = resolveSlug(slug);
  return projects.find((p) => p.slug === resolved || p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getProjectsByService(serviceSlug: string): Project[] {
  return projects.filter((p) => p.serviceSlug === serviceSlug);
}

export function getProjectsByDistrict(district: string): Project[] {
  const q = district.toLowerCase();
  return projects.filter((p) => p.district.toLowerCase().includes(q));
}

export const districts = Array.from(
  new Set(projects.map((p) => p.district))
).sort((a, b) => a.localeCompare(b, "tr"));

export const serviceCategories = [
  {
    slug: "mantolama",
    name: "Mantolama işlemleri",
    description:
      "Isı yalıtım levhalarının bina dış cephelerine kimyasal ve mekanik olarak kaplanıp sıvanması ve boyanması.",
  },
  {
    slug: "boya-onarim",
    name: "Onarım ve boya işlemleri",
    description: "Dış cephe onarım, fileli sıva ve silikon esaslı dış cephe boya uygulamaları.",
  },
  {
    slug: "cati-yalitim",
    name: "Çatı Yalıtım İşlemleri",
    description: "Çatı onarım ve yalıtım uygulamaları ile su sızıntısı ve ısı kaybına çözüm.",
  },
  {
    slug: "teras",
    name: "Teras işlemleri",
    description: "Teras söküm, onarım ve yalıtım uygulamaları.",
  },
  {
    slug: "drenaj",
    name: "Drenaj işlemleri",
    description: "Bina çevresi ve temel drenaj sistemleri ile kalıcı çözümler.",
  },
  {
    slug: "tarihi-bina-restorasyonu",
    name: "Tarihi Bina Restorasyonu",
    description: "Tarihi yapıların korunarak dış cephe restorasyon ve onarım işlemleri.",
  },
  {
    slug: "yapi-guclendirme",
    name: "Yapı Güçlendirme İşlemleri",
    description: "Bina güçlendirme ve zemin-kolon güçlendirme uygulamaları.",
  },
  {
    slug: "insaat-taahhut",
    name: "İnşaat Taahhüt",
    description: "Kapsamlı inşaat ve yenileme projelerinin anahtar teslim uygulaması.",
  },
];
