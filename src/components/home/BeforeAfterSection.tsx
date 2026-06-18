import RetimImage from "@/components/ui/RetimImage";
import { beforeAfterSection } from "@/data/site";
import { mediaAssets } from "@/data/mediaAssets";

function CompareIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4"
      />
    </svg>
  );
}

export default function BeforeAfterSection() {
  const { before, after } = mediaAssets.beforeAfter;

  return (
    <section className="border-b border-retim-gray-dark bg-white py-16 md:py-20">
      <div className="container-main">
        <div className="mb-10 max-w-2xl">
          <p className="section-label">{beforeAfterSection.label}</p>
          <h2 className="section-title mt-2">{beforeAfterSection.title}</h2>
          <p className="section-subtitle">{beforeAfterSection.description}</p>
        </div>

        <div className="before-after-panel relative overflow-hidden rounded-sm border border-retim-gray-dark bg-retim-gray shadow-soft">
          <div className="grid md:grid-cols-2">
            <div className="before-after-side relative">
              <div className="absolute left-4 top-4 z-10 rounded-sm bg-black/55 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                {beforeAfterSection.beforeLabel}
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-[16/11]">
                <RetimImage
                  source={before}
                  fill
                  className="retim-image-hover object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            <div className="before-after-side relative border-t border-retim-gray-dark md:border-l md:border-t-0">
              <div className="absolute left-4 top-4 z-10 rounded-sm bg-retim-orange px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-soft">
                {beforeAfterSection.afterLabel}
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-[16/11]">
                <RetimImage
                  source={after}
                  fill
                  className="retim-image-hover object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

          <div
            className="before-after-compare pointer-events-none absolute left-1/2 top-1/2 z-20 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-retim-orange text-white shadow-lift md:flex"
            aria-hidden
          >
            <CompareIcon />
          </div>
        </div>
      </div>
    </section>
  );
}
