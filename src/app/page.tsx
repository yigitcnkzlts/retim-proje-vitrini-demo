import Link from "next/link";
import ContactForm from "@/components/contact/ContactForm";
import BeforeAfterSection from "@/components/home/BeforeAfterSection";
import HomeServiceTile from "@/components/home/HomeServiceTile";
import DiscoveryProcessSection from "@/components/home/DiscoveryProcessSection";
import StatsSection from "@/components/home/StatsSection";
import HeroBanner from "@/components/ui/HeroBanner";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TrustStrip from "@/components/ui/TrustStrip";
import { getServices } from "@/lib/cms/services";
import { getHomeContent } from "@/lib/cms/home-content";
import { getFeaturedServices } from "@/lib/seo/featured-services";

export default async function HomePage() {
  const [services, homeContent] = await Promise.all([getServices(), getHomeContent()]);
  const featuredServices = getFeaturedServices(services);
  const tickerItems = homeContent.homeDistricts;

  return (
    <>
      <HeroBanner
        title={homeContent.heroTitle}
        description={homeContent.heroDescription}
        tickerItems={tickerItems}
      />

      <TrustStrip />

      <ScrollReveal>
        <StatsSection stats={homeContent.stats} />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <DiscoveryProcessSection
          problemsSection={homeContent.problemsSection}
          discoverySection={homeContent.discoverySection}
        />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <BeforeAfterSection />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <section className="py-16 md:py-20">
          <div className="container-main">
            <div className="mb-10">
              <p className="section-label">Süreç</p>
              <h2 className="section-title mt-2">Her Projede Aynı Disiplin</h2>
            </div>
            <div className="approach-timeline grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {homeContent.approachSteps.map((step, i) => (
                <div key={`${step.title}-${i}`} className="approach-card">
                  <div className="approach-number">{i + 1}</div>
                  <h3 className="text-base font-bold text-retim-navy">{step.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <section className="border-b border-retim-gray-dark bg-retim-gray py-16 md:py-20">
          <div className="container-main">
            <div className="mb-10">
              <p className="section-label">Hizmetler</p>
              <h2 className="section-title mt-2">
                <Link href="/hizmetler" className="transition-colors hover:text-retim-orange">
                  Uygulama Alanlarımız
                </Link>
              </h2>
              <p className="section-subtitle">
                Mantolama, dış cephe boya, çatı yalıtımı, drenaj ve güçlendirme için{" "}
                <Link href="/hizmetler" className="font-medium text-retim-navy underline-offset-2 hover:text-retim-orange hover:underline">
                  Retim hizmetlerini
                </Link>{" "}
                inceleyin.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {featuredServices.map((service) => (
                <HomeServiceTile key={service.slug} service={service} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/hizmetler" className="btn-primary">
                Tüm Hizmetleri İncele
              </Link>
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
                {homeContent.discoveryLead}
              </p>
              <div className="form-glow mt-8 rounded-sm border border-retim-gray-dark bg-white p-6 shadow-lift md:p-8">
                <ContactForm compact />
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <section className="home-cta-band relative overflow-hidden bg-gradient-to-br from-[#1a1512] via-retim-anthracite to-retim-orange/90 py-16 text-white md:py-24">
        <div className="hero-glow-orb left-1/2 top-0 h-64 w-64 -translate-x-1/2" />
        <div className="container-main relative text-center">
          <h2 className="animate-fade-up text-2xl font-bold md:text-3xl">
            Binanız için doğru uygulama geçmişine sahip ekiple çalışın.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl animate-fade-up text-gray-300" style={{ animationDelay: "150ms" }}>
            Mantolama, yalıtım veya güçlendirme ihtiyaçlarınız için{" "}
            <Link href="/hizmetler" className="text-white underline underline-offset-2 hover:text-retim-orange">
              Retim hizmetlerini
            </Link>{" "}
            inceleyin.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/hizmetler" className="btn-primary">
              Hizmetleri İncele
            </Link>
            <Link href="/iletisim#kesif-formu" className="btn-outline-white btn-kesif">
              Ücretsiz Keşif Al
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
