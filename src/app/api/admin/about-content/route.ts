import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { getAboutContent, upsertAboutContent } from "@/lib/cms/about-content";
import { aboutContentSchema } from "@/lib/validation/schemas";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const content = await getAboutContent();
  return NextResponse.json({ content });
}

export async function PUT(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const body = await request.json();
    const parsed = aboutContentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Geçersiz veri." },
        { status: 400 }
      );
    }
    await upsertAboutContent(parsed.data);
    revalidatePath("/hakkimizda");
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kayıt başarısız.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
