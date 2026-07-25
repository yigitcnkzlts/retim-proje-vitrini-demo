"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "retim_vid";

function getVisitorId(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing && existing.length >= 8) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `v-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    return `v-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

/** Public sayfa görüntülemelerini kaydeder (admin hariç). */
export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    const visitorId = getVisitorId();
    const payload = JSON.stringify({ visitorId, path: pathname });

    // Aynı oturumda aynı path'i 15 sn içinde tekrar yazma
    const dedupeKey = `retim_pv_${pathname}`;
    try {
      const last = sessionStorage.getItem(dedupeKey);
      if (last && Date.now() - Number(last) < 15_000) return;
      sessionStorage.setItem(dedupeKey, String(Date.now()));
    } catch {
      /* ignore */
    }

    // sendBeacon bazı ortamlarda JSON body'yi bozuyor — fetch daha güvenilir
    void fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
      cache: "no-store",
    }).catch(() => undefined);
  }, [pathname]);

  return null;
}
