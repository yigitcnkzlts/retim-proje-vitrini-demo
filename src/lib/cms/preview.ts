import { getSupabaseAdmin } from "@/lib/cms/supabase";

export type PreviewType = "project" | "service";

export type PreviewPayload = {
  type: PreviewType;
  data: Record<string, unknown>;
  expires_at: string;
  created_at: string;
};

const TTL_MS = 30 * 60 * 1000; // 30 dakika

function previewKey(token: string) {
  return `cms_preview_${token}`;
}

function newToken(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function createPreview(
  type: PreviewType,
  data: Record<string, unknown>
): Promise<{ token: string; expiresAt: string }> {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("Supabase yapılandırılmamış.");

  const token = newToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + TTL_MS).toISOString();
  const payload: PreviewPayload = {
    type,
    data,
    expires_at: expiresAt,
    created_at: now.toISOString(),
  };

  const { error } = await client.from("site_settings").upsert({
    key: previewKey(token),
    value: payload,
    updated_at: now.toISOString(),
  });

  if (error) throw new Error(error.message);
  return { token, expiresAt };
}

export async function getPreview(token: string): Promise<PreviewPayload | null> {
  const client = getSupabaseAdmin();
  if (!client) return null;

  const safe = token.trim().slice(0, 80);
  if (!safe) return null;

  const { data } = await client
    .from("site_settings")
    .select("value")
    .eq("key", previewKey(safe))
    .maybeSingle();

  if (!data?.value || typeof data.value !== "object") return null;
  const payload = data.value as PreviewPayload;
  if (!payload.type || !payload.data || !payload.expires_at) return null;
  if (new Date(payload.expires_at).getTime() < Date.now()) {
    await client.from("site_settings").delete().eq("key", previewKey(safe));
    return null;
  }
  return payload;
}
