import { getSupabaseAdmin } from "@/lib/cms/supabase";

export type VisitStats = {
  todayVisitors: number;
  yesterdayVisitors: number;
  weekVisitors: number;
  todayPageviews: number;
  configured: boolean;
  tableReady: boolean;
};

export type PathStat = {
  path: string;
  views: number;
};

export type DailyStat = {
  date: string;
  pageviews: number;
  visitors: number;
};

export type AnalyticsReport = {
  days: number;
  fromDate: string;
  toDate: string;
  totalPageviews: number;
  totalVisitors: number;
  topPaths: PathStat[];
  daily: DailyStat[];
  configured: boolean;
  tableReady: boolean;
};

type VisitRow = {
  visitor_id: string;
  path: string;
  visit_date: string;
};

/** Avrupa/İstanbul takvim günü (YYYY-MM-DD) */
export function istanbulDate(offsetDays = 0): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const now = new Date();
  const base = new Date(now.getTime() + offsetDays * 24 * 60 * 60 * 1000);
  return fmt.format(base);
}

function weekStartIstanbul(): string {
  // Bugünden geriye 6 gün = son 7 gün
  return istanbulDate(-6);
}

function pathLabel(path: string): string {
  if (!path || path === "/") return "/ (Ana Sayfa)";
  return path;
}

async function probeTableReady(): Promise<{ configured: boolean; tableReady: boolean }> {
  const client = getSupabaseAdmin();
  if (!client) return { configured: false, tableReady: false };

  const { error: probeError, count: probeCount } = await client
    .from("site_visits")
    .select("id", { head: true, count: "exact" })
    .limit(1);

  if (probeError || probeCount === null) {
    return { configured: true, tableReady: false };
  }
  return { configured: true, tableReady: true };
}

async function countDistinctVisitors(fromDate: string, toDate: string): Promise<number> {
  const client = getSupabaseAdmin();
  if (!client) return 0;

  const { data, error } = await client
    .from("site_visits")
    .select("visitor_id")
    .gte("visit_date", fromDate)
    .lte("visit_date", toDate);

  if (error || !data) return 0;
  return new Set(data.map((r) => r.visitor_id as string)).size;
}

async function countPageviews(date: string): Promise<number> {
  const client = getSupabaseAdmin();
  if (!client) return 0;

  const { count, error } = await client
    .from("site_visits")
    .select("*", { count: "exact", head: true })
    .eq("visit_date", date);

  if (error) return 0;
  return count ?? 0;
}

export async function getVisitStats(): Promise<VisitStats> {
  const probe = await probeTableReady();
  if (!probe.configured) {
    return {
      todayVisitors: 0,
      yesterdayVisitors: 0,
      weekVisitors: 0,
      todayPageviews: 0,
      configured: false,
      tableReady: false,
    };
  }
  if (!probe.tableReady) {
    return {
      todayVisitors: 0,
      yesterdayVisitors: 0,
      weekVisitors: 0,
      todayPageviews: 0,
      configured: true,
      tableReady: false,
    };
  }

  const today = istanbulDate(0);
  const yesterday = istanbulDate(-1);
  const weekFrom = weekStartIstanbul();

  const [todayVisitors, yesterdayVisitors, weekVisitors, todayPageviews] = await Promise.all([
    countDistinctVisitors(today, today),
    countDistinctVisitors(yesterday, yesterday),
    countDistinctVisitors(weekFrom, today),
    countPageviews(today),
  ]);

  return {
    todayVisitors,
    yesterdayVisitors,
    weekVisitors,
    todayPageviews,
    configured: true,
    tableReady: true,
  };
}

/** Son N gün: günlük trend + en çok görülen sayfalar */
export async function getAnalyticsReport(days: 7 | 30 = 7): Promise<AnalyticsReport> {
  const toDate = istanbulDate(0);
  const fromDate = istanbulDate(-(days - 1));
  const emptyDaily = (): DailyStat[] =>
    Array.from({ length: days }, (_, i) => ({
      date: istanbulDate(-(days - 1 - i)),
      pageviews: 0,
      visitors: 0,
    }));

  const probe = await probeTableReady();
  if (!probe.configured || !probe.tableReady) {
    return {
      days,
      fromDate,
      toDate,
      totalPageviews: 0,
      totalVisitors: 0,
      topPaths: [],
      daily: emptyDaily(),
      configured: probe.configured,
      tableReady: probe.tableReady,
    };
  }

  const client = getSupabaseAdmin();
  if (!client) {
    return {
      days,
      fromDate,
      toDate,
      totalPageviews: 0,
      totalVisitors: 0,
      topPaths: [],
      daily: emptyDaily(),
      configured: false,
      tableReady: false,
    };
  }

  const { data, error } = await client
    .from("site_visits")
    .select("visitor_id, path, visit_date")
    .gte("visit_date", fromDate)
    .lte("visit_date", toDate);

  if (error || !data) {
    return {
      days,
      fromDate,
      toDate,
      totalPageviews: 0,
      totalVisitors: 0,
      topPaths: [],
      daily: emptyDaily(),
      configured: true,
      tableReady: true,
    };
  }

  const rows = data as VisitRow[];
  const pathCounts = new Map<string, number>();
  const dayPageviews = new Map<string, number>();
  const dayVisitors = new Map<string, Set<string>>();
  const allVisitors = new Set<string>();

  for (const row of rows) {
    const path = pathLabel(row.path || "/");
    pathCounts.set(path, (pathCounts.get(path) || 0) + 1);

    const d = row.visit_date;
    dayPageviews.set(d, (dayPageviews.get(d) || 0) + 1);
    if (!dayVisitors.has(d)) dayVisitors.set(d, new Set());
    dayVisitors.get(d)!.add(row.visitor_id);
    allVisitors.add(row.visitor_id);
  }

  const topPaths: PathStat[] = [...pathCounts.entries()]
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 20);

  const daily: DailyStat[] = Array.from({ length: days }, (_, i) => {
    const date = istanbulDate(-(days - 1 - i));
    return {
      date,
      pageviews: dayPageviews.get(date) || 0,
      visitors: dayVisitors.get(date)?.size || 0,
    };
  });

  return {
    days,
    fromDate,
    toDate,
    totalPageviews: rows.length,
    totalVisitors: allVisitors.size,
    topPaths,
    daily,
    configured: true,
    tableReady: true,
  };
}

export async function recordVisit(input: {
  visitorId: string;
  path: string;
}): Promise<void> {
  const client = getSupabaseAdmin();
  if (!client) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY eksik — ziyaret kaydedilemedi.");
  }

  const visitorId = input.visitorId.trim().slice(0, 80);
  const path = (input.path || "/").trim().slice(0, 300);
  if (!visitorId || path.startsWith("/admin") || path.startsWith("/api") || path.startsWith("/onizleme")) return;

  const visitDate = istanbulDate(0);

  const { error } = await client.from("site_visits").insert({
    visitor_id: visitorId,
    path,
    visit_date: visitDate,
  });

  if (error) {
    throw new Error(error.message);
  }
}
