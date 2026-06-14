"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, type MouseEvent } from "react";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  variant?: "default" | "compact";
}

export default function ProjectCard({ project, variant = "default" }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const imageHeight = variant === "compact" ? "h-36" : "h-48";

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
  };

  const handleLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "";
  };

  return (
    <article
      ref={cardRef}
      className="project-card card-interactive group overflow-hidden p-0 transition-transform duration-200 ease-out"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <Link href={`/projeler/${project.slug}`} className="block">
        <div className={`relative w-full overflow-hidden ${imageHeight}`}>
          <Image
            src={project.image}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-retim-navy/70 via-retim-navy/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-sm bg-retim-orange text-white opacity-0 shadow-glow transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="tag">{project.district}</span>
            <span className="tag">{project.year}</span>
            {variant === "default" && <span className="tag line-clamp-1">{project.service}</span>}
          </div>
          <h3
            className={`font-bold text-retim-navy transition-colors duration-200 group-hover:text-retim-orange ${
              variant === "compact" ? "text-base" : "text-lg"
            }`}
          >
            {project.name}
          </h3>
          {variant === "compact" && (
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">{project.service}</p>
          )}
          <p className="mt-2 flex-1 text-sm text-gray-600 line-clamp-2">
            {project.shortDescription}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-retim-orange transition-all duration-300 group-hover:gap-3">
            Projeyi İncele
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>
    </article>
  );
}
