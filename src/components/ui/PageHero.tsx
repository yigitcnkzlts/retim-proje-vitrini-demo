import Link from "next/link";

interface PageHeroProps {
  title: string;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
}

export default function PageHero({ title, description, breadcrumb }: PageHeroProps) {
  return (
    <section className="page-hero-pattern relative overflow-hidden border-b border-retim-gray-dark bg-gradient-to-br from-retim-gray via-white to-retim-gray">
      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-retim-orange/5 blur-3xl" />
      <div className="container-main relative py-12 md:py-16">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-500 animate-fade-in">
            {breadcrumb.map((item, index) => (
              <span key={index} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="transition-colors duration-200 hover:text-retim-orange"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-medium text-retim-navy">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="animate-fade-up text-3xl font-bold tracking-tight text-retim-navy md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-3xl animate-fade-up text-base text-gray-600 md:text-lg" style={{ animationDelay: "100ms" }}>
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
