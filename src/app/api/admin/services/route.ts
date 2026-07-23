import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { createService, getAllServicesAdmin } from "@/lib/cms/services";
import { isCmsConfigured } from "@/lib/cms/supabase";
import { serviceInputSchema } from "@/lib/validation/schemas";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  if (!isCmsConfigured()) {
    return NextResponse.json({ configured: false, services: [] });
  }

  const services = await getAllServicesAdmin();
  return NextResponse.json({ configured: true, services });
}

export async function POST(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const body = await request.json();
    const parsed = serviceInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Geçersiz veri." },
        { status: 400 }
      );
    }
    const service = await createService(parsed.data);
    revalidatePath("/hizmetler");
    revalidatePath("/");
    return NextResponse.json({ service });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Hizmet eklenemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
