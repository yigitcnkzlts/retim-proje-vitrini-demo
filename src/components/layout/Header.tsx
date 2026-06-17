"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { services } from "@/data/services";
import { navigation, siteConfig } from "@/data/site";
import { projectImages } from "@/data/images";

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

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navLinkClass = (href: string) =>
    `nav-link ${isActive(href) ? "nav-link-active text-retim-orange" : "text-retim-anthracite hover:text-retim-navy"}`;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-retim-gray-dark/80 bg-white/95 shadow-soft backdrop-blur-md"
          : "border-retim-gray-dark bg-white"
      }`}
    >
      <div className="container-main">
        <div className="flex h-[4.25rem] items-center justify-between gap-3 sm:h-[4.5rem] lg:gap-4">
          <Link
            href="/"
            className="group flex min-w-0 flex-shrink-0 items-center gap-2.5 transition-transform duration-300 hover:scale-[1.01] sm:gap-3"
            onClick={closeMobile}
          >
            <Image
              src={projectImages.logo}
              alt={siteConfig.name}
              width={220}
              height={66}
              className="site-logo"
              quality={95}
              priority
            />
            <div className="header-brand-badge hidden md:flex">
              <span>Proje Vitrini</span>
            </div>
          </Link>

          <nav className="hidden flex-1 items-center justify-center lg:flex">
            {navigation.map((item) =>
              "hasDropdown" in item && item.hasDropdown ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <Link href={item.href} className={`${navLinkClass(item.href)} inline-flex items-center gap-1`}>
                    {item.name}
                    <svg
                      className={`h-3 w-3 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>

                  <div
                    className={`absolute left-1/2 top-full z-50 w-[34rem] -translate-x-1/2 transition-all duration-200 ${
                      servicesOpen
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-2 opacity-0"
                    }`}
                  >
                    <div className="pt-2">
                      <div className="mega-menu">
                        <div className="mb-2 flex items-center justify-between border-b border-retim-gray-dark px-3 pb-3">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Uygulama Alanları
                          </p>
                          <Link
                            href="/hizmetler"
                            className="text-xs font-semibold text-retim-orange transition-colors hover:text-retim-orange-dark"
                          >
                            Tümünü Gör →
                          </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-0.5">
                          {services.map((service) => (
                            <Link
                              key={service.slug}
                              href={`/hizmetler#${service.slug}`}
                              className="mega-menu-link"
                            >
                              <span className="mega-menu-dot" aria-hidden />
                              <span className="leading-snug">{service.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={item.href} href={item.href} className={navLinkClass(item.href)}>
                  {item.name}
                </Link>
              )
            )}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 lg:flex xl:gap-2.5">
            <Link href="/projeler" className="header-cta-secondary">
              Projeler
            </Link>
            <Link href="/iletisim#kesif-formu" className="header-cta-primary">
              Ücretsiz Keşif Al
            </Link>
          </div>

          <button
            type="button"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-sm border transition-colors lg:hidden ${
              mobileOpen
                ? "border-retim-orange bg-retim-orange/10 text-retim-orange"
                : "border-retim-gray-dark text-retim-navy hover:bg-retim-gray"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-retim-navy/40 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
          aria-label="Menüyü kapat"
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-retim-gray-dark bg-white shadow-lift transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-retim-gray-dark px-4 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-retim-orange">
              Proje Vitrini
            </p>
            <p className="text-sm font-bold text-retim-navy">{siteConfig.name}</p>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-retim-navy hover:bg-retim-gray"
            onClick={closeMobile}
            aria-label="Menüyü kapat"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navigation.map((item) =>
            "hasDropdown" in item && item.hasDropdown ? (
              <div key={item.href} className="mb-1">
                <button
                  type="button"
                  className={`mobile-nav-link w-full justify-between ${
                    isActive(item.href) || mobileServicesOpen
                      ? "mobile-nav-link-active"
                      : "mobile-nav-link-idle"
                  }`}
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                >
                  <span>{item.name}</span>
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
                  <div className="mb-2 mt-1 rounded-sm bg-retim-gray p-2">
                    <Link
                      href="/hizmetler"
                      className="mobile-service-link font-semibold text-retim-navy"
                      onClick={closeMobile}
                    >
                      Tüm Hizmetler
                    </Link>
                    {services.map((service) => (
                      <Link
                        key={service.slug}
                        href={`/hizmetler#${service.slug}`}
                        className="mobile-service-link"
                        onClick={closeMobile}
                      >
                        <span className="h-1 w-1 rounded-full bg-retim-orange" />
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
                className={`mobile-nav-link mb-1 ${
                  isActive(item.href) ? "mobile-nav-link-active" : "mobile-nav-link-idle"
                }`}
                onClick={closeMobile}
              >
                {item.name}
              </Link>
            )
          )}
        </nav>

        <div className="border-t border-retim-gray-dark bg-retim-gray p-4">
          <div className="grid grid-cols-2 gap-2">
            <Link href="/projeler" className="header-cta-secondary justify-center py-3" onClick={closeMobile}>
              Projeler
            </Link>
            <Link
              href="/iletisim#kesif-formu"
              className="header-cta-primary justify-center py-3"
              onClick={closeMobile}
            >
              Ücretsiz Keşif Al
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
