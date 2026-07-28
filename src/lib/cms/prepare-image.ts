export type ImagePrepareOptions = {
  /** En geniş kenar (px). 0 = yeniden boyutlandırma yok */
  maxEdge: number;
  /** JPEG kalitesi 0–1 */
  quality?: number;
  /** Merkezden kırpma oranı; null = oran koru */
  aspect?: "1:1" | "4:3" | "16:9" | null;
};

function aspectValue(aspect: NonNullable<ImagePrepareOptions["aspect"]>): number {
  if (aspect === "1:1") return 1;
  if (aspect === "4:3") return 4 / 3;
  return 16 / 9;
}

/**
 * Tarayıcıda canvas ile görseli isteğe bağlı kırpıp küçültür.
 * Büyük dosyaları web için hafifletir.
 */
export async function prepareImageForUpload(
  file: File,
  options: ImagePrepareOptions
): Promise<File> {
  const { maxEdge, quality = 0.85, aspect = null } = options;
  if ((!maxEdge || maxEdge <= 0) && !aspect) return file;
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return file;

  const bitmap = await createImageBitmap(file);
  let sx = 0;
  let sy = 0;
  let sw = bitmap.width;
  let sh = bitmap.height;

  if (aspect) {
    const target = aspectValue(aspect);
    const current = sw / sh;
    if (current > target) {
      sw = Math.round(sh * target);
      sx = Math.round((bitmap.width - sw) / 2);
    } else if (current < target) {
      sh = Math.round(sw / target);
      sy = Math.round((bitmap.height - sh) / 2);
    }
  }

  let tw = sw;
  let th = sh;
  if (maxEdge > 0) {
    const edge = Math.max(sw, sh);
    if (edge > maxEdge) {
      const scale = maxEdge / edge;
      tw = Math.max(1, Math.round(sw * scale));
      th = Math.max(1, Math.round(sh * scale));
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = tw;
  canvas.height = th;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }

  ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, tw, th);
  bitmap.close();

  const outType = file.type === "image/png" ? "image/png" : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, outType, quality)
  );
  if (!blob) return file;

  const base = file.name.replace(/\.[^.]+$/, "");
  const ext = outType === "image/png" ? "png" : "jpg";
  return new File([blob], `${base}.${ext}`, { type: outType, lastModified: Date.now() });
}
