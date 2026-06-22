import Image from "next/image";
import Link from "next/link";
import { footerLinks, lastFiveProjects, siteConfig, socialLinks } from "@/data/site";
import { mediaAssets } from "@/data/mediaAssets";

function SocialIcon({ icon }: { icon: string }) {
  if (icon === "linkedin") {
    return (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }
  if (icon === "instagram") {
    return (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-retim-gray-dark bg-retim-navy text-white">
      <div className="container-main py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Image
                src={mediaAssets.logo.primary}
                alt={siteConfig.name}
                width={220}
                height={66}
                className="site-logo max-w-[200px]"
                quality={95}
              />
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
                    className="group inline-flex text-sm text-gray-400 transition-all duration-200 hover:translate-x-1 hover:text-retim-orange"
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
                    className="group inline-flex text-sm text-gray-400 transition-all duration-200 hover:translate-x-1 hover:text-retim-orange"
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
                <a
                  href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}
                  className="transition-colors hover:text-retim-orange"
                >
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-retim-orange">
                  {siteConfig.email}
                </a>
              </li>
              <li>
                {siteConfig.workingHours}
                <br />
                {siteConfig.workingHoursClosed}
              </li>
            </ul>

            <h3 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Sosyal Medya
            </h3>
            <p className="mb-3 text-xs text-gray-500">
              Sosyal medya hesaplarımızdan da bize ulaşabilirsiniz.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/10 bg-white/5 text-gray-400 transition-all duration-300 hover:border-retim-orange hover:bg-retim-orange hover:text-white hover:shadow-glow"
                  aria-label={social.name}
                >
                  <SocialIcon icon={social.icon} />
                </a>
              ))}
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
