export interface Service {
  slug: string;
  name: string;
  description: string;
  projectTypes: string[];
}

export const services: Service[] = [
  {
    slug: "mantolama",
    name: "Mantolama işlemleri",
    description:
      "Isı yalıtım levhalarının bina dış cephelerine kimyasal ve mekanik olarak kaplanıp, sıvanması ve boyanması işlemlerinin bütünüdür. FilliBoya, STO ve diğer marka mantolama paketleri ile uygulanır.",
    projectTypes: ["Apartman", "Site", "Rezidans", "Ticari Bina"],
  },
  {
    slug: "boya-onarim",
    name: "Onarım ve boya işlemleri",
    description:
      "Dış cephe onarım, sıva, fileli sıva ve silikon esaslı dış cephe boya uygulamaları. Polisan, FilliBoya, Baumit, Dyo ve STO marka boyaları ile uygulanır.",
    projectTypes: ["Apartman", "Villa", "Ticari Bina", "Tarihi Bina"],
  },
  {
    slug: "cati-yalitim",
    name: "Çatı Yalıtım İşlemleri",
    description:
      "Çatı onarım ve yalıtım uygulamaları ile su sızıntısı önlenir, ısı kaybı minimize edilir ve çatı ömrü uzatılır.",
    projectTypes: ["Apartman", "Site", "Ticari Bina"],
  },
  {
    slug: "teras",
    name: "Teras işlemleri",
    description:
      "Teras söküm, onarım ve yalıtım uygulamaları ile teras alanlarında su ve ısı yalıtımı sağlanır.",
    projectTypes: ["Apartman", "Rezidans", "Site"],
  },
  {
    slug: "drenaj",
    name: "Drenaj işlemleri",
    description:
      "Bina çevresi ve temel drenaj sistemleri ile su birikintisi ve nem sorunlarına kalıcı çözümler getirilir.",
    projectTypes: ["Site", "Apartman", "Ticari Bina"],
  },
  {
    slug: "su-deposu",
    name: "Su Deposu işlemleri",
    description:
      "Su deposu yalıtım ve onarım uygulamaları ile depo alanlarında su sızıntısı ve korozyon sorunları giderilir.",
    projectTypes: ["Apartman", "Site", "Ticari Bina"],
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
    projectTypes: ["Apartman", "Ticari Bina", "Tarihi Bina"],
  },
  {
    slug: "insaat-taahhut",
    name: "İnşaat Taahhüt",
    description:
      "Kapsamlı inşaat ve yenileme projelerinin anahtar teslim uygulaması.",
    projectTypes: ["Site", "Ticari Bina", "Rezidans"],
  },
  {
    slug: "3d-modelleme",
    name: "3D Modelleme",
    description:
      "Proje öncesi 3D görselleştirme ile uygulama sonucu önceden görülebilir.",
    projectTypes: ["Apartman", "Site", "Ticari Bina"],
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
