import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ProjectFilters from "@/components/projects/ProjectFilters";
import ProjectCard from "@/components/projects/ProjectCard";
import { getFeaturedProjects, projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projeler",
  description: "Retim'in tamamladığı dış cephe, yalıtım, restorasyon ve güçlendirme projeleri.",
};

interface ProjectsPageProps {
  searchParams: Promise<{ hizmet?: string; semt?: string }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const featured = getFeaturedProjects();

  return (
    <>
      <PageHero
        title="Projeler"
        description="Retim'in İstanbul genelinde tamamladığı dış cephe, yalıtım, restorasyon ve güçlendirme projelerini hizmet türü ve semte göre filtreleyerek inceleyin."
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

          <div>
            <p className="section-label">Katalog</p>
            <h2 className="section-title mt-2">Tüm Projeler</h2>
            <p className="section-subtitle">
              Toplam {projects.length} proje. Arama ve filtrelerle kataloğu daraltın.
            </p>
            <div className="mt-6">
              <ProjectFilters
                initialCategory={params.hizmet || ""}
                initialDistrict={params.semt || ""}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
