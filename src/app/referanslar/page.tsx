import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ReferenceArchive from "@/components/references/ReferenceArchive";
import { getArchiveReferences } from "@/lib/cms/references";

export const metadata: Metadata = {
  title: "Referanslar",
  description: "Retim Restorasyon tamamlanmış uygulama referansları.",
  alternates: { canonical: "/referanslar" },
};

export const revalidate = 60;

export default async function ReferencesPage() {
  const references = await getArchiveReferences();

  return (
    <>
      <PageHero
        title="Referanslar"
        description="İstanbul merkezli Retim Restorasyon, apartman, site ve özel yapılarda dış cephe, çatı, yalıtım ve güçlendirme ihtiyaçlarına uzun yıllara dayanan uygulama deneyimiyle çözüm sunar. Referanslarımız ise en güçlü güvencemizdir."
        breadcrumb={[{ label: "Ana Sayfa", href: "/" }, { label: "Referanslar" }]}
      />

      <section className="py-12 md:py-16">
        <div className="container-main">
          <ReferenceArchive items={references} />
        </div>
      </section>
    </>
  );
}
