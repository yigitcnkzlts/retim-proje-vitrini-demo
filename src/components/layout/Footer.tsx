import Link from "next/link";
import { footerLinks, lastFiveProjects, siteConfig } from "@/data/site";

export default function Footer() {
  return (
    <footer className="border-t border-retim-gray-dark bg-retim-navy text-white">
      <div className="container-main py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-white/10">
                <span className="text-lg font-bold text-retim-orange">R</span>
              </div>
              <div>
                <span className="block text-lg font-bold">{siteConfig.name}</span>
                <span className="block text-[11px] text-gray-400">Proje Vitrini Demo</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">{siteConfig.legalName}</p>
            <p className="mt-3 text-sm text-gray-400">{siteConfig.description}</p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Son 5 Proje
            </h3>
            <ul className="space-y-2">
              {lastFiveProjects.map((project) => (
                <li key={project.slug}>
                  <Link
                    href={`/projeler/${project.slug}`}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    <span className="font-medium text-gray-300">{project.name}</span>
                    <span className="ml-1 text-xs uppercase text-gray-500">{project.district}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Linkler
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
              İletişim
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <p>{siteConfig.addressLine1}</p>
                <p className="uppercase">{siteConfig.addressLine2}</p>
              </li>
              <li>
                <a href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`} className="hover:text-white">
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                  {siteConfig.email}
                </a>
              </li>
              <li>
                {siteConfig.workingHours}
                <br />
                {siteConfig.workingHoursClosed}
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/iletisim#kesif-formu" className="btn-primary text-xs uppercase tracking-wide">
                Ücretsiz Keşif Al
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-gray-500">
          Copyright © {new Date().getFullYear()} Retim. Tüm Hakları Saklıdır. Demo arayüzü.
        </div>
      </div>
    </footer>
  );
}
