import Link from "next/link";
import RetimImage from "@/components/ui/RetimImage";
import type { Service } from "@/data/services";
import { getServiceImageSource } from "@/data/mediaAssets";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const fallbackSource = getServiceImageSource(service.slug);
  const imageSource = service.imageUrl
    ? { primary: service.imageUrl, fallback: fallbackSource.fallback, alt: service.imageAlt || service.name }
    : fallbackSource;

  return (
    <div id={service.slug} className="card-interactive group flex scroll-mt-28 flex-col overflow-hidden p-0">
      <div className="relative h-40 w-full overflow-hidden">
        <RetimImage
          source={imageSource}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-retim-navy/50 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-retim-navy transition-colors duration-200 group-hover:text-retim-orange">
          <Link href={`/hizmetler#${service.slug}`} className="hover:text-retim-orange">
            {service.name}
          </Link>
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
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={`/hizmetler#${service.slug}`}
            className="btn-secondary px-4 py-2 text-xs"
          >
            Hizmet Detayı
          </Link>
          <Link
            href={`/projeler?hizmet=${service.slug}`}
            className="inline-flex items-center text-xs font-medium text-gray-500 transition-colors hover:text-retim-orange"
          >
            İlgili projeler
          </Link>
        </div>
      </div>
    </div>
  );
}
