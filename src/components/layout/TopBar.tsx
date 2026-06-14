import { siteConfig } from "@/data/site";

export default function TopBar() {
  return (
    <div className="hidden border-b border-retim-gray-dark bg-retim-navy text-white lg:block">
      <div className="container-main">
        <div className="flex items-center justify-between py-2 text-xs">
          <p className="font-medium text-gray-300">{siteConfig.legalName}</p>
          <div className="flex items-center gap-6 text-gray-300">
            <a href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`} className="transition-colors duration-200 hover:text-retim-orange">
              {siteConfig.phone}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="transition-colors duration-200 hover:text-retim-orange">
              {siteConfig.email}
            </a>
            <span>
              {siteConfig.workingHours} · {siteConfig.workingHoursClosed}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
