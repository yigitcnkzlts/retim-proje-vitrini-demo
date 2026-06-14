import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ContactForm from "@/components/contact/ContactForm";
import MapCard from "@/components/contact/MapCard";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Retim ile iletişime geçin. Ücretsiz keşif talebi için formu doldurun.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="İletişim"
        description="Projeniz için ücretsiz keşif talebi oluşturun veya doğrudan bizimle iletişime geçin."
        breadcrumb={[{ label: "Ana Sayfa", href: "/" }, { label: "İletişim" }]}
      />

      <section className="py-12 md:py-16">
        <div className="container-main">
          <div className="grid gap-10 lg:grid-cols-2">
            <div id="kesif-formu">
              <p className="section-label">Keşif Talebi</p>
              <h2 className="mt-2 text-xl font-bold text-retim-navy">Ücretsiz Keşif Formu</h2>
              <p className="mt-2 text-sm text-gray-600">
                Formu doldurarak projeniz hakkında bilgi verin. En kısa sürede size dönüş
                yapılacaktır.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>

            <div>
              <p className="section-label">Bize Ulaşın</p>
              <h2 className="mt-2 text-xl font-bold text-retim-navy">İletişim Bilgileri</h2>
              <div className="mt-6 space-y-4">
                <div className="card-base">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Telefon
                  </h3>
                  <a
                    href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}
                    className="mt-2 block text-lg font-bold text-retim-navy hover:text-retim-orange"
                  >
                    {siteConfig.phone}
                  </a>
                </div>

                <div className="card-base">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    E-posta
                  </h3>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="mt-2 block text-lg font-bold text-retim-navy hover:text-retim-orange"
                  >
                    {siteConfig.email}
                  </a>
                </div>

                <div className="card-base">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Adres
                  </h3>
                  <p className="mt-2 font-medium text-retim-navy">{siteConfig.addressLine1}</p>
                  <p className="text-sm uppercase text-gray-600">{siteConfig.addressLine2}</p>
                </div>

                <div className="card-base">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Çalışma Saatleri
                  </h3>
                  <p className="mt-2 font-medium text-retim-navy">{siteConfig.workingHours}</p>
                  <p className="text-sm text-gray-600">{siteConfig.workingHoursClosed}</p>
                </div>
              </div>

              <div className="mt-8">
                <MapCard />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
