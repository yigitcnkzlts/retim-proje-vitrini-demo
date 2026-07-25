"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { DbPartner } from "@/lib/cms/types";

type Props = {
  initialPartners: DbPartner[];
  configured: boolean;
  siteCount: number;
};

export default function PartnersAdminClient({ initialPartners, configured, siteCount }: Props) {
  const router = useRouter();
  const [partners, setPartners] = useState(initialPartners);

  useEffect(() => {
    if (initialPartners.length > 0) setPartners(initialPartners);
  }, [initialPartners]);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; logo_url: string } | null>(null);
  const [editUploading, setEditUploading] = useState(false);

  async function syncFromSite() {
    setSyncing(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin/partners", { method: "PUT" });
      const data = (await res.json()) as {
        partners?: DbPartner[];
        message?: string;
        error?: string;
      };
      if (data.partners && data.partners.length > 0) setPartners(data.partners);
      if (!res.ok) setError(data.error || "Aktarım başarısız.");
      else setMessage(data.message || "Güncellendi.");
      router.refresh();
    } finally {
      setSyncing(false);
    }
  }

  async function uploadLogo(file: File): Promise<string | null> {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", "partners");
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const data = (await res.json()) as { url?: string; error?: string };
    if (!res.ok) {
      setError(data.error || "Görsel yüklenemedi.");
      return null;
    }
    return data.url || null;
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!configured) {
      setError("Supabase bağlı değil.");
      return;
    }
    const res = await fetch("/api/admin/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, logo_url: logoUrl, sort_order: partners.length }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error || "Eklenemedi.");
      return;
    }
    setName("");
    setLogoUrl("");
    setMessage("Ortak eklendi.");
    router.refresh();
  }

  async function toggleActive(partner: DbPartner) {
    if (partner.id.startsWith("static-")) {
      setError("Önce “Site ile eşitle”ye basın.");
      return;
    }
    await fetch(`/api/admin/partners/${partner.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !partner.active }),
    });
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (id.startsWith("static-")) {
      setError("Önce “Site ile eşitle”ye basın, sonra Çıkar’a tıklayın.");
      return;
    }
    if (!confirm("Bu çözüm ortağını çıkarmak istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/admin/partners/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error || "Çıkarılamadı.");
      return;
    }
    setPartners((prev) => prev.filter((p) => p.id !== id));
    setMessage("Ortak çıkarıldı.");
    router.refresh();
  }

  function startEdit(p: DbPartner) {
    setEditingId(p.id);
    setEditForm({ name: p.name, logo_url: p.logo_url });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(null);
  }

  async function saveEdit(id: string) {
    if (!editForm) return;
    if (id.startsWith("static-")) {
      setError("Önce “Site ile eşitle”ye basın.");
      return;
    }
    await fetch(`/api/admin/partners/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    cancelEdit();
    setMessage("Güncellendi.");
    router.refresh();
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-retim-navy">Çözüm Ortakları</h1>
          <p className="mt-1 text-sm text-gray-600">
            Sitedeki markalar burada. Toplam: <strong>{partners.length}</strong> / sitede {siteCount}
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
          Supabase bağlı değil. Liste siteden gösteriliyor; kaydetmek için env gerekli.
        </div>
      )}

      <form onSubmit={handleCreate} className="admin-card">
        <h2 className="admin-card-title">Yeni Ortak Ekle</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            className="input-field"
            placeholder="Firma adı"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              className="input-field"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                const url = await uploadLogo(file);
                setUploading(false);
                if (url) setLogoUrl(url);
              }}
            />
            <input
              className="input-field mt-2"
              placeholder="veya Logo URL"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              required
            />
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        {message && <p className="mt-2 text-sm text-green-700">{message}</p>}
        <button type="submit" disabled={uploading} className="btn-primary mt-4 disabled:opacity-60">
          Ekle
        </button>
      </form>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((p) =>
          editingId === p.id && editForm ? (
            <div key={p.id} className="admin-card space-y-2">
              <input
                className="input-field"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
              <input
                type="file"
                accept="image/*"
                disabled={editUploading}
                className="input-field"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setEditUploading(true);
                  const url = await uploadLogo(file);
                  setEditUploading(false);
                  if (url) setEditForm({ ...editForm, logo_url: url });
                }}
              />
              <input
                className="input-field"
                value={editForm.logo_url}
                onChange={(e) => setEditForm({ ...editForm, logo_url: e.target.value })}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void saveEdit(p.id)}
                  className="text-xs font-semibold text-green-700 hover:underline"
                >
                  Kaydet
                </button>
                <button type="button" onClick={cancelEdit} className="text-xs text-gray-500 hover:underline">
                  Vazgeç
                </button>
              </div>
            </div>
          ) : (
            <div key={p.id} className="admin-card flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.logo_url} alt={p.name} className="h-12 w-20 object-contain" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-retim-navy">{p.name}</p>
                <p className="text-xs text-gray-500">{p.active ? "Aktif" : "Pasif"}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(p)}
                  className="text-xs font-semibold text-retim-navy hover:underline"
                >
                  Düzenle
                </button>
                <button
                  type="button"
                  onClick={() => void toggleActive(p)}
                  className="text-xs text-retim-orange hover:underline"
                >
                  {p.active ? "Pasifleştir" : "Aktifleştir"}
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(p.id)}
                  className="rounded border border-red-200 px-2 py-0.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  Çıkar
                </button>
              </div>
            </div>
          )
        )}
      </div>
      {partners.length === 0 && (
        <p className="mt-4 text-sm text-red-600">Liste boş — sayfayı yenileyin veya Site ile eşitleyin.</p>
      )}
    </div>
  );
}
