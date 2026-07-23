"use client";

import { FormEvent, useEffect, useState } from "react";
import type { DbService } from "@/lib/cms/types";

type ServiceForm = {
  slug: string;
  name: string;
  description: string;
  detail: string;
  image_url: string;
  image_alt: string;
  project_types: string;
  active: boolean;
  featured: boolean;
};

const EMPTY_FORM: ServiceForm = {
  slug: "",
  name: "",
  description: "",
  detail: "",
  image_url: "",
  image_alt: "",
  project_types: "",
  active: true,
  featured: false,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<DbService[]>([]);
  const [configured, setConfigured] = useState(true);
  const [form, setForm] = useState<ServiceForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/services");
    const data = (await res.json()) as { configured: boolean; services: DbService[] };
    setConfigured(data.configured);
    setServices(data.services || []);
  }

  useEffect(() => {
    void load();
  }, []);

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function editService(s: DbService) {
    setEditingId(s.id);
    setForm({
      slug: s.slug,
      name: s.name,
      description: s.description,
      detail: s.detail,
      image_url: s.image_url || "",
      image_alt: s.image_alt,
      project_types: s.project_types.join(", "),
      active: s.active,
      featured: s.featured,
    });
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError("");
    const body = new FormData();
    body.append("file", file);
    body.append("folder", "services");
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const data = (await res.json()) as { url?: string; error?: string };
    setUploading(false);
    if (!res.ok) {
      setError(data.error || "Görsel yüklenemedi.");
      return;
    }
    setForm((prev) => ({ ...prev, image_url: data.url || "" }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      detail: form.detail.trim(),
      image_url: form.image_url || null,
      image_alt: form.image_alt.trim(),
      project_types: form.project_types
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      active: form.active,
      featured: form.featured,
    };

    const res = editingId
      ? await fetch(`/api/admin/services/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    const data = (await res.json()) as { error?: string };
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Kayıt başarısız.");
      return;
    }

    setMessage(editingId ? "Hizmet güncellendi." : "Hizmet eklendi.");
    resetForm();
    await load();
  }

  async function toggleActive(s: DbService) {
    await fetch(`/api/admin/services/${s.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !s.active }),
    });
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu hizmeti silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-retim-navy">Hizmetler</h1>
      <p className="mt-1 text-sm text-gray-600">
        Hizmetler sayfası ve ana sayfada görünen uygulama alanlarını yönetin.
      </p>

      {!configured && (
        <div className="admin-alert mt-6">
          <strong>Supabase henüz bağlı değil.</strong> Site statik hizmet verileriyle çalışmaya devam eder.
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-card mt-6">
        <h2 className="admin-card-title">{editingId ? "Hizmeti Düzenle" : "Yeni Hizmet"}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            className="input-field"
            placeholder="Slug (örn. mantolama)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
          />
          <input
            className="input-field"
            placeholder="Hizmet adı"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <textarea
          className="input-field mt-3"
          placeholder="Açıklama (en az 10 karakter)"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <textarea
          className="input-field mt-3"
          placeholder="Detay metni (isteğe bağlı)"
          rows={3}
          value={form.detail}
          onChange={(e) => setForm({ ...form, detail: e.target.value })}
        />
        <input
          className="input-field mt-3"
          placeholder="Proje tipleri (virgülle ayırın: Apartman, Site, Villa)"
          value={form.project_types}
          onChange={(e) => setForm({ ...form, project_types: e.target.value })}
        />

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Görsel</label>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleImageUpload(file);
              }}
              className="input-field"
            />
            {form.image_url && (
              <p className="mt-1 truncate text-xs text-gray-500">{form.image_url}</p>
            )}
          </div>
          <input
            className="input-field self-end"
            placeholder="Görsel alt metni"
            value={form.image_alt}
            onChange={(e) => setForm({ ...form, image_alt: e.target.value })}
          />
        </div>

        <div className="mt-3 flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Aktif
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Öne çıkan
          </label>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {message && <p className="mt-3 text-sm text-green-700">{message}</p>}

        <div className="mt-4 flex gap-2">
          <button type="submit" disabled={saving || uploading} className="btn-primary disabled:opacity-60">
            {saving ? "Kaydediliyor..." : editingId ? "Güncelle" : "Ekle"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              İptal
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {services.map((s) => (
          <div key={s.id} className="admin-card flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-retim-navy">
                {s.name} <span className="text-xs text-gray-400">/{s.slug}</span>
              </p>
              <p className="mt-1 max-w-xl text-sm text-gray-600">{s.description}</p>
              <p className="mt-1 text-xs text-gray-400">
                {s.active ? "Aktif" : "Pasif"} {s.featured && "· Öne çıkan"}
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => editService(s)} className="text-xs text-retim-navy underline">
                Düzenle
              </button>
              <button type="button" onClick={() => void toggleActive(s)} className="text-xs text-retim-orange">
                {s.active ? "Pasifleştir" : "Aktifleştir"}
              </button>
              <button type="button" onClick={() => void handleDelete(s.id)} className="text-xs text-red-600">
                Sil
              </button>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <p className="text-sm text-gray-500">Henüz hizmet eklenmedi.</p>
        )}
      </div>
    </div>
  );
}
