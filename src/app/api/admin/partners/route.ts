import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/require-admin";
import {
  createPartner,
  getAllPartnersAdmin,
  getSitePartnerCount,
  syncSitePartnersToAdmin,
} from "@/lib/cms/partners";
import { isCmsConfigured } from "@/lib/cms/supabase";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const partners = await getAllPartnersAdmin();
  return NextResponse.json({
    configured: isCmsConfigured(),
    sitePartnerCount: getSitePartnerCount(),
    partners,
  });
}

/** Sitedeki çözüm ortaklarını panele aktarır. */
export async function PUT() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const result = await syncSitePartnersToAdmin();
    revalidatePath("/cozum-ortaklari");
    const partners = await getAllPartnersAdmin();
    return NextResponse.json({
      ...result,
      partners,
      message:
        result.imported > 0
          ? `${result.imported} ortak siteden aktarıldı. Toplam: ${partners.length}.`
          : `Sitedeki ortaklar panelde. Toplam: ${partners.length}.`,
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
    const body = (await request.json()) as {
      name: string;
      logo_url: string;
      sort_order?: number;
      active?: boolean;
    };
    if (!body.name?.trim() || !body.logo_url?.trim()) {
      return NextResponse.json({ error: "Firma adı ve logo gerekli." }, { status: 400 });
    }
    const partner = await createPartner(body);
    revalidatePath("/cozum-ortaklari");
    return NextResponse.json({ partner });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ortak eklenemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
