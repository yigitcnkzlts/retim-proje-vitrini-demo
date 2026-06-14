"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { services } from "@/data/services";
import { navigation, siteConfig } from "@/data/site";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setServicesOpen(false);
    setMobileOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-retim-gray-dark/80 bg-white/90 shadow-soft backdrop-blur-md"
          : "border-retim-gray-dark bg-white"
      }`}
    >
      <div className="container-main">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
            onClick={closeMobile}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded bg-retim-navy transition-all duration-300 group-hover:bg-retim-orange group-hover:shadow-glow">
              <span className="text-xl font-bold text-retim-orange transition-colors group-hover:text-white">
                R
              </span>
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
            {navigation.map((item) =>
              "hasDropdown" in item && item.hasDropdown ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <Link
                    href={item.href}
                    className={`nav-link inline-flex items-center gap-1 ${
                      isActive(item.href)
                        ? "nav-link-active text-retim-orange"
                        : "text-retim-anthracite hover:text-retim-navy"
                    }`}
                  >
                    {item.name}
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>

                  <div
                    className={`absolute left-0 top-full z-50 w-72 transition-all duration-200 ${
                      servicesOpen
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-2 opacity-0"
                    }`}
                  >
                    <div className="pt-1">
                      <div className="rounded-sm border border-retim-gray-dark bg-white py-2 shadow-lift">
                      {services.map((service) => (
                        <Link
                          key={service.slug}
                          href={`/hizmetler#${service.slug}`}
                          className="block px-4 py-2.5 text-sm text-retim-anthracite transition-colors hover:bg-retim-gray hover:text-retim-orange"
                        >
                          {service.name}
                        </Link>
                      ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${
                    isActive(item.href)
                      ? "nav-link-active text-retim-orange"
                      : "text-retim-anthracite hover:text-retim-navy"
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
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
            className="inline-flex items-center justify-center rounded p-2 text-retim-navy transition-colors hover:bg-retim-gray lg:hidden"
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

      <div
        className={`overflow-hidden border-t border-retim-gray-dark bg-white transition-all duration-300 lg:hidden ${
          mobileOpen ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="container-main flex flex-col py-4">
          {navigation.map((item) =>
            "hasDropdown" in item && item.hasDropdown ? (
              <div key={item.href}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded px-3 py-3 text-sm font-medium text-retim-anthracite hover:bg-retim-gray"
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                >
                  {item.name}
                  <svg
                    className={`h-4 w-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileServicesOpen && (
                  <div className="mb-2 ml-3 border-l-2 border-retim-gray-dark pl-3">
                    {services.map((service) => (
                      <Link
                        key={service.slug}
                        href={`/hizmetler#${service.slug}`}
                        className="block rounded px-3 py-2 text-sm text-gray-600 hover:bg-retim-gray hover:text-retim-orange"
                        onClick={closeMobile}
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded px-3 py-3 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-retim-gray text-retim-orange"
                    : "text-retim-anthracite hover:bg-retim-gray"
                }`}
                onClick={closeMobile}
              >
                {item.name}
              </Link>
            )
          )}
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
    </header>
  );
}
