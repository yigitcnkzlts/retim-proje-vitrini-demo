"use client";

import { FormEvent, useEffect, useState } from "react";
import type { HomeContent } from "@/lib/cms/home-content";

export default function AdminHomeContentPage() {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [districtInput, setDistrictInput] = useState("");

  useEffect(() => {
    void fetch("/api/admin/home-content")
      .then((r) => r.json())
      .then((d: { content: HomeContent }) => setContent(d.content));
  }, []);

  function updateStat(index: number, field: "value" | "label", value: string) {
    if (!content) return;
    const stats = content.stats.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    setContent({ ...content, stats });
  }

  function updateStep(index: number, field: "title" | "description", value: string) {
    if (!content) return;
    const approachSteps = content.approachSteps.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    setContent({ ...content, approachSteps });
  }

  function addStep() {
    if (!content) return;
    setContent({
      ...content,
      approachSteps: [...content.approachSteps, { title: "", description: "" }],
    });
  }

  function removeStep(index: number) {
    if (!content) return;
    setContent({
      ...content,
      approachSteps: content.approachSteps.filter((_, i) => i !== index),
    });
  }

  function addDistrict() {
    if (!content || !districtInput.trim()) return;
    setContent({ ...content, homeDistricts: [...content.homeDistricts, districtInput.trim()] });
    setDistrictInput("");
  }

  function removeDistrict(index: number) {
    if (!content) return;
    setContent({ ...content, homeDistricts: content.homeDistricts.filter((_, i) => i !== index) });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!content) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/admin/home-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Kayıt başarısız.");
      } else {
        setMessage("Ana sayfa içeriği kaydedildi.");
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
      <h1 className="text-2xl font-bold text-retim-navy">Ana Sayfa</h1>
      <p className="mt-1 text-sm text-gray-600">
        Hero başlığı, istatistikler, süreç kartları ve semt listesini yönetin.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-3xl space-y-6">
        <div className="admin-card space-y-4">
          <h2 className="admin-card-title">Hero Alanı</h2>
          <label>
            <span className="mb-1.5 block text-sm font-medium text-gray-700">Hero Başlığı</span>
            <input
              className="input-field"
              value={content.heroTitle}
              onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
            />
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-gray-700">Hero Açıklaması</span>
            <textarea
              className="input-field"
              rows={3}
              value={content.heroDescription}
              onChange={(e) => setContent({ ...content, heroDescription: e.target.value })}
            />
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-gray-700">Keşif Formu Üst Metni</span>
            <input
              className="input-field"
              value={content.discoveryLead}
              onChange={(e) => setContent({ ...content, discoveryLead: e.target.value })}
            />
          </label>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title">İstatistikler</h2>
          <div className="mt-3 space-y-2">
            {content.stats.map((stat, i) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <input
                  className="input-field"
                  placeholder="Değer (örn. 2000+)"
                  value={stat.value}
                  onChange={(e) => updateStat(i, "value", e.target.value)}
                />
                <input
                  className="input-field"
                  placeholder="Etiket (örn. Referans)"
                  value={stat.label}
                  onChange={(e) => updateStat(i, "label", e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between">
            <h2 className="admin-card-title">Süreç Kartları (&quot;Her Projede Aynı Disiplin&quot;)</h2>
            <button type="button" onClick={addStep} className="text-sm font-semibold text-retim-orange hover:underline">
              + Kart Ekle
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {content.approachSteps.map((step, i) => (
              <div key={i} className="rounded-lg border border-gray-200 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400">Kart {i + 1}</span>
                  <button type="button" onClick={() => removeStep(i)} className="text-xs text-red-600 hover:underline">
                    Kaldır
                  </button>
                </div>
                <input
                  className="input-field mt-2"
                  placeholder="Başlık"
                  value={step.title}
                  onChange={(e) => updateStep(i, "title", e.target.value)}
                />
                <textarea
                  className="input-field mt-2"
                  placeholder="Açıklama"
                  rows={2}
                  value={step.description}
                  onChange={(e) => updateStep(i, "description", e.target.value)}
                />
              </div>
            ))}
            {content.approachSteps.length === 0 && (
              <p className="text-sm text-gray-500">Henüz kart eklenmedi.</p>
            )}
          </div>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title">Hero Semt Listesi (kayan yazı)</h2>
          <div className="mt-3 flex gap-2">
            <input
              className="input-field"
              placeholder="Semt adı ekle (örn. Nişantaşı)"
              value={districtInput}
              onChange={(e) => setDistrictInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addDistrict();
                }
              }}
            />
            <button type="button" onClick={addDistrict} className="btn-secondary whitespace-nowrap">
              Ekle
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {content.homeDistricts.map((district, i) => (
              <span key={i} className="tag flex items-center gap-1.5">
                {district}
                <button
                  type="button"
                  onClick={() => removeDistrict(i)}
                  className="text-gray-400 hover:text-red-600"
                  aria-label={`${district} kaldır`}
                >
                  ×
                </button>
              </span>
            ))}
            {content.homeDistricts.length === 0 && (
              <p className="text-sm text-gray-500">Henüz semt eklenmedi.</p>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
}
