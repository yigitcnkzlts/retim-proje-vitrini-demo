import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import { projects, getProjectBySlug } from "@/data/projects";
import { slugAliases } from "@/data/images";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    ...projects.map((project) => ({ slug: project.slug })),
    ...Object.keys(slugAliases).map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Proje Bulunamadı" };

  return {
    title: project.name,
    description: project.shortDescription,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

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
              <div className="relative mb-8 h-64 overflow-hidden rounded md:h-96">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
              </div>

              <h2 className="text-xl font-semibold text-retim-navy">Proje Açıklaması</h2>
              <p className="mt-4 text-gray-600 leading-relaxed">{project.description}</p>

              <h2 className="mt-10 text-xl font-semibold text-retim-navy">Uygulama Kapsamı</h2>
              <ul className="mt-4 space-y-2">
                {project.scope.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-600">
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
                  <li key={item} className="flex items-start gap-3 text-gray-600">
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
              <div className="sticky top-24 rounded border border-retim-gray-dark bg-retim-gray p-6">
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
                  <Link href="/iletisim#kesif-formu" className="btn-primary w-full text-center">
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
