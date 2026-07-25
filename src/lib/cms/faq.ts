import {
  faqCategories as staticFaqCategories,
  flattenFaqCategories,
  type FaqCategory,
} from "@/data/faq";
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

const EXCLUDED_FAQ_KEY = "excluded_faq_questions";
const UPSERT_BATCH = 50;

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

function staticFaqAsDb(): DbFaqItem[] {
  const now = new Date().toISOString();
  return flattenFaqCategories(staticFaqCategories).map((r, i) => ({
    id: `static-faq-${i}`,
    category_slug: r.category_slug,
    category_title: r.category_title,
    question: r.question,
    answer: r.answer,
    sort_order: r.sort_order,
    active: true,
    created_at: now,
    updated_at: now,
  }));
}

async function getExcludedQuestions(): Promise<Set<string>> {
  const client = getSupabaseAdmin();
  if (!client) return new Set();
  const { data } = await client
    .from("site_settings")
    .select("value")
    .eq("key", EXCLUDED_FAQ_KEY)
    .maybeSingle();
  const value = data?.value;
  if (Array.isArray(value)) return new Set(value.map(String));
  return new Set();
}

async function addExcludedQuestion(question: string): Promise<void> {
  const client = getSupabaseAdmin();
  if (!client) return;
  const excluded = await getExcludedQuestions();
  excluded.add(question);
  await client.from("site_settings").upsert({
    key: EXCLUDED_FAQ_KEY,
    value: Array.from(excluded),
    updated_at: new Date().toISOString(),
  });
}

/**
 * Sitedeki tüm Bilgi Merkezi sorularını panele aktarır (eksik olanlar).
 * Silinen sorular (excluded) tekrar eklenmez.
 */
export async function syncSiteFaqToAdmin(): Promise<{
  imported: number;
  total: number;
  done: boolean;
}> {
  const client = getSupabaseAdmin();
  if (!client) return { imported: 0, total: 0, done: true };

  const excluded = await getExcludedQuestions();
  const source = flattenFaqCategories(staticFaqCategories).filter(
    (r) => !excluded.has(r.question)
  );

  const { data: existing, error: readError } = await client
    .from("faq_items")
    .select("question");
  if (readError) throw new Error(readError.message);

  const have = new Set((existing ?? []).map((r) => r.question as string));
  const missing = source
    .filter((r) => !have.has(r.question))
    .map((r) => ({
      category_slug: r.category_slug,
      category_title: r.category_title,
      question: r.question,
      answer: r.answer,
      sort_order: r.sort_order,
      active: true,
    }));

  let imported = 0;
  for (let i = 0; i < missing.length; i += UPSERT_BATCH) {
    const batch = missing.slice(i, i + UPSERT_BATCH);
    const { error } = await client.from("faq_items").insert(batch);
    if (error) throw new Error(error.message);
    imported += batch.length;
  }

  return { imported, total: source.length, done: true };
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

/**
 * Panelde sitedeki Bilgi Merkezi soruları birebir görünsün:
 * site listesi temel, DB UUID/güncellemeleri üzerine yazılır.
 */
async function mergeSiteFaqWithDb(): Promise<DbFaqItem[]> {
  const client = getSupabaseAdmin();
  const excluded = client ? await getExcludedQuestions() : new Set<string>();
  const siteRows = staticFaqAsDb().filter((r) => !excluded.has(r.question));

  if (!client) return siteRows;

  // Eksikleri sessizce aktarmayı dene (tablo yoksa site listesi kalır)
  try {
    await syncSiteFaqToAdmin();
  } catch (error) {
    console.error("FAQ senkron hatası:", error instanceof Error ? error.message : error);
  }

  const { data } = await client.from("faq_items").select("*").order("sort_order", { ascending: true });
  const dbRows = (data as DbFaqItem[]) ?? [];
  const byQuestion = new Map(dbRows.map((r) => [r.question, r]));

  const merged = siteRows.map((r) => byQuestion.get(r.question) ?? r);

  // Panelden elle eklenen (sitede olmayan) sorular
  const siteQuestions = new Set(siteRows.map((r) => r.question));
  for (const row of dbRows) {
    if (!siteQuestions.has(row.question) && !excluded.has(row.question)) {
      merged.push(row);
    }
  }

  return merged.sort((a, b) => a.sort_order - b.sort_order);
}

export async function getAllFaqAdmin(): Promise<DbFaqItem[]> {
  return mergeSiteFaqWithDb();
}

export function getSiteFaqCount(): number {
  return flattenFaqCategories(staticFaqCategories).length;
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

  const { data: existing } = await client
    .from("faq_items")
    .select("question")
    .eq("id", id)
    .maybeSingle();

  const { error } = await client.from("faq_items").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (existing?.question) {
    await addExcludedQuestion(existing.question as string);
  }
}
