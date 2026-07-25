import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { createFaqItem, getAllFaqAdmin } from "@/lib/cms/faq";
import { isCmsConfigured } from "@/lib/cms/supabase";
import { faqInputSchema } from "@/lib/validation/schemas";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  if (!isCmsConfigured()) {
    return NextResponse.json({ configured: false, items: [] });
  }

  const items = await getAllFaqAdmin();
  return NextResponse.json({ configured: true, items });
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
