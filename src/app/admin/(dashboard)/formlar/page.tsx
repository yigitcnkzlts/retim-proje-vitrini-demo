"use client";

import { useEffect, useMemo, useState } from "react";
import type { DbContactSubmission, SubmissionStatus } from "@/lib/cms/types";

const STATUS_LABELS: Record<SubmissionStatus, string> = {
  new: "Yeni",
  contacted: "Görüşüldü",
  in_progress: "Sürüyor",
  closed: "Kapandı",
};

const STATUS_OPTIONS: SubmissionStatus[] = ["new", "contacted", "in_progress", "closed"];

function statusBadgeClass(status: SubmissionStatus): string {
  switch (status) {
    case "new":
      return "bg-retim-orange/10 text-retim-orange";
    case "contacted":
      return "bg-blue-50 text-blue-700";
    case "in_progress":
      return "bg-amber-50 text-amber-700";
    case "closed":
      return "bg-green-50 text-green-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<DbContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "all">("all");
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/submissions");
    const data = (await res.json()) as { submissions: DbContactSubmission[] };
    setSubmissions(data.submissions || []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function updateStatus(id: string, status: SubmissionStatus) {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status, is_read: true } : s)));
    await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function saveNote(id: string) {
    const note = noteDrafts[id] ?? "";
    await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_note: note }),
    });
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, admin_note: note } : s)));
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu talebi silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
    await load();
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return submissions.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (!term) return true;
      return (
        s.name.toLowerCase().includes(term) ||
        s.phone.toLowerCase().includes(term) ||
        (s.email || "").toLowerCase().includes(term) ||
        (s.building || "").toLowerCase().includes(term) ||
        (s.service || "").toLowerCase().includes(term)
      );
    });
  }, [submissions, search, statusFilter]);

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-retim-navy">Keşif Talepleri</h1>
          <p className="mt-1 text-sm text-gray-600">İletişim formundan gelen talepler.</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- dosya indirme, sayfa değil */}
        <a href="/api/admin/submissions/export" className="btn-secondary text-sm">
          CSV Olarak İndir
        </a>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          className="input-field max-w-xs"
          placeholder="Ad, telefon, e-posta ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input-field max-w-[180px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as SubmissionStatus | "all")}
        >
          <option value="all">Tüm durumlar</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-card mt-6 overflow-hidden p-0">
        {loading ? (
          <p className="p-8 text-center text-sm text-gray-500">Yükleniyor...</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500">
            {submissions.length === 0
              ? "Henüz kayıt yok. Supabase bağlandığında formlar burada görünecek."
              : "Filtrelere uyan kayıt bulunamadı."}
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((s) => (
              <div key={s.id} className={`p-4 ${!s.is_read ? "bg-retim-orange/5" : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-retim-navy">{s.name}</p>
                    <p className="text-sm text-gray-600">
                      {s.phone} {s.email && `· ${s.email}`}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(s.created_at).toLocaleString("tr-TR")}
                      {s.building && ` · ${s.building}`}
                      {s.service && ` · ${s.service}`}
                    </p>
                    {s.message && <p className="mt-2 max-w-xl text-sm text-gray-700">{s.message}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(s.status)}`}
                    >
                      {STATUS_LABELS[s.status]}
                    </span>
                    <select
                      className="input-field text-xs"
                      value={s.status}
                      onChange={(e) => void updateStatus(s.id, e.target.value as SubmissionStatus)}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {STATUS_LABELS[opt]}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => void handleDelete(s.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Sil
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    className="input-field text-sm"
                    placeholder="Not ekleyin..."
                    value={noteDrafts[s.id] ?? s.admin_note ?? ""}
                    onChange={(e) => setNoteDrafts((prev) => ({ ...prev, [s.id]: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => void saveNote(s.id)}
                    className="btn-secondary whitespace-nowrap px-3 py-2 text-xs"
                  >
                    Notu Kaydet
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
