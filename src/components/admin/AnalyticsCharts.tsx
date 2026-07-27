"use client";

import type { DailyStat, PathStat } from "@/lib/cms/analytics";

type Props = {
  daily: DailyStat[];
  topPaths: PathStat[];
  days: 7 | 30;
};

function formatShortDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}.${m}`;
}

export default function AnalyticsCharts({ daily, topPaths, days }: Props) {
  const maxViews = Math.max(1, ...daily.map((d) => d.pageviews));
  const maxPath = Math.max(1, ...topPaths.map((p) => p.views));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="admin-card">
        <h2 className="admin-card-title">Günlük trend ({days} gün)</h2>
        <p className="mt-1 text-xs text-gray-500">Sayfa görüntüleme (çubuk) · ziyaretçi sayısı etiketlerde</p>

        {daily.every((d) => d.pageviews === 0) ? (
          <p className="mt-6 text-sm text-gray-500">Bu dönemde henüz kayıt yok.</p>
        ) : (
          <div className="mt-6 flex h-48 items-end gap-1 sm:gap-1.5">
            {daily.map((d) => {
              const h = Math.max(2, Math.round((d.pageviews / maxViews) * 100));
              return (
                <div key={d.date} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] tabular-nums text-gray-400">{d.visitors}</span>
                  <div
                    className="w-full rounded-t bg-retim-orange/80 transition-all hover:bg-retim-orange"
                    style={{ height: `${h}%` }}
                    title={`${d.date}: ${d.pageviews} görüntüleme, ${d.visitors} ziyaretçi`}
                  />
                  <span className="truncate text-[9px] text-gray-500 sm:text-[10px]">
                    {formatShortDate(d.date)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="admin-card">
        <h2 className="admin-card-title">En çok görülen sayfalar</h2>
        <p className="mt-1 text-xs text-gray-500">/referanslar, /iletisim, /projeler…</p>

        {topPaths.length === 0 ? (
          <p className="mt-6 text-sm text-gray-500">Bu dönemde sayfa kaydı yok.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {topPaths.map((p) => (
              <li key={p.path}>
                <div className="mb-0.5 flex items-center justify-between gap-2 text-sm">
                  <span className="truncate font-medium text-retim-navy" title={p.path}>
                    {p.path}
                  </span>
                  <span className="shrink-0 tabular-nums text-gray-500">{p.views}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded bg-gray-100">
                  <div
                    className="h-full rounded bg-retim-navy/70"
                    style={{ width: `${Math.round((p.views / maxPath) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
