"use client";

import Link from "next/link";
import RetimImage from "@/components/ui/RetimImage";
import { useEffect, useState } from "react";
import ProjectMarquee from "./ProjectMarquee";
import { mediaAssets } from "@/data/mediaAssets";

interface HeroBannerProps {
  legalName: string;
  title: string;
  description: string;
  tickerItems: string[];
}

const heroHighlights = [
  { value: "1989", label: "Kuruluş" },
  { value: "35+", label: "Yıllık Deneyim" },
  { value: "Türkiye", label: "Geneli Uygulama" },
];

const quickLinks = [
  { href: "/hizmetler", label: "Hizmetler →" },
  { href: "/referanslar", label: "Referanslar →" },
  { href: "/hakkimizda", label: "Kurumsal →" },
];

export default function HeroBanner({
  legalName,
  title,
  description,
  tickerItems,
}: HeroBannerProps) {
  const [parallax, setParallax] = useState(0);

  useEffect(() => {
    const onScroll = () => setParallax(window.scrollY * 0.2);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative min-h-[min(90vh,900px)] overflow-hidden bg-retim-navy text-white">
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translateY(${parallax}px) scale(1.03)` }}
      >
        <RetimImage
          source={mediaAssets.hero}
          fill
          className="object-cover object-[72%_center] sm:object-[68%_center] lg:object-[60%_center]"
          priority
          sizes="100vw"
          quality={90}
        />
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/15"
        aria-hidden
      />

      <div className="container-main relative flex min-h-[min(90vh,900px)] flex-col justify-center py-20 md:py-28">
        <div className="hero-content-panel animate-fade-up">
          <p className="hero-legal-name">{legalName}</p>
          <div className="hero-accent-line" aria-hidden />
          <h1 className="hero-title">{title}</h1>
          <p className="hero-description">{description}</p>

          <div className="hero-stats">
            {heroHighlights.map((item) => (
              <div key={item.label} className="hero-stat-item">
                <p className="hero-stat-value">{item.value}</p>
                <p className="hero-stat-label">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="hero-actions">
            <Link href="/projeler" className="btn-primary group">
              <span>Projeleri İncele</span>
              <svg
                className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/iletisim#kesif-formu" className="btn-outline-white">
              Ücretsiz Keşif Formu
            </Link>
          </div>

          <nav className="hero-quick-links" aria-label="Hızlı bağlantılar">
            {quickLinks.map((link, index) => (
              <span key={link.href} className="flex items-center">
                {index > 0 && <span className="hero-quick-sep" aria-hidden>·</span>}
                <Link href={link.href} className="hero-quick-link">
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>
      </div>

      <ProjectMarquee items={tickerItems} className="hero-marquee" />
    </section>
  );
}
