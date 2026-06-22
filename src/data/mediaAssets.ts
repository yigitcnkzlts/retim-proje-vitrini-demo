/**
 * Retim görsel path tanımları.
 * primary: Drive'dan gelecek gerçek görsel yolu
 * fallback: primary yoksa kullanılan placeholder
 */
export interface RetimImageSource {
  primary: string;
  fallback: string;
  alt: string;
}

const RETIM = "/images/retim";
const PLACEHOLDER = "/images/projects";

export const mediaAssets = {
  hero: {
    primary: `${RETIM}/hero-facade.jpg`,
    fallback: `${RETIM}/hero-facade.jpg`,
    alt: "Retim dış cephe uygulaması — İstanbul Boğazı tarihi bina",
  } satisfies RetimImageSource,

  logo: {
    primary: `${RETIM}/logo/retim-logo.svg`,
    fallback: `${RETIM}/logo/retim-logo.svg`,
    alt: "Retim Restorasyon logo",
  } satisfies RetimImageSource,

  logoHeader: {
    primary: `${RETIM}/logo/retim-logo-header.svg`,
    fallback: `${RETIM}/logo/retim-logo-header.svg`,
    alt: "Retim Restorasyon",
  } satisfies RetimImageSource,

  aboutField: {
    primary: `${RETIM}/dis-cephe-uygulama.jpg`,
    fallback: `${PLACEHOLDER}/mantolama.svg`,
    alt: "Retim saha dış cephe uygulama görseli",
  } satisfies RetimImageSource,

  beforeAfter: {
    before: {
      primary: `${RETIM}/before-after/oncesi-cephe.jpg`,
      fallback: `${PLACEHOLDER}/boya.svg`,
      alt: "Dış cephe uygulama öncesi görünüm",
    } satisfies RetimImageSource,
    after: {
      primary: `${RETIM}/before-after/sonrasi-cephe.jpg`,
      fallback: `${PLACEHOLDER}/restorasyon.svg`,
      alt: "Dış cephe uygulama sonrası analiz görünümü",
    } satisfies RetimImageSource,
  },

  services: {
    mantolama: {
      primary: `${RETIM}/services/mantolama.jpg`,
      fallback: `${PLACEHOLDER}/mantolama.svg`,
      alt: "Mantolama uygulama görseli",
    },
    "boya-onarim": {
      primary: `${RETIM}/services/boya-onarim.jpg`,
      fallback: `${PLACEHOLDER}/boya.svg`,
      alt: "Boya ve onarım uygulama görseli",
    },
    "cati-yalitim": {
      primary: `${RETIM}/services/cati-yalitim.jpg`,
      fallback: `${PLACEHOLDER}/cati.svg`,
      alt: "Çatı yalıtım uygulama görseli",
    },
    teras: {
      primary: `${RETIM}/services/teras.jpg`,
      fallback: `${PLACEHOLDER}/teras.svg`,
      alt: "Teras uygulama görseli",
    },
    drenaj: {
      primary: `${RETIM}/services/drenaj.jpg`,
      fallback: `${PLACEHOLDER}/site.svg`,
      alt: "Drenaj uygulama görseli",
    },
    "su-deposu": {
      primary: `${RETIM}/services/su-deposu.jpg`,
      fallback: `${PLACEHOLDER}/site.svg`,
      alt: "Su deposu yalıtım görseli",
    },
    "tarihi-bina-restorasyonu": {
      primary: `${RETIM}/services/tarihi-bina-restorasyonu.jpg`,
      fallback: `${PLACEHOLDER}/restorasyon.svg`,
      alt: "Tarihi bina restorasyon görseli",
    },
    "yapi-guclendirme": {
      primary: `${RETIM}/services/yapi-guclendirme.jpg`,
      fallback: `${PLACEHOLDER}/guclendirme.svg`,
      alt: "Yapı güçlendirme uygulama görseli",
    },
    "istinat-duvari": {
      primary: `${RETIM}/services/istinat-duvari.jpg`,
      fallback: `${PLACEHOLDER}/site.svg`,
      alt: "İstinat duvarı uygulama görseli",
    },
    "3d-modelleme": {
      primary: `${RETIM}/services/3d-modelleme.jpg`,
      fallback: `${PLACEHOLDER}/boya.svg`,
      alt: "3D modelleme görseli",
    },
    "diger-uygulamalar": {
      primary: `${RETIM}/services/diger-uygulamalar.jpg`,
      fallback: `${PLACEHOLDER}/boya.svg`,
      alt: "Diğer uygulamalar görseli",
    },
  } as Record<string, RetimImageSource>,
} as const;

/** Proje slug'ından görsel dosya adı (ref no olmadan) */
export function projectSlugToImageKey(slug: string): string {
  return slug.replace(/-\d+$/, "");
}

export function getProjectImageSource(slug: string, serviceSlug: string): RetimImageSource {
  const key = projectSlugToImageKey(slug);
  const serviceFallback =
    mediaAssets.services[serviceSlug]?.fallback ?? `${PLACEHOLDER}/boya.svg`;

  return {
    primary: `${RETIM}/projects/${key}.jpg`,
    fallback: serviceFallback,
    alt: `${key.replace(/-/g, " ")} proje uygulama görseli`,
  };
}

export function getServiceImageSource(slug: string): RetimImageSource {
  return mediaAssets.services[slug] ?? {
    primary: `${RETIM}/services/${slug}.jpg`,
    fallback: `${PLACEHOLDER}/boya.svg`,
    alt: "Hizmet uygulama görseli",
  };
}
