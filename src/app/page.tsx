import Link from "next/link";
import Image from "next/image";
import ContactForm from "@/components/contact/ContactForm";
import ProjectCard from "@/components/projects/ProjectCard";
import ReferenceTablePreview from "@/components/references/ReferenceTablePreview";
import { services } from "@/data/services";
import { getFeaturedProjects, serviceCategories } from "@/data/projects";
import { getReferencePreview } from "@/data/references";
import { stats, approachSteps, homeDistricts, siteConfig } from "@/data/site";
import { projectImages } from "@/data/images";

export default function HomePage() {
  const featuredProjects = getFeaturedProjects();
  const referencePreview = getReferencePreview(8);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-retim-navy text-white">
        <div className="absolute inset-0 opacity-25">
          <Image
            src={projectImages.hero}
            alt="Dış cephe uygulama"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-retim-navy via-retim-navy/95 to-retim-navy/80" />
        <div className="container-main relative py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="section-label text-retim-orange">{siteConfig.legalName}</p>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
              İstanbul&apos;un Binlerce Binasında Retim İmzası
            </h1>
            <p className="mt-6 text-base leading-relaxed text-gray-300 md:text-lg">
              {siteConfig.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/projeler" className="btn-primary">
                Projeleri İncele
              </Link>
              <Link href="/referanslar" className="btn-outline-white">
                Referans Listesine Git
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-retim-gray-dark bg-white py-12">
        <div className="container-main">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-sm border border-retim-gray-dark bg-retim-gray p-5 text-center"
              >
                <p className="text-2xl font-bold text-retim-navy md:text-3xl">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-b border-retim-gray-dark bg-retim-gray py-16 md:py-20">
        <div className="container-main">
          <div className="mb-10">
            <p className="section-label">Hizmetler</p>
            <h2 className="section-title mt-2">Uygulama Alanlarımız</h2>
            <p className="section-subtitle">
              Mantolama, boya, çatı yalıtımı, drenaj, restorasyon ve güçlendirme alanlarında
              kapsamlı hizmet.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {services.slice(0, 8).map((service) => (
              <Link
                key={service.slug}
                href={`/hizmetler#${service.slug}`}
                className="card-base group hover:border-retim-orange"
              >
                <h3 className="text-sm font-bold text-retim-navy group-hover:text-retim-orange">
                  {service.name}
                </h3>
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

      {/* Featured Projects */}
      <section className="py-16 md:py-20">
        <div className="container-main">
          <div className="mb-10">
            <p className="section-label">Projeler</p>
            <h2 className="section-title mt-2">Öne Çıkan Proje Uygulamaları</h2>
            <p className="section-subtitle">
              İstanbul&apos;un farklı semtlerinde tamamlanan seçilmiş proje uygulamaları.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} variant="compact" />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/projeler" className="btn-secondary">
              Tüm Projeleri Gör
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-retim-gray-dark bg-retim-gray py-16 md:py-20">
        <div className="container-main">
          <div className="mb-10">
            <p className="section-label">Katalog</p>
            <h2 className="section-title mt-2">Hizmet Türüne Göre Projeler</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCategories.map((cat) => (
              <div key={cat.slug} className="card-base">
                <h3 className="text-base font-bold text-retim-navy">{cat.name}</h3>
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

      {/* Districts */}
      <section className="py-16 md:py-20">
        <div className="container-main">
          <div className="mb-10">
            <p className="section-label">Lokasyon</p>
            <h2 className="section-title mt-2">
              İstanbul&apos;un Farklı Bölgelerinde Tamamlanan Uygulamalar
            </h2>
          </div>
          <div className="rounded-sm border border-retim-gray-dark bg-retim-gray p-6 md:p-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {homeDistricts.map((district) => (
                <Link
                  key={district}
                  href={`/projeler?semt=${encodeURIComponent(district)}`}
                  className="flex items-center justify-center rounded-sm border border-retim-gray-dark bg-white px-4 py-3 text-xs font-semibold uppercase tracking-wide text-retim-navy transition-colors hover:border-retim-orange hover:bg-retim-orange hover:text-white"
                >
                  {district}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reference Preview */}
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

      {/* Approach */}
      <section className="py-16 md:py-20">
        <div className="container-main">
          <div className="mb-10">
            <p className="section-label">Süreç</p>
            <h2 className="section-title mt-2">Her Projede Aynı Disiplin</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {approachSteps.map((step) => (
              <div key={step.step} className="card-base">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-sm bg-retim-navy text-sm font-bold text-white">
                  {step.step}
                </div>
                <h3 className="text-base font-bold text-retim-navy">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Keşif Form */}
      <section className="border-y border-retim-gray-dark bg-retim-gray py-16 md:py-20">
        <div className="container-main">
          <div className="mx-auto max-w-2xl">
            <p className="section-label text-center">Keşif Talebi</p>
            <h2 className="section-title mt-2 text-center">Ücretsiz Keşif Formu</h2>
            <p className="section-subtitle mx-auto text-center">
              Projeniz hakkında bilgi verin, en kısa sürede size dönüş yapalım.
            </p>
            <div className="mt-8 rounded-sm border border-retim-gray-dark bg-white p-6 md:p-8">
              <ContactForm compact />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-retim-navy py-16 text-white md:py-20">
        <div className="container-main text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            Binanız için doğru uygulama geçmişine sahip ekiple çalışın.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
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
