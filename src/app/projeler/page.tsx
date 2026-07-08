import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ProjectCard from "@/components/projects/ProjectCard";
import { getFeaturedProjects } from "@/lib/cms/projects";

export const metadata: Metadata = {
  title: "Projeler",
  description:
    "Farklı il ve ilçelerde tamamladığımız dış cephe, çatı, yalıtım ve restorasyon projelerini inceleyin.",
};

export const revalidate = 60;

export default async function ProjectsPage() {
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
          <div className="mb-12">
            <p className="section-label">Öne Çıkan</p>
            <h2 className="section-title mt-2">Son Tamamlanan Projeler</h2>
            <p className="section-subtitle">
              Retim web sitesinde öne çıkan {featured.length} referans uygulaması.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {featured.map((project) => (
                <ProjectCard key={project.slug} project={project} variant="compact" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
