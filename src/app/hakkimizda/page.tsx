import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { aboutText, siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Retim Restorasyon Madencilik Sanayii ve Ticaret Ltd. Şti. hakkında kurumsal bilgiler.",
};

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
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-12 xl:gap-16">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold text-retim-navy">{siteConfig.legalName}</h2>
              <p className="mt-6 leading-relaxed text-gray-600">{aboutText.intro}</p>
              <p className="mt-4 leading-relaxed text-gray-600">{aboutText.experience}</p>
              <p className="mt-4 leading-relaxed text-gray-600">{aboutText.team}</p>
              <p className="mt-4 leading-relaxed text-gray-600">{aboutText.closing}</p>
            </div>

            <div className="w-full justify-self-end">
              <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-sm border border-retim-gray-dark bg-[#0b0b0b] shadow-soft lg:mx-0 lg:max-w-none">
                <div className="relative aspect-square w-full">
                  <Image
                    src="/images/retim/hakkimizda-kurumsal.jpeg"
                    alt="Retim Restorasyon kurumsal — İyiler her zaman kazanır"
                    fill
                    className="object-contain object-center"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 55vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 rounded-sm border border-retim-gray-dark bg-retim-navy p-8 text-center text-white md:p-12">
            <h2 className="text-xl font-bold md:text-2xl">Ücretsiz Keşif Formu</h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-300">
              Dış cephe, yalıtım, restorasyon veya güçlendirme ihtiyaçlarınız için keşif talebi
              oluşturun.
            </p>
            <Link href="/iletisim#kesif-formu" className="btn-primary btn-kesif mt-6">
              Ücretsiz Keşif Al
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
