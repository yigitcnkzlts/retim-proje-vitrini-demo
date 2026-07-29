import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import ServiceCard from "@/components/services/ServiceCard";
import JsonLd from "@/components/seo/JsonLd";
import { getServices } from "@/lib/cms/services";
import { getFeaturedServices, servicePagePath } from "@/lib/seo/featured-services";
import { getSiteUrl } from "@/lib/seo/site-url";

export const metadata: Metadata = {
  title: {
    absolute: "Hizmetler | Mantolama, Dış Cephe, Yalıtım ve Güçlendirme | Retim",
  },
  description:
    "Retim hizmetleri: mantolama işlemleri, çatı yalıtım işlemleri, onarım ve boya, drenaj, yapı güçlendirme, istinat duvarı ve diğer uygulamalar. İstanbul odaklı keşif ve uygulama.",
  alternates: {
    canonical: "/hizmetler",
  },
};

export default async function ServicesPage() {
  const services = await getServices();
  const featured = getFeaturedServices(services);
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

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Retim Hizmetleri",
    itemListElement: featured.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: service.name,
      url: `${siteUrl}${servicePagePath(service.slug)}`,
    })),
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema, itemListSchema]} />
      <PageHero
        title="Hizmetlerimiz: Mantolama, Dış Cephe, Yalıtım ve Güçlendirme"
        description="Retim Restorasyon; İstanbul merkezli operasyonuyla apartman, site ve özel yapılarda mantolama, dış cephe onarım ve boya, çatı yalıtımı, drenaj, yapı güçlendirme ve istinat duvarı uygulamaları sunar."
        breadcrumb={[{ label: "Ana Sayfa", href: "/" }, { label: "Hizmetler" }]}
      />

      <section className="py-12 md:py-16">
        <div className="container-main">
          <h2 className="mb-6 text-xl font-bold text-retim-navy">Tüm uygulama alanları</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-retim-gray-dark bg-retim-gray py-8 md:py-10">
        <div className="container-main">
          <h2 className="text-lg font-bold text-retim-navy">Öne çıkan hizmetler</h2>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            Aşağıdaki hizmet sayfalarından uygulama kapsamını inceleyebilir, ücretsiz keşif talebi
            oluşturabilirsiniz.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((service) => (
              <li key={service.slug}>
                <Link
                  href={servicePagePath(service.slug)}
                  className="group flex h-full flex-col rounded-sm border border-retim-gray-dark bg-white p-4 transition-colors hover:border-retim-orange"
                >
                  <span className="font-semibold text-retim-navy group-hover:text-retim-orange">
                    {service.name}
                  </span>
                  <span className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {service.description}
                  </span>
                  <span className="mt-3 text-xs font-semibold text-retim-orange">
                    Hizmet sayfasına git →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
