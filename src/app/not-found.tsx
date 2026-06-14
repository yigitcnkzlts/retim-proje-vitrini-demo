import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <div className="container-main text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-retim-orange">404</p>
        <h1 className="mt-2 text-3xl font-semibold text-retim-navy">Sayfa Bulunamadı</h1>
        <p className="mt-4 text-gray-600">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-primary">
            Ana Sayfaya Dön
          </Link>
          <Link href="/projeler" className="btn-secondary">
            Projeleri İncele
          </Link>
        </div>
      </div>
    </section>
  );
}
