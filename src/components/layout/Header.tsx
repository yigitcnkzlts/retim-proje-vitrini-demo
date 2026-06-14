"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navigation, siteConfig } from "@/data/site";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const closeMobile = () => setMobileOpen(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-retim-gray-dark bg-white shadow-sm">
      <div className="container-main">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3" onClick={closeMobile}>
            <div className="flex h-11 w-11 items-center justify-center rounded bg-retim-navy">
              <span className="text-xl font-bold text-retim-orange">R</span>
            </div>
            <div className="hidden sm:block">
              <span className="block text-lg font-bold tracking-tight text-retim-navy">
                {siteConfig.name}
              </span>
              <span className="block text-[11px] uppercase tracking-wider text-gray-500">
                Proje Vitrini
              </span>
            </div>
          </Link>

          <nav className="hidden items-center lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  isActive(item.href)
                    ? "text-retim-orange"
                    : "text-retim-anthracite hover:text-retim-navy"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/projeler" className="btn-secondary text-xs uppercase tracking-wide">
              Projeler
            </Link>
            <Link href="/iletisim#kesif-formu" className="btn-primary text-xs uppercase tracking-wide">
              Ücretsiz Keşif Al
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded p-2 text-retim-navy lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menüyü aç"
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-retim-gray-dark bg-white lg:hidden">
          <nav className="container-main flex flex-col py-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded px-3 py-3 text-sm font-medium ${
                  isActive(item.href)
                    ? "bg-retim-gray text-retim-orange"
                    : "text-retim-anthracite hover:bg-retim-gray"
                }`}
                onClick={closeMobile}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 border-t border-retim-gray-dark pt-4">
              <Link href="/projeler" className="btn-secondary text-center" onClick={closeMobile}>
                Projeler
              </Link>
              <Link
                href="/iletisim#kesif-formu"
                className="btn-primary text-center"
                onClick={closeMobile}
              >
                Ücretsiz Keşif Al
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
