import { NextResponse } from "next/server";
import { getServiceLabel } from "@/lib/contact/web3forms";
import { saveContactSubmission } from "@/lib/cms/submissions";
import { contactPayloadSchema } from "@/lib/validation/schemas";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const contactLogSchema = contactPayloadSchema.extend({
  logOnly: z.literal(true),
  service: z.string().trim().optional().default(""),
});

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Geçersiz form verisi." }, 400);
    }

    const parsed = contactLogSchema.safeParse(body);
    if (!parsed.success) {
      return jsonResponse(
        { error: parsed.error.issues[0]?.message || "Geçersiz form verisi." },
        400
      );
    }

    const { name, phone, email, building, service, message } = parsed.data;
    const serviceLabel = getServiceLabel(service);

    try {
      await saveContactSubmission({
        name,
        email: email || "",
        phone,
        building: building || "",
        service: serviceLabel,
        message: message || "",
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
