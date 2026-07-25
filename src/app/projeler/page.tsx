import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import ProjectCard from "@/components/projects/ProjectCard";
import { getFeaturedProjects, getProjectsByService } from "@/lib/cms/projects";
import { getServiceBySlugCms } from "@/lib/cms/services";

export const metadata: Metadata = {
  title: "Projeler",
  description:
    "Farklı il ve ilçelerde tamamladığımız dış cephe, çatı, yalıtım ve restorasyon projelerini inceleyin.",
};

export const revalidate = 30;

interface PageProps {
  searchParams: Promise<{ hizmet?: string }>;
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const { hizmet } = await searchParams;
  const serviceSlug = hizmet?.trim() || "";

  if (serviceSlug) {
    const [service, projects] = await Promise.all([
      getServiceBySlugCms(serviceSlug),
      getProjectsByService(serviceSlug),
    ]);
    const title = service?.name || "İlgili Projeler";

    return (
      <>
        <PageHero
          title={title}
          description={`${title} kapsamında tamamlanan Retim projeleri.`}
          breadcrumb={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Hizmetler", href: "/hizmetler" },
            { label: title },
          ]}
        />

        <section className="py-12 md:py-16">
          <div className="container-main">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-600">
                {projects.length > 0
                  ? `${projects.length} proje listeleniyor`
                  : "Bu hizmete bağlı yayınlanmış proje henüz yok."}
              </p>
              <Link href="/projeler" className="text-sm font-semibold text-retim-orange hover:underline">
                Tüm projelere dön
              </Link>
            </div>
            {projects.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {projects.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            ) : (
              <div className="rounded-sm border border-retim-gray-dark bg-retim-gray p-8 text-center">
                <p className="text-gray-600">
                  Bu hizmet için henüz proje eklenmemiş. Admin panelden proje eklerken ilgili hizmeti seçin.
                </p>
                <Link href="/hizmetler" className="btn-secondary mt-4 inline-flex">
                  Hizmetlere dön
                </Link>
              </div>
            )}
          </div>
        </section>
      </>
    );
  }

  const featured = await getFeaturedProjects();

  return (
    <>
      <PageHero
        title="Projeler"
        description="Farklı il ve ilçelerde tamamladığımız dış cephe, çatı, yalıtım ve restorasyon projelerini inceleyerek Retim'in uygulama yaklaşımını yakından görebilirsiniz."
        breadcrumb={[{ label: "Ana Sayfa", href: "/" }, { label: "Projeler" }]}
      />

      <section className="py-12 md:py-16">
        <div className="container-main">
          {featured.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {featured.map((project) => (
                <ProjectCard key={project.slug} project={project} variant="compact" />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Henüz yayınlanmış proje yok.</p>
          )}
        </div>
      </section>
    </>
  );
}
