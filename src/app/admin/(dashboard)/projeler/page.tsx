"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import type { DbProject } from "@/lib/cms/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ığüşöç]/g, (c) => ({ ı: "i", ğ: "g", ü: "u", ş: "s", ö: "o", ç: "c" })[c] || c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

type ServiceOption = { slug: string; name: string };

const EMPTY_FORM = {
  name: "",
  district: "",
  year: new Date().getFullYear(),
  ref_no: "",
  service: "",
  service_slug: "",
  building_type: "Apartman",
  duration: "—",
  featured: false,
  published: true,
  short_description: "",
  description: "",
  scope: "Keşif ve mevcut durum analizi\n\nKontrollü saha uygulaması\nTeslim ve kontrol süreci",
  highlights: "",
  image_url: "",
  image_alt: "",
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    const [projRes, svcRes] = await Promise.all([
      fetch("/api/admin/projects"),
      fetch("/api/admin/services"),
    ]);
    const projData = (await projRes.json()) as { configured: boolean; projects: DbProject[] };
    const svcData = (await svcRes.json()) as { services: Array<{ slug: string; name: string; active?: boolean }> };
    setConfigured(projData.configured);
    setProjects(projData.projects || []);
    setServices(
      (svcData.services || [])
        .filter((s) => s.active !== false)
        .map((s) => ({ slug: s.slug, name: s.name }))
    );
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function syncFromSite() {
    setSyncing(true);
    setError("");
    setMessage("");
    const res = await fetch("/api/admin/projects", { method: "PUT" });
    const data = (await res.json()) as {
      imported?: number;
      removed?: number;
      total?: number;
      projects?: DbProject[];
      message?: string;
      error?: string;
    };
    setSyncing(false);
    if (!res.ok) {
      setError(data.error || "Siteden aktarım başarısız.");
      return;
    }
    if (data.projects) setProjects(data.projects);
    setMessage(data.message || "Aktarım tamamlandı.");
  }

  function onServiceSelect(slug: string) {
    const found = services.find((s) => s.slug === slug);
    setForm((prev) => ({
      ...prev,
      service_slug: slug,
      service: found?.name || prev.service,
    }));
  }

  function fillExampleTexts() {
    const name = form.name.trim() || "Proje";
    const district = form.district.trim() || "İstanbul";
    const service = form.service.trim() || "uygulama";
    const year = form.year;
    const refNo = form.ref_no.trim() || "—";

    setForm((prev) => ({
      ...prev,
      short_description: prev.short_description || `${district} — ${service}`,
      description:
        prev.description ||
        `${name} projesinde ${district} bölgesinde ${service.toLowerCase()} uygulaması Retim tarafından tamamlanmıştır. Referans No: ${refNo}`,
      scope:
        prev.scope.includes(service) || !service
          ? prev.scope
          : `Keşif ve mevcut durum analizi\n${service}\nKontrollü saha uygulaması\nTeslim ve kontrol süreci`,
      highlights:
        prev.highlights.trim() ||
        `Retim referans projesi\n${year} yılı uygulaması\n${district} bölgesi`,
    }));
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
    setForm((prev) => ({ ...prev, image_url: data.url || "" }));
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    if (!form.service_slug) {
      setSaving(false);
      setError("Lütfen bir hizmet türü seçin (örn. Çatı Yalıtım İşlemleri).");
      return;
    }

    const slug = `${slugify(form.name)}-${form.ref_no || Date.now()}`;
    const payload = {
      name: form.name.trim(),
      district: form.district.trim(),
      year: Number(form.year),
      ref_no: form.ref_no.trim(),
      service: form.service.trim(),
      service_slug: form.service_slug,
      building_type: form.building_type.trim() || "Apartman",
      duration: form.duration.trim() || "—",
      featured: form.featured,
      published: form.published,
      short_description: form.short_description.trim(),
      description: form.description.trim(),
      scope: linesToArray(form.scope),
      highlights: linesToArray(form.highlights),
      slug,
      image_url: form.image_url || null,
      image_alt: form.image_alt || null,
    };

    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { error?: string };
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Proje eklenemedi.");
      return;
    }

    setMessage(
      `Proje eklendi. Sitede /projeler?hizmet=${form.service_slug} adresinde bu hizmete tıklanınca görünecek.`
    );
    setForm(EMPTY_FORM);
    setShowForm(false);
    await load();
  }

  async function handleDelete(slug: string) {
    setError("");
    setMessage("");
    if (!confirm("Bu projeyi silmek istediğinize emin misiniz? Siteden de kalkar.")) return;

    // Önce listeyi senkronize et (static- id varsa)
    await load();
    const res = await fetch(`/api/admin/projects/${slug}`, { method: "DELETE" });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setError(data.error || "Proje silinemedi.");
      await load();
      return;
    }
    setMessage("Proje silindi.");
    await load();
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-retim-navy">Projeler</h1>
          <p className="mt-1 text-sm text-gray-600">
            Panel, sitede görünen 10 öne çıkan proje ile aynı kalır. Fazla kayıtlar otomatik temizlenir.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void syncFromSite()}
            disabled={syncing || !configured}
            className="rounded-lg border border-retim-navy/20 bg-white px-4 py-2 text-sm font-semibold text-retim-navy hover:bg-retim-navy/5 disabled:opacity-50"
          >
            {syncing ? "Eşitleniyor…" : "Site ile eşitle (10 proje)"}
          </button>
          <button type="button" onClick={() => setShowForm((v) => !v)} className="btn-primary">
            {showForm ? "Formu Kapat" : "+ Yeni Proje Ekle"}
          </button>
        </div>
      </div>

      {!configured && <SetupAlert />}

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 space-y-4">
          <div className="admin-card">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="admin-card-title">1. Proje Bilgileri</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Sitede proje detay sayfasının sağındaki <strong>Proje Bilgileri</strong> kartında görünür
                  (Referans No, Lokasyon, Semt, Yıl, Hizmet Türü, Bina Tipi, Süre).
                </p>
              </div>
              <button
                type="button"
                onClick={fillExampleTexts}
                className="text-xs font-semibold text-retim-orange hover:underline"
              >
                Örnek metinleri doldur
              </button>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <LabeledInput
                label="Proje Adı"
                hint="Sayfa başlığı ve açıklamada kullanılır"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                placeholder="örn. Asmalımescit No 28"
                required
              />
              <LabeledInput
                label="Referans No"
                hint="Sitede: Referans No"
                value={form.ref_no}
                onChange={(v) => setForm({ ...form, ref_no: v })}
                placeholder="örn. 2359"
              />
              <LabeledInput
                label="Lokasyon / Semt"
                hint="Sitede hem Lokasyon hem Semt olarak aynı değer görünür"
                value={form.district}
                onChange={(v) => setForm({ ...form, district: v })}
                placeholder="örn. Beyoğlu"
                required
              />
              <LabeledInput
                label="Yıl"
                hint="Sitede: Yıl"
                type="number"
                value={String(form.year)}
                onChange={(v) => setForm({ ...form, year: Number(v) })}
                required
              />
              <label className="md:col-span-2">
                <span className="mb-0.5 block text-sm font-medium text-gray-700">Hizmet Türü</span>
                <span className="mb-1.5 block text-xs text-gray-500">
                  Sitede bu hizmete (örn. Çatı Yalıtım) tıklanınca proje listelenir
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
                </select>
              </label>
              <LabeledInput
                label="Bina Tipi"
                hint="Sitede: Bina Tipi"
                value={form.building_type}
                onChange={(v) => setForm({ ...form, building_type: v })}
                placeholder="Apartman, Site, Villa..."
              />
              <LabeledInput
                label="Süre"
                hint="Sitede: Süre — boş bırakırsanız — görünür"
                value={form.duration}
                onChange={(v) => setForm({ ...form, duration: v })}
                placeholder="örn. 45 gün veya —"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                />
                Yayında (sitede görünsün)
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
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
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="örn. Asmalımescit No 28 projesinde Beyoğlu bölgesinde diş cephe restorasyon -boya işlemleri uygulaması Retim tarafından tamamlanmıştır. Referans No: 2359"
            />
            <label className="mt-4 block text-sm font-medium text-gray-700">
              Kısa Açıklama
            </label>
            <p className="mt-0.5 text-xs text-gray-500">
              /projeler listesindeki kart altında kısa özet olarak görünür
            </p>
            <input
              className="input-field mt-1"
              value={form.short_description}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              placeholder="örn. Beyoğlu — Dış cephe restorasyon - boya"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="admin-card">
              <h2 className="admin-card-title">3. Uygulama Kapsamı</h2>
              <p className="mt-1 text-sm text-gray-600">
                Sitede açıklamanın altında <strong>onay işaretli madde listesi</strong> olarak görünür.
                Her satır bir madde olur.
              </p>
              <textarea
                className="input-field mt-3 min-h-40"
                value={form.scope}
                onChange={(e) => setForm({ ...form, scope: e.target.value })}
                placeholder={"Keşif ve mevcut durum analizi\nDIŞ CEPHE RESTORASYON -BOYA İŞLEMLERİ\nKontrollü saha uygulaması\nTeslim ve kontrol süreci"}
              />
            </div>
            <div className="admin-card">
              <h2 className="admin-card-title">4. Öne Çıkan Uygulama Maddeleri</h2>
              <p className="mt-1 text-sm text-gray-600">
                Sitede projenin <strong>öne çıkan kısa maddeleri</strong> olarak görünür.
                Her satır bir madde olur.
              </p>
              <textarea
                className="input-field mt-3 min-h-40"
                value={form.highlights}
                onChange={(e) => setForm({ ...form, highlights: e.target.value })}
                placeholder={"Retim referans projesi\n2024 yılı uygulaması\nBeyoğlu bölgesi"}
              />
            </div>
          </div>

          <div className="admin-card">
            <h2 className="admin-card-title">5. Kapak Görseli</h2>
            <p className="mt-1 text-sm text-gray-600">
              Sitede proje detayındaki <strong>büyük kapak görseli</strong> ve /projeler listesindeki kart
              fotoğrafı olarak görünür. Yüklediğiniz görsel canlı sitede aynı şekilde çıkar.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Görsel dosyası yükle</label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  className="input-field"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleImageUpload(file);
                  }}
                />
                <label className="mb-1.5 mt-3 block text-sm font-medium text-gray-700">veya görsel URL</label>
                <input
                  className="input-field"
                  placeholder="https://... veya /images/..."
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                />
              </div>
              <LabeledInput
                label="Görsel Alt Metni"
                hint="Erişilebilirlik için kısa açıklama"
                value={form.image_alt}
                onChange={(v) => setForm({ ...form, image_alt: v })}
                placeholder="örn. Beyoğlu dış cephe uygulama görseli"
                className="self-end"
              />
            </div>
            {form.image_url && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-gray-500">Sitede görünecek önizleme:</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image_url} alt="" className="h-40 w-auto rounded-lg border object-cover" />
              </div>
            )}
            {uploading && <p className="mt-2 text-xs text-gray-500">Görsel yükleniyor...</p>}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={saving || uploading} className="btn-primary disabled:opacity-60">
            {saving ? "Ekleniyor..." : "Projeyi Kaydet (sitede yayınla)"}
          </button>
        </form>
      )}

      {message && <p className="mb-4 text-sm text-green-700">{message}</p>}

      <div className="admin-card overflow-hidden p-0">
        {loading ? (
          <p className="p-8 text-center text-sm text-gray-500">Yükleniyor...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Görsel</th>
                <th>Proje</th>
                <th>Hizmet</th>
                <th>Semt</th>
                <th>Yıl</th>
                <th>Ref No</th>
                <th>Durum</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image_url} alt="" className="h-10 w-14 rounded object-cover" />
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="font-medium text-retim-navy">{p.name}</td>
                  <td className="max-w-[10rem] truncate text-xs text-gray-600" title={p.service}>
                    {p.service || p.service_slug || "—"}
                  </td>
                  <td>{p.district}</td>
                  <td>{p.year}</td>
                  <td>{p.ref_no}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {p.published && <span className="admin-badge admin-badge-green">Yayında</span>}
                      {p.featured && <span className="admin-badge admin-badge-orange">Öne çıkan</span>}
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/projeler/${p.slug}`}
                        className="text-sm font-semibold text-retim-orange hover:underline"
                      >
                        Düzenle →
                      </Link>
                      <button
                        type="button"
                        onClick={() => void handleDelete(p.slug)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && projects.length === 0 && (
          <p className="p-8 text-center text-sm text-gray-500">
            Proje bulunamadı. Yukarıdan yeni proje ekleyin veya referans ekleyerek otomatik oluşturun.
          </p>
        )}
      </div>
    </div>
  );
}

function LabeledInput({
  label,
  hint,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  className = "",
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
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
        required={required}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function SetupAlert() {
  return (
    <div className="admin-alert mb-6">
      Supabase bağlantısı gerekli. <code>ADMIN_SETUP.md</code> dosyasındaki adımları izleyin.
    </div>
  );
}
