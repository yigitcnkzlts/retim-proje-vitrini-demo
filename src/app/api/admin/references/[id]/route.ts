import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { deleteReference, updateReference } from "@/lib/cms/references";
import type { ProjectRefInput } from "@/lib/cms/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const { id } = await context.params;
    const body = (await request.json()) as Partial<ProjectRefInput>;
    const reference = await updateReference(id, body);
    revalidatePath("/referanslar");
    revalidatePath("/projeler");
    revalidatePath("/", "layout");
    return NextResponse.json({ reference });
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
    await deleteReference(id);
    revalidatePath("/referanslar");
    revalidatePath("/projeler");
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Silme başarısız.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
