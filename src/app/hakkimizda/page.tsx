import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { siteConfig } from "@/data/site";
import { getAboutContent } from "@/lib/cms/about-content";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Retim Restorasyon Madencilik Sanayii ve Ticaret Ltd. Şti. hakkında kurumsal bilgiler.",
};

export default async function AboutPage() {
  const about = await getAboutContent();

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
              <p className="mt-6 leading-relaxed text-gray-600">{about.intro}</p>
              <p className="mt-4 leading-relaxed text-gray-600">{about.experience}</p>
              <p className="mt-4 leading-relaxed text-gray-600">{about.team}</p>
              <p className="mt-4 leading-relaxed text-gray-600">{about.closing}</p>
            </div>

            <div className="w-full justify-self-end">
              <div className="mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none">
                <div className="overflow-hidden rounded-sm border border-retim-gray-dark shadow-soft">
                  <Image
                    src={about.founderImage}
                    alt={`${about.founderName} — Retim Restorasyon ${about.founderTitle}`}
                    width={828}
                    height={820}
                    className="h-auto w-full"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 55vw"
                    priority
                  />
                </div>
                <p className="mt-3 text-center text-sm font-semibold text-retim-navy">
                  {about.founderName}
                  <span className="mt-0.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
                    {about.founderTitle}
                  </span>
                </p>
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
