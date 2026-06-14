import { siteConfig } from "@/data/site";

export default function MapCard() {
  return (
    <div className="overflow-hidden rounded border border-retim-gray-dark">
      <div className="relative h-64 bg-retim-gray md:h-80">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-retim-navy">
              <svg
                className="h-8 w-8 text-retim-orange"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-retim-navy">Retim Merkez Ofis</p>
            <p className="mt-1 text-sm text-gray-600">{siteConfig.address}</p>
          </div>
        </div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(to right, #e2e4e8 1px, transparent 1px), linear-gradient(to bottom, #e2e4e8 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>
      <div className="border-t border-retim-gray-dark bg-white p-4">
        <a
          href={siteConfig.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary w-full text-center"
        >
          Haritada Gör
        </a>
      </div>
    </div>
  );
}
