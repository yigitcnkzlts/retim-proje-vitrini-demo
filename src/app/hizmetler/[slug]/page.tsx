import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import RetimImage from "@/components/ui/RetimImage";
import JsonLd from "@/components/seo/JsonLd";
import { getServiceImageSource } from "@/data/mediaAssets";
import { getServiceBySlugCms, getServices } from "@/lib/cms/services";
import {
  getFeaturedServices,
  isFeaturedServiceSlug,
  servicePagePath,
} from "@/lib/seo/featured-services";
import { getSiteUrl } from "@/lib/seo/site-url";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlugCms(slug);
  if (!service) return { title: "Hizmet" };

  const title = service.seoTitle?.trim()
    ? service.seoTitle.trim()
    : `${service.name} | Retim Hizmetleri`;
  const description = service.seoDescription?.trim()
    ? service.seoDescription.trim()
    : service.description.length > 155
      ? `${service.description.slice(0, 152)}...`
      : `${service.description} İstanbul ve seçili bölgelerde Retim uygulaması.`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: servicePagePath(slug) },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getServiceBySlugCms(slug);
  if (!service) notFound();

  const allServices = await getServices();
  const related = getFeaturedServices(allServices).filter((s) => s.slug !== slug).slice(0, 6);
  const siteUrl = getSiteUrl();
  const path = servicePagePath(slug);

  const fallbackSource = getServiceImageSource(service.slug);
  const imageSource = service.imageUrl
    ? {
        primary: service.imageUrl,
        fallback: fallbackSource.fallback,
        alt: service.imageAlt || service.name,
      }
    : fallbackSource;

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
      {
        "@type": "ListItem",
        position: 3,
        name: service.name,
        item: `${siteUrl}${path}`,
      },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: `${siteUrl}${path}`,
    provider: {
      "@type": "Organization",
      name: "Retim",
      url: siteUrl,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "İstanbul",
    },
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema, serviceSchema]} />
      <PageHero
        title={service.name}
        description={service.description}
        breadcrumb={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Hizmetler", href: "/hizmetler" },
          { label: service.name },
        ]}
      />

      <section className="py-12 md:py-16">
        <div className="container-main">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-retim-gray-dark">
                <RetimImage
                  source={imageSource}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  priority
                />
              </div>
              <h2 className="mt-8 text-xl font-bold text-retim-navy">
                {service.name} hakkında
              </h2>
              <p className="mt-4 leading-relaxed text-gray-600">{service.description}</p>
              <p className="mt-4 leading-relaxed text-gray-600">
                Retim, bu hizmet kapsamında keşif, doğru malzeme seçimi ve kontrollü saha
                uygulamasıyla kalıcı çözüm üretir. Detaylı bilgi ve ücretsiz keşif için bizimle
                iletişime geçebilirsiniz.
              </p>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Uygulama alanları
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {service.projectTypes.map((type) => (
                    <span key={type} className="tag">
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/iletisim#kesif-formu" className="btn-primary">
                  Ücretsiz Keşif Al
                </Link>
                <Link href="/hizmetler" className="btn-secondary">
                  Tüm Hizmetler
                </Link>
              </div>
            </div>

            <aside className="rounded-sm border border-retim-gray-dark bg-retim-gray p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Diğer hizmetler
              </h2>
              <ul className="mt-4 space-y-2">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={servicePagePath(item.slug)}
                      className="text-sm font-medium text-retim-navy transition-colors hover:text-retim-orange"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              {!isFeaturedServiceSlug(slug) && (
                <p className="mt-6 text-xs leading-relaxed text-gray-500">
                  Bu hizmet{" "}
                  <Link href="/hizmetler" className="text-retim-navy underline-offset-2 hover:underline">
                    Hizmetler
                  </Link>{" "}
                  sayfasındaki uygulama alanlarımız arasındadır.
                </p>
              )}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
