import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import ZoomableImage from "@/components/ui/ZoomableImage";
import ImageCompareSlider from "@/components/ui/ImageCompareSlider";
import { slugAliases } from "@/data/images";
import { getProjectBySlug, getProjectSlugs } from "@/lib/cms/projects";

export const revalidate = 60;

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return [
    ...slugs.map((slug) => ({ slug })),
    ...Object.keys(slugAliases).map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Proje Bulunamadı" };

  return {
    title: project.seoTitle || project.name,
    description: project.seoDescription || project.shortDescription,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const before = project.gallery.find((g) => g.kind === "before");
  const after = project.gallery.find((g) => g.kind === "after");
  const galleryExtras = project.gallery.filter((g) => g.kind === "gallery");

  return (
    <>
      <PageHero
        title={project.name}
        description={project.shortDescription}
        breadcrumb={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Projeler", href: "/projeler" },
          { label: project.name },
        ]}
      />

      <section className="py-12 md:py-16">
        <div className="container-main">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="relative mb-8 aspect-[16/10] overflow-hidden rounded-sm bg-retim-gray md:aspect-[21/10]">
                <ZoomableImage
                  source={{
                    primary: project.image,
                    fallback: project.imageFallback,
                    alt: project.imageAlt,
                  }}
                  className="absolute inset-0 h-full"
                  imageClassName="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-retim-navy/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </ZoomableImage>
              </div>

              <h2 className="text-xl font-semibold text-retim-navy">Proje Açıklaması</h2>
              <p className="mt-4 leading-relaxed text-gray-600">{project.description}</p>

              {before && after && (
                <div className="mt-10">
                  <h2 className="text-xl font-semibold text-retim-navy">Önce / Sonra</h2>
                  <div className="mt-4 overflow-hidden rounded-sm border border-retim-gray-dark">
                    <ImageCompareSlider
                      beforeSrc={before.url}
                      afterSrc={after.url}
                      beforeAlt={before.alt || `${project.name} önce`}
                      afterAlt={after.alt || `${project.name} sonra`}
                      beforeLabel="Önce"
                      afterLabel="Sonra"
                    />
                  </div>
                </div>
              )}

              {galleryExtras.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-semibold text-retim-navy">Proje Galerisi</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {galleryExtras.map((img) => (
                      <div key={img.url} className="relative aspect-[4/3] overflow-hidden rounded-sm bg-retim-gray">
                        <ZoomableImage
                          source={{
                            primary: img.url,
                            fallback: img.url,
                            alt: img.alt || project.imageAlt,
                          }}
                          className="absolute inset-0 h-full"
                          imageClassName="object-cover object-center"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <h2 className="mt-10 text-xl font-semibold text-retim-navy">Uygulama Kapsamı</h2>
              <ul className="mt-4 space-y-2">
                {project.scope.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-sm px-2 py-1.5 text-gray-600 transition-all duration-200 hover:translate-x-1 hover:bg-retim-orange/5"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-retim-orange" />
                    {item}
                  </li>
                ))}
              </ul>

              <h2 className="mt-10 text-xl font-semibold text-retim-navy">
                Öne Çıkan Uygulama Maddeleri
              </h2>
              <ul className="mt-4 space-y-2">
                {project.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-sm px-2 py-1.5 text-gray-600 transition-all duration-200 hover:translate-x-1 hover:bg-retim-orange/5"
                  >
                    <svg
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-retim-orange"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="stat-card sticky top-24 p-6 text-left">
                <h3 className="text-lg font-semibold text-retim-navy">Proje Bilgileri</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between border-b border-retim-gray-dark pb-3">
                    <dt className="text-gray-500">Referans No</dt>
                    <dd className="font-medium text-retim-navy">{project.refNo}</dd>
                  </div>
                  <div className="flex justify-between border-b border-retim-gray-dark pb-3">
                    <dt className="text-gray-500">Lokasyon</dt>
                    <dd className="font-medium text-retim-navy">{project.district}</dd>
                  </div>
                  <div className="flex justify-between border-b border-retim-gray-dark pb-3">
                    <dt className="text-gray-500">Semt</dt>
                    <dd className="font-medium text-retim-navy">{project.district}</dd>
                  </div>
                  <div className="flex justify-between border-b border-retim-gray-dark pb-3">
                    <dt className="text-gray-500">Yıl</dt>
                    <dd className="font-medium text-retim-navy">{project.year}</dd>
                  </div>
                  <div className="flex justify-between border-b border-retim-gray-dark pb-3">
                    <dt className="text-gray-500">Hizmet Türü</dt>
                    <dd className="font-medium text-retim-navy">{project.service}</dd>
                  </div>
                  <div className="flex justify-between border-b border-retim-gray-dark pb-3">
                    <dt className="text-gray-500">Bina Tipi</dt>
                    <dd className="font-medium text-retim-navy">{project.buildingType}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Süre</dt>
                    <dd className="font-medium text-retim-navy">{project.duration}</dd>
                  </div>
                </dl>

                <div className="mt-6 space-y-3">
                  <Link href="/iletisim#kesif-formu" className="btn-primary btn-kesif w-full text-center">
                    Ücretsiz Keşif Al
                  </Link>
                  <Link href="/projeler" className="btn-secondary w-full text-center">
                    Tüm Projelere Dön
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
