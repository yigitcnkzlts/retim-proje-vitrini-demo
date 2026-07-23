import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ServiceCard from "@/components/services/ServiceCard";
import { getServices } from "@/lib/cms/services";

export const metadata: Metadata = {
  title: "Hizmetler",
  description: "Retim'in dış cephe, yalıtım, restorasyon ve güçlendirme hizmetleri.",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageHero
        title="Hizmetler"
        description="Retim Restorasyon, İstanbul merkezli operasyon yapısıyla başta İstanbul olmak üzere seçili bölgelerde dış cephe renovasyonu, çatı ve teras yalıtımı, drenaj, tarihi bina restorasyonu ve güçlendirme uygulamaları gerçekleştirmektedir."
        breadcrumb={[{ label: "Ana Sayfa", href: "/" }, { label: "Hizmetler" }]}
      />

      <section className="py-12 md:py-16">
        <div className="container-main">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
