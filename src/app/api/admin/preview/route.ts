import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { createPreview } from "@/lib/cms/preview";

export async function POST(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const body = (await request.json()) as {
      type?: string;
      data?: Record<string, unknown>;
    };

    if (body.type !== "project" && body.type !== "service") {
      return NextResponse.json({ error: "Geçersiz önizleme tipi." }, { status: 400 });
    }
    if (!body.data || typeof body.data !== "object") {
      return NextResponse.json({ error: "Önizleme verisi gerekli." }, { status: 400 });
    }

    const { token, expiresAt } = await createPreview(body.type, body.data);
    return NextResponse.json({
      token,
      expiresAt,
      url: `/onizleme/${token}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Önizleme oluşturulamadı.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
