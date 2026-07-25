import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { createProject, getAllProjectsAdmin } from "@/lib/cms/projects";
import { isCmsConfigured } from "@/lib/cms/supabase";
import { projectInputSchema } from "@/lib/validation/schemas";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const projects = await getAllProjectsAdmin();
  return NextResponse.json({
    configured: isCmsConfigured(),
    projects,
    message: isCmsConfigured()
      ? undefined
      : "Supabase yapılandırılmamış. Görüntülenen liste sitedeki statik veridir; kayıt için .env.local gerekli.",
  });
}

export async function POST(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const body = await request.json();
    const parsed = projectInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Geçersiz veri." },
        { status: 400 }
      );
    }
    const project = await createProject(parsed.data);
    if (!project) {
      return NextResponse.json(
        { error: "Proje kaydedilemedi. Supabase bağlantısını kontrol edin." },
        { status: 503 }
      );
    }
    revalidatePath("/projeler");
    revalidatePath(`/projeler/${project.slug}`);
    revalidatePath("/", "layout");
    return NextResponse.json({ project });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Proje eklenemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
