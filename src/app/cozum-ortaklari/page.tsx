import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { partners } from "@/data/partners";

export const metadata: Metadata = {
  title: "Çözüm Ortakları",
  description: "Retim'in malzeme ve uygulama alanında iş birliği yaptığı çözüm ortakları.",
};

export default function PartnersPage() {
  return (
    <>
      <PageHero
        title="Çözüm Ortakları"
        description="Retim, dış cephe ve yapı uygulamalarında sektörün önde gelen malzeme üreticileri ile çalışarak kaliteli ve uzun ömürlü sonuçlar sunar."
        breadcrumb={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Çözüm Ortakları" },
        ]}
      />

      <ScrollReveal>
        <section className="py-12 md:py-16">
          <div className="container-main">
            <div className="mb-10">
              <p className="section-label">İş Birlikleri</p>
              <h2 className="section-title mt-2">Güvenilir Malzeme Ortakları</h2>
              <p className="section-subtitle">
                Mantolama, boya ve yalıtım uygulamalarında üretici standartlarına uygun malzeme
                tercihleri ile projeler tamamlanır.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {partners.map((partner) => (
                <div
                  key={partner.name}
                  className="partner-card group flex min-h-[5.5rem] items-center justify-center rounded-sm border border-retim-gray-dark bg-white px-4 py-5 text-center shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-retim-orange/35 hover:shadow-lift"
                >
                  <h3 className="text-sm font-bold leading-snug text-retim-navy transition-colors duration-300 group-hover:text-retim-orange md:text-base">
                    {partner.name}
                  </h3>
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-sm border border-retim-gray-dark bg-retim-gray p-8 text-center">
              <h3 className="text-lg font-bold text-retim-navy">Projeniz için doğru malzeme seçimi</h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600">
                Keşif sürecinde bina tipi, cephe durumu ve bütçe kriterlerine göre en uygun uygulama
                ve malzeme kombinasyonu belirlenir.
              </p>
              <Link href="/iletisim#kesif-formu" className="btn-primary btn-kesif mt-6">
                Ücretsiz Keşif Al
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
