import Link from "next/link";
import ContactForm from "@/components/contact/ContactForm";
import BeforeAfterSection from "@/components/home/BeforeAfterSection";
import HomeServiceTile from "@/components/home/HomeServiceTile";
import DiscoveryProcessSection from "@/components/home/DiscoveryProcessSection";
import StatsSection from "@/components/home/StatsSection";
import HeroBanner from "@/components/ui/HeroBanner";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TrustStrip from "@/components/ui/TrustStrip";
import { services } from "@/data/services";
import { approachSteps, homeDistricts, siteConfig } from "@/data/site";

export default function HomePage() {
  const tickerItems = homeDistricts;

  return (
    <>
      <HeroBanner
        title="Yüzlerce Onarılan Binada Retim İmzası"
        description={siteConfig.description}
        tickerItems={tickerItems}
      />

      <TrustStrip />

      <ScrollReveal>
        <StatsSection />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <DiscoveryProcessSection />
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
        <section className="border-b border-retim-gray-dark bg-retim-gray py-16 md:py-20">
          <div className="container-main">
            <div className="mb-10">
              <p className="section-label">Hizmetler</p>
              <h2 className="section-title mt-2">Uygulama Alanlarımız</h2>
              <p className="section-subtitle">
                Mantolama, boya, çatı yalıtımı ve drenaj alanlarında kapsamlı hizmet.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <HomeServiceTile key={service.slug} service={service} />
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

      <section className="home-cta-band relative overflow-hidden bg-gradient-to-br from-[#1a1512] via-retim-anthracite to-retim-orange/90 py-16 text-white md:py-24">
        <div className="hero-glow-orb left-1/2 top-0 h-64 w-64 -translate-x-1/2" />
        <div className="container-main relative text-center">
          <h2 className="animate-fade-up text-2xl font-bold md:text-3xl">
            Binanız için doğru uygulama geçmişine sahip ekiple çalışın.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl animate-fade-up text-gray-300" style={{ animationDelay: "150ms" }}>
            Dış cephe, yalıtım, restorasyon veya güçlendirme ihtiyaçlarınız için Retim&apos;in
            proje deneyiminden faydalanın.
          </p>
          <Link href="/iletisim#kesif-formu" className="btn-primary btn-kesif mt-8">
            Ücretsiz Keşif Al
          </Link>
        </div>
      </section>
    </>
  );
}
