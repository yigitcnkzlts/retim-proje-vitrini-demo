import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { createFaqItem, getAllFaqAdmin, getSiteFaqCount, syncSiteFaqToAdmin } from "@/lib/cms/faq";
import { isCmsConfigured } from "@/lib/cms/supabase";
import { faqInputSchema } from "@/lib/validation/schemas";
import { flattenFaqCategories, faqCategories } from "@/data/faq";
import type { DbFaqItem } from "@/lib/cms/types";

function siteFaqFallback(): DbFaqItem[] {
  const now = new Date().toISOString();
  return flattenFaqCategories(faqCategories).map((r, i) => ({
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

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const items = await getAllFaqAdmin();
    return NextResponse.json({
      configured: isCmsConfigured(),
      siteFaqCount: getSiteFaqCount(),
      items: items.length > 0 ? items : siteFaqFallback(),
    });
  } catch (error) {
    console.error("FAQ GET:", error);
    return NextResponse.json({
      configured: isCmsConfigured(),
      siteFaqCount: getSiteFaqCount(),
      items: siteFaqFallback(),
    });
  }
}

/** Sitedeki tüm Bilgi Merkezi sorularını panele / DB'ye aktarır. */
export async function PUT() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const result = await syncSiteFaqToAdmin();
    revalidatePath("/bilgi-merkezi");
    const items = await getAllFaqAdmin();
    return NextResponse.json({
      ...result,
      items: items.length > 0 ? items : siteFaqFallback(),
      message:
        result.imported > 0
          ? `${result.imported} soru siteden aktarıldı. Toplam: ${items.length || getSiteFaqCount()}.`
          : `Tüm sorular panelde. Toplam: ${items.length || getSiteFaqCount()}.`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Aktarım başarısız.";
    // Tablo yoksa bile site listesini döndür
    return NextResponse.json({
      error: `${message} (Supabase'de 0002_faq_items.sql çalıştırın)`,
      items: siteFaqFallback(),
      configured: isCmsConfigured(),
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const body = await request.json();
    const parsed = faqInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Geçersiz veri." },
        { status: 400 }
      );
    }
    const item = await createFaqItem(parsed.data);
    revalidatePath("/bilgi-merkezi");
    return NextResponse.json({ item });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Soru eklenemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
