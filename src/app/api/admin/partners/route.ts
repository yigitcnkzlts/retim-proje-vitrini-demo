import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/require-admin";
import {
  createPartner,
  getAllPartnersAdminSafe,
  getSitePartnerCount,
  syncSitePartnersToAdmin,
} from "@/lib/cms/partners";
import { isCmsConfigured } from "@/lib/cms/supabase";
import { partners as staticPartners } from "@/data/partners";
import type { DbPartner } from "@/lib/cms/types";

function sitePartnersFallback(): DbPartner[] {
  const now = new Date().toISOString();
  return staticPartners.map((p, i) => ({
    id: `static-partner-${i}`,
    name: p.name,
    logo_url: p.logo,
    sort_order: i,
    active: true,
    created_at: now,
    updated_at: now,
  }));
}

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const partners = await getAllPartnersAdminSafe();
    return NextResponse.json({
      configured: isCmsConfigured(),
      sitePartnerCount: getSitePartnerCount(),
      partners: partners.length > 0 ? partners : sitePartnersFallback(),
    });
  } catch (error) {
    console.error("Partners GET:", error);
    return NextResponse.json({
      configured: isCmsConfigured(),
      sitePartnerCount: getSitePartnerCount(),
      partners: sitePartnersFallback(),
    });
  }
}

/** Sitedeki çözüm ortaklarını panele / DB'ye aktarır. */
export async function PUT() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const result = await syncSitePartnersToAdmin();
    revalidatePath("/cozum-ortaklari");
    const partners = await getAllPartnersAdminSafe();
    return NextResponse.json({
      ...result,
      partners: partners.length > 0 ? partners : sitePartnersFallback(),
      message:
        result.imported > 0
          ? `${result.imported} ortak siteden aktarıldı. Toplam: ${partners.length}.`
          : `Sitedeki ortaklar panelde. Toplam: ${partners.length}.`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Aktarım başarısız.";
    return NextResponse.json(
      {
        error: message,
        partners: sitePartnersFallback(),
      },
      { status: 500 }
    );
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
