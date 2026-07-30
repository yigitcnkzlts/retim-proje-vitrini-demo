import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/require-admin";
import {
  deleteProject,
  getProjectBySlugAdmin,
  updateProject,
} from "@/lib/cms/projects";
import type { ProjectInput } from "@/lib/cms/types";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { slug } = await context.params;
  const project = await getProjectBySlugAdmin(slug);
  if (!project) {
    return NextResponse.json({ error: "Proje bulunamadı." }, { status: 404 });
  }
  return NextResponse.json({ project });
}

export async function PUT(request: Request, context: RouteContext) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const { slug } = await context.params;
    const body = (await request.json()) as Partial<ProjectInput>;
    const project = await updateProject(slug, body);
    revalidatePath("/projeler");
    revalidatePath(`/projeler/${slug}`);
    revalidatePath("/");
    revalidatePath("/", "layout");
    return NextResponse.json({ project });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Güncelleme başarısız.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const { slug } = await context.params;
    await deleteProject(slug);
    revalidatePath("/projeler");
    revalidatePath(`/projeler/${slug}`);
    revalidatePath("/hizmetler");
    revalidatePath("/");
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Silme başarısız.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
