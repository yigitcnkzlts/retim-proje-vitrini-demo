import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/require-admin";
import {
  createReference,
  getAllRefsAdmin,
  getSiteArchiveCount,
  syncSiteRefsToAdmin,
} from "@/lib/cms/references";
import { isCmsConfigured } from "@/lib/cms/supabase";
import type { ProjectRefInput } from "@/lib/cms/types";

export async function GET(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as "catalog" | "archive" | null;

  const references = await getAllRefsAdmin(type ?? undefined);
  return NextResponse.json({
    configured: isCmsConfigured(),
    siteArchiveCount: getSiteArchiveCount(),
    references,
  });
}

/** Sitedeki referansları parça parça panele aktarır (tekrar çağrılabilir). */
export async function PUT() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const result = await syncSiteRefsToAdmin(600);
    if (result.done) {
      revalidatePath("/referanslar");
      revalidatePath("/", "layout");
    }
    const imported = result.importedCatalog + result.importedArchive;
    return NextResponse.json({
      ...result,
      siteArchiveCount: getSiteArchiveCount(),
      // Büyük listeyi her turda gönderme — istemci bitince yeniden yükler
      message: result.done
        ? imported > 0
          ? `Aktarım bitti. Sitedeki arşiv: ${result.totalArchive} referans.`
          : `Panel sitedeki ${result.totalArchive} referans ile aynı.`
        : `${imported} kayıt aktarıldı, ${result.remaining} kaldı…`,
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
    const body = (await request.json()) as ProjectRefInput & { create_project?: boolean };
    const ref = await createReference(body, body.create_project !== false);
    revalidatePath("/referanslar");
    revalidatePath("/projeler");
    revalidatePath("/", "layout");
    return NextResponse.json({ reference: ref });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Referans eklenemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
