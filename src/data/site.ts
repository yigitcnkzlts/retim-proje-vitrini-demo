const whatsappMessage = "Merhaba, binamız için keşif ve teklif almak istiyorum.";

export const siteConfig = {
  name: "Retim",
  legalName: "Retim Restorasyon Madencilik Sanayii ve Ticaret Ltd. Şti.",
  title: "Mantolama, Dış Cephe Boya, Drenaj, Çatı Yalıtımı",
  description:
    "İstanbul odaklı apartman, site ve özel yapılarda dış cephe, çatı, yalıtım ve güçlendirme ihtiyaçlarını teknoloji destekli keşif süreciyle analiz edip kesin çözümler sunuyoruz.",
  phone: "0532 681 92 90",
  officePhone: "0 (212) 212 45 40",
  whatsapp: "0532 681 92 90",
  whatsappMessage,
  whatsappUrl: `https://wa.me/905326819290?text=${encodeURIComponent(whatsappMessage)}`,
  email: "retim@retim.com.tr",
  addressLine1: "Aytekin Kotil Cad. No:39/B",
  addressLine2: "Mecidiyeköy / İSTANBUL",
  address: "Aytekin Kotil Cad. No:39/B Mecidiyeköy / İSTANBUL",
  workingHours: "Pzt - Cmt 8.00 - 18.00",
  workingHoursClosed: "Pazar Kapalı",
  founded: "27 Kasım 1989",
  mapsUrl: "https://maps.app.goo.gl/ngVpKqqjFkxxsv437?g_st=iw",
  mapsEmbedUrl:
    "https://www.google.com/maps?q=Aytekin+Kotil+Cad.+No:39%2FB,+Mecidiyek%C3%B6y,+%C4%B0stanbul&hl=tr&z=16&output=embed",
};

export const navigation = [
  { name: "Ana Sayfa", href: "/" },
  { name: "Kurumsal", href: "/hakkimizda" },
  { name: "Hizmetler", href: "/hizmetler", hasDropdown: true },
  { name: "Projeler", href: "/projeler" },
  { name: "Referanslar", href: "/referanslar" },
  { name: "Çözüm Ortakları", href: "/cozum-ortaklari" },
  { name: "Bilgi Merkezi", href: "/bilgi-merkezi" },
  { name: "İletişim", href: "/iletisim" },
];

export const footerLinks = [
  { name: "Ana Sayfa", href: "/" },
  { name: "Hakkımızda", href: "/hakkimizda" },
  { name: "Projeler", href: "/projeler" },
  { name: "Referanslar", href: "/referanslar" },
  { name: "Sık Sorulan Sorular", href: "/bilgi-merkezi" },
  { name: "Çözüm Ortakları", href: "/cozum-ortaklari" },
  { name: "İletişim", href: "/iletisim" },
];

export const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/retim-restorasyon/?viewAsMember=true",
    icon: "linkedin",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/retimrestorasyon/",
    icon: "instagram",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/1ERyrDESb8/?mibextid=wwXIfr",
    icon: "facebook",
  },
];

export const lastFiveProjects = [
  { name: "SABANCI VİLLALARI", district: "KANDİLLİ", href: "/referanslar" },
  { name: "İBB BİNASI", district: "FATİH", href: "/referanslar" },
  { name: "İSTANBUL ADLİYESİ BİNASI", district: "SULTANAHMET", href: "/referanslar" },
  { name: "İSTANBUL ÜNİVERSİTESİ GİRİŞ KAPISI", district: "BEYAZIT", href: "/referanslar" },
  { name: "KADIRGA MEYDAN ÇEŞMESİ", district: "KADIRGA", href: "/referanslar" },
];

export const stats = [
  { value: "Yüzlerce", label: "Onarılan Bina" },
  { value: "37", label: "Yıllık Deneyim" },
  { value: "1989", label: "Kuruluş Yılı" },
  { value: "100+", label: "Teknik Kadro" },
  { value: "2000+", label: "Referans" },
];

