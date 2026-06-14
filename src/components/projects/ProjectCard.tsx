import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  variant?: "default" | "compact";
}

export default function ProjectCard({ project, variant = "default" }: ProjectCardProps) {
  const imageHeight = variant === "compact" ? "h-36" : "h-48";

  return (
    <div className={`card-base overflow-hidden ${variant === "compact" ? "flex flex-col p-0" : "p-0"}`}>
      <div className={`relative w-full ${imageHeight}`}>
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="tag">{project.district}</span>
          <span className="tag">{project.year}</span>
          {variant === "default" && <span className="tag">{project.service}</span>}
        </div>
        <h3
          className={`font-bold text-retim-navy ${variant === "compact" ? "text-base" : "text-lg"}`}
        >
          {project.name}
        </h3>
        {variant === "compact" && (
          <p className="mt-1 line-clamp-2 text-xs text-gray-500">{project.service}</p>
        )}
        <p className="mt-2 flex-1 text-sm text-gray-600">{project.shortDescription}</p>
        <Link
          href={`/projeler/${project.slug}`}
          className="btn-secondary mt-4 px-4 py-2 text-xs"
        >
          Projeyi İncele
        </Link>
      </div>
    </div>
  );
}
