import { NextResponse } from "next/server";
import { setAdminSessionCookie } from "@/lib/auth/admin-session";
import { isAdminAuthConfigured, verifyAdminPassword } from "@/lib/auth/verify-password";
import { checkLoginRateLimit, getClientIp, resetLoginRateLimit } from "@/lib/auth/rate-limit";
import { z } from "zod";

const loginSchema = z.object({
  password: z.string().min(1, "Şifre gerekli."),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!isAdminAuthConfigured()) {
      return NextResponse.json(
        {
          error:
            "Admin şifresi yapılandırılmamış. ADMIN_PASSWORD_HASH veya ADMIN_PASSWORD ekleyin.",
        },
        { status: 503 }
      );
    }

    const ip = getClientIp(request);
    const limit = checkLoginRateLimit(`login:${ip}`);
    if (!limit.ok) {
      return NextResponse.json(
        {
          error: `Çok fazla deneme. ${limit.retryAfterSec} saniye sonra tekrar deneyin.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Geçersiz istek." },
        { status: 400 }
      );
    }

    const ok = await verifyAdminPassword(parsed.data.password);
    if (!ok) {
      return NextResponse.json({ error: "Hatalı şifre." }, { status: 401 });
    }

    resetLoginRateLimit(`login:${ip}`);
    await setAdminSessionCookie();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Giriş başarısız." }, { status: 500 });
  }
}
