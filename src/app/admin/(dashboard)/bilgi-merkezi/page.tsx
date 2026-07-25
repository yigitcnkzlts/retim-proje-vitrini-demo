"use client";

import { FormEvent, useEffect, useState } from "react";
import { faqCategories } from "@/data/faq";
import type { DbFaqItem } from "@/lib/cms/types";

const CATEGORY_OPTIONS = faqCategories.map((c) => ({ slug: c.id, title: c.title }));

export default function AdminFaqPage() {
  const [items, setItems] = useState<DbFaqItem[]>([]);
  const [configured, setConfigured] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    category_slug: CATEGORY_OPTIONS[0]?.slug || "genel",
    category_title: CATEGORY_OPTIONS[0]?.title || "Genel",
    question: "",
    answer: "",
  });

  async function load() {
    const res = await fetch("/api/admin/faq");
    const data = (await res.json()) as { configured: boolean; items: DbFaqItem[] };
    setConfigured(data.configured);
    setItems(data.items || []);
  }

  useEffect(() => {
    void load();
  }, []);

  function onCategoryChange(slug: string) {
    const found = CATEGORY_OPTIONS.find((c) => c.slug === slug);
    setForm((prev) => ({
      ...prev,
      category_slug: slug,
      category_title: found?.title || slug,
    }));
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      category_slug: CATEGORY_OPTIONS[0]?.slug || "genel",
      category_title: CATEGORY_OPTIONS[0]?.title || "Genel",
      question: "",
      answer: "",
    });
  }

  function startEdit(item: DbFaqItem) {
    setEditingId(item.id);
    setForm({
      category_slug: item.category_slug,
      category_title: item.category_title,
      question: item.question,
      answer: item.answer,
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const res = editingId
      ? await fetch(`/api/admin/faq/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      : await fetch("/api/admin/faq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, sort_order: items.length }),
        });

    const data = (await res.json()) as { error?: string };
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Kayıt başarısız.");
      return;
    }

    setMessage(editingId ? "Soru güncellendi." : "Soru eklendi.");
    resetForm();
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu soru-cevabı silmek istediğinize emin misiniz?")) return;
    setError("");
    const res = await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setError(data.error || "Silinemedi.");
      return;
    }
    setMessage("Soru silindi.");
    if (editingId === id) resetForm();
    await load();
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-retim-navy">Bilgi Merkezi</h1>
      <p className="mt-1 text-sm text-gray-600">
        Sık sorulan soruları ekleyin, düzenleyin veya çıkarın. Site /bilgi-merkezi sayfasında görünür.
      </p>

      {!configured && (
        <div className="admin-alert mt-6">
          <strong>Supabase henüz bağlı değil.</strong> SSS tablosu için{" "}
          <code className="text-xs">supabase/migrations/0002_faq_items.sql</code> dosyasını SQL Editor&apos;da
          çalıştırın, ardından <code className="text-xs">npm run seed</code> ile mevcut soruları aktarın.
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-card mt-6 max-w-3xl space-y-3">
        <h2 className="admin-card-title">{editingId ? "Soruyu Düzenle" : "Yeni Soru Ekle"}</h2>
        <label>
          <span className="mb-1.5 block text-sm font-medium text-gray-700">Kategori</span>
          <select
            className="input-field"
            value={form.category_slug}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-medium text-gray-700">Soru</span>
          <input
            className="input-field"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            required
          />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-medium text-gray-700">Cevap</span>
          <textarea
            className="input-field"
            rows={4}
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            required
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
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
        {items.map((item) => (
          <div key={item.id} className="admin-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {item.category_title}
                </p>
                <p className="mt-1 font-semibold text-retim-navy">{item.question}</p>
                <p className="mt-2 text-sm text-gray-600">{item.answer}</p>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => startEdit(item)} className="text-sm text-retim-navy underline">
                  Düzenle
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(item.id)}
                  className="rounded border border-red-200 px-2 py-1 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Çıkar
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-gray-500">
            Henüz kayıt yok. Yukarıdan ekleyin veya <code>npm run seed</code> çalıştırın.
          </p>
        )}
      </div>
    </div>
  );
}
