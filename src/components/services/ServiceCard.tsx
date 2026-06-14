import Link from "next/link";
import type { Service } from "@/data/services";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div id={service.slug} className="card-interactive group flex scroll-mt-28 flex-col">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-sm bg-retim-navy/5 text-retim-orange transition-all duration-300 group-hover:bg-retim-orange group-hover:text-white group-hover:shadow-glow">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-retim-navy transition-colors duration-200 group-hover:text-retim-orange">
        {service.name}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">{service.description}</p>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Uygulama Alanları
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {service.projectTypes.map((type) => (
            <span key={type} className="tag">
              {type}
            </span>
          ))}
        </div>
      </div>
      <Link
        href={`/projeler?hizmet=${service.slug}`}
        className="btn-secondary mt-5 px-4 py-2 text-xs"
      >
        İlgili Projeleri Gör
      </Link>
    </div>
  );
}
