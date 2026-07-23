"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/ana-sayfa", label: "Ana Sayfa" },
  { href: "/admin/hizmetler", label: "Hizmetler" },
  { href: "/admin/hakkimizda", label: "Hakkımızda" },
  { href: "/admin/projeler", label: "Projeler" },
  { href: "/admin/referanslar", label: "Referanslar" },
  { href: "/admin/ortaklar", label: "Çözüm Ortakları" },
  { href: "/admin/formlar", label: "Keşif Talepleri" },
  { href: "/admin/ayarlar", label: "Site Ayarları" },
];

export default function AdminNav() {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <aside className="admin-sidebar">
      <div className="border-b border-white/10 px-5 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-retim-orange">
          Retim
        </p>
        <h1 className="mt-1 text-lg font-bold text-white">Yönetim Paneli</h1>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {links.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`admin-nav-link ${active ? "is-active" : ""}`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link href="/" className="admin-nav-link mb-1 block" target="_blank">
          Siteyi Görüntüle →
        </Link>
        <button type="button" onClick={handleLogout} className="admin-nav-link w-full text-left">
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
