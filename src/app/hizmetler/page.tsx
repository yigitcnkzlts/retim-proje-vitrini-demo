import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import ServiceCard from "@/components/services/ServiceCard";
import JsonLd from "@/components/seo/JsonLd";
import { getServices } from "@/lib/cms/services";
import { getSiteUrl } from "@/lib/seo/site-url";

export const metadata: Metadata = {
  title: {
    absolute: "Mantolama, Dış Cephe, Yalıtım ve Restorasyon Hizmetleri | Retim",
  },
  description:
    "Retim hizmetleri: mantolama, dış cephe boya ve onarım, çatı ve teras yalıtımı, drenaj, tarihi bina restorasyonu ve yapı güçlendirme. İstanbul odaklı keşif ve uygulama.",
  alternates: {
    canonical: "/hizmetler",
  },
};

export default async function ServicesPage() {
  const services = await getServices();
  const siteUrl = getSiteUrl();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana Sayfa",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Hizmetler",
        item: `${siteUrl}/hizmetler`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <PageHero
        title="Mantolama, Dış Cephe, Yalıtım ve Restorasyon Hizmetleri"
        description="Retim Restorasyon; İstanbul merkezli operasyonuyla apartman, site ve özel yapılarda mantolama, dış cephe boya-onarım, çatı ve teras yalıtımı, drenaj, tarihi bina restorasyonu ve yapı güçlendirme uygulamaları sunar."
        breadcrumb={[{ label: "Ana Sayfa", href: "/" }, { label: "Hizmetler" }]}
      />

      <section className="border-b border-retim-gray-dark bg-retim-gray py-8 md:py-10">
        <div className="container-main">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Hizmetlerimiz
          </h2>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/hizmetler#${service.slug}`}
                  className="text-sm font-medium text-retim-navy transition-colors hover:text-retim-orange"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-main">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
