import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ImageCompareSlider from "@/components/ui/ImageCompareSlider";
import RetimImage from "@/components/ui/RetimImage";
import { getPreview } from "@/lib/cms/preview";
import type { GalleryImage } from "@/lib/cms/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Önizleme",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ token: string }>;
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asGallery(v: unknown): GalleryImage[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((item): GalleryImage | null => {
      const url = String(item.url || "");
      if (!url) return null;
      const kind: GalleryImage["kind"] =
        item.kind === "before" || item.kind === "after" || item.kind === "gallery"
          ? item.kind
          : "gallery";
      return { url, alt: String(item.alt || ""), kind };
    })
    .filter((g): g is GalleryImage => g !== null);
}

export default async function PreviewPage({ params }: PageProps) {
  const { token } = await params;
  const preview = await getPreview(token);
  if (!preview) notFound();

  if (preview.type === "service") {
    const name = asString(preview.data.name, "Hizmet");
    const description = asString(preview.data.description);
    const detail = asString(preview.data.detail);
    const imageUrl = asString(preview.data.image_url) || null;

    return (
      <PreviewShell title="Hizmet önizlemesi (kaydedilmedi)">
        <section className="py-12">
          <div className="container-main max-w-3xl">
            <p className="section-label">Hizmet</p>
            <h1 className="mt-2 text-3xl font-bold text-retim-navy">{name}</h1>
            <p className="mt-4 text-gray-600">{description}</p>
            {imageUrl && (
              <div className="relative mt-8 h-56 overflow-hidden rounded-sm md:h-72">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            {detail && <p className="mt-8 leading-relaxed text-gray-600">{detail}</p>}
          </div>
        </section>
      </PreviewShell>
    );
  }

  const name = asString(preview.data.name, "Proje");
  const shortDescription = asString(preview.data.short_description);
  const description = asString(preview.data.description);
  const imageUrl = asString(preview.data.image_url);
  const imageAlt = asString(preview.data.image_alt, name);
  const gallery = asGallery(preview.data.gallery);
  const before = gallery.find((g) => g.kind === "before");
  const after = gallery.find((g) => g.kind === "after");
  const extras = gallery.filter((g) => g.kind === "gallery");

  return (
    <PreviewShell title="Proje önizlemesi (kaydedilmedi)">
      <section className="py-12">
        <div className="container-main max-w-4xl">
          <p className="section-label">Proje</p>
          <h1 className="mt-2 text-3xl font-bold text-retim-navy">{name}</h1>
          <p className="mt-3 text-gray-600">{shortDescription}</p>

          {imageUrl && (
            <div className="relative mt-8 h-56 overflow-hidden rounded-sm md:h-80">
              <RetimImage
                source={{ primary: imageUrl, fallback: imageUrl, alt: imageAlt }}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          )}

          {description && <p className="mt-8 leading-relaxed text-gray-600">{description}</p>}

          {before && after && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-retim-navy">Önce / Sonra</h2>
              <div className="mt-4 overflow-hidden rounded-sm border border-retim-gray-dark">
                <ImageCompareSlider
                  beforeSrc={before.url}
                  afterSrc={after.url}
                  beforeAlt={before.alt || "Önce"}
                  afterAlt={after.alt || "Sonra"}
                  beforeLabel="Önce"
                  afterLabel="Sonra"
                />
              </div>
            </div>
          )}

          {extras.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-retim-navy">Proje Galerisi</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {extras.map((img) => (
                  <div key={img.url} className="relative h-48 overflow-hidden rounded-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.alt || ""} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </PreviewShell>
  );
}

function PreviewShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900">
        {title} · Bu sayfa yaklaşık 30 dakika geçerlidir · Kaydetmeden canlı siteye yansımaz
      </div>
      {children}
    </>
  );
}
