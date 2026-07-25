import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { createProject, getAllProjectsAdmin, syncSiteProjectsToAdmin } from "@/lib/cms/projects";
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

/** Sitedeki öne çıkan projeleri (eksik olanları) admin paneline aktarır. */
export async function PUT() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const result = await syncSiteProjectsToAdmin();
    revalidatePath("/projeler");
    revalidatePath("/", "layout");
    const projects = await getAllProjectsAdmin();
    const parts: string[] = [];
    if (result.imported > 0) parts.push(`${result.imported} proje eklendi`);
    if (result.removed > 0) parts.push(`${result.removed} fazla proje kaldırıldı`);
    return NextResponse.json({
      ...result,
      projects,
      message:
        parts.length > 0
          ? `${parts.join(", ")}. Panelde sitedeki ${result.total} proje var.`
          : `Panel sitedeki ${result.total} proje ile aynı.`,
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
    revalidatePath("/hizmetler");
    revalidatePath("/", "layout");
    return NextResponse.json({ project });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Proje eklenemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
