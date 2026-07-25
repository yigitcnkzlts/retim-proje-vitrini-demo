import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { getFaqCategories } from "@/lib/cms/faq";

export const metadata: Metadata = {
  title: "Bilgi Merkezi",
  description: "Retim Restorasyon bilgi merkezi ve sık sorulan sorular.",
  alternates: { canonical: "/bilgi-merkezi" },
};

export default async function InformationCenterPage() {
  const categories = await getFaqCategories();

  return (
    <>
      <PageHero
        title="Bilgi Merkezi"
        description="Bina restorasyonu, mantolama, yalıtım ve güçlendirme konularında teknik ve pratik bilgilere erişin."
        breadcrumb={[{ label: "Ana Sayfa", href: "/" }, { label: "Bilgi Merkezi" }]}
      />

      <section className="py-12 md:py-16">
        <div className="container-main">
          <div className="rounded-sm border border-retim-gray-dark bg-retim-gray p-6 md:p-8">
            <p className="section-label">Bilgilendirme Notu</p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-700 md:text-base">
              Bu içerikler genel bilgilendirme amaçlıdır. Her yapının durumu farklıdır; kesin teknik
              değerlendirme ve uygulama kapsamı yerinde inceleme ve gerekli mühendislik çalışmaları
              sonrasında belirlenir.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
            <aside className="rounded-sm border border-retim-gray-dark bg-white p-6 shadow-soft">
              <h2 className="text-lg font-bold text-retim-navy">Kategoriler</h2>
              <ul className="mt-5 space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`#${category.id}`}
                      className="flex items-center rounded-sm px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-retim-gray hover:text-retim-orange"
                    >
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-retim-orange" aria-hidden />
                      {category.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="space-y-8">
              {categories.map((category) => (
                <section
                  key={category.id}
                  id={category.id}
                  className="rounded-sm border border-retim-gray-dark bg-white p-6 shadow-soft md:p-8"
                >
                  <h2 className="text-xl font-bold text-retim-navy">{category.title}</h2>
                  <div className="mt-6 space-y-4">
                    {category.items.map((item) => (
                      <article
                        key={item.question}
                        className="rounded-sm border border-retim-gray-dark/70 bg-retim-gray/50 p-4"
                      >
                        <h3 className="text-base font-semibold text-retim-navy">{item.question}</h3>
                        <p className="mt-2 text-sm leading-7 text-gray-700">{item.answer}</p>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
