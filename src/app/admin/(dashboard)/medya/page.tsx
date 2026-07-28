"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { MediaRecord } from "@/lib/cms/media";
import { MEDIA_FOLDERS, mediaFolderLabel } from "@/lib/cms/media-folders";
import type { MediaUsageRef } from "@/lib/cms/media-usage";
import { prepareImageForUpload } from "@/lib/cms/prepare-image";

function formatBytes(n: number | null): string {
  if (!n || n <= 0) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

type AspectOption = "none" | "1:1" | "4:3" | "16:9";

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaRecord[]>([]);
  const [usage, setUsage] = useState<Record<string, MediaUsageRef[]>>({});
  const [configured, setConfigured] = useState(true);
  const [folderFilter, setFolderFilter] = useState("all");
  const [uploadFolder, setUploadFolder] = useState("general");
  const [search, setSearch] = useState("");
  const [usageOnly, setUsageOnly] = useState(false);
  const [maxEdge, setMaxEdge] = useState(1920);
  const [aspect, setAspect] = useState<AspectOption>("none");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/media");
    const data = (await res.json()) as {
      configured: boolean;
      media: MediaRecord[];
      usage?: Record<string, MediaUsageRef[]>;
    };
    setConfigured(data.configured);
    setMedia(data.media || []);
    setUsage(data.usage || {});
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const folderOptions = useMemo(() => {
    const known = MEDIA_FOLDERS.map((f) => f.id);
    const extra = Array.from(new Set(media.map((m) => m.folder || "general"))).filter(
      (f) => !known.includes(f as (typeof MEDIA_FOLDERS)[number]["id"])
    );
    return ["all", ...known, ...extra.sort()];
  }, [media]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return media.filter((m) => {
      if (folderFilter !== "all" && m.folder !== folderFilter) return false;
      if (usageOnly && !(usage[m.url]?.length > 0)) return false;
      if (!q) return true;
      return (
        m.file_name.toLowerCase().includes(q) ||
        m.folder.toLowerCase().includes(q) ||
        m.alt_text.toLowerCase().includes(q) ||
        m.url.toLowerCase().includes(q)
      );
    });
  }, [media, folderFilter, search, usageOnly, usage]);

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) {
      setError("Lütfen en az bir görsel seçin.");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");
    let ok = 0;
    let fail = 0;

    for (let i = 0; i < list.length; i++) {
      const original = list[i];
      setUploadProgress(`${i + 1}/${list.length}: ${original.name}`);
      try {
        const prepared = await prepareImageForUpload(original, {
          maxEdge,
          aspect: aspect === "none" ? null : aspect,
          quality: 0.85,
        });
        const body = new FormData();
        body.append("file", prepared);
        body.append("folder", uploadFolder);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          fail += 1;
          setError(data.error || `${original.name} yüklenemedi.`);
        } else {
          ok += 1;
        }
      } catch {
        fail += 1;
        setError(`${original.name} işlenirken hata oluştu.`);
      }
    }

    setUploading(false);
    setUploadProgress("");
    if (ok > 0) {
      setMessage(
        fail > 0
          ? `${ok} görsel yüklendi, ${fail} başarısız.`
          : `${ok} görsel yüklendi.`
      );
      await load();
    }
  }

  async function handleDelete(item: MediaRecord) {
    const used = usage[item.url]?.length ?? 0;
    const warn =
      used > 0
        ? `“${item.file_name}” ${used} yerde kullanılıyor. Yine de silinsin mi?`
        : `“${item.file_name}” silinsin mi? Bu işlem geri alınamaz.`;
    if (!confirm(warn)) return;
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
      setMessage("URL panoya kopyalandı.");
    } catch {
      setError("Panoya kopyalanamadı.");
    }
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-retim-navy">Medya Kütüphanesi</h1>
      <p className="mt-1 text-sm text-gray-600">
        Görselleri klasörlere yükleyin, arayın, boyutlandırın ve nerede kullanıldığını görün.
      </p>

      {!configured && (
        <div className="admin-alert mt-6">
          <strong>Supabase henüz bağlı değil.</strong> Medya listesi boş görünür.
        </div>
      )}

      <div className="admin-card mt-6 space-y-4">
        <h2 className="admin-card-title">Yükleme</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-gray-700">Hedef klasör</span>
            <select
              className="input-field"
              value={uploadFolder}
              onChange={(e) => setUploadFolder(e.target.value)}
              disabled={uploading}
            >
              {MEDIA_FOLDERS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-gray-700">Maks. kenar</span>
            <select
              className="input-field"
              value={maxEdge}
              onChange={(e) => setMaxEdge(Number(e.target.value))}
              disabled={uploading}
            >
              <option value={0}>Orijinal boyut</option>
              <option value={2560}>2560 px</option>
              <option value={1920}>1920 px (önerilen)</option>
              <option value={1200}>1200 px</option>
              <option value={800}>800 px</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-gray-700">Kırpma oranı</span>
            <select
              className="input-field"
              value={aspect}
              onChange={(e) => setAspect(e.target.value as AspectOption)}
              disabled={uploading}
            >
              <option value="none">Yok (oran koru)</option>
              <option value="1:1">Kare 1:1</option>
              <option value="4:3">4:3</option>
              <option value="16:9">16:9</option>
            </select>
          </label>
          <div className="flex items-end">
            <label className="w-full">
              <span className="btn-primary inline-flex w-full cursor-pointer justify-center">
                {uploading ? "Yükleniyor..." : "Görsel seç / toplu yükle"}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const files = e.target.files;
                  if (files?.length) void uploadFiles(files);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
        {uploadProgress && <p className="text-xs text-gray-500">{uploadProgress}</p>}
        <p className="text-xs text-gray-500">
          Birden fazla dosya seçebilirsiniz. Yüklemeden önce tarayıcıda yeniden boyutlandırma /
          kırpma uygulanır.
        </p>
      </div>

      <div className="admin-card mt-4 flex flex-wrap items-end gap-4">
        <label className="min-w-[12rem] flex-1 text-sm">
          <span className="mb-1 block font-medium text-gray-700">Ara</span>
          <input
            className="input-field"
            placeholder="Dosya adı, klasör, URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-gray-700">Klasör</span>
          <select
            className="input-field"
            value={folderFilter}
            onChange={(e) => setFolderFilter(e.target.value)}
          >
            {folderOptions.map((f) => (
              <option key={f} value={f}>
                {f === "all" ? "Tümü" : mediaFolderLabel(f)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 pb-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={usageOnly}
            onChange={(e) => setUsageOnly(e.target.checked)}
          />
          Sadece kullanılanlar
        </label>
        <p className="pb-2 text-xs text-gray-500">
          {filtered.length} / {media.length} görsel
        </p>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {message && <p className="mt-3 text-sm text-green-700">{message}</p>}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((item) => {
          const used = usage[item.url] ?? [];
          const open = expandedId === item.id;
          return (
            <article key={item.id} className="admin-card overflow-hidden p-0">
              <div className="relative aspect-[4/3] bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.alt_text || item.file_name}
                  className="h-full w-full object-cover"
                />
                {used.length > 0 && (
                  <span className="absolute left-2 top-2 rounded bg-retim-navy/85 px-2 py-0.5 text-[10px] font-semibold text-white">
                    {used.length} kullanım
                  </span>
                )}
              </div>
              <div className="space-y-2 p-3">
                <p className="truncate text-sm font-medium text-retim-navy" title={item.file_name}>
                  {item.file_name}
                </p>
                <p className="text-xs text-gray-500">
                  {mediaFolderLabel(item.folder)} · {formatBytes(item.size_bytes)}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="text-xs text-retim-orange underline"
                    onClick={() => void copyUrl(item.url)}
                  >
                    URL kopyala
                  </button>
                  <button
                    type="button"
                    className="text-xs text-retim-navy underline"
                    onClick={() => setExpandedId(open ? null : item.id)}
                  >
                    {open ? "Gizle" : "Nerede?"}
                  </button>
                  <button
                    type="button"
                    className="text-xs text-red-600 underline"
                    onClick={() => void handleDelete(item)}
                  >
                    Sil
                  </button>
                </div>
                {open && (
                  <div className="rounded border border-retim-gray-dark bg-retim-gray/60 p-2 text-xs text-gray-700">
                    {used.length === 0 ? (
                      <p>Henüz hiçbir içerikte kullanılmıyor.</p>
                    ) : (
                      <ul className="space-y-1">
                        {used.map((ref) => (
                          <li key={`${ref.href}-${ref.label}`}>
                            <Link href={ref.href} className="text-retim-orange underline">
                              {ref.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-sm text-gray-500">
          Sonuca uyan görsel yok. Filtreyi temizleyin veya yeni görsel yükleyin.
        </p>
      )}
    </div>
  );
}
