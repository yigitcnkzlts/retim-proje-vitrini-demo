"use client";

import { FormEvent, useEffect, useState } from "react";
import type { AboutContent } from "@/lib/cms/about-content";

export default function AdminAboutContentPage() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void fetch("/api/admin/about-content")
      .then((r) => r.json())
      .then((d: { content: AboutContent }) => setContent(d.content));
  }, []);

  async function handleImageUpload(file: File) {
    if (!content) return;
    setUploading(true);
    setError("");
    const body = new FormData();
    body.append("file", file);
    body.append("folder", "hakkimizda");
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const data = (await res.json()) as { url?: string; error?: string };
    setUploading(false);
    if (!res.ok) {
      setError(data.error || "Görsel yüklenemedi.");
      return;
    }
    setContent({ ...content, founderImage: data.url || content.founderImage });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!content) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/admin/about-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Kayıt başarısız.");
      } else {
        setMessage("Hakkımızda içeriği kaydedildi.");
      }
    } catch {
      setError("Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.");
    } finally {
      setSaving(false);
    }
  }

  if (!content) return <div className="p-8 text-sm text-gray-500">Yükleniyor...</div>;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-retim-navy">Hakkımızda</h1>
      <p className="mt-1 text-sm text-gray-600">Kurumsal metinler ve kurucu bilgisi.</p>

      <form onSubmit={handleSubmit} className="admin-card mt-6 max-w-2xl space-y-4">
        <label>
          <span className="mb-1.5 block text-sm font-medium text-gray-700">Giriş Metni</span>
          <textarea
            className="input-field"
            rows={3}
            value={content.intro}
            onChange={(e) => setContent({ ...content, intro: e.target.value })}
          />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-medium text-gray-700">Deneyim Metni</span>
          <textarea
            className="input-field"
            rows={3}
            value={content.experience}
            onChange={(e) => setContent({ ...content, experience: e.target.value })}
          />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-medium text-gray-700">Ekip Metni</span>
          <textarea
            className="input-field"
            rows={3}
            value={content.team}
            onChange={(e) => setContent({ ...content, team: e.target.value })}
          />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-medium text-gray-700">Kapanış Metni</span>
          <textarea
            className="input-field"
            rows={3}
            value={content.closing}
            onChange={(e) => setContent({ ...content, closing: e.target.value })}
          />
        </label>

        <div className="grid gap-3 md:grid-cols-2">
          <label>
            <span className="mb-1.5 block text-sm font-medium text-gray-700">Kurucu Adı</span>
            <input
              className="input-field"
              value={content.founderName}
              onChange={(e) => setContent({ ...content, founderName: e.target.value })}
            />
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-medium text-gray-700">Unvan</span>
            <input
              className="input-field"
              value={content.founderTitle}
              onChange={(e) => setContent({ ...content, founderTitle: e.target.value })}
            />
          </label>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Kurucu Görseli</label>
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
          <p className="mt-1 truncate text-xs text-gray-500">{content.founderImage}</p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}
        <button type="submit" disabled={saving || uploading} className="btn-primary disabled:opacity-60">
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
}
