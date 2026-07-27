"use client";

import { useEffect, useMemo, useState } from "react";
import type { MediaRecord } from "@/lib/cms/media";

function formatBytes(n: number | null): string {
  if (!n || n <= 0) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaRecord[]>([]);
  const [configured, setConfigured] = useState(true);
  const [folder, setFolder] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/media");
    const data = (await res.json()) as { configured: boolean; media: MediaRecord[] };
    setConfigured(data.configured);
    setMedia(data.media || []);
  }

  useEffect(() => {
    void load();
  }, []);

  const folders = useMemo(() => {
    const set = new Set(media.map((m) => m.folder || "general"));
    return ["all", ...Array.from(set).sort()];
  }, [media]);

  const filtered = folder === "all" ? media : media.filter((m) => m.folder === folder);

  async function handleUpload(file: File) {
    setUploading(true);
    setError("");
    setMessage("");
    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder === "all" ? "general" : folder);
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const data = (await res.json()) as { error?: string };
    setUploading(false);
    if (!res.ok) {
      setError(data.error || "Yükleme başarısız.");
      return;
    }
    setMessage("Görsel yüklendi.");
    await load();
  }

  async function handleDelete(item: MediaRecord) {
    if (!confirm(`“${item.file_name}” silinsin mi? Bu işlem geri alınamaz.`)) return;
    setError("");
    const res = await fetch("/api/admin/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: item.path }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error || "Silinemedi.");
      return;
    }
    setMessage("Görsel silindi.");
    await load();
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setMessage("URL panoya kopyalandı — formlarda tekrar kullanabilirsiniz.");
    } catch {
      setError("Panoya kopyalanamadı.");
    }
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-retim-navy">Medya Kütüphanesi</h1>
      <p className="mt-1 text-sm text-gray-600">
        Yüklenen görselleri listeleyin, URL kopyalayarak tekrar kullanın veya silin.
      </p>

      {!configured && (
        <div className="admin-alert mt-6">
          <strong>Supabase henüz bağlı değil.</strong> Medya listesi boş görünür.
        </div>
      )}

      <div className="admin-card mt-6 flex flex-wrap items-end gap-4">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-gray-700">Klasör filtresi</span>
          <select className="input-field" value={folder} onChange={(e) => setFolder(e.target.value)}>
            {folders.map((f) => (
              <option key={f} value={f}>
                {f === "all" ? "Tümü" : f}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="btn-secondary inline-flex cursor-pointer">
            {uploading ? "Yükleniyor..." : "Yeni görsel yükle"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleUpload(file);
              e.target.value = "";
            }}
          />
        </label>
        <p className="text-xs text-gray-500">{filtered.length} görsel</p>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {message && <p className="mt-3 text-sm text-green-700">{message}</p>}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((item) => (
          <article key={item.id} className="admin-card overflow-hidden p-0">
            <div className="relative aspect-[4/3] bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.alt_text || item.file_name} className="h-full w-full object-cover" />
            </div>
            <div className="space-y-2 p-3">
              <p className="truncate text-sm font-medium text-retim-navy" title={item.file_name}>
                {item.file_name}
              </p>
              <p className="text-xs text-gray-500">
                {item.folder} · {formatBytes(item.size_bytes)}
              </p>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="text-xs text-retim-orange underline" onClick={() => void copyUrl(item.url)}>
                  URL kopyala
                </button>
                <button type="button" className="text-xs text-red-600 underline" onClick={() => void handleDelete(item)}>
                  Sil
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-sm text-gray-500">Bu klasörde görsel yok. Yukarıdan yükleyebilirsiniz.</p>
      )}
    </div>
  );
}
