import Link from "next/link";
import { getVisitStats } from "@/lib/cms/analytics";
import { getAllProjectsAdmin } from "@/lib/cms/projects";
import { getAllRefsAdmin } from "@/lib/cms/references";
import { getAllPartnersAdmin } from "@/lib/cms/partners";
import { getAllServicesAdmin } from "@/lib/cms/services";
import { getSubmissionsAdmin, getUnreadSubmissionCount } from "@/lib/cms/submissions";
import { isCmsConfigured } from "@/lib/cms/supabase";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const configured = isCmsConfigured();
  const [projects, catalogRefs, archiveRefs, partners, services, submissions, unread, visits] =
    await Promise.all([
      configured ? getAllProjectsAdmin() : Promise.resolve([]),
      configured ? getAllRefsAdmin("catalog") : Promise.resolve([]),
      configured ? getAllRefsAdmin("archive") : Promise.resolve([]),
      configured ? getAllPartnersAdmin() : Promise.resolve([]),
      configured ? getAllServicesAdmin() : Promise.resolve([]),
      configured ? getSubmissionsAdmin() : Promise.resolve([]),
      configured ? getUnreadSubmissionCount() : Promise.resolve(0),
      getVisitStats(),
    ]);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-retim-navy">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Retim web sitesi içerik yönetimi ve ziyaret özeti</p>
      </div>

      {!configured && (
        <div className="admin-alert mb-6">
          <strong>Supabase henüz bağlı değil.</strong>{" "}
          <code className="text-xs">.env.local</code> dosyasına Supabase anahtarlarını ekleyin.
        </div>
      )}

      {configured && !visits.tableReady && (
        <div className="admin-alert mb-6">
          <strong>Ziyaretçi tablosu yok.</strong> Supabase SQL Editor&apos;da{" "}
          <code className="text-xs">supabase/migrations/0003_site_visits.sql</code> dosyasını
          çalıştırın. Sonra bugün/dün ziyaretçi sayıları burada görünür.
        </div>
      )}

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Site Etkileşimi
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Bugün ziyaretçi"
            value={visits.todayVisitors}
            hint="Benzersiz kişi (İstanbul saati)"
          />
          <StatCard
            label="Dün ziyaretçi"
            value={visits.yesterdayVisitors}
            hint="Benzersiz kişi"
          />
          <StatCard
            label="Son 7 gün"
            value={visits.weekVisitors}
            hint="Benzersiz ziyaretçi"
          />
          <StatCard
            label="Bugün sayfa görüntüleme"
            value={visits.todayPageviews}
            hint="Toplam tıklama / sayfa"
          />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          İçerik
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Hizmetler" value={services.length} href="/admin/hizmetler" />
          <StatCard label="Projeler" value={projects.length} href="/admin/projeler" />
          <StatCard label="Katalog Referans" value={catalogRefs.length} href="/admin/referanslar" />
          <StatCard label="Çözüm Ortağı" value={partners.length} href="/admin/ortaklar" />
          <StatCard
            label="Keşif Talebi"
            value={submissions.length}
            badge={unread > 0 ? `${unread} yeni` : undefined}
            href="/admin/formlar"
          />
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="admin-card">
          <h2 className="admin-card-title">Hızlı İşlemler</h2>
          <div className="mt-4 space-y-2">
            <QuickLink href="/admin/ana-sayfa" label="Ana sayfa hero ve istatistikler" />
            <QuickLink href="/admin/hizmetler" label="Hizmetleri düzenle" />
            <QuickLink href="/admin/hakkimizda" label="Hakkımızda metinleri" />
            <QuickLink href="/admin/projeler" label="Proje detaylarını düzenle" />
            <QuickLink href="/admin/referanslar" label="Yeni referans ekle" />
            <QuickLink href="/admin/ortaklar" label="Çözüm ortağı yönet" />
            <QuickLink href="/admin/formlar" label="Keşif taleplerini görüntüle" />
            <QuickLink href="/admin/ayarlar" label="Telefon ve iletişim bilgileri" />
          </div>
        </section>

        <section className="admin-card">
          <h2 className="admin-card-title">Son Keşif Talepleri</h2>
          {submissions.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">Henüz kayıt yok.</p>
          ) : (
            <ul className="mt-4 divide-y divide-gray-100">
              {submissions.slice(0, 5).map((s) => (
                <li key={s.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium text-retim-navy">{s.name}</p>
                    <p className="text-gray-500">{s.phone}</p>
                  </div>
                  {!s.is_read && (
                    <span className="rounded-full bg-retim-orange/10 px-2 py-0.5 text-xs font-semibold text-retim-orange">
                      Yeni
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="mt-6 text-xs text-gray-500">
        Arşiv referansları: {archiveRefs.length} kayıt · Ziyaretçi sayıları tarayıcı kimliği ile
        hesaplanır (yaklaşık benzersiz kişi).
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
  badge,
  hint,
}: {
  label: string;
  value: number;
  href?: string;
  badge?: string;
  hint?: string;
}) {
  const inner = (
    <>
      <p className="text-sm text-gray-500">{label}</p>
      <div className="mt-2 flex items-center gap-2">
        <p className="text-3xl font-bold text-retim-navy">{value}</p>
        {badge && (
          <span className="rounded-full bg-retim-orange px-2 py-0.5 text-xs font-semibold text-white">
            {badge}
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="admin-stat-card">
        {inner}
      </Link>
    );
  }

  return <div className="admin-stat-card">{inner}</div>;
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-retim-navy transition hover:border-retim-orange/30 hover:bg-retim-orange/5"
    >
      {label} →
    </Link>
  );
}
