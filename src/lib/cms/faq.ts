import { faqCategories as staticFaqCategories, type FaqCategory } from "@/data/faq";
import { getSupabaseAdmin, getSupabasePublic, isCmsConfigured } from "@/lib/cms/supabase";
import type { DbFaqItem } from "@/lib/cms/types";

export type FaqInput = {
  category_slug: string;
  category_title: string;
  question: string;
  answer: string;
  sort_order?: number;
  active?: boolean;
};

function groupByCategory(rows: DbFaqItem[]): FaqCategory[] {
  const map = new Map<string, FaqCategory>();
  for (const row of rows) {
    let cat = map.get(row.category_slug);
    if (!cat) {
      cat = { id: row.category_slug, title: row.category_title, items: [] };
      map.set(row.category_slug, cat);
    }
    cat.items.push({ question: row.question, answer: row.answer });
  }
  return Array.from(map.values());
}

export async function getFaqCategories(): Promise<FaqCategory[]> {
  if (!isCmsConfigured()) return staticFaqCategories;

  const client = getSupabasePublic() ?? getSupabaseAdmin();
  if (!client) return staticFaqCategories;

  const { data, error } = await client
    .from("faq_items")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return staticFaqCategories;
  return groupByCategory(data as DbFaqItem[]);
}

export async function getAllFaqAdmin(): Promise<DbFaqItem[]> {
  const client = getSupabaseAdmin();
  if (!client) return [];
  const { data } = await client.from("faq_items").select("*").order("sort_order", { ascending: true });
  return (data as DbFaqItem[]) ?? [];
}

export async function createFaqItem(input: FaqInput): Promise<DbFaqItem | null> {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("CMS yapılandırılmamış");

  const { data, error } = await client
    .from("faq_items")
    .insert({
      category_slug: input.category_slug,
      category_title: input.category_title,
      question: input.question,
      answer: input.answer,
      sort_order: input.sort_order ?? 0,
      active: input.active ?? true,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as DbFaqItem;
}

export async function updateFaqItem(id: string, input: Partial<FaqInput>): Promise<DbFaqItem | null> {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("CMS yapılandırılmamış");

  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.category_slug !== undefined) payload.category_slug = input.category_slug;
  if (input.category_title !== undefined) payload.category_title = input.category_title;
  if (input.question !== undefined) payload.question = input.question;
  if (input.answer !== undefined) payload.answer = input.answer;
  if (input.sort_order !== undefined) payload.sort_order = input.sort_order;
  if (input.active !== undefined) payload.active = input.active;

  const { data, error } = await client.from("faq_items").update(payload).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return data as DbFaqItem;
}

export async function deleteFaqItem(id: string): Promise<void> {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("CMS yapılandırılmamış");
  const { error } = await client.from("faq_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
