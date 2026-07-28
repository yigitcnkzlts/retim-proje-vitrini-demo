import { getSupabaseAdmin } from "@/lib/cms/supabase";

export type MediaUsageRef = {
  type: "project" | "service" | "partner" | "about";
  label: string;
  href: string;
};

function pushUsage(
  map: Map<string, MediaUsageRef[]>,
  url: string | null | undefined,
  ref: MediaUsageRef
) {
  if (!url || !url.startsWith("http")) return;
  const list = map.get(url) ?? [];
  if (!list.some((r) => r.href === ref.href && r.label === ref.label)) {
    list.push(ref);
  }
  map.set(url, list);
}

/** Tüm CMS görsellerini tarayıp URL → kullanım yerleri haritası üretir. */
export async function getMediaUsageMap(): Promise<Record<string, MediaUsageRef[]>> {
  const client = getSupabaseAdmin();
  if (!client) return {};

  const map = new Map<string, MediaUsageRef[]>();

  const [projectsRes, servicesRes, partnersRes, aboutRes] = await Promise.all([
    client.from("projects").select("slug, name, image_url, gallery"),
    client.from("services").select("slug, name, image_url"),
    client.from("partners").select("id, name, logo_url"),
    client.from("about_content").select("id, founder_image").eq("id", 1).maybeSingle(),
  ]);

  for (const row of projectsRes.data ?? []) {
    const slug = String(row.slug ?? "");
    const name = String(row.name ?? slug);
    pushUsage(map, row.image_url as string | null, {
      type: "project",
      label: `Proje: ${name}`,
      href: `/admin/projeler/${slug}`,
    });
    const gallery = Array.isArray(row.gallery) ? row.gallery : [];
    for (const item of gallery) {
      if (!item || typeof item !== "object") continue;
      const g = item as { url?: string; kind?: string };
      if (!g.url) continue;
      const kind =
        g.kind === "before" ? "önce" : g.kind === "after" ? "sonra" : "galeri";
      pushUsage(map, g.url, {
        type: "project",
        label: `Proje galeri (${kind}): ${name}`,
        href: `/admin/projeler/${slug}`,
      });
    }
  }

  for (const row of servicesRes.data ?? []) {
    pushUsage(map, row.image_url as string | null, {
      type: "service",
      label: `Hizmet: ${String(row.name ?? row.slug)}`,
      href: "/admin/hizmetler",
    });
  }

  for (const row of partnersRes.data ?? []) {
    pushUsage(map, row.logo_url as string | null, {
      type: "partner",
      label: `Ortak: ${String(row.name ?? "")}`,
      href: "/admin/ortaklar",
    });
  }

  if (aboutRes.data?.founder_image) {
    pushUsage(map, aboutRes.data.founder_image as string, {
      type: "about",
      label: "Hakkımızda — kurucu görseli",
      href: "/admin/hakkimizda",
    });
  }

  return Object.fromEntries(map);
}
