import Link from "next/link";
import ContactForm from "@/components/contact/ContactForm";
import StatsSection from "@/components/home/StatsSection";
import ProjectCard from "@/components/projects/ProjectCard";
import ReferenceTablePreview from "@/components/references/ReferenceTablePreview";
import HeroBanner from "@/components/ui/HeroBanner";
import ScrollReveal from "@/components/ui/ScrollReveal";
import StaggerChildren from "@/components/ui/StaggerChildren";
import TrustStrip from "@/components/ui/TrustStrip";
import { services } from "@/data/services";
import { getFeaturedProjects, serviceCategories } from "@/data/projects";
import { getReferencePreview } from "@/data/references";
import { approachSteps, homeDistricts, siteConfig } from "@/data/site";
import { getServiceHeroImage } from "@/data/images";

export default function HomePage() {
  const featuredProjects = getFeaturedProjects();
  const referencePreview = getReferencePreview(8);
  const tickerItems = featuredProjects.map((p) => `${p.name} · ${p.district}`);

  const heroSlides = services.map((service) => ({
    name: service.name,
    image: getServiceHeroImage(service.slug),
    href: `/hizmetler#${service.slug}`,
  }));

  return (
    <>
      <HeroBanner
        legalName={siteConfig.legalName}
        title="İstanbul'un Binlerce Binasında Retim İmzası"
        description={siteConfig.description}
        slides={heroSlides}
        tickerItems={tickerItems}
      />

      <TrustStrip />

      <ScrollReveal>
        <StatsSection />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <section className="border-b border-retim-gray-dark bg-retim-gray py-16 md:py-20">
          <div className="container-main">
            <div className="mb-10">
              <p className="section-label">Hizmetler</p>
              <h2 className="section-title mt-2">Uygulama Alanlarımız</h2>
              <p className="section-subtitle">
                Mantolama, boya, çatı yalıtımı, drenaj, su deposu, restorasyon, güçlendirme ve
                inşaat taahhüt alanlarında kapsamlı hizmet.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <Link key={service.slug} href={`/hizmetler#${service.slug}`} className="service-tile group">
                  <h3 className="text-sm font-bold text-retim-navy transition-colors duration-200 group-hover:text-retim-orange">
                    {service.name}
                  </h3>
                  <svg
                    className="h-4 w-4 flex-shrink-0 text-retim-orange opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/hizmetler" className="btn-secondary">
                Tüm Hizmetler
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <section className="py-16 md:py-20">
          <div className="container-main">
            <div className="mb-10">
              <p className="section-label">Projeler</p>
              <h2 className="section-title mt-2">Öne Çıkan Proje Uygulamaları</h2>
              <p className="section-subtitle">
                İstanbul&apos;un farklı semtlerinde tamamlanan seçilmiş proje uygulamaları.
              </p>
            </div>
            <StaggerChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" staggerMs={100}>
              {featuredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} variant="compact" />
              ))}
            </StaggerChildren>
            <div className="mt-10 text-center">
              <Link href="/projeler" className="btn-secondary">
                Tüm Projeleri Gör
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <section className="border-y border-retim-gray-dark bg-retim-gray py-16 md:py-20">
          <div className="container-main">
            <div className="mb-10">
              <p className="section-label">Katalog</p>
              <h2 className="section-title mt-2">Hizmet Türüne Göre Projeler</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {serviceCategories.map((cat) => (
                <div key={cat.slug} className="card-interactive group">
                  <h3 className="text-base font-bold text-retim-navy transition-colors group-hover:text-retim-orange">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">{cat.description}</p>
                  <Link
                    href={`/projeler?hizmet=${cat.slug}`}
                    className="btn-secondary mt-4 px-4 py-2 text-xs"
                  >
                    Bu Kategorideki Projeleri Gör
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <section className="py-16 md:py-20">
          <div className="container-main">
            <div className="mb-10">
              <p className="section-label">Lokasyon</p>
              <h2 className="section-title mt-2">
                İstanbul&apos;un Farklı Bölgelerinde Tamamlanan Uygulamalar
              </h2>
            </div>
            <div className="rounded-sm border border-retim-gray-dark bg-retim-gray p-6 shadow-soft md:p-8">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {homeDistricts.map((district) => (
                  <Link
                    key={district}
                    href={`/projeler?semt=${encodeURIComponent(district)}`}
                    className="district-pill"
                  >
                    {district}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <section className="border-y border-retim-gray-dark bg-retim-gray py-16 md:py-20">
          <div className="container-main">
            <div className="mb-10">
              <p className="section-label">Arşiv</p>
              <h2 className="section-title mt-2">Yıllara Göre Referans Geçmişi</h2>
              <p className="section-subtitle">
                Retim&apos;in tamamladığı projeler yıl, semt, hizmet türü ve proje adına göre
                incelenebilir.
              </p>
            </div>
            <ReferenceTablePreview references={referencePreview} />
            <div className="mt-8 text-center">
              <Link href="/referanslar" className="btn-primary">
                Tam Referans Listesini Gör
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <section className="py-16 md:py-20">
          <div className="container-main">
            <div className="mb-10">
              <p className="section-label">Süreç</p>
              <h2 className="section-title mt-2">Her Projede Aynı Disiplin</h2>
            </div>
            <div className="approach-timeline grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {approachSteps.map((step) => (
                <div key={step.step} className="approach-card">
                  <div className="approach-number">{step.step}</div>
                  <h3 className="text-base font-bold text-retim-navy">{step.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <section id="kesif-formu" className="border-y border-retim-gray-dark bg-retim-gray py-16 md:py-20">
          <div className="container-main">
            <div className="mx-auto max-w-2xl">
              <p className="section-label text-center">Keşif Talebi</p>
              <h2 className="section-title mt-2 text-center">Ücretsiz Keşif Formu</h2>
              <p className="section-subtitle mx-auto text-center">
                Projeniz hakkında bilgi verin, en kısa sürede size dönüş yapalım.
              </p>
              <div className="form-glow mt-8 rounded-sm border border-retim-gray-dark bg-white p-6 shadow-lift md:p-8">
                <ContactForm compact />
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <section className="relative overflow-hidden bg-retim-navy py-16 text-white md:py-24">
        <div className="hero-glow-orb left-1/2 top-0 h-64 w-64 -translate-x-1/2" />
        <div className="container-main relative text-center">
          <h2 className="animate-fade-up text-2xl font-bold md:text-3xl">
            Binanız için doğru uygulama geçmişine sahip ekiple çalışın.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl animate-fade-up text-gray-300" style={{ animationDelay: "150ms" }}>
            Dış cephe, yalıtım, restorasyon veya güçlendirme ihtiyaçlarınız için Retim&apos;in
            proje deneyiminden faydalanın.
          </p>
          <Link href="/iletisim#kesif-formu" className="btn-primary mt-8">
            Ücretsiz Keşif Al
          </Link>
        </div>
      </section>
    </>
  );
}
