import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ServiceCard from "@/components/services/ServiceCard";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Hizmetler",
  description: "Retim'in dış cephe, yalıtım, restorasyon ve güçlendirme hizmetleri.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Hizmetler"
        description="Retim'in 35 yılı aşkın deneyimiyle sunduğu yapı uygulama hizmetleri. Her hizmet, tamamlanan proje referanslarıyla desteklenmektedir."
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
