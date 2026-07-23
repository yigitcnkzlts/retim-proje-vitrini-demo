import { getSupabaseAdmin } from "@/lib/cms/supabase";

export interface MediaRecord {
  id: string;
  bucket: string;
  path: string;
  url: string;
  folder: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  alt_text: string;
  created_at: string;
}

const BUCKET = "cms-uploads";

/** Yüklenen bir dosyayı `media` tablosuna kaydeder (en iyi çaba — hata verse de yükleme başarısı bozulmaz). */
export async function recordMedia(input: {
  path: string;
  url: string;
  folder: string;
  file_name: string;
  mime_type?: string | null;
  size_bytes?: number | null;
}): Promise<void> {
  const client = getSupabaseAdmin();
  if (!client) return;

  const { error } = await client.from("media").insert({
    bucket: BUCKET,
    path: input.path,
    url: input.url,
    folder: input.folder,
    file_name: input.file_name,
    mime_type: input.mime_type ?? null,
    size_bytes: input.size_bytes ?? null,
  });

  if (error) {
    console.error("Medya kaydı oluşturulamadı:", error.message);
  }
}

/** Storage bucket'ındaki bir görsel URL'inden dosya yolunu (path) çıkarır. */
export function extractStoragePath(urlOrPath: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = urlOrPath.indexOf(marker);
  if (idx >= 0) return decodeURIComponent(urlOrPath.slice(idx + marker.length));
  if (!urlOrPath.startsWith("http")) return urlOrPath;
  return null;
}

/** Storage'dan dosyayı ve `media` kaydını siler. */
export async function deleteMediaByPath(path: string): Promise<void> {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("Supabase yapılandırılmamış.");

  const { error: storageError } = await client.storage.from(BUCKET).remove([path]);
  if (storageError) throw new Error(storageError.message);

  const { error: dbError } = await client.from("media").delete().eq("bucket", BUCKET).eq("path", path);
  if (dbError) console.error("Medya kaydı silinemedi:", dbError.message);
}

export async function getAllMediaAdmin(): Promise<MediaRecord[]> {
  const client = getSupabaseAdmin();
  if (!client) return [];
  const { data } = await client.from("media").select("*").order("created_at", { ascending: false });
  return (data as MediaRecord[]) ?? [];
}
