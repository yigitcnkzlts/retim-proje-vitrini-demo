export const siteConfig = {
  name: "Retim",
  legalName: "Retim Restorasyon Madencilik Sanayii ve Ticaret Ltd. Şti.",
  title: "Mantolama, Dış Cephe Boya, Drenaj, Su Deposu Yalıtımı",
  description:
    "Binaların dış-iç cephe onarımı, yalıtımı, boyası, sıva kaplama, restorasyonu ile çatı, teras ve bina zeminlerinin su ve ısı yalıtımı alanlarında kesin çözümler.",
  phone: "(0212) 212 45 40",
  email: "retim@retim.com.tr",
  addressLine1: "Aytekin Kotil Cad. No:39/B",
  addressLine2: "Mecidiyeköy / İSTANBUL",
  address: "Aytekin Kotil Cad. No:39/B Mecidiyeköy / İSTANBUL",
  workingHours: "Pzt - Cmt 8.00 - 18.00",
  workingHoursClosed: "Pazar Kapalı",
  founded: "27 Kasım 1989",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Aytekin+Kotil+Cad.+No%3A39%2FB+Mecidiyek%C3%B6y+%C4%B0stanbul",
};

export const navigation = [
  { name: "Ana Sayfa", href: "/" },
  { name: "Kurumsal", href: "/hakkimizda" },
  { name: "Hizmetler", href: "/hizmetler", hasDropdown: true },
  { name: "Projeler", href: "/projeler" },
  { name: "Referanslar", href: "/referanslar" },
  { name: "Çözüm Ortakları", href: "/cozum-ortaklari" },
  { name: "İletişim", href: "/iletisim" },
];

export const footerLinks = [
  { name: "Ana Sayfa", href: "/" },
  { name: "Hakkımızda", href: "/hakkimizda" },
  { name: "Projeler", href: "/projeler" },
  { name: "Referanslar", href: "/referanslar" },
  { name: "Çözüm Ortakları", href: "/cozum-ortaklari" },
  { name: "İletişim", href: "/iletisim" },
];

export const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/retim",
    icon: "linkedin",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/retim",
    icon: "instagram",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/retim",
    icon: "facebook",
  },
];

export const lastFiveProjects = [
  { name: "RUŞEN ÜNSAL BİNASI", district: "ZİNCİRLİKUYU", slug: "rusen-unsal-binasi" },
  { name: "OCAK APT.", district: "OSMANBEY", slug: "ocak-apt" },
  { name: "KANTARCIOĞLU APT.", district: "BEŞİKTAŞ", slug: "kantarcioglu-apt" },
  { name: "MODERN APT.", district: "TEŞVİKİYE", slug: "modern-apt" },
  { name: "MİTHAT TEKSTİL BİNASI", district: "BOMONTİ", slug: "mithat-tekstil-binasi" },
];

export const stats = [
  { value: "2000+", label: "Tamamlanan Bina" },
  { value: "35+", label: "Yıllık Deneyim" },
  { value: "1989", label: "Kuruluş Yılı" },
  { value: "100+", label: "Teknik Kadro" },
  { value: "İstanbul", label: "Geneli Uygulama" },
];

export const aboutText = {
  intro:
    "Retim Restorasyon Madencilik Sanayii ve Ticaret Ltd. Şti. 27 Kasım 1989 yılında, binaların dış - iç cephe onarımı, yalıtımı, boyası, sıva kaplama işlemleri, dış cephe temizlik ve restorasyonu ile çatı, teras ve bina zeminlerinin su ve ısı yalıtımları gibi sorunlarına kesin çözümler getirmek amacıyla kurulmuştur.",
  experience:
    "Sektördeki 32 yıllık deneyimiyle, kuruluşundan bugüne, kalite ve güvenilirliğini, hizmetini sunduğu 2000'i aşkın bina ile kanıtlamış ve sektörün öncü kuruluşu olmuştur.",
  team:
    "Bünyesindeki 2 İnşaat Mühendisi, 1 Jeoloji Mühendisi, Mimar ve 100'ü aşkın tecrübeli teknik servis eleman kadrosu ile sahip olduğu malzeme ve makine parkı sayesinde, üstlendiği projeleri en iyi işçilik ve en kaliteli malzemeler ile en kısa sürede tamamlamıştır.",
  closing:
    "Bugün olduğu gibi, gelecekte de müşteri memnuniyetini kendine ilke edinen Retim Ltd. Şti.'ne ait bu tanıtım sayfası, siz değerli dostlarımız ile kalıcı ve başarılı bir birlikteliği tesis etmek amacıyla hazırlanmıştır.",
};

export const approachSteps = [
  {
    step: 1,
    title: "Çevre Koruma ve Temizlik İşlemleri",
    description:
      "Uygulama öncesi bina çevresi ve cephe koruma tedbirleri alınır, gerekli temizlik işlemleri yapılır.",
  },
  {
    step: 2,
    title: "Keşif ve Cephe Onarım İşlemleri",
    description:
      "Mevcut durum analizi yapılır, çatlak ve hasarlar giderilir, uygulama planı ve malzeme seçimi belirlenir.",
  },
  {
    step: 3,
    title: "Kontrollü Saha Uygulaması",
    description:
      "Mantolama, boya, yalıtım veya restorasyon işlemleri üretici standartlarına uygun şekilde uygulanır.",
  },
  {
    step: 4,
    title: "Teslim, Kontrol ve Garanti Süreci",
    description:
      "Proje teslim edilir, son kontroller yapılır ve garanti süreci başlatılır.",
  },
];

export const homeDistricts = [
  "Nişantaşı",
  "Teşvikiye",
  "Beşiktaş",
  "Zincirlikuyu",
  "Bomonti",
  "Göktürk",
  "Bebek",
  "Karaköy",
  "Osmanbey",
  "Etiler",
  "Beyoğlu",
  "Levent",
];
