import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ReferenceArchive from "@/components/references/ReferenceArchive";

export const metadata: Metadata = {
  title: "Referanslar",
  description: "Retim'in 1989'dan günümüze tamamladığı proje referans arşivi.",
};

export default function ReferencesPage() {
  return (
    <>
      <PageHero
        title="Referanslar"
        description="Bu sayfadaki referans listesi, Retim'in mevcut web sitesinde yayınlanan proje bilgilerinden demo arayüzüne uyarlanmıştır. Lütfen yıl seçerek filtreleyin."
        breadcrumb={[{ label: "Ana Sayfa", href: "/" }, { label: "Referanslar" }]}
      />

      <section className="py-12 md:py-16">
        <div className="container-main">
          <ReferenceArchive />
        </div>
      </section>
    </>
  );
}
