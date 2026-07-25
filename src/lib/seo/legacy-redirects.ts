/**
 * Eski WordPress tarzı numaralı hizmet/proje URL'leri → güncel Next.js rotaları.
 * Google'da hâlâ görünen 404'ler için 301 permanent redirect.
 */
export type LegacyRedirect = {
  source: string;
  destination: string;
  statusCode: 301;
};

const SERVICE_ALIASES: Record<string, string> = {
  // Mantolama
  "1-mantolama": "/hizmetler/mantolama",
  "1-mantolama-islemleri": "/hizmetler/mantolama",
  // Onarım / boya
  "2-onarim-ve-boya": "/hizmetler/boya-onarim",
  "2-boya": "/hizmetler/boya-onarim",
  "3-onarim-ve-boya-islemleri": "/hizmetler/boya-onarim",
  "3-dis-cephe-boya": "/hizmetler/boya-onarim",
  "onarim-ve-boya-islemleri": "/hizmetler/boya-onarim",
  "dis-cephe-boya": "/hizmetler/boya-onarim",
  // Çatı / teras
  "3-cati": "/hizmetler/cati-yalitim",
  "3-cati-yalitim": "/hizmetler/cati-yalitim",
  "2-cati-yalitim-islemleri": "/hizmetler/cati-yalitim",
  "cati-yalitim-islemleri": "/hizmetler/cati-yalitim",
  "45-teras-islemleri": "/hizmetler/cati-yalitim",
  "teras-islemleri": "/hizmetler/cati-yalitim",
  "cati-aktarma": "/hizmetler/cati-yalitim",
  // Drenaj
  "4-drenaj": "/hizmetler/drenaj",
  "4-drenaj-islemleri": "/hizmetler/drenaj",
  "drenaj-islemleri": "/hizmetler/drenaj",
  // Tarihi bina (eski numaralı → güncel slug sayfası)
  "5-tarihi-bina-restorasyonu": "/hizmetler/tarihi-bina-restorasyonu",
  "tarihi-bina-restorasyonu-islemleri": "/hizmetler/tarihi-bina-restorasyonu",
  // Güçlendirme
  "6-yapi-guclendirme": "/hizmetler/yapi-guclendirme",
  "yapi-guclendirme-islemleri": "/hizmetler/yapi-guclendirme",
  // İstinat
  "7-istinat-duvari": "/hizmetler/istinat-duvari",
  // İnşaat taahhüt / genel (karşılık yok → hub)
  "8-insaat-taahhut": "/hizmetler",
  "insaat-taahhut": "/hizmetler",
  // Diğer
  "9-diger": "/hizmetler/diger-uygulamalar",
  "9-diger-uygulamalar": "/hizmetler/diger-uygulamalar",
  "su-deposu-yalitimi": "/hizmetler/cati-yalitim",
};

/** Güncel slug'larla aynı olan alias'ları redirect listesine alma (loop yok). */
const CURRENT_SERVICE_SLUGS = new Set([
  "mantolama",
  "boya-onarim",
  "cati-yalitim",
  "drenaj",
  "tarihi-bina-restorasyonu",
  "yapi-guclendirme",
  "istinat-duvari",
  "diger-uygulamalar",
]);

function withOptionalTrailingSlash(source: string): string[] {
  const base = source.replace(/\/$/, "");
  return [base, `${base}/`];
}

export function getLegacyRedirects(): LegacyRedirect[] {
  const redirects: LegacyRedirect[] = [];

  for (const [alias, destination] of Object.entries(SERVICE_ALIASES)) {
    if (CURRENT_SERVICE_SLUGS.has(alias)) continue;
    if (`/hizmetler/${alias}` === destination) continue;

    for (const source of withOptionalTrailingSlash(`/hizmetler/${alias}`)) {
      redirects.push({ source, destination, statusCode: 301 });
    }
  }

  // Bilinmeyen eski numaralı hizmet URL'leri → hub (spesifik eşleşmeler yukarıda öncelikli)
  redirects.push(
    {
      source: "/hizmetler/:legacy(\\d+-[\\w.-]+)",
      destination: "/hizmetler",
      statusCode: 301,
    },
    {
      source: "/hizmetler/:legacy(\\d+-[\\w.-]+)/",
      destination: "/hizmetler",
      statusCode: 301,
    },
    // Eski numaralı proje detayları
    {
      source: "/projeler/:legacy(\\d+-[\\w.-]+)",
      destination: "/projeler",
      statusCode: 301,
    },
    {
      source: "/projeler/:legacy(\\d+-[\\w.-]+)/",
      destination: "/projeler",
      statusCode: 301,
    }
  );

  return redirects;
}