export const aboutText = {
  intro:
    "Retim Restorasyon Madencilik Sanayii ve Ticaret Ltd. Şti. 27 Kasım 1989 tarihinde; binaların iç ve dış cephe onarımı, yalıtımı, mantolaması, boya, sıva ve kaplama uygulamaları ile çatı ve bina zeminlerinde su ve ısı yalıtımı ihtiyaçlarına kalıcı çözümler sunmak amacıyla kurulmuştur.",
  experience:
    "Kuruluşundan bugüne 36 yılı aşkın sektör deneyimiyle Retim Restorasyon, kalite, güvenilirlik ve sürdürülebilir hizmet anlayışını tamamladığı yüzlerce yapı projesiyle kanıtlamış; restorasyon, renovasyon ve yapı güçlendirme alanlarında sektörün öncüleri arasında yerini almıştır.",
  team:
    "Bünyesinde yer alan inşaat mühendisi, jeoloji mühendisi, mimar ve 100'ü aşkın deneyimli saha ekibiyle Retim; sahip olduğu teknik donanım ve uzman uygulama kadrosu sayesinde üstlendiği projeleri yüksek işçilik kalitesi, doğru malzeme seçimi ve disiplinli proje yönetimiyle hayata geçirmektedir.",
  closing:
    "Retim Restorasyon için her proje yalnızca bir onarım süreci değil; yapının güvenliğini, estetik değerini ve kullanım ömrünü artıran kapsamlı bir yenileme çalışmasıdır. Geçmişten gelen tecrübesini güncel mühendislik yaklaşımıyla birleştirerek her yapıya güven, dayanıklılık ve estetik değer kazandırmayı hedeflemektedir.",
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

export const discoverySteps = [
  {
    step: 1,
    icon: "drone" as const,
    title: "Drone ile Keşif",
    description:
      "Binanızın dört cephesini ve çatısını havadan yüksek çözünürlüklü kameralarla tarıyoruz. İskele kurmadan, binanıza dokunmadan tüm cepheleri santimetre hassasiyetinde görüntülüyoruz.",
    highlights: [
      "Çatlak, dökülme ve beton hasarlarının tespiti",
      "Çatı ve drenaj sisteminin detaylı incelenmesi",
      "Sorunların fotoğraflarla belgelenmesi",
    ],
  },
  {
    step: 2,
    icon: "thermal" as const,
    title: "Termal Kamera Analizi",
    description:
      "Binanızın dört cephesini termal kamerayla tarayarak ısı kaybı noktalarını tespit ediyoruz. Görünmeyen yalıtım eksikliklerini renkli ısı haritasıyla somut hale getiriyoruz.",
    highlights: [
      "4 cepheden termal görüntüleme",
      "Isı kaybı ve yalıtım analiz raporu",
      "Mevcut durum ve önerilen aksiyonlar",
    ],
  },
  {
    step: 3,
    icon: "structural" as const,
    title: "Yapısal Dayanım Analizi",
    description:
      "Beton kalitesi ve donatı durumunu yerinde inceleyerek yapısal risklere yönelik ön değerlendirme raporu hazırlıyoruz.",
    highlights: [
      "Hasarsız beton dayanımı testi",
      "Donatı konum ve durum analizi",
      "Deprem güvenliği ön değerlendirmesi",
    ],
  },
];

export const discoveryReport = {
  title: "Keşif Raporu",
  subtitle: "Tüm bulgular tek bir raporda",
  description:
    "Drone görüntüleri, termal analiz sonuçları ve yapısal test verileri tek bir raporda birleştirilerek size sunulur. Mevcut sorunlar, önerilen çözümler ve tahmini maliyet bilgisi içerir.",
  ctaLabel: "Ücretsiz Keşif Talebi",
  ctaHref: "/iletisim#kesif-formu",
};

export const buildingProblemCards = [
  {
    id: "mantolama",
    side: "left" as const,
    icon: "mantolama" as const,
    title: "Mantolama Problemleri",
    description:
      "Eski veya hatalı mantolama sistemleri ısı kaybına ve cephe deformasyonuna yol açar.",
    hotspot: { x: 38, y: 52 },
    path: "M 248 138 Q 310 155 382 292",
    arrowPoints: "382,292 374,286 388,286",
  },
  {
    id: "drenaj",
    side: "left" as const,
    icon: "drenaj" as const,
    title: "Drenaj Problemleri",
    description:
      "Yetersiz drenaj ve su yalıtımı bodrum katlarda su alma, nem ve rutubete neden olur.",
    hotspot: { x: 48, y: 82 },
    path: "M 248 281 Q 360 330 478 462",
    arrowPoints: "478,462 470,454 482,454",
  },
  {
    id: "cati",
    side: "left" as const,
    icon: "cati" as const,
    title: "Çatı ve Teras Problemleri",
    description:
      "Su yalıtımı zayıflayan çatı ve teraslarda rutubet, tavan lekeleri ve betonarme hasarları oluşabilir.",
    hotspot: { x: 50, y: 22 },
    path: "M 248 424 Q 390 300 500 126",
    arrowPoints: "500,126 494,134 506,134",
  },
  {
    id: "yagmur",
    side: "right" as const,
    icon: "yagmur" as const,
    title: "Yağmur İnişleri",
    description:
      "Tıkalı veya hasarlı yağmur inişleri cephede su taşmalarına ve lekelenmeye sebep olur.",
    hotspot: { x: 62, y: 49 },
    path: "M 752 138 Q 690 200 622 276",
    arrowPoints: "622,276 630,270 618,270",
  },
  {
    id: "boya",
    side: "right" as const,
    icon: "boya" as const,
    title: "Onarım ve Boya",
    description:
      "Dökülen sıva, çatlaklar ve bozulan boya tabakaları estetik görünümü olumsuz etkiler.",
    hotspot: { x: 52, y: 38 },
    path: "M 752 281 Q 640 240 522 214",
    arrowPoints: "522,214 530,208 518,208",
  },
  {
    id: "balkon",
    side: "right" as const,
    icon: "balkon" as const,
    title: "Balkon ve Korkuluklar",
    description:
      "Korozyon, beton dökülmeleri ve derz boşlukları güvenlik açısından risk oluşturur.",
    hotspot: { x: 58, y: 62 },
    path: "M 752 424 Q 680 390 580 348",
    arrowPoints: "580,348 588,342 576,342",
  },
];

export const beforeAfterSection = {
  label: "Termal Kamera ile Raporlama Süreci",
  title: "Uygulama Öncesi Isı Kaçağı Analizi",
  description:
    "Dış cephe yalıtım ve restorasyon projelerinde keşif, analiz ve uygulama süreçlerinin etkisini görsel olarak takip edin.",
  beforeLabel: "Normal Görünüm",
  afterLabel: "Termal Analiz",
};

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
  "Bodrum",
];
