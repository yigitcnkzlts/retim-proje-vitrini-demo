import { getSupabaseAdmin } from "@/lib/cms/supabase";

export type VisitStats = {
  todayVisitors: number;
  yesterdayVisitors: number;
  weekVisitors: number;
  todayPageviews: number;
  configured: boolean;
  tableReady: boolean;
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
  const client = getSupabaseAdmin();
  if (!client) {
    return {
      todayVisitors: 0,
      yesterdayVisitors: 0,
      weekVisitors: 0,
      todayPageviews: 0,
      configured: false,
      tableReady: false,
    };
  }

  const today = istanbulDate(0);
  const yesterday = istanbulDate(-1);
  const weekFrom = weekStartIstanbul();

  // Tablo var mı?
  const { error: probeError } = await client.from("site_visits").select("id", { head: true, count: "exact" }).limit(1);
  if (probeError) {
    return {
      todayVisitors: 0,
      yesterdayVisitors: 0,
      weekVisitors: 0,
      todayPageviews: 0,
      configured: true,
      tableReady: false,
    };
  }

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

export async function recordVisit(input: {
  visitorId: string;
  path: string;
}): Promise<void> {
  const client = getSupabaseAdmin();
  if (!client) return;

  const visitorId = input.visitorId.trim().slice(0, 80);
  const path = (input.path || "/").trim().slice(0, 300);
  if (!visitorId || path.startsWith("/admin") || path.startsWith("/api")) return;

  const visitDate = istanbulDate(0);

  const { error } = await client.from("site_visits").insert({
    visitor_id: visitorId,
    path,
    visit_date: visitDate,
  });

  if (error) {
    // Tablo yoksa sessiz geç
    console.error("Ziyaret kaydı:", error.message);
  }
}
