import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { getSubmissionsAdmin } from "@/lib/cms/submissions";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const submissions = await getSubmissionsAdmin();
  return NextResponse.json({ submissions });
}
