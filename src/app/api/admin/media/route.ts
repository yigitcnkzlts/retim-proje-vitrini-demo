import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { getAllMediaAdmin } from "@/lib/cms/media";
import { getMediaUsageMap } from "@/lib/cms/media-usage";
import { isCmsConfigured } from "@/lib/cms/supabase";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  if (!isCmsConfigured()) {
    return NextResponse.json({ configured: false, media: [], usage: {} });
  }

  const [media, usage] = await Promise.all([getAllMediaAdmin(), getMediaUsageMap()]);
  return NextResponse.json({ configured: true, media, usage });
}
