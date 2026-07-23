import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { getSiteSettings, updateSiteSettings } from "@/lib/cms/site-settings";
import { siteSettingsSchema } from "@/lib/validation/schemas";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const body = await request.json();
    const parsed = siteSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Geçersiz veri." },
        { status: 400 }
      );
    }
    await updateSiteSettings(parsed.data);
    revalidatePath("/", "layout");
    revalidatePath("/iletisim");
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kayıt başarısız.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
