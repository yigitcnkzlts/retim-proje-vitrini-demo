import { siteConfig } from "@/data/site";

export default function MapCard() {
  return (
    <div className="overflow-hidden rounded border border-retim-gray-dark">
      <div className="relative h-64 bg-retim-gray md:h-80">
        <iframe
          title="Retim Restorasyon konum haritası"
          src={siteConfig.mapsEmbedUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className="border-t border-retim-gray-dark bg-white p-4">
        <p className="mb-3 text-center text-sm text-gray-600">{siteConfig.address}</p>
        <a
          href={siteConfig.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary w-full text-center"
        >
          Google Maps&apos;te Aç
        </a>
      </div>
    </div>
  );
}
