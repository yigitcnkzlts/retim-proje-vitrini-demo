import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { getAllMediaAdmin } from "@/lib/cms/media";
import { isCmsConfigured } from "@/lib/cms/supabase";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  if (!isCmsConfigured()) {
    return NextResponse.json({ configured: false, media: [] });
  }

  const media = await getAllMediaAdmin();
  return NextResponse.json({ configured: true, media });
}
