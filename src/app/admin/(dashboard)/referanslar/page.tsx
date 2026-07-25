"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  REFERENCES_PAGE_SIZE,
  references2023,
  references2024,
  referencesArchive,
} from "@/data/references";
import type { DbProjectRef } from "@/lib/cms/types";

type RefFormState = {
  ref_no: string;
  project_name: string;
  service: string;
  district: string;
  year: number;
};

function toStaticDb(
  refs: Array<{ refNo: string; projectName: string; service: string; district: string; year: number }>,
  refType: "catalog" | "archive",
  prefix: string
): DbProjectRef[] {
  const now = new Date().toISOString();
  return refs.map((r) => ({
    id: `${prefix}-${r.refNo}`,
    ref_no: r.refNo,
    project_name: r.projectName,
    service: r.service,
    district: r.district,
    year: r.year,
    ref_type: refType,
    created_at: now,
    updated_at: now,
  }));
}

const SITE_ARCHIVE = toStaticDb(referencesArchive, "archive", "static-archive");
const SITE_CATALOG = toStaticDb([...references2024, ...references2023], "catalog", "static-catalog");

export default function AdminReferencesPage() {
  const [catalog, setCatalog] = useState<DbProjectRef[]>(SITE_CATALOG);
  const [archive, setArchive] = useState<DbProjectRef[]>(SITE_ARCHIVE);
  const [tab, setTab] = useState<"catalog" | "archive">("archive");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
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
    ref_type: "archive" as "catalog" | "archive",
  });

  async function load() {
    setLoading(true);
    try {
      const [catRes, arcRes] = await Promise.all([
        fetch("/api/admin/references?type=catalog"),
        fetch("/api/admin/references?type=archive"),
      ]);
      const catData = (await catRes.json()) as { references?: DbProjectRef[] };
      const arcData = (await arcRes.json()) as { references?: DbProjectRef[] };

      // API dolu gelirse kullan; aksi halde sitedeki tam liste kalsın
      if (catData.references && catData.references.length > 0) {
        setCatalog(catData.references);
      }
      if (arcData.references && arcData.references.length >= SITE_ARCHIVE.length * 0.5) {
        setArchive(arcData.references);
      } else if (arcData.references && arcData.references.length > 0) {
        // Kısmi DB — site listesiyle birleştir
        const byNo = new Map(arcData.references.map((r) => [r.ref_no, r]));
        setArchive(SITE_ARCHIVE.map((r) => byNo.get(r.ref_no) ?? r));
      }
    } catch {
      setArchive(SITE_ARCHIVE);
      setCatalog(SITE_CATALOG);
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
    setMessage("Sitedeki referanslar aktarılıyor…");
    setTab("archive");

    try {
      for (let round = 0; round < 30; round++) {
        const res = await fetch("/api/admin/references", { method: "PUT" });
        const data = (await res.json()) as {
          message?: string;
          error?: string;
          done?: boolean;
          remaining?: number;
          totalArchive?: number;
        };
        if (!res.ok) {
          setError(data.error || "Siteden aktarım başarısız.");
          break;
        }
        setMessage(data.message || "Aktarım devam ediyor…");
        if (data.done) {
          await load();
          setMessage(`Tamam. Panelde sitedeki gibi ${data.totalArchive ?? archive.length} referans var.`);
          break;
        }
      }
    } finally {
      setSyncing(false);
    }
  }

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
    setForm({
      ref_no: "",
      project_name: "",
      service: "",
      district: "",
      year: new Date().getFullYear(),
      ref_type: tab,
    });
    await load();
  }

  async function handleDelete(id: string) {
    if (id.startsWith("static-")) {
      setError("Kalıcı silmek için önce “Site ile eşitle”ye basın, sonra Çıkar’a tıklayın.");
      return;
    }
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
    if (id.startsWith("static-")) {
      setError("Düzenlemek için önce “Site ile eşitle”ye basın.");
      return;
    }
    await fetch(`/api/admin/references/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    cancelEdit();
    await load();
  }

  const list = tab === "catalog" ? catalog : archive;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (r) =>
        r.ref_no.toLowerCase().includes(q) ||
        r.project_name.toLowerCase().includes(q) ||
        r.service.toLowerCase().includes(q) ||
        r.district.toLowerCase().includes(q) ||
        String(r.year).includes(q)
    );
  }, [list, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / REFERENCES_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * REFERENCES_PAGE_SIZE;
    return filtered.slice(start, start + REFERENCES_PAGE_SIZE);
  }, [filtered, currentPage]);

  useEffect(() => {
    setPage(1);
  }, [search, tab]);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-retim-navy">Referanslar</h1>
          <p className="mt-1 text-sm text-gray-600">
            Sitedeki <strong>/referanslar</strong> listesi burada <strong>Arşiv</strong> olarak görünür:{" "}
            <strong>{archive.length}</strong> referans (sitede {SITE_ARCHIVE.length}).
          </p>
        </div>
        <button
          type="button"
          onClick={() => void syncFromSite()}
          disabled={syncing}
          className="rounded-lg border border-retim-navy/20 bg-white px-4 py-2 text-sm font-semibold text-retim-navy hover:bg-retim-navy/5 disabled:opacity-50"
        >
          {syncing ? "Aktarılıyor… (birkaç tur sürebilir)" : "Site ile eşitle (veritabanına yaz)"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`admin-tab ${tab === "archive" ? "is-active" : ""}`}
          onClick={() => setTab("archive")}
        >
          Arşiv — sitedeki liste ({archive.length})
        </button>
        <button
          type="button"
          className={`admin-tab ${tab === "catalog" ? "is-active" : ""}`}
          onClick={() => setTab("catalog")}
        >
          Katalog ({catalog.length})
        </button>
      </div>

      <form onSubmit={handleCreate} className="admin-card mt-6">
        <h2 className="admin-card-title">Yeni Referans Ekle</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            className="input-field"
            placeholder="Ref No"
            value={form.ref_no}
            onChange={(e) => setForm({ ...form, ref_no: e.target.value })}
            required
          />
          <input
            className="input-field md:col-span-2"
            placeholder="Proje Adı"
            value={form.project_name}
            onChange={(e) => setForm({ ...form, project_name: e.target.value })}
            required
          />
          <input
            className="input-field md:col-span-2"
            placeholder="İşlem / Hizmet"
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
            required
          />
          <input
            className="input-field"
            placeholder="Semt"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
            required
          />
          <input
            className="input-field"
            type="number"
            placeholder="Yıl"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
            required
          />
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {message && <p className="mt-3 text-sm text-green-700">{message}</p>}
        <button type="submit" className="btn-primary mt-4">
          Ekle
        </button>
      </form>

      <div className="mt-6 flex flex-wrap items-end gap-4">
        <div className="min-w-[240px] flex-1">
          <input
            className="input-field max-w-md"
            placeholder="Listede ara (ref no, proje, semt…)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <p className="text-sm text-gray-600">
          {filtered.length === list.length
            ? `${list.length} kayıt`
            : `${filtered.length} / ${list.length} kayıt`}
          {tab === "archive" && (
            <span className="ml-2 font-semibold text-retim-navy">
              (sitede {SITE_ARCHIVE.length})
            </span>
          )}
        </p>
      </div>

      <div className="admin-card mt-4 overflow-hidden p-0">
        {loading ? (
          <p className="p-8 text-center text-sm text-gray-500">Yükleniyor…</p>
        ) : (
          <>
            <div className="overflow-x-auto">
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
                  {pageItems.map((r) =>
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
                            onChange={(e) =>
                              setEditForm({ ...editForm, project_name: e.target.value })
                            }
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
                            onChange={(e) =>
                              setEditForm({ ...editForm, year: Number(e.target.value) })
                            }
                          />
                        </td>
                        <td className="text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => void saveEdit(r.id)}
                              className="text-sm font-semibold text-green-700 hover:underline"
                            >
                              Kaydet
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="text-sm text-gray-500 hover:underline"
                            >
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
                            <button
                              type="button"
                              onClick={() => startEdit(r)}
                              className="text-sm font-semibold text-retim-navy hover:underline"
                            >
                              Düzenle
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDelete(r.id)}
                              className="rounded border border-red-200 px-2 py-1 text-sm font-semibold text-red-600 hover:bg-red-50"
                            >
                              Çıkar
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
                <p className="text-xs text-gray-500">
                  Sayfa {currentPage} / {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded border px-3 py-1 text-sm disabled:opacity-40"
                  >
                    Önceki
                  </button>
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded border px-3 py-1 text-sm disabled:opacity-40"
                  >
                    Sonraki
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        {!loading && filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-gray-500">Kayıt bulunamadı.</p>
        )}
      </div>
    </div>
  );
}
