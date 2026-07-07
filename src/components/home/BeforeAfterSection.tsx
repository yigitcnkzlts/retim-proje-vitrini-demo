import ImageCompareSlider from "@/components/ui/ImageCompareSlider";
import { beforeAfterSection } from "@/data/site";
import { mediaAssets } from "@/data/mediaAssets";

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

        <div className="before-after-panel overflow-hidden rounded-sm border border-retim-gray-dark bg-retim-gray shadow-soft">
          <ImageCompareSlider
            beforeSrc={before.primary}
            afterSrc={after.primary}
            beforeAlt={before.alt}
            afterAlt={after.alt}
            beforeLabel={beforeAfterSection.beforeLabel}
            afterLabel={beforeAfterSection.afterLabel}
          />
        </div>
      </div>
    </section>
  );
}
