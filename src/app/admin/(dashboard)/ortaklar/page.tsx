"use client";

import { FormEvent, useEffect, useState } from "react";
import type { DbPartner } from "@/lib/cms/types";

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<DbPartner[]>([]);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    const res = await fetch("/api/admin/partners");
    const data = (await res.json()) as { partners: DbPartner[] };
    setPartners(data.partners || []);
  }

  useEffect(() => {
    void load();
  }, []);

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

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-retim-navy">Çözüm Ortakları</h1>
      <p className="mt-1 text-sm text-gray-600">Logo ve firma adlarını yönetin.</p>

      <form onSubmit={handleCreate} className="admin-card mt-6">
        <h2 className="admin-card-title">Yeni Ortak</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input className="input-field" placeholder="Firma adı" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="input-field" placeholder="Logo URL (/images/partners/...)" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} required />
        </div>
        {message && <p className="mt-2 text-sm text-green-700">{message}</p>}
        <button type="submit" className="btn-primary mt-4">Ekle</button>
      </form>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((p) => (
          <div key={p.id} className="admin-card flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.logo_url} alt={p.name} className="h-12 w-20 object-contain" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-retim-navy">{p.name}</p>
              <p className="text-xs text-gray-500">{p.active ? "Aktif" : "Pasif"}</p>
            </div>
            <div className="flex flex-col gap-1">
              <button type="button" onClick={() => void toggleActive(p)} className="text-xs text-retim-orange">
                {p.active ? "Pasifleştir" : "Aktifleştir"}
              </button>
              <button type="button" onClick={() => void handleDelete(p.id)} className="text-xs text-red-600">
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
