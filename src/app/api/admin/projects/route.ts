import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { getAllProjectsAdmin } from "@/lib/cms/projects";
import { isCmsConfigured } from "@/lib/cms/supabase";

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
