import { NextResponse } from "next/server";
import { getServiceLabel } from "@/lib/contact/web3forms";
import { saveContactSubmission } from "@/lib/cms/submissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return jsonResponse({ error: "Geçersiz form verisi." }, 400);
    }

    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();
    const building = String(body.building ?? "").trim();
    const service = String(body.service ?? "").trim();
    const message = String(body.message ?? "").trim();
    const logOnly = body.logOnly === true;

    if (!name || !phone) {
      return jsonResponse({ error: "Ad soyad ve telefon zorunludur." }, 400);
    }

    if (!logOnly) {
      return jsonResponse(
        {
          error:
            "Form gönderimi tarayıcı üzerinden yapılandırıldı. NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY kullanın.",
        },
        400
      );
    }

    const serviceLabel = getServiceLabel(service);

    try {
      await saveContactSubmission({
        name,
        email,
        phone,
        building,
        service: serviceLabel,
        message,
      });
    } catch (saveError) {
      console.error("Contact log error:", saveError);
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return jsonResponse({ error: "İstek işlenemedi." }, 500);
  }
}
