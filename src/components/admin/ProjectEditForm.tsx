"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminImageField from "@/components/admin/AdminImageField";
import type { DbProject, GalleryImage, GalleryImageKind } from "@/lib/cms/types";

interface ProjectEditFormProps {
  project: DbProject;
}

type ServiceOption = { slug: string; name: string };

function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function arrayToLines(items: string[]): string {
  return items.join("\n");
}

const KIND_LABEL: Record<GalleryImageKind, string> = {
  before: "Önce",
  after: "Sonra",
  gallery: "Galeri",
};

export default function ProjectEditForm({ project }: ProjectEditFormProps) {
  const [form, setForm] = useState({
    name: project.name,
    district: project.district,
    year: project.year,
    ref_no: project.ref_no,
    service: project.service,
    service_slug: project.service_slug,
    building_type: project.building_type,
    duration: project.duration,
    featured: project.featured,
    published: project.published,
    short_description: project.short_description,
    description: project.description,
    scope: arrayToLines(project.scope),
    highlights: arrayToLines(project.highlights),
    image_url: project.image_url || "",
    image_alt: project.image_alt || "",
    seo_title: project.seo_title || "",
    seo_description: project.seo_description || "",
  });
  const [gallery, setGallery] = useState<GalleryImage[]>(project.gallery || []);
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [galleryKind, setGalleryKind] = useState<GalleryImageKind>("gallery");

  useEffect(() => {
    void fetch("/api/admin/services")
      .then((r) => r.json())
      .then((d: { services: Array<{ slug: string; name: string; active?: boolean }> }) => {
        setServices(
          (d.services || [])
            .filter((s) => s.active !== false)
            .map((s) => ({ slug: s.slug, name: s.name }))
        );
      });
  }, []);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onServiceSelect(slug: string) {
    const found = services.find((s) => s.slug === slug);
    setForm((prev) => ({
      ...prev,
      service_slug: slug,
      service: found?.name || prev.service,
    }));
  }

  function buildPayload() {
    return {
      ...form,
      year: Number(form.year),
      service_slug: form.service_slug,
      service: form.service,
      scope: linesToArray(form.scope),
      highlights: linesToArray(form.highlights),
      image_url: form.image_url || null,
      image_alt: form.image_alt || null,
      gallery,
      seo_title: form.seo_title,
      seo_description: form.seo_description,
    };
  }

  function addGalleryImage(url: string) {
    setGallery((prev) => [...prev, { url, kind: galleryKind, alt: "" }]);
  }

  function removeGalleryItem(index: number) {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  }

  function updateGalleryKind(index: number, kind: GalleryImageKind) {
    setGallery((prev) => prev.map((item, i) => (i === index ? { ...item, kind } : item)));
  }

  function updateGalleryAlt(index: number, alt: string) {
    setGallery((prev) => prev.map((item, i) => (i === index ? { ...item, alt } : item)));
  }

  async function handlePreview() {
    setPreviewing(true);
    setError("");
    const res = await fetch("/api/admin/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "project", data: buildPayload() }),
    });
    const data = (await res.json()) as { url?: string; error?: string };
    setPreviewing(false);
    if (!res.ok || !data.url) {
      setError(data.error || "Önizleme açılamadı.");
      return;
    }
    window.open(data.url, "_blank", "noopener,noreferrer");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const res = await fetch(`/api/admin/projects/${project.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload()),
    });

    const data = (await res.json()) as { error?: string };
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Kayıt başarısız.");
      return;
    }
    setMessage("Proje başarıyla güncellendi.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="admin-card">
        <h2 className="admin-card-title">1. Proje Bilgileri</h2>
        <p className="mt-1 text-sm text-gray-600">
          Sitede proje detay sayfasının sağındaki <strong>Proje Bilgileri</strong> kartında görünür
          (Referans No, Lokasyon, Semt, Yıl, Hizmet Türü, Bina Tipi, Süre).
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Proje Adı" hint="Sayfa başlığı ve açıklamada kullanılır" value={form.name} onChange={(v) => updateField("name", v)} />
          <Field label="Referans No" hint="Sitede: Referans No" value={form.ref_no} onChange={(v) => updateField("ref_no", v)} />
          <Field
            label="Lokasyon / Semt"
            hint="Sitede hem Lokasyon hem Semt olarak aynı değer görünür"
            value={form.district}
            onChange={(v) => updateField("district", v)}
            placeholder="örn. Beyoğlu"
          />
          <Field label="Yıl" hint="Sitede: Yıl" type="number" value={String(form.year)} onChange={(v) => updateField("year", Number(v))} />
          <label className="md:col-span-2">
            <span className="mb-0.5 block text-sm font-medium text-gray-700">Hizmet Türü</span>
            <span className="mb-1.5 block text-xs text-gray-500">
              Sitede bu hizmete tıklanınca proje listelenir (örn. /projeler?hizmet=cati-yalitim)
            </span>
            <select
              className="input-field"
              value={form.service_slug}
              onChange={(e) => onServiceSelect(e.target.value)}
              required
            >
              <option value="">Hizmet seçin...</option>
              {services.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
              {form.service_slug && !services.some((s) => s.slug === form.service_slug) && (
                <option value={form.service_slug}>{form.service || form.service_slug}</option>
              )}
            </select>
          </label>
          <Field label="Bina Tipi" hint="Sitede: Bina Tipi" value={form.building_type} onChange={(v) => updateField("building_type", v)} />
          <Field
            label="Süre"
            hint="Sitede: Süre — boş bırakırsanız — görünür"
            value={form.duration}
            onChange={(v) => updateField("duration", v)}
            placeholder="örn. 45 gün veya —"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => updateField("published", e.target.checked)} />
            Yayında (sitede görünsün)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => updateField("featured", e.target.checked)} />
            Ana sayfada öne çıkan proje
          </label>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">2. Proje Açıklaması</h2>
        <p className="mt-1 text-sm text-gray-600">
          Sitede proje detay sayfasının solundaki <strong>uzun açıklama metni</strong> olarak görünür.
        </p>
        <textarea
          className="input-field mt-4 min-h-32"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
        <label className="mt-4 block text-sm font-medium text-gray-700">Kısa Açıklama</label>
        <p className="mt-0.5 text-xs text-gray-500">/projeler listesindeki kart altında kısa özet olarak görünür</p>
        <input
          className="input-field mt-1"
          value={form.short_description}
          onChange={(e) => updateField("short_description", e.target.value)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="admin-card">
          <h2 className="admin-card-title">3. Uygulama Kapsamı</h2>
          <p className="mt-1 text-sm text-gray-600">
            Sitede <strong>onay işaretli madde listesi</strong> olarak görünür. Her satır bir madde olur.
          </p>
          <textarea
            className="input-field mt-3 min-h-40"
            value={form.scope}
            onChange={(e) => updateField("scope", e.target.value)}
          />
        </div>
        <div className="admin-card">
          <h2 className="admin-card-title">4. Öne Çıkan Uygulama Maddeleri</h2>
          <p className="mt-1 text-sm text-gray-600">
            Sitede projenin <strong>öne çıkan kısa maddeleri</strong> olarak görünür. Her satır bir madde olur.
          </p>
          <textarea
            className="input-field mt-3 min-h-40"
            value={form.highlights}
            onChange={(e) => updateField("highlights", e.target.value)}
          />
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">5. Kapak Görseli</h2>
        <p className="mt-1 text-sm text-gray-600">
          Sitede proje detayındaki <strong>büyük kapak görseli</strong> ve /projeler listesindeki kart fotoğrafı
          olarak görünür. Boyutlandırma / kırpma yüklemeden önce uygulanır.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <AdminImageField
            folder="projects"
            label="Kapak görseli yükle"
            libraryLabel="Kütüphaneden seç"
            showUrlInput
            urlValue={form.image_url}
            onUrlChange={(url) => updateField("image_url", url)}
            previewUrl={form.image_url || undefined}
            onClear={() => updateField("image_url", "")}
            onUploaded={(url) => updateField("image_url", url)}
          />
          <Field
            label="Görsel Alt Metni"
            hint="Erişilebilirlik için kısa açıklama"
            value={form.image_alt}
            onChange={(v) => updateField("image_alt", v)}
          />
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">6. Proje Galerisi (Önce / Sonra)</h2>
        <p className="mt-1 text-sm text-gray-600">
          Kapak dışında önce/sonra ve ek uygulama fotoğrafları. Toplu yükleme ve kütüphaneden seçim
          desteklenir.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-gray-700">Eklenecek tür</span>
            <select
              className="input-field"
              value={galleryKind}
              onChange={(e) => setGalleryKind(e.target.value as GalleryImageKind)}
            >
              <option value="before">Önce</option>
              <option value="after">Sonra</option>
              <option value="gallery">Galeri</option>
            </select>
          </label>
        </div>
        <div className="mt-3">
          <AdminImageField
            folder="projects"
            multiple
            label="Galeri fotoğrafı yükle (çoklu)"
            libraryLabel="Kütüphaneden ekle"
            onUploaded={addGalleryImage}
          />
        </div>

        {gallery.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">Henüz galeri görseli yok.</p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item, index) => (
              <li key={`${item.url}-${index}`} className="rounded border border-gray-200 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt="" className="h-28 w-full rounded object-cover" />
                <select
                  className="input-field mt-2 text-sm"
                  value={item.kind}
                  onChange={(e) => updateGalleryKind(index, e.target.value as GalleryImageKind)}
                >
                  {(Object.keys(KIND_LABEL) as GalleryImageKind[]).map((k) => (
                    <option key={k} value={k}>
                      {KIND_LABEL[k]}
                    </option>
                  ))}
                </select>
                <input
                  className="input-field mt-2 text-sm"
                  placeholder="Alt metin (opsiyonel)"
                  value={item.alt || ""}
                  onChange={(e) => updateGalleryAlt(index, e.target.value)}
                />
                <button
                  type="button"
                  className="mt-2 text-xs text-red-600 underline"
                  onClick={() => removeGalleryItem(index)}
                >
                  Kaldır
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">7. SEO</h2>
        <p className="mt-1 text-sm text-gray-600">
          Boş bırakılırsa proje adı ve kısa açıklama kullanılır.
        </p>
        <div className="mt-4 space-y-3">
          <Field
            label="Meta başlık"
            hint="Tarayıcı sekmesi ve arama sonuçlarında"
            value={form.seo_title}
            onChange={(v) => updateField("seo_title", v)}
            placeholder={form.name}
          />
          <label>
            <span className="mb-0.5 block text-sm font-medium text-gray-700">Meta açıklama</span>
            <span className="mb-1.5 block text-xs text-gray-500">Önerilen 120–155 karakter</span>
            <textarea
              className="input-field min-h-20"
              value={form.seo_description}
              onChange={(e) => updateField("seo_description", e.target.value)}
              placeholder={form.short_description}
            />
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-green-700">{message}</p>}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </button>
        <button
          type="button"
          disabled={previewing}
          className="btn-secondary"
          onClick={() => void handlePreview()}
        >
          {previewing ? "Önizleme hazırlanıyor..." : "Kaydetmeden önizle →"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
  type = "text",
  placeholder,
  className = "",
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-0.5 block text-sm font-medium text-gray-700">{label}</span>
      {hint && <span className="mb-1.5 block text-xs text-gray-500">{hint}</span>}
      <input
        type={type}
        className="input-field"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
