"use client";

import { FormEvent, useEffect, useState } from "react";
import type { DbProjectRef } from "@/lib/cms/types";

type RefFormState = {
  ref_no: string;
  project_name: string;
  service: string;
  district: string;
  year: number;
};

export default function AdminReferencesPage() {
  const [catalog, setCatalog] = useState<DbProjectRef[]>([]);
  const [archive, setArchive] = useState<DbProjectRef[]>([]);
  const [tab, setTab] = useState<"catalog" | "archive">("catalog");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<RefFormState | null>(null);
  const [form, setForm] = useState({
    ref_no: "",
    project_name: "",
    service: "",
    district: "",
    year: new Date().getFullYear(),
    ref_type: "catalog" as "catalog" | "archive",
  });

  async function load() {
    setLoading(true);
    const [catRes, arcRes] = await Promise.all([
      fetch("/api/admin/references?type=catalog"),
      fetch("/api/admin/references?type=archive"),
    ]);
    const catData = (await catRes.json()) as { references: DbProjectRef[] };
    const arcData = (await arcRes.json()) as { references: DbProjectRef[] };
    setCatalog(catData.references || []);
    setArchive(arcData.references || []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    const res = await fetch("/api/admin/references", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, ref_type: tab, create_project: tab === "catalog" }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error || "Eklenemedi.");
      return;
    }
    setMessage("Referans eklendi.");
    setForm({ ref_no: "", project_name: "", service: "", district: "", year: new Date().getFullYear(), ref_type: tab });
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu referansı çıkarmak istediğinize emin misiniz? Listeden kalıcı olarak silinir.")) return;
    setMessage("");
    setError("");
    const res = await fetch(`/api/admin/references/${id}`, { method: "DELETE" });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setError(data.error || "Referans çıkarılamadı.");
      return;
    }
    setMessage("Referans çıkarıldı.");
    await load();
  }

  function startEdit(r: DbProjectRef) {
    setEditingId(r.id);
    setEditForm({
      ref_no: r.ref_no,
      project_name: r.project_name,
      service: r.service,
      district: r.district,
      year: r.year,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(null);
  }

  async function saveEdit(id: string) {
    if (!editForm) return;
    await fetch(`/api/admin/references/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    cancelEdit();
    await load();
  }

  const list = tab === "catalog" ? catalog : archive;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-retim-navy">Referanslar</h1>
      <p className="mt-1 text-sm text-gray-600">
        Katalog referansları otomatik proje oluşturur. Arşiv referansları /referanslar sayfasında görünür.
      </p>

      <div className="mt-6 flex gap-2">
        <button type="button" className={`admin-tab ${tab === "catalog" ? "is-active" : ""}`} onClick={() => setTab("catalog")}>
          Katalog ({catalog.length})
        </button>
        <button type="button" className={`admin-tab ${tab === "archive" ? "is-active" : ""}`} onClick={() => setTab("archive")}>
          Arşiv ({archive.length})
        </button>
      </div>

      <form onSubmit={handleCreate} className="admin-card mt-6">
        <h2 className="admin-card-title">Yeni Referans Ekle</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input className="input-field" placeholder="Ref No" value={form.ref_no} onChange={(e) => setForm({ ...form, ref_no: e.target.value })} required />
          <input className="input-field md:col-span-2" placeholder="Proje Adı" value={form.project_name} onChange={(e) => setForm({ ...form, project_name: e.target.value })} required />
          <input className="input-field md:col-span-2" placeholder="İşlem / Hizmet" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} required />
          <input className="input-field" placeholder="Semt" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} required />
          <input className="input-field" type="number" placeholder="Yıl" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} required />
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {message && <p className="mt-3 text-sm text-green-700">{message}</p>}
        <button type="submit" className="btn-primary mt-4">Ekle</button>
      </form>

      <div className="admin-card mt-6 overflow-hidden p-0">
        {loading ? (
          <p className="p-8 text-center text-sm text-gray-500">Yükleniyor...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Proje</th>
                <th>İşlem</th>
                <th>Konum</th>
                <th>Yıl</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {list.map((r) =>
                editingId === r.id && editForm ? (
                  <tr key={r.id} className="bg-retim-orange/5">
                    <td>
                      <input
                        className="input-field"
                        value={editForm.ref_no}
                        onChange={(e) => setEditForm({ ...editForm, ref_no: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="input-field"
                        value={editForm.project_name}
                        onChange={(e) => setEditForm({ ...editForm, project_name: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="input-field"
                        value={editForm.service}
                        onChange={(e) => setEditForm({ ...editForm, service: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="input-field"
                        value={editForm.district}
                        onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="input-field"
                        type="number"
                        value={editForm.year}
                        onChange={(e) => setEditForm({ ...editForm, year: Number(e.target.value) })}
                      />
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => void saveEdit(r.id)} className="text-sm font-semibold text-green-700 hover:underline">
                          Kaydet
                        </button>
                        <button type="button" onClick={cancelEdit} className="text-sm text-gray-500 hover:underline">
                          Vazgeç
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={r.id}>
                    <td>{r.ref_no}</td>
                    <td className="font-medium">{r.project_name}</td>
                    <td className="max-w-xs truncate">{r.service}</td>
                    <td>{r.district}</td>
                    <td>{r.year}</td>
                    <td className="text-right">
                      <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => startEdit(r)} className="text-sm font-semibold text-retim-navy hover:underline">
                          Düzenle
                        </button>
                        <button type="button" onClick={() => void handleDelete(r.id)} className="rounded border border-red-200 px-2 py-1 text-sm font-semibold text-red-600 hover:bg-red-50">
                          Çıkar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
        {!loading && list.length === 0 && (
          <p className="p-8 text-center text-sm text-gray-500">Kayıt bulunamadı.</p>
        )}
      </div>
    </div>
  );
}
