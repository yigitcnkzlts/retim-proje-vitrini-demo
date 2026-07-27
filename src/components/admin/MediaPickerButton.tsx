"use client";

import { useEffect, useState } from "react";
import type { MediaRecord } from "@/lib/cms/media";

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

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    void fetch("/api/admin/media")
      .then((r) => r.json())
      .then((d: { media: MediaRecord[] }) => setMedia(d.media || []))
      .finally(() => setLoading(false));
  }, [open]);

  const list = folderHint
    ? [...media].sort((a, b) => {
        const aHit = a.folder === folderHint ? 0 : 1;
        const bHit = b.folder === folderHint ? 0 : 1;
        return aHit - bHit;
      })
    : media;

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
              <button type="button" className="text-sm text-gray-500 hover:text-retim-navy" onClick={() => setOpen(false)}>
                Kapat
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-4">
              {loading && <p className="text-sm text-gray-500">Yükleniyor...</p>}
              {!loading && list.length === 0 && (
                <p className="text-sm text-gray-500">
                  Kütüphane boş. Önce{" "}
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
                    <span className="block truncate px-2 py-1 text-[11px] text-gray-600">{item.file_name}</span>
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
