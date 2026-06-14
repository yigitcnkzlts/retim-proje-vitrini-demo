"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import ProjectMarquee from "./ProjectMarquee";

export interface HeroSlide {
  name: string;
  image: string;
  href: string;
}

interface HeroBannerProps {
  legalName: string;
  title: string;
  description: string;
  slides: HeroSlide[];
  tickerItems: string[];
}

export default function HeroBanner({
  legalName,
  title,
  description,
  slides,
  tickerItems,
}: HeroBannerProps) {
  const [parallax, setParallax] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const onScroll = () => setParallax(window.scrollY * 0.35);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative overflow-hidden bg-retim-navy text-white">
      <div className="hero-glow-orb -left-20 top-20 h-72 w-72" />
      <div
        className="hero-glow-orb right-0 top-1/3 h-96 w-96 bg-white/10"
        style={{ animationDelay: "2s" }}
      />

      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translateY(${parallax}px)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.name}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === activeSlide ? "opacity-30" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.name}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-retim-navy via-retim-navy/95 to-retim-navy/75" />
      <div className="hero-grid absolute inset-0 opacity-30" aria-hidden />

      <div className="container-main relative py-20 md:py-32">
        <div className="max-w-3xl animate-fade-up">
          <p className="section-label text-shimmer">{legalName}</p>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-gray-300 md:text-lg">{description}</p>

          {slides.length > 0 && (
            <Link
              href={slides[activeSlide].href}
              className="mt-6 inline-flex items-center gap-2 rounded-sm border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-retim-orange hover:bg-retim-orange/20"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-retim-orange" />
              {slides[activeSlide].name}
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}

          <div className="mt-8 flex flex-wrap gap-4">
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

          {slides.length > 1 && (
            <div className="mt-8 flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.name}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeSlide ? "w-8 bg-retim-orange" : "w-3 bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`${slide.name} slaytı`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ProjectMarquee items={tickerItems} />
    </section>
  );
}
