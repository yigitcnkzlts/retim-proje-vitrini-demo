import Link from "next/link";
import type { Service } from "@/data/services";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div id={service.slug} className="card-base flex scroll-mt-28 flex-col">
      <h3 className="text-lg font-bold text-retim-navy">{service.name}</h3>
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
