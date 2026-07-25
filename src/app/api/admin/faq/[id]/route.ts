import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { deleteFaqItem, updateFaqItem } from "@/lib/cms/faq";
import { faqInputSchema } from "@/lib/validation/schemas";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = faqInputSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Geçersiz veri." },
        { status: 400 }
      );
    }
    const item = await updateFaqItem(id, parsed.data);
    revalidatePath("/bilgi-merkezi");
    return NextResponse.json({ item });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Güncelleme başarısız.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const { id } = await context.params;
    await deleteFaqItem(id);
    revalidatePath("/bilgi-merkezi");
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Silme başarısız.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
