import Link from "next/link";

interface PageHeroProps {
  title: string;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
}

export default function PageHero({ title, description, breadcrumb }: PageHeroProps) {
  return (
    <section className="border-b border-retim-gray-dark bg-retim-gray">
      <div className="container-main py-12 md:py-16">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            {breadcrumb.map((item, index) => (
              <span key={index} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                {item.href ? (
                  <Link href={item.href} className="hover:text-retim-orange">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-retim-navy">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-3xl font-semibold tracking-tight text-retim-navy md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-3xl text-base text-gray-600 md:text-lg">{description}</p>
        )}
      </div>
    </section>
  );
}
