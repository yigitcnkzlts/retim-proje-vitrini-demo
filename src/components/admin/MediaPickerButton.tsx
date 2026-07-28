"use client";

import { useEffect, useMemo, useState } from "react";
import type { MediaRecord } from "@/lib/cms/media";
import { MEDIA_FOLDERS, mediaFolderLabel } from "@/lib/cms/media-folders";

type Props = {
  onSelect: (url: string) => void;
  folderHint?: string;
  label?: string;
};

export default function MediaPickerButton({
  onSelect,
  folderHint,
  label = "Kütüphaneden seç",
}: Props) {
  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState<MediaRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState(folderHint || "all");

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setFolder(folderHint || "all");
    setSearch("");
    void fetch("/api/admin/media")
      .then((r) => r.json())
      .then((d: { media: MediaRecord[] }) => setMedia(d.media || []))
      .finally(() => setLoading(false));
  }, [open, folderHint]);

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    let items = media;
    if (folder !== "all") {
      items = items.filter((m) => m.folder === folder);
    }
    if (q) {
      items = items.filter(
        (m) =>
          m.file_name.toLowerCase().includes(q) ||
          m.folder.toLowerCase().includes(q)
      );
    }
    if (folderHint) {
      items = [...items].sort((a, b) => {
        const aHit = a.folder === folderHint ? 0 : 1;
        const bHit = b.folder === folderHint ? 0 : 1;
        return aHit - bHit;
      });
    }
    return items;
  }, [media, folder, search, folderHint]);

  const folderOptions = useMemo(() => {
    const known = MEDIA_FOLDERS.map((f) => f.id);
    const extra = Array.from(new Set(media.map((m) => m.folder || "general"))).filter(
      (f) => !known.includes(f as (typeof MEDIA_FOLDERS)[number]["id"])
    );
    return ["all", ...known, ...extra.sort()];
  }, [media]);

  return (
    <>
      <button type="button" className="btn-secondary text-sm" onClick={() => setOpen(true)}>
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="font-semibold text-retim-navy">Medya Kütüphanesi</h3>
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-retim-navy"
                onClick={() => setOpen(false)}
              >
                Kapat
              </button>
            </div>
            <div className="flex flex-wrap gap-3 border-b px-4 py-3">
              <input
                className="input-field min-w-[10rem] flex-1 text-sm"
                placeholder="Ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="input-field text-sm"
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
              >
                {folderOptions.map((f) => (
                  <option key={f} value={f}>
                    {f === "all" ? "Tüm klasörler" : mediaFolderLabel(f)}
                  </option>
                ))}
              </select>
            </div>
            <div className="max-h-[65vh] overflow-y-auto p-4">
              {loading && <p className="text-sm text-gray-500">Yükleniyor...</p>}
              {!loading && list.length === 0 && (
                <p className="text-sm text-gray-500">
                  Sonuç yok.{" "}
                  <a href="/admin/medya" className="text-retim-orange underline" target="_blank">
                    Medya
                  </a>{" "}
                  sayfasından yükleyin.
                </p>
              )}
              <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4">
                {list.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="overflow-hidden rounded border border-gray-200 text-left transition hover:border-retim-orange"
                    onClick={() => {
                      onSelect(item.url);
                      setOpen(false);
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt="" className="aspect-square w-full object-cover" />
                    <span className="block truncate px-2 py-1 text-[11px] text-gray-600">
                      {item.file_name}
                    </span>
                    <span className="block truncate px-2 pb-1 text-[10px] text-gray-400">
                      {mediaFolderLabel(item.folder)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
