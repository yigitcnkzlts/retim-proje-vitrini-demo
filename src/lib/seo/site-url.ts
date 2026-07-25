export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "https://www.retim.com.tr";
  return raw.replace(/\/$/, "");
}
