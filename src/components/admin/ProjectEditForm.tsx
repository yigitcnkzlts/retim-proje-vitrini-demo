"use client";

import { FormEvent, useState } from "react";
import type { DbProject } from "@/lib/cms/types";

interface ProjectEditFormProps {
  project: DbProject;
}

function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function arrayToLines(items: string[]): string {
  return items.join("\n");
}

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
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const res = await fetch(`/api/admin/projects/${project.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        year: Number(form.year),
        scope: linesToArray(form.scope),
        highlights: linesToArray(form.highlights),
        image_url: form.image_url || null,
        image_alt: form.image_alt || null,
      }),
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
        <h2 className="admin-card-title">Temel Bilgiler</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Proje Adı" value={form.name} onChange={(v) => updateField("name", v)} />
          <Field label="Semt / Lokasyon" value={form.district} onChange={(v) => updateField("district", v)} />
          <Field label="Yıl" type="number" value={String(form.year)} onChange={(v) => updateField("year", Number(v))} />
          <Field label="Referans No" value={form.ref_no} onChange={(v) => updateField("ref_no", v)} />
          <Field label="Hizmet Türü" value={form.service} onChange={(v) => updateField("service", v)} className="md:col-span-2" />
          <Field label="Bina Tipi" value={form.building_type} onChange={(v) => updateField("building_type", v)} />
          <Field label="Süre" value={form.duration} onChange={(v) => updateField("duration", v)} placeholder="örn. 3 ay" />
        </div>
        <div className="mt-4 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => updateField("published", e.target.checked)} />
            Yayında
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => updateField("featured", e.target.checked)} />
            Öne çıkan proje
          </label>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">Proje Açıklaması</h2>
        <textarea
          className="input-field mt-4 min-h-32"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
        <label className="mt-4 block text-sm font-medium text-gray-700">Kısa Açıklama (liste kartı)</label>
        <input
          className="input-field mt-1"
          value={form.short_description}
          onChange={(e) => updateField("short_description", e.target.value)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="admin-card">
          <h2 className="admin-card-title">Uygulama Kapsamı</h2>
          <p className="mt-1 text-xs text-gray-500">Her satır bir madde</p>
          <textarea
            className="input-field mt-3 min-h-40"
            value={form.scope}
            onChange={(e) => updateField("scope", e.target.value)}
          />
        </div>
        <div className="admin-card">
          <h2 className="admin-card-title">Öne Çıkan Maddeler</h2>
          <p className="mt-1 text-xs text-gray-500">Her satır bir madde</p>
          <textarea
            className="input-field mt-3 min-h-40"
            value={form.highlights}
            onChange={(e) => updateField("highlights", e.target.value)}
          />
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">Kapak Görseli</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Görsel URL</label>
            <input
              className="input-field"
              value={form.image_url}
              onChange={(e) => updateField("image_url", e.target.value)}
              placeholder="/images/... veya Supabase URL"
            />
            <label className="mt-3 block">
              <span className="btn-secondary mt-2 inline-flex cursor-pointer">
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
          </div>
          <Field label="Görsel Alt Metni" value={form.image_alt} onChange={(v) => updateField("image_alt", v)} />
        </div>
        {form.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.image_url} alt="" className="mt-4 h-40 w-auto rounded-lg border object-cover" />
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-green-700">{message}</p>}

      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
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
