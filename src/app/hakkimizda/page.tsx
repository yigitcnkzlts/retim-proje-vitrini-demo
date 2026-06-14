import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { aboutText, siteConfig, stats } from "@/data/site";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Retim Restorasyon Madencilik Sanayii ve Ticaret Ltd. Şti. hakkında kurumsal bilgiler.",
};

const values = [
  {
    title: "2 İnşaat Mühendisi",
    description: "Projelerde mühendislik destekli teknik analiz ve uygulama planlaması.",
  },
  {
    title: "1 Jeoloji Mühendisi",
    description: "Zemin ve yapı koşullarına uygun teknik değerlendirme.",
  },
  {
    title: "Mimar",
    description: "Cephe, restorasyon ve estetik uygulama koordinasyonu.",
  },
  {
    title: "100+ Teknik Kadro",
    description: "Tecrübeli teknik servis elemanları ile kontrollü saha uygulaması.",
  },
  {
    title: "Malzeme ve Makine Parkı",
    description: "En kaliteli malzemeler ve profesyonel ekipman ile uygulama.",
  },
  {
    title: "Müşteri Memnuniyeti",
    description: "Kalıcı ve başarılı birliktelik için müşteri memnuniyeti ilkesi.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="Kurumsal"
        description="Hakkımızda"
        breadcrumb={[{ label: "Ana Sayfa", href: "/" }, { label: "Hakkımızda" }]}
      />

      <section className="py-12 md:py-16">
        <div className="container-main">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-retim-navy">{siteConfig.legalName}</h2>
            <p className="mt-6 text-gray-600 leading-relaxed">{aboutText.intro}</p>
            <p className="mt-4 text-gray-600 leading-relaxed">{aboutText.experience}</p>
            <p className="mt-4 text-gray-600 leading-relaxed">{aboutText.team}</p>
            <p className="mt-4 text-gray-600 leading-relaxed">{aboutText.closing}</p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-sm border border-retim-gray-dark bg-retim-gray p-5 text-center"
              >
                <p className="text-2xl font-bold text-retim-navy">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <h2 className="section-title">Teknik Kadro ve Uygulama Gücü</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((value) => (
                <div key={value.title} className="card-base">
                  <h3 className="font-bold text-retim-navy">{value.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 rounded-sm border border-retim-gray-dark bg-retim-navy p-8 text-center text-white md:p-12">
            <h2 className="text-xl font-bold md:text-2xl">Ücretsiz Keşif Formu</h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-300">
              Dış cephe, yalıtım, restorasyon veya güçlendirme ihtiyaçlarınız için keşif talebi
              oluşturun.
            </p>
            <Link href="/iletisim#kesif-formu" className="btn-primary mt-6">
              Ücretsiz Keşif Al
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
