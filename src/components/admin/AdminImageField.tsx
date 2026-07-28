"use client";

import { useState } from "react";
import MediaPickerButton from "@/components/admin/MediaPickerButton";
import { prepareImageForUpload } from "@/lib/cms/prepare-image";

type AspectOption = "none" | "1:1" | "4:3" | "16:9";

type Props = {
  folder?: string;
  /** Tek görsel: seçilince onUploaded(url) */
  onUploaded: (url: string) => void;
  /** Çoklu yükleme için true (galeri) */
  multiple?: boolean;
  /** Her dosya için onUploaded çağrılır */
  label?: string;
  libraryLabel?: string;
  showUrlInput?: boolean;
  urlValue?: string;
  onUrlChange?: (url: string) => void;
  previewUrl?: string;
  onClear?: () => void;
};

export default function AdminImageField({
  folder = "projects",
  onUploaded,
  multiple = false,
  label = "Dosya yükle",
  libraryLabel = "Kütüphaneden seç",
  showUrlInput = false,
  urlValue = "",
  onUrlChange,
  previewUrl,
  onClear,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [maxEdge, setMaxEdge] = useState(1920);
  const [aspect, setAspect] = useState<AspectOption>("none");

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) {
      setError("Lütfen bir görsel seçin.");
      return;
    }

    setUploading(true);
    setError("");
    let lastUrl = "";

    for (let i = 0; i < list.length; i++) {
      const original = list[i];
      setProgress(`${i + 1}/${list.length}: ${original.name}`);
      try {
        const prepared = await prepareImageForUpload(original, {
          maxEdge,
          aspect: aspect === "none" ? null : aspect,
          quality: 0.85,
        });
        const body = new FormData();
        body.append("file", prepared);
        body.append("folder", folder);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !data.url) {
          setError(data.error || `${original.name} yüklenemedi.`);
          continue;
        }
        lastUrl = data.url;
        onUploaded(data.url);
        if (!multiple) break;
      } catch {
        setError(`${original.name} işlenirken hata oluştu.`);
      }
    }

    setUploading(false);
    setProgress("");
    if (!multiple && lastUrl) {
      // single mode done
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-gray-700">Maks. kenar</span>
          <select
            className="input-field"
            value={maxEdge}
            disabled={uploading}
            onChange={(e) => setMaxEdge(Number(e.target.value))}
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
            disabled={uploading}
            onChange={(e) => setAspect(e.target.value as AspectOption)}
          >
            <option value="none">Yok (oran koru)</option>
            <option value="1:1">Kare 1:1</option>
            <option value="4:3">4:3</option>
            <option value="16:9">16:9</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <label>
          <span className="btn-secondary inline-flex cursor-pointer">
            {uploading ? "Yükleniyor..." : label}
          </span>
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const files = e.target.files;
              if (files?.length) void uploadFiles(files);
              e.target.value = "";
            }}
          />
        </label>
        <MediaPickerButton
          folderHint={folder}
          label={libraryLabel}
          onSelect={(url) => onUploaded(url)}
        />
        {previewUrl && onClear && (
          <button type="button" className="text-xs text-red-600 underline" onClick={onClear}>
            Görseli kaldır
          </button>
        )}
      </div>

      {progress && <p className="text-xs text-gray-500">{progress}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}

      {showUrlInput && onUrlChange && (
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">veya görsel URL</span>
          <input
            className="input-field"
            value={urlValue}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://... veya /images/..."
          />
        </label>
      )}

      {previewUrl && (
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">Önizleme:</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="" className="h-40 w-auto rounded-lg border object-cover" />
        </div>
      )}
    </div>
  );
}
