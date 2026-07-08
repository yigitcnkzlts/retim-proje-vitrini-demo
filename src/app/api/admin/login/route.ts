import { NextResponse } from "next/server";
import { setAdminSessionCookie, verifyAdminPassword } from "@/lib/auth/admin-session";

export async function POST(request: Request) {
  try {
    if (!process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD ortam değişkeni tanımlı değil." },
        { status: 503 }
      );
    }

    const { password } = (await request.json()) as { password?: string };
    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json({ error: "Hatalı şifre." }, { status: 401 });
    }

    await setAdminSessionCookie();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Giriş başarısız." }, { status: 500 });
  }
}
