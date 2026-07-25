"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { faqCategories, flattenFaqCategories } from "@/data/faq";
import type { DbFaqItem } from "@/lib/cms/types";

const CATEGORY_OPTIONS = faqCategories.map((c) => ({ slug: c.id, title: c.title }));

const SITE_FAQ: DbFaqItem[] = flattenFaqCategories(faqCategories).map((r, i) => {
  const now = new Date().toISOString();
  return {
    id: `static-faq-${i}`,
    category_slug: r.category_slug,
    category_title: r.category_title,
    question: r.question,
    answer: r.answer,
    sort_order: r.sort_order,
    active: true,
    created_at: now,
    updated_at: now,
  };
});

export default function AdminFaqPage() {
  // Sitedeki sorular hemen görünsün (API beklenmeden)
  const [items, setItems] = useState<DbFaqItem[]>(SITE_FAQ);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
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
    setLoading(true);
    try {
      const res = await fetch("/api/admin/faq");
      const data = (await res.json()) as {
        configured: boolean;
        items: DbFaqItem[];
        siteFaqCount?: number;
        message?: string;
      };
      setConfigured(data.configured);
      if (data.items && data.items.length > 0) {
        setItems(data.items);
      } else {
        setItems(SITE_FAQ);
      }
      if (data.message && !data.configured) setMessage(data.message);
    } catch {
      setItems(SITE_FAQ);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function syncFromSite() {
    setSyncing(true);
    setError("");
    setMessage("");
    const res = await fetch("/api/admin/faq", { method: "PUT" });
    const data = (await res.json()) as {
      items?: DbFaqItem[];
      message?: string;
      error?: string;
    };
    setSyncing(false);
    if (!res.ok) {
      setError(
        data.error ||
          "Aktarım başarısız. Supabase'de faq_items tablosu var mı? (0002_faq_items.sql)"
      );
      // Tablo yoksa bile sitedeki liste kalsın
      setItems(SITE_FAQ);
      return;
    }
    if (data.items && data.items.length > 0) setItems(data.items);
    else setItems(SITE_FAQ);
    setMessage(data.message || `Sitedeki ${SITE_FAQ.length} soru panelde.`);
  }

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!configured) {
      setError("Önce Supabase + faq_items tablosunu bağlayın.");
      return;
    }
    if (editingId?.startsWith("static-")) {
      setError("Bu kayıt henüz veritabanında değil. “Site ile eşitle”ye basın.");
      return;
    }

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
    if (id.startsWith("static-")) {
      setError("Bu kayıt henüz veritabanında değil. Önce “Site ile eşitle”ye basın.");
      return;
    }
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

  const filtered = useMemo(() => {
    if (filterCategory === "all") return items;
    return items.filter((i) => i.category_slug === filterCategory);
  }, [items, filterCategory]);

  const grouped = useMemo(() => {
    const map = new Map<string, DbFaqItem[]>();
    for (const item of filtered) {
      const key = item.category_title || item.category_slug;
      const list = map.get(key) || [];
      list.push(item);
      map.set(key, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-retim-navy">Bilgi Merkezi</h1>
          <p className="mt-1 text-sm text-gray-600">
            Sitedeki Bilgi Merkezi metinleri burada görünür. Ekle / düzenle / çıkar yapabilirsiniz.
            Toplam: <strong>{items.length}</strong> (sitede {SITE_FAQ.length})
          </p>
        </div>
        <button
          type="button"
          onClick={() => void syncFromSite()}
          disabled={syncing || !configured}
          className="rounded-lg border border-retim-navy/20 bg-white px-4 py-2 text-sm font-semibold text-retim-navy hover:bg-retim-navy/5 disabled:opacity-50"
        >
          {syncing ? "Aktarılıyor…" : "Site ile eşitle (veritabanına yaz)"}
        </button>
      </div>

      {!configured && (
        <div className="admin-alert mt-2">
          <strong>Supabase henüz bağlı değil.</strong> SSS tablosu için{" "}
          <code className="text-xs">supabase/migrations/0002_faq_items.sql</code> dosyasını SQL
          Editor&apos;da çalıştırın. Liste yine de sitedeki soruları gösterir; kaydetmek için bağlantı
          gerekir.
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

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-gray-700">
          Kategori filtre:
          <select
            className="input-field ml-2 inline-block w-auto"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">Tümü ({items.length})</option>
            {CATEGORY_OPTIONS.map((c) => {
              const count = items.filter((i) => i.category_slug === c.slug).length;
              return (
                <option key={c.slug} value={c.slug}>
                  {c.title} ({count})
                </option>
              );
            })}
          </select>
        </label>
      </div>

      <div className="mt-4 space-y-6">
        {loading && items.length === 0 ? (
          <p className="text-sm text-gray-500">Yükleniyor…</p>
        ) : (
          grouped.map(([categoryTitle, catItems]) => (
            <section key={categoryTitle}>
              <h2 className="mb-3 text-lg font-bold text-retim-navy">{categoryTitle}</h2>
              <div className="space-y-3">
                {catItems.map((item) => (
                  <div key={item.id} className="admin-card">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-retim-navy">{item.question}</p>
                        <p className="mt-2 text-sm text-gray-600">{item.answer}</p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="text-sm text-retim-navy underline"
                        >
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
              </div>
            </section>
          ))
        )}
        {!loading && items.length === 0 && (
          <p className="text-sm text-gray-500">
            Henüz kayıt yok. “Site ile eşitle”ye basın veya yukarıdan ekleyin.
          </p>
        )}
      </div>
    </div>
  );
}
