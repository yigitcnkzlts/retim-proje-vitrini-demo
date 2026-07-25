export interface Service {
  slug: string;
  name: string;
  description: string;
  projectTypes: string[];
  imageUrl?: string | null;
  imageAlt?: string;
}

export const services: Service[] = [
  {
    slug: "mantolama",
    name: "Mantolama İşlemleri",
    description:
      "Isı yalıtım levhalarının bina dış cephelerine kimyasal ve mekanik olarak kaplanıp, sıvanması ve boyanması işlemlerinin bütünüdür. FilliBoya, STO ve diğer marka mantolama paketleri ile uygulanır.",
    projectTypes: ["Apartman", "Site", "Rezidans", "Ticari Bina"],
  },
  {
    slug: "boya-onarim",
    name: "Onarım ve Boya İşlemleri",
    description:
      "Dış cephe onarım, sıva, fileli sıva ve silikon esaslı dış cephe boya uygulamaları. Polisan, FilliBoya, Baumit, Dyo ve STO marka boyaları ile uygulanır.",
    projectTypes: ["Apartman", "Villa", "Ticari Bina", "Ticari Yapı"],
  },
  {
    slug: "cati-yalitim",
    name: "Çatı Yalıtım İşlemleri",
    description:
      "Çatı onarım ve yalıtım uygulamaları ile su sızıntısı önlenir, ısı kaybı minimize edilir ve çatı ömrü uzatılır.",
    projectTypes: ["Apartman", "Site", "Ticari Bina"],
  },
  {
    slug: "drenaj",
    name: "Drenaj İşlemleri",
    description:
      "Bina çevresi ve temel drenaj sistemleri ile su birikintisi ve nem sorunlarına kalıcı çözümler getirilir.",
    projectTypes: ["Site", "Apartman", "Ticari Bina"],
  },
  {
    slug: "tarihi-bina-restorasyonu",
    name: "Tarihi Bina Restorasyonu",
    description:
      "Tarihi yapıların orijinal dokusu korunarak dış cephe restorasyon, onarım ve boya işlemleri gerçekleştirilir.",
    projectTypes: ["Tarihi Bina", "Han", "Konak"],
  },
  {
    slug: "yapi-guclendirme",
    name: "Yapı Güçlendirme İşlemleri",
    description:
      "Bina güçlendirme, zemin ve kolon güçlendirme uygulamaları ile yapısal güvenlik artırılır.",
    projectTypes: ["Apartman", "Ticari Bina", "Site"],
  },
  {
    slug: "istinat-duvari",
    name: "İstinat Duvarı",
    description:
      "Bahçe, site ve yapı çevresinde zemin hareketlerine karşı istinat duvarı imalatı ve uygulaması.",
    projectTypes: ["Site", "Apartman", "Ticari Bina"],
  },
  {
    slug: "diger-uygulamalar",
    name: "Diğer Uygulamalar",
    description:
      "İskele kurulumu, cephe temizliği, kompozit kaplama ve özel yapı uygulamaları.",
    projectTypes: ["Tüm yapı tipleri"],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
