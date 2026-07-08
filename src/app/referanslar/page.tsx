import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ReferenceArchive from "@/components/references/ReferenceArchive";
import { getArchiveReferences } from "@/lib/cms/references";

export const metadata: Metadata = {
  title: "Referanslar",
  description: "Retim'in 1986-1988 döneminde tamamladığı proje referans arşivi.",
};

export const revalidate = 60;

export default async function ReferencesPage() {
  const references = await getArchiveReferences();

  return (
    <>
      <PageHero
        title="Referanslar"
        description="Retim'in 1986-1988 döneminde tamamladığı seçili restorasyon ve dış cephe referansları."
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
