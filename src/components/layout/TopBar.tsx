import { siteConfig } from "@/data/site";
import { getSiteSettings } from "@/lib/cms/site-settings";

export default async function TopBar() {
  const settings = await getSiteSettings();

  return (
    <div className="hidden border-b border-retim-gray-dark bg-retim-navy text-white lg:block">
      <div className="container-main">
        <div className="flex items-center justify-between py-2 text-xs">
          <p className="font-medium text-gray-300">{siteConfig.legalName}</p>
          <div className="flex items-center gap-6 text-gray-300">
            <a
              href={`tel:${settings.officePhone.replace(/[^\d+]/g, "")}`}
              className="transition-colors duration-200 hover:text-retim-orange"
            >
              {settings.officePhone}
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="transition-colors duration-200 hover:text-retim-orange"
            >
              {settings.email}
            </a>
            <span>
              {settings.workingHours} · {settings.workingHoursClosed}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
