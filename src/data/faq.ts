export type FaqItem = { question: string; answer: string };
export type FaqCategory = { id: string; title: string; items: FaqItem[] };

export const faqCategories: FaqCategory[] = [
  {
    id: "one-cikan-sorular",
    title: "Öne Çıkan Sorular",
    items: [
      {
        question: "Apartmanımızın gerçekten mantolamaya ihtiyacı var mı?",
        answer:
          "Mantolama ihtiyacı yalnızca binanın yaşı veya cephenin görünümüyle belirlenmez. Yüksek ısı kaybı, iç yüzeylerde yoğuşma, mevcut yalıtımın yıpranması ve sıva-boya tabakalarının bozulması birlikte değerlendirilmelidir.",
      },
      {
        question: "Mantolama maliyetini neler etkiler?",
        answer:
          "Yalıtım kalınlığı ve türü, dübel ve file sistemi, yüzey onarımları, söve ve denizlik detayları, iskele ve bina geometrisi maliyeti etkiler.",
      },
      {
        question: "Dış cephe fiyatı nasıl belirlenir?",
        answer:
          "Cephe alanı, kat sayısı, hasar miktarı, erişim yöntemi, iskele, malzeme sistemi, detay sayısı ve işçilik koşulları fiyatı belirler. Sadece metrekare üzerinden karşılaştırma yanıltıcı olabilir.",
      },
      {
        question: "Mantolama binayı güçlendirir mi?",
        answer:
          "Hayır. Mantolama, binanın ısı yalıtım performansını artıran bir cephe sistemidir; taşıyıcı sistem güçlendirmesi değildir. Güçlendirme ayrı mühendislik hesabı gerektirir.",
      },
    ],
  },
  {
    id: "genel",
    title: "Genel",
    items: [
      {
        question: "Retim Restorasyon hangi hizmetleri sunuyor?",
        answer:
          "Dış cephe onarımı, mantolama, dış cephe boyama, çatı ve teras yalıtımı, su ve ısı yalıtımı, betonarme onarımı, yapı güçlendirme ve kapsamlı bina renovasyonu alanlarında hizmet verir.",
      },
      {
        question: "Hangi bölgelerde hizmet veriyorsunuz?",
        answer:
          "Ağırlıklı olarak İstanbul genelinde apartman, site, villa, ticari yapı ve özel yapılara hizmet veriyoruz. İstanbul dışı talepler de proje ve erişim koşullarına göre değerlendirilebilir.",
      },
      {
        question: "Bina restorasyonu nedir?",
        answer:
          "Yapının bozulmuş, hasar görmüş veya işlevini yitirmiş bölümlerinin teknik ve estetik özellikler gözetilerek onarılmasıdır.",
      },
      {
        question: "Dış cephe yenileme ne zaman gerekir?",
        answer:
          "Boya ve sıva dökülmeleri, çatlaklar, su izleri, beton parçalarının kopması, yalıtım performansının düşmesi veya cephe kaplamalarının gevşemesi ihtiyacı işaret edebilir.",
      },
    ],
  },
  {
    id: "dis-cephe",
    title: "Dış Cephe",
    items: [
      {
        question: "Mantolama ne zaman gereklidir?",
        answer:
          "Yüksek ısı kaybı, iç yüzeylerde yoğuşma, eski yalıtım sisteminin yıpranması veya enerji performansının iyileştirilmesi gerektiğinde değerlendirilir.",
      },
      {
        question: "Cephe boyası neden dökülür?",
        answer:
          "Nem, su sızıntısı, güneş ve sıcaklık etkisi, yüzey hazırlığının yetersizliği veya eski boya tabakasının taşıma gücünü kaybetmesi boya dökülmesine neden olabilir.",
      },
      {
        question: "Cephede çatlak neden oluşur?",
        answer:
          "Isıl hareketler, malzeme büzülmesi, farklı malzemelerin birleşimi, yapı oturması, uygulama hataları veya taşıyıcı sistem hareketleri çatlak oluşturabilir.",
      },
      {
        question: "Fileli sıva nedir?",
        answer:
          "Alkali dayanımlı cam elyaf donatı filesinin sıva katmanı içine gömüldüğü güçlendirilmiş yüzey sistemidir; yüzey gerilmelerini dağıtmaya yardımcı olur.",
      },
    ],
  },
  {
    id: "su-yalitim",
    title: "Su Yalıtımı",
    items: [
      {
        question: "Su yalıtımı neden önemlidir?",
        answer:
          "Su, yapı malzemelerinde bozulma, donatı korozyonu, küf ve iç mekân hasarlarına neden olabilir. Doğru su yalıtımı yapının kullanım ömrünü uzatır.",
      },
      {
        question: "Bodrum neden su alır?",
        answer:
          "Yeraltı suyu, yüzey suları, yetersiz drenaj, temel-perde birleşim detayları ve çatlaklar su girişine neden olabilir.",
      },
      {
        question: "Teras neden su alır?",
        answer:
          "Yetersiz eğim, tıkalı gider, çatlamış kaplama, bozulmuş yalıtım veya parapet ve süzgeç detaylarındaki hatalar su sızıntısına yol açabilir.",
      },
      {
        question: "Kristalize yalıtım nedir?",
        answer:
          "Çimento esaslı aktif bileşenlerin beton içindeki nem ve minerallerle reaksiyona girerek kılcal boşluklarda kristal yapı oluşturmasını amaçlayan bir yöntemdir.",
      },
    ],
  },
  {
    id: "cati",
    title: "Çatı",
    items: [
      {
        question: "Çatı neden akar?",
        answer:
          "Yalıtımın eskimesi, birleşim detayları, kırık kaplamalar, gider tıkanıklığı, baca ve parapet çevresindeki hatalar veya eğim problemleri nedeniyle oluşabilir.",
      },
      {
        question: "Teras yalıtımı nasıl yapılır?",
        answer:
          "Önce yüzey, eğim, gider ve çatlaklar incelenir; gerekli tamir ve tesviye sonrası uygun astar, yalıtım katmanları ve koruyucu kaplama uygulanır.",
      },
      {
        question: "Membran nedir?",
        answer:
          "Çatı ve teraslarda su geçişini engellemek için kullanılan tabaka biçimindeki yalıtım ürünlerinin genel adıdır.",
      },
    ],
  },
  {
    id: "betonarme",
    title: "Betonarme",
    items: [
      {
        question: "Beton neden dökülür?",
        answer:
          "Su girişi, donatı korozyonu, donma-çözülme, yetersiz beton örtüsü, düşük malzeme kalitesi veya darbe etkisi betonun çatlayıp dökülmesine neden olabilir.",
      },
      {
        question: "Donatı neden paslanır?",
        answer:
          "Betonun koruyucu alkaliliğinin azalması ve su-oksijenin donatıya ulaşması korozyonu başlatabilir. Paslanan çelik genleşerek beton örtüsünü çatlatır.",
      },
      {
        question: "Karbonatlaşma nedir?",
        answer:
          "Havadaki karbondioksitin betonla reaksiyona girerek alkaliliği düşürmesidir. Donatı seviyesine ulaştığında korozyon riskini artırabilir.",
      },
      {
        question: "Beton tamiri nasıl yapılır?",
        answer:
          "Gevşek beton sağlam yüzeye kadar uzaklaştırılır, donatı temizlenir ve gerekiyorsa korunur veya tamamlanır. Uygun aderans ve tamir harcıyla kesit onarılır.",
      },
    ],
  },
  {
    id: "guclendirme",
    title: "Güçlendirme",
    items: [
      {
        question: "Bina güçlendirme nedir?",
        answer:
          "Yapının taşıma kapasitesi ve deprem performansını artırmak için yapılan mühendislik tasarımı ve uygulamalarıdır.",
      },
      {
        question: "Güçlendirme kararı nasıl verilir?",
        answer:
          "Mevcut projeler, röleve, malzeme testleri, zemin bilgileri ve deprem performans analizi birlikte değerlendirilir.",
      },
      {
        question: "Güçlendirme ne kadar sürer?",
        answer:
          "Süre yapı büyüklüğü, yöntem, erişim, tahliye ihtiyacı ve proje kapsamına göre değişir. Ön proje ve iş programı hazırlandıktan sonra daha sağlıklı süre verilebilir.",
      },
    ],
  },
  {
    id: "surec",
    title: "Süreç",
    items: [
      {
        question: "Süreç nasıl ilerler?",
        answer:
          "Talep alınır, ön bilgi ve görseller değerlendirilir, uygun görülürse saha incelemesi planlanır. İnceleme sonrası kapsam, yöntem, iş programı ve teklif hazırlanır.",
      },
      {
        question: "Fotoğraf göndererek ön değerlendirme yapılabilir mi?",
        answer:
          "Evet. Fotoğraflar sorunun türü ve önceliği hakkında ilk fikir verebilir; ancak kesin iş kapsamı ve fiyat için çoğu projede yerinde inceleme gerekir.",
      },
      {
        question: "Teknik değerlendirme nasıl talep edilir?",
        answer:
          "Web sitesi formu, WhatsApp veya telefon üzerinden yapının konumu, tipi ve mevcut problemi paylaşılabilir.",
      },
      {
        question: "Hava şartları çalışmaları etkiler mi?",
        answer:
          "Evet. Yağış, rüzgâr, sıcaklık ve nem; boya, sıva, yalıtım ve drone uçuşlarını etkileyebilir.",
      },
    ],
  },
  {
    id: "apartman-yonetimi",
    title: "Apartman Yönetimi",
    items: [
      {
        question: "Apartman restorasyonuna nasıl karar verilir?",
        answer:
          "Önce teknik ihtiyaç ve tahmini kapsam belirlenmeli, ardından teklifler ve finansman seçenekleri kat maliklerine sunulmalıdır.",
      },
      {
        question: "Kat maliklerini nasıl ikna edebiliriz?",
        answer:
          "Sorunu fotoğraf, teknik rapor, riskler, çözüm alternatifleri ve maliyet dağılımıyla şeffaf şekilde anlatmak önemlidir.",
      },
      {
        question: "Belediye izni gerekir mi?",
        answer:
          "Yapılacak işin türüne, yapının tescil durumuna ve dış cephedeki değişikliğe göre izin veya onay gerekebilir.",
      },
    ],
  },
  {
    id: "maliyet",
    title: "Maliyet",
    items: [
      {
        question: "Dış cephe fiyatı nasıl belirlenir?",
        answer:
          "Cephe alanı, kat sayısı, hasar miktarı, erişim yöntemi, iskele, malzeme sistemi ve işçilik koşulları fiyatı belirler.",
      },
      {
        question: "Mantolama maliyetini neler etkiler?",
        answer:
          "Yalıtım kalınlığı ve türü, dübel ve file sistemi, yüzey onarımları, söve ve denizlik detayları, iskele ve bina geometrisi maliyeti etkiler.",
      },
      {
        question: "En ucuz çözüm her zaman doğru çözüm müdür?",
        answer:
          "Hayır. Düşük kapsam, yetersiz yüzey hazırlığı veya uyumsuz malzeme kısa sürede tekrar onarım gerektirebilir.",
      },
    ],
  },
  {
    id: "retim-hakkinda",
    title: "Retim Hakkında",
    items: [
      {
        question: "Neden Retim Restorasyon?",
        answer:
          "Saha deneyimini mühendislik yaklaşımı ve modern inceleme teknolojileriyle birleştirir; sorun kaynağına uygun uzun ömürlü çözümler üretir.",
      },
      {
        question: "Kaç yıldır faaliyet gösteriyorsunuz?",
        answer:
          "Retim Restorasyon 1989 yılından bu yana yapı onarımı, yalıtım, dış cephe ve restorasyon alanlarında faaliyet göstermektedir.",
      },
      {
        question: "Hangi teknolojileri kullanıyorsunuz?",
        answer:
          "Dron, termal kamera, beton yüzey sertliği ölçümü, donatı tespiti ve dijital raporlama araçlarından faydalanıyoruz.",
      },
    ],
  },
  {
    id: "teknik-bilgiler",
    title: "Teknik Bilgiler",
    items: [
      {
        question: "Isı köprüsü nedir?",
        answer:
          "Yapı kabuğunda ısının çevresindeki bölgelere göre daha hızlı geçtiği noktadır. Kolon, kiriş, döşeme kenarı ve bağlantı detaylarında oluşabilir.",
      },
      {
        question: "Kapiler su nedir?",
        answer:
          "Suyun küçük gözenek ve kılcal boşluklarda yüzey gerilimiyle yukarı veya yana doğru hareket etmesidir. Zeminle temas eden duvarlarda nem yükselmesine neden olabilir.",
      },
      {
        question: "Beton örtüsü nedir?",
        answer:
          "Donatı ile beton yüzeyi arasındaki beton kalınlığıdır. Donatıyı yangın, nem ve korozyona karşı korur.",
      },
      {
        question: "Basınç dayanımı nedir?",
        answer:
          "Bir malzemenin basınç yükü altında taşıyabildiği gerilme seviyesidir. Betonun temel mekanik özelliklerinden biridir.",
      },
    ],
  },
];

export function flattenFaqCategories(categories: FaqCategory[]) {
  const rows: Array<{
    category_slug: string;
    category_title: string;
    question: string;
    answer: string;
    sort_order: number;
  }> = [];
  let order = 0;
  for (const cat of categories) {
    for (const item of cat.items) {
      rows.push({
        category_slug: cat.id,
        category_title: cat.title,
        question: item.question,
        answer: item.answer,
        sort_order: order++,
      });
    }
  }
  return rows;
}
