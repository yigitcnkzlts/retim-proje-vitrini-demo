import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { createPartner, getAllPartnersAdmin } from "@/lib/cms/partners";
import { isCmsConfigured } from "@/lib/cms/supabase";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  if (!isCmsConfigured()) {
    return NextResponse.json({ configured: false, partners: [] });
  }

  const partners = await getAllPartnersAdmin();
  return NextResponse.json({ configured: true, partners });
}

export async function POST(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const body = (await request.json()) as {
      name: string;
      logo_url: string;
      sort_order?: number;
      active?: boolean;
    };
    const partner = await createPartner(body);
    revalidatePath("/cozum-ortaklari");
    return NextResponse.json({ partner });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ortak eklenemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
