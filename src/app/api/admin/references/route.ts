import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { createReference, getAllRefsAdmin } from "@/lib/cms/references";
import { isCmsConfigured } from "@/lib/cms/supabase";
import type { ProjectRefInput } from "@/lib/cms/types";

export async function GET(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as "catalog" | "archive" | null;

  if (!isCmsConfigured()) {
    return NextResponse.json({ configured: false, references: [] });
  }

  const references = await getAllRefsAdmin(type ?? undefined);
  return NextResponse.json({ configured: true, references });
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
