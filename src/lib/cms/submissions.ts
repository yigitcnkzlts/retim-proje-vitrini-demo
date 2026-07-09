import { getSupabaseAdmin } from "@/lib/cms/supabase";
import type { DbContactSubmission } from "@/lib/cms/types";

export async function saveContactSubmission(input: {
  name: string;
  email?: string;
  phone: string;
  building?: string;
  service?: string;
  message?: string;
}): Promise<void> {
  try {
    const client = getSupabaseAdmin();
    if (!client) return;

    const { error } = await client.from("contact_submissions").insert({
      name: input.name,
      email: input.email || null,
      phone: input.phone,
      building: input.building || null,
      service: input.service || null,
      message: input.message || null,
    });

    if (error) {
      console.error("Supabase submission save failed:", error.message);
    }
  } catch (error) {
    console.error("Supabase submission save failed:", error);
  }
}

export async function getSubmissionsAdmin(): Promise<DbContactSubmission[]> {
  const client = getSupabaseAdmin();
  if (!client) return [];
  const { data } = await client
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as DbContactSubmission[]) ?? [];
}

export async function markSubmissionRead(id: string, isRead: boolean): Promise<void> {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("CMS yapılandırılmamış");
  const { error } = await client.from("contact_submissions").update({ is_read: isRead }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteSubmission(id: string): Promise<void> {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("CMS yapılandırılmamış");
  const { error } = await client.from("contact_submissions").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getUnreadSubmissionCount(): Promise<number> {
  const client = getSupabaseAdmin();
  if (!client) return 0;
  const { count } = await client
    .from("contact_submissions")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);
  return count ?? 0;
}
