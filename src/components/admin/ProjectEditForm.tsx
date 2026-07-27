"use client";

import { FormEvent, useEffect, useState } from "react";
import MediaPickerButton from "@/components/admin/MediaPickerButton";
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
  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
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

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError("");
    const body = new FormData();
    body.append("file", file);
    body.append("folder", "projects");

    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const data = (await res.json()) as { url?: string; error?: string };
    setUploading(false);

    if (!res.ok) {
      setError(data.error || "Görsel yüklenemedi.");
      return;
    }
    updateField("image_url", data.url || "");
  }

  async function handleGalleryUpload(file: File) {
    setGalleryUploading(true);
    setError("");
    const body = new FormData();
    body.append("file", file);
    body.append("folder", "projects");
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const data = (await res.json()) as { url?: string; error?: string };
    setGalleryUploading(false);
    if (!res.ok) {
      setError(data.error || "Galeri görseli yüklenemedi.");
      return;
    }
    if (data.url) {
      setGallery((prev) => [...prev, { url: data.url!, kind: galleryKind, alt: "" }]);
    }
  }

  function addGalleryFromLibrary(url: string) {
    setGallery((prev) => [...prev, { url, kind: galleryKind, alt: "" }]);
  }

  function removeGalleryItem(index: number) {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  }

  function updateGalleryKind(index: number, kind: GalleryImageKind) {
    setGallery((prev) => prev.map((item, i) => (i === index ? { ...item, kind } : item)));
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
          olarak görünür.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Görsel dosyası yükle</label>
            <div className="flex flex-wrap gap-2">
              <label className="block">
                <span className="btn-secondary inline-flex cursor-pointer">
                  {uploading ? "Yükleniyor..." : "Dosya Yükle"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleImageUpload(file);
                  }}
                />
              </label>
              <MediaPickerButton folderHint="projects" onSelect={(url) => updateField("image_url", url)} />
            </div>
            <label className="mb-1.5 mt-3 block text-sm font-medium text-gray-700">veya görsel URL</label>
            <input
              className="input-field"
              value={form.image_url}
              onChange={(e) => updateField("image_url", e.target.value)}
              placeholder="https://... veya /images/..."
            />
          </div>
          <Field
            label="Görsel Alt Metni"
            hint="Erişilebilirlik için kısa açıklama"
            value={form.image_alt}
            onChange={(v) => updateField("image_alt", v)}
          />
        </div>
        {form.image_url && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-gray-500">Sitede görünecek önizleme:</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.image_url} alt="" className="h-40 w-auto rounded-lg border object-cover" />
          </div>
        )}
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">6. Proje Galerisi (Önce / Sonra)</h2>
        <p className="mt-1 text-sm text-gray-600">
          Kapak dışında önce/sonra ve ek uygulama fotoğrafları. Önce + Sonra çifti sitede kaydırıcı olarak gösterilir.
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
          <label>
            <span className="btn-secondary inline-flex cursor-pointer">
              {galleryUploading ? "Yükleniyor..." : "Dosya yükle"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleGalleryUpload(file);
                e.target.value = "";
              }}
            />
          </label>
          <MediaPickerButton folderHint="projects" label="Kütüphaneden ekle" onSelect={addGalleryFromLibrary} />
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
