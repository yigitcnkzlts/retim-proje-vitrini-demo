import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { deleteService, updateService } from "@/lib/cms/services";
import { serviceInputSchema } from "@/lib/validation/schemas";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = serviceInputSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Geçersiz veri." },
        { status: 400 }
      );
    }
    const service = await updateService(id, parsed.data);
    revalidatePath("/hizmetler");
    revalidatePath("/");
    return NextResponse.json({ service });
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
    await deleteService(id);
    revalidatePath("/hizmetler");
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Silme başarısız.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
