"use client";

import { FormEvent, useEffect, useState } from "react";
import type { DbPartner } from "@/lib/cms/types";

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<DbPartner[]>([]);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; logo_url: string } | null>(null);
  const [editUploading, setEditUploading] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/partners");
    const data = (await res.json()) as { partners: DbPartner[] };
    setPartners(data.partners || []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function uploadLogo(file: File): Promise<string | null> {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", "partners");
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const data = (await res.json()) as { url?: string; error?: string };
    if (!res.ok) {
      setMessage(data.error || "Görsel yüklenemedi.");
      return null;
    }
    return data.url || null;
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, logo_url: logoUrl, sort_order: partners.length }),
    });
    if (!res.ok) return;
    setName("");
    setLogoUrl("");
    setMessage("Ortak eklendi.");
    await load();
  }

  async function toggleActive(partner: DbPartner) {
    await fetch(`/api/admin/partners/${partner.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !partner.active }),
    });
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/partners/${id}`, { method: "DELETE" });
    await load();
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
    await fetch(`/api/admin/partners/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    cancelEdit();
    await load();
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-retim-navy">Çözüm Ortakları</h1>
      <p className="mt-1 text-sm text-gray-600">Logo ve firma adlarını yönetin.</p>

      <form onSubmit={handleCreate} className="admin-card mt-6">
        <h2 className="admin-card-title">Yeni Ortak</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input className="input-field" placeholder="Firma adı" value={name} onChange={(e) => setName(e.target.value)} required />
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
              placeholder="veya Logo URL yapıştırın"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              required
            />
          </div>
        </div>
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
                placeholder="Firma adı"
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
                placeholder="Logo URL"
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => void saveEdit(p.id)} className="text-xs font-semibold text-green-700 hover:underline">
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
                <button type="button" onClick={() => startEdit(p)} className="text-xs text-retim-navy hover:underline">
                  Düzenle
                </button>
                <button type="button" onClick={() => void toggleActive(p)} className="text-xs text-retim-orange">
                  {p.active ? "Pasifleştir" : "Aktifleştir"}
                </button>
                <button type="button" onClick={() => void handleDelete(p.id)} className="text-xs text-red-600">
                  Sil
                </button>
              </div>
            </div>
          )
        )}
        {partners.length === 0 && (
          <p className="text-sm text-gray-500">Henüz ortak eklenmedi.</p>
        )}
      </div>
    </div>
  );
}
