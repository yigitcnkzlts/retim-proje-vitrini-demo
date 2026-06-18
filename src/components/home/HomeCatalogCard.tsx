import Link from "next/link";

interface HomeCatalogCardProps {
  slug: string;
  name: string;
  description: string;
}

export default function HomeCatalogCard({ slug, name, description }: HomeCatalogCardProps) {
  return (
    <Link href={`/projeler?hizmet=${slug}`} className="home-catalog-card group block">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold text-retim-navy transition-colors duration-300 group-hover:text-retim-orange">
          {name}
        </h3>
        <span
          className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-sm border border-transparent text-retim-orange opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
        {description}
      </p>
      <span className="home-catalog-card-cta mt-4 inline-flex items-center text-xs font-semibold uppercase tracking-wide text-retim-navy transition-colors duration-300 group-hover:text-retim-orange">
        Projeleri Gör
        <svg className="ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}
