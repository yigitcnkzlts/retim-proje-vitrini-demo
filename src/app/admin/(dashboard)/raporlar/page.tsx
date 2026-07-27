import Link from "next/link";
import { getAnalyticsReport } from "@/lib/cms/analytics";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ gun?: string }>;
}

export default async function AdminReportsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const days: 7 | 30 = params.gun === "30" ? 30 : 7;
  const report = await getAnalyticsReport(days);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-retim-navy">Ziyaret Raporları</h1>
          <p className="mt-1 text-sm text-gray-600">
            Hangi sayfa kaç kez görüldü · {report.fromDate} → {report.toDate} (İstanbul saati)
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/raporlar?gun=7"
            className={`admin-tab ${days === 7 ? "is-active" : ""}`}
          >
            Son 7 gün
          </Link>
          <Link
            href="/admin/raporlar?gun=30"
            className={`admin-tab ${days === 30 ? "is-active" : ""}`}
          >
            Son 30 gün
          </Link>
        </div>
      </div>

      {!report.configured && (
        <div className="admin-alert mb-6">
          <strong>Supabase henüz bağlı değil.</strong> Ziyaret verileri görünmez.
        </div>
      )}

      {report.configured && !report.tableReady && (
        <div className="admin-alert mb-6">
          <strong>Ziyaretçi tablosu yok.</strong>{" "}
          <code className="text-xs">supabase/migrations/0003_site_visits.sql</code> dosyasını
          çalıştırın veya <code className="text-xs">npm run setup:analytics</code> kullanın.
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="admin-stat-card">
          <p className="text-sm text-gray-500">Toplam sayfa görüntüleme</p>
          <p className="mt-2 text-3xl font-bold text-retim-navy">{report.totalPageviews}</p>
        </div>
        <div className="admin-stat-card">
          <p className="text-sm text-gray-500">Benzersiz ziyaretçi</p>
          <p className="mt-2 text-3xl font-bold text-retim-navy">{report.totalVisitors}</p>
        </div>
      </div>

      <AnalyticsCharts daily={report.daily} topPaths={report.topPaths} days={days} />

      <p className="mt-6 text-xs text-gray-500">
        <Link href="/admin/dashboard" className="text-retim-orange hover:underline">
          ← Dashboard
        </Link>
        {" · "}Veri kaynağı: <code>site_visits</code>
      </p>
    </div>
  );
}
