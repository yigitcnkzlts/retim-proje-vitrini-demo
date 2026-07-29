"use client";

import { useEffect, useState, type ReactNode } from "react";
import RetimImage from "@/components/ui/RetimImage";
import type { RetimImageSource } from "@/data/mediaAssets";

type Props = {
  source: RetimImageSource;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  children?: ReactNode;
};

/** Kapak/galeri görseli: kutuyu doldurur, tıklanınca tam ekran büyütür. */
export default function ZoomableImage({
  source,
  className = "",
  imageClassName = "object-cover object-center",
  sizes,
  priority,
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={`group relative block w-full cursor-zoom-in overflow-hidden text-left ${className}`}
        onClick={() => setOpen(true)}
        aria-label="Görseli büyüt"
      >
        <RetimImage
          source={source}
          fill
          className={imageClassName}
          sizes={sizes}
          priority={priority}
        />
        {children}
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-sm bg-retim-navy/70 px-2 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
          Büyüt
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Görsel önizleme"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-sm bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
            onClick={() => setOpen(false)}
          >
            Kapat
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={source.primary}
            alt={source.alt}
            className="max-h-[90vh] max-w-[96vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
