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
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/projects");
    const data = (await res.json()) as { configured: boolean; projects: DbProject[] };
    setConfigured(data.configured);
    setProjects(data.projects || []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const slug = `${slugify(form.name)}-${form.ref_no || Date.now()}`;
    const payload = {
      ...form,
      slug,
      service_slug: form.service_slug || slugify(form.service),
      scope: [],
      highlights: [],
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

    setMessage("Proje eklendi. Detayları düzenlemek için 'Düzenle' bağlantısını kullanın.");
    setForm(EMPTY_FORM);
    setShowForm(false);
    await load();
  }

  async function handleDelete(slug: string) {
    if (!confirm("Bu projeyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return;
    await fetch(`/api/admin/projects/${slug}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-retim-navy">Projeler</h1>
          <p className="mt-1 text-sm text-gray-600">
            Proje ekleyin, silin veya detaylarını (açıklama, kapsam, süre, görsel) düzenleyin.
          </p>
        </div>
        <button type="button" onClick={() => setShowForm((v) => !v)} className="btn-primary">
          {showForm ? "Formu Kapat" : "+ Yeni Proje Ekle"}
        </button>
      </div>

      {!configured && <SetupAlert />}

      {showForm && (
        <form onSubmit={handleCreate} className="admin-card mb-6">
          <h2 className="admin-card-title">Yeni Proje</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              className="input-field"
              placeholder="Proje adı (örn. Yalı Apartmanı)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className="input-field"
              placeholder="Semt (örn. Beşiktaş)"
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              required
            />
            <input
              className="input-field"
              type="number"
              placeholder="Yıl"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
              required
            />
            <input
              className="input-field"
              placeholder="Ref No"
              value={form.ref_no}
              onChange={(e) => setForm({ ...form, ref_no: e.target.value })}
            />
            <input
              className="input-field"
              placeholder="Hizmet (örn. Mantolama işlemleri)"
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              required
            />
            <input
              className="input-field"
              placeholder="Bina tipi (Apartman, Site, Villa...)"
              value={form.building_type}
              onChange={(e) => setForm({ ...form, building_type: e.target.value })}
            />
            <input
              className="input-field"
              placeholder="Süre (örn. 45 gün)"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />
          </div>
          <textarea
            className="input-field mt-3"
            placeholder="Kısa açıklama"
            rows={2}
            value={form.short_description}
            onChange={(e) => setForm({ ...form, short_description: e.target.value })}
          />
          <div className="mt-3 flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              Yayında
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
          <button type="submit" disabled={saving} className="btn-primary mt-4 disabled:opacity-60">
            {saving ? "Ekleniyor..." : "Projeyi Ekle"}
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
                <th>Proje</th>
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
                  <td className="font-medium text-retim-navy">{p.name}</td>
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
                      <Link href={`/admin/projeler/${p.slug}`} className="text-sm font-semibold text-retim-orange hover:underline">
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

function SetupAlert() {
  return (
    <div className="admin-alert mb-6">
      Supabase bağlantısı gerekli. <code>ADMIN_SETUP.md</code> dosyasındaki adımları izleyin.
    </div>
  );
}
