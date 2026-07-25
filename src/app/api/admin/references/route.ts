import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { createReference, getAllRefsAdmin, syncSiteRefsToAdmin } from "@/lib/cms/references";
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
    const [catalog, archive] = await Promise.all([
      getAllRefsAdmin("catalog"),
      getAllRefsAdmin("archive"),
    ]);
    const imported = result.importedCatalog + result.importedArchive;
    return NextResponse.json({
      ...result,
      catalog,
      archive,
      message: result.done
        ? imported > 0
          ? `Aktarım bitti. Arşiv: ${archive.length}, Katalog: ${catalog.length}.`
          : `Panel sitedeki referanslarla aynı. Arşiv: ${archive.length}.`
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
