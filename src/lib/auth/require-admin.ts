import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";

export async function requireAdminApi(): Promise<NextResponse | null> {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  return null;
}
