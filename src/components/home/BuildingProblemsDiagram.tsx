"use client";

import Image from "next/image";
import { useState } from "react";
import BuildingProblemIcon from "@/components/home/BuildingProblemIcon";
import { buildingProblemCards } from "@/data/site";

export default function BuildingProblemsDiagram() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const leftCards = buildingProblemCards.filter((c) => c.side === "left");
  const rightCards = buildingProblemCards.filter((c) => c.side === "right");

  return (
    <div className="building-problems-diagram">
      <div className="mb-8 max-w-2xl md:mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-retim-orange">
          Binanızın Sorun Haritası
        </p>
        <h2 className="mt-3 font-serif text-3xl font-bold leading-tight tracking-tight text-retim-navy md:text-4xl">
          Binanızda Bu Sorunlar Gözden Kaçmasın
        </h2>
        <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
          Cephe çatlakları, çatı akıntıları, drenaj sorunları ve yalıtım problemleri zamanla daha büyük maliyetlere yol açabilir. Retim, bu sorunları yerinde ve teknoloji destekli keşif süreciyle tespit eder.
        </p>
      </div>

      <div className="building-problems-stage relative mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-[#e8dfd0] bg-[#f4efe6] shadow-[0_24px_60px_-28px_rgba(26,35,50,0.35)]">
        <div className="relative hidden aspect-[16/9] lg:block">
          <Image
            src="/images/retim/building-problems-diagram.jpg"
            alt="Sorunlu apartman binası — dış cephe, çatı ve yalıtım problemleri"
            fill
            className="object-contain object-center"
            sizes="(max-width: 1024px) 100vw, 1152px"
            priority
          />

          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 1000 562"
            preserveAspectRatio="none"
            aria-hidden
          >
            {buildingProblemCards.map((card) => {
              const isActive = activeId === card.id;
              return (
                <g key={card.id}>
                  <path
                    d={card.path}
                    className={`building-problem-line transition-opacity duration-300 ${
                      isActive ? "opacity-100" : activeId ? "opacity-25" : "opacity-70"
                    }`}
                    fill="none"
                    stroke="url(#problem-line-gradient)"
                    strokeWidth={isActive ? 2.2 : 1.6}
                    strokeLinecap="round"
                  />
                  <polygon
                    points={card.arrowPoints}
                    className={`transition-opacity duration-300 ${
                      isActive ? "opacity-100" : activeId ? "opacity-25" : "opacity-70"
                    }`}
                    fill="#e85d04"
                  />
                </g>
              );
            })}
            <defs>
              <linearGradient id="problem-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e85d04" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>
          </svg>

          {buildingProblemCards.map((card) => (
            <button
              key={`hotspot-${card.id}`}
              type="button"
              className={`building-problem-hotspot ${activeId === card.id ? "is-active" : ""}`}
              style={{ left: `${card.hotspot.x}%`, top: `${card.hotspot.y}%` }}
              aria-label={card.title}
              onMouseEnter={() => setActiveId(card.id)}
              onMouseLeave={() => setActiveId(null)}
              onFocus={() => setActiveId(card.id)}
              onBlur={() => setActiveId(null)}
            />
          ))}

          <div className="absolute inset-y-0 left-0 flex w-[26%] flex-col justify-center gap-3 pl-3 pr-1">
            {leftCards.map((card) => (
              <ProblemCard
                key={card.id}
                card={card}
                isActive={activeId === card.id}
                onActivate={() => setActiveId(card.id)}
                onDeactivate={() => setActiveId(null)}
              />
            ))}
          </div>

          <div className="absolute inset-y-0 right-0 flex w-[26%] flex-col justify-center gap-3 pl-1 pr-3">
            {rightCards.map((card) => (
              <ProblemCard
                key={card.id}
                card={card}
                isActive={activeId === card.id}
                onActivate={() => setActiveId(card.id)}
                onDeactivate={() => setActiveId(null)}
              />
            ))}
          </div>
        </div>

        <div className="lg:hidden">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src="/images/retim/building-problems-diagram.jpg"
              alt="Sorunlu apartman binası — dış cephe, çatı ve yalıtım problemleri"
              fill
              className="object-contain object-center"
              sizes="100vw"
              priority
            />
            {buildingProblemCards.map((card) => (
              <span
                key={`mobile-hotspot-${card.id}`}
                className="building-problem-hotspot is-static"
                style={{ left: `${card.hotspot.x}%`, top: `${card.hotspot.y}%` }}
                aria-hidden
              />
            ))}
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-2">
            {buildingProblemCards.map((card) => (
              <ProblemCard key={card.id} card={card} compact />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProblemCardProps {
  card: (typeof buildingProblemCards)[number];
  isActive?: boolean;
  compact?: boolean;
  onActivate?: () => void;
  onDeactivate?: () => void;
}

function ProblemCard({
  card,
  isActive = false,
  compact = false,
  onActivate,
  onDeactivate,
}: ProblemCardProps) {
  return (
    <article
      className={`building-problem-card ${isActive ? "is-active" : ""} ${compact ? "compact" : ""}`}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
      tabIndex={compact ? undefined : 0}
    >
      <div className="building-problem-card-icon">
        <BuildingProblemIcon type={card.icon} />
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-bold leading-snug text-retim-navy">{card.title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-gray-600">{card.description}</p>
      </div>
    </article>
  );
}
