"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { faqCategories } from "@/data/faq";
import type { DbFaqItem } from "@/lib/cms/types";

const CATEGORY_OPTIONS = faqCategories.map((c) => ({ slug: c.id, title: c.title }));

type Props = {
  initialItems: DbFaqItem[];
  configured: boolean;
  siteCount: number;
};

export default function FaqAdminClient({ initialItems, configured, siteCount }: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    if (initialItems.length > 0) setItems(initialItems);
  }, [initialItems]);
  const [syncing, setSyncing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    category_slug: CATEGORY_OPTIONS[0]?.slug || "genel",
    category_title: CATEGORY_OPTIONS[0]?.title || "Genel",
    question: "",
    answer: "",
  });

  async function syncFromSite() {
    setSyncing(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin/faq", { method: "PUT" });
      const data = (await res.json()) as { items?: DbFaqItem[]; message?: string; error?: string };
      if (data.items && data.items.length > 0) setItems(data.items);
      if (!res.ok) {
        setError(data.error || "Aktarım başarısız. Supabase'de 0002_faq_items.sql çalıştırın.");
      } else {
        setMessage(data.message || "Güncellendi.");
      }
      router.refresh();
    } finally {
      setSyncing(false);
    }
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
      setError("Supabase bağlı değil.");
      return;
    }
    if (editingId?.startsWith("static-")) {
      setError("Önce “Site ile eşitle”ye basın, sonra düzenleyin.");
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
    setMessage(editingId ? "Güncellendi." : "Eklendi.");
    resetForm();
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (id.startsWith("static-")) {
      setError("Önce “Site ile eşitle”ye basın, sonra Çıkar’a tıklayın.");
      return;
    }
    if (!confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error || "Silinemedi.");
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
    setMessage("Soru silindi.");
    router.refresh();
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
            Sitedeki SSS burada. Toplam: <strong>{items.length}</strong> / sitede {siteCount}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void syncFromSite()}
          disabled={syncing || !configured}
          className="rounded-lg border border-retim-navy/20 bg-white px-4 py-2 text-sm font-semibold text-retim-navy hover:bg-retim-navy/5 disabled:opacity-50"
        >
          {syncing ? "Aktarılıyor…" : "Site ile eşitle"}
        </button>
      </div>

      {!configured && (
        <div className="admin-alert mb-4">
          Supabase bağlı değil. Liste siteden gösteriliyor; kaydetmek için env +{" "}
          <code className="text-xs">0002_faq_items.sql</code> gerekli.
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-card max-w-3xl space-y-3">
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

      <div className="mt-6">
        <select
          className="input-field w-auto"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">Tümü ({items.length})</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.title} ({items.filter((i) => i.category_slug === c.slug).length})
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 space-y-6">
        {grouped.map(([categoryTitle, catItems]) => (
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
        ))}
        {items.length === 0 && (
          <p className="text-sm text-red-600">Liste boş — sayfayı yenileyin veya Site ile eşitleyin.</p>
        )}
      </div>
    </div>
  );
}
