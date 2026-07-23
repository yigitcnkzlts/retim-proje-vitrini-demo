import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { createProject, getAllProjectsAdmin } from "@/lib/cms/projects";
import { isCmsConfigured } from "@/lib/cms/supabase";
import { projectInputSchema } from "@/lib/validation/schemas";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  if (!isCmsConfigured()) {
    return NextResponse.json({
      configured: false,
      projects: [],
      message: "Supabase yapılandırılmamış. .env dosyasını kontrol edin.",
    });
  }

  const projects = await getAllProjectsAdmin();
  return NextResponse.json({ configured: true, projects });
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
    revalidatePath("/projeler");
    revalidatePath("/", "layout");
    return NextResponse.json({ project });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Proje eklenemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
