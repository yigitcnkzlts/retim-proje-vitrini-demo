"use client";

import { useEffect, useState } from "react";
import type { DbContactSubmission } from "@/lib/cms/types";

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<DbContactSubmission[]>([]);

  async function load() {
    const res = await fetch("/api/admin/submissions");
    const data = (await res.json()) as { submissions: DbContactSubmission[] };
    setSubmissions(data.submissions || []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function markRead(id: string, isRead: boolean) {
    await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_read: isRead }),
    });
    await load();
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-retim-navy">Keşif Talepleri</h1>
      <p className="mt-1 text-sm text-gray-600">İletişim formundan gelen talepler.</p>

      <div className="admin-card mt-6 overflow-hidden p-0">
        {submissions.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500">
            Henüz kayıt yok. Supabase bağlandığında formlar burada görünecek.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Ad</th>
                <th>Telefon</th>
                <th>Hizmet</th>
                <th>Mesaj</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id} className={!s.is_read ? "bg-retim-orange/5" : ""}>
                  <td className="whitespace-nowrap text-xs text-gray-500">
                    {new Date(s.created_at).toLocaleString("tr-TR")}
                  </td>
                  <td className="font-medium">{s.name}</td>
                  <td>{s.phone}</td>
                  <td className="max-w-[120px] truncate text-xs">{s.service}</td>
                  <td className="max-w-xs truncate text-sm">{s.message}</td>
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={() => void markRead(s.id, !s.is_read)}
                      className="text-xs font-semibold text-retim-orange hover:underline"
                    >
                      {s.is_read ? "Okunmadı yap" : "Okundu"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
