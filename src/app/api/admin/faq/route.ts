import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { createFaqItem, getAllFaqAdmin, syncSiteFaqToAdmin } from "@/lib/cms/faq";
import { isCmsConfigured } from "@/lib/cms/supabase";
import { faqInputSchema } from "@/lib/validation/schemas";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const items = await getAllFaqAdmin();
  return NextResponse.json({
    configured: isCmsConfigured(),
    items,
    message: isCmsConfigured()
      ? undefined
      : "Supabase yapılandırılmamış. Liste sitedeki statik sorulardır; kaydetmek için env + faq_items tablosu gerekli.",
  });
}

/** Sitedeki tüm Bilgi Merkezi sorularını panele aktarır. */
export async function PUT() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const result = await syncSiteFaqToAdmin();
    revalidatePath("/bilgi-merkezi");
    const items = await getAllFaqAdmin();
    return NextResponse.json({
      ...result,
      items,
      message:
        result.imported > 0
          ? `${result.imported} soru siteden aktarıldı. Toplam: ${items.length}.`
          : `Tüm sorular panelde. Toplam: ${items.length}.`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Aktarım başarısız.";
    return NextResponse.json({ error: message }, { status: 500 });
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
