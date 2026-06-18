import Link from "next/link";
import RetimImage from "@/components/ui/RetimImage";
import type { Service } from "@/data/services";
import { getServiceImageSource } from "@/data/mediaAssets";

interface HomeServiceTileProps {
  service: Service;
}

export default function HomeServiceTile({ service }: HomeServiceTileProps) {
  const imageSource = getServiceImageSource(service.slug);

  return (
    <Link
      href={`/hizmetler#${service.slug}`}
      className="home-service-tile group block overflow-hidden"
    >
      <div className="relative h-28 overflow-hidden sm:h-32">
        <RetimImage
          source={imageSource}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-retim-navy/80 via-retim-navy/20 to-transparent transition-opacity duration-300 group-hover:from-retim-navy/70"
          aria-hidden
        />
        <div
          className="home-service-tile-shine pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden
        />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-retim-gray-dark/80 bg-white p-4">
        <h3 className="text-sm font-bold text-retim-navy transition-colors duration-300 group-hover:text-retim-orange">
          {service.name}
        </h3>
        <span
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-sm border border-retim-gray-dark bg-retim-gray text-retim-orange transition-all duration-300 group-hover:border-retim-orange group-hover:bg-retim-orange group-hover:text-white group-hover:shadow-glow"
        >
          <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
