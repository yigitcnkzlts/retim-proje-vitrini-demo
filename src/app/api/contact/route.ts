import { NextResponse } from "next/server";
import { siteConfig } from "@/data/site";
import { saveContactSubmission } from "@/lib/cms/submissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTACT_EMAIL = (process.env.CONTACT_EMAIL || siteConfig.email).trim();

const serviceLabels: Record<string, string> = {
  mantolama: "Mantolama işlemleri",
  boya: "Onarım ve boya işlemleri",
  cati: "Çatı Yalıtım İşlemleri",
  drenaj: "Drenaj işlemleri",
  restorasyon: "Tarihi Bina Restorasyonu",
  guclendirme: "Yapı Güçlendirme İşlemleri",
  diger: "Diğer Uygulamalar",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildPlainMessage(
  name: string,
  phone: string,
  email: string,
  building: string,
  serviceLabel: string,
  message: string
): string {
  return [
    "Yeni Keşif Talebi",
    "",
    `Ad Soyad: ${name}`,
    `Telefon: ${phone}`,
    `E-posta: ${email || "Belirtilmedi"}`,
    `Bina / Proje: ${building || "Belirtilmedi"}`,
    `Hizmet Türü: ${serviceLabel}`,
    "",
    "Mesaj:",
    message || "—",
  ].join("\n");
}

async function parseExternalJson(response: Response): Promise<Record<string, unknown>> {
  const text = await response.text();

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    const snippet = text.replace(/\s+/g, " ").trim().slice(0, 160);
    throw new Error(
      `E-posta servisi beklenmeyen yanıt döndürdü (HTTP ${response.status}). ${snippet}`
    );
  }
}

async function sendViaWeb3Forms(payload: {
  name: string;
  phone: string;
  email: string;
  building: string;
  serviceLabel: string;
  message: string;
}): Promise<boolean | null> {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY?.trim();
  if (!accessKey) return null;

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `Yeni Keşif Talebi — ${payload.name}`,
      from_name: "Retim Web Sitesi",
      name: payload.name,
      email: payload.email || undefined,
      replyto: payload.email || undefined,
      phone: payload.phone,
      building: payload.building || "Belirtilmedi",
      service: payload.serviceLabel,
      botcheck: false,
      message: buildPlainMessage(
        payload.name,
        payload.phone,
        payload.email,
        payload.building,
        payload.serviceLabel,
        payload.message
      ),
    }),
  });

  const data = await parseExternalJson(response);
  const success = data.success === true;

  if (!response.ok || !success) {
    const message =
      (typeof data.message === "string" && data.message) ||
      (typeof data.body === "string" && data.body) ||
      "Web3Forms gönderimi başarısız.";
    throw new Error(message);
  }

  return true;
}

async function sendViaResend(payload: {
  name: string;
  phone: string;
  email: string;
  building: string;
  serviceLabel: string;
  message: string;
}): Promise<boolean | null> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const from = process.env.CONTACT_FROM || "Retim İletişim <onboarding@resend.dev>";

  const html = `
    <h2>Yeni Keşif Talebi</h2>
    <p><strong>Ad Soyad:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Telefon:</strong> ${escapeHtml(payload.phone)}</p>
    <p><strong>E-posta:</strong> ${escapeHtml(payload.email || "Belirtilmedi")}</p>
    <p><strong>Bina / Proje:</strong> ${escapeHtml(payload.building || "Belirtilmedi")}</p>
    <p><strong>Hizmet Türü:</strong> ${escapeHtml(payload.serviceLabel)}</p>
    <p><strong>Mesaj:</strong></p>
    <p>${escapeHtml(payload.message || "—").replace(/\n/g, "<br />")}</p>
  `;

  const { error } = await resend.emails.send({
    from,
    to: [CONTACT_EMAIL],
    replyTo: payload.email || undefined,
    subject: `Yeni Keşif Talebi — ${payload.name}`,
    html,
  });

  if (error) {
    throw new Error(error.message || "Resend gönderimi başarısız.");
  }

  return true;
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

    if (!name || !phone) {
      return jsonResponse({ error: "Ad soyad ve telefon zorunludur." }, 400);
    }

    const hasWeb3Forms = Boolean(process.env.WEB3FORMS_ACCESS_KEY?.trim());
    const hasResend = Boolean(process.env.RESEND_API_KEY?.trim());

    if (!hasWeb3Forms && !hasResend) {
      return jsonResponse(
        {
          error:
            "E-posta servisi yapılandırılmamış. Vercel ortam değişkenlerine WEB3FORMS_ACCESS_KEY ekleyin.",
        },
        503
      );
    }

    const serviceLabel = service ? serviceLabels[service] || service : "Belirtilmedi";
    const payload = { name, phone, email, building, serviceLabel, message };

    let sent = false;

    if (hasWeb3Forms) {
      sent = (await sendViaWeb3Forms(payload)) === true;
    }

    if (!sent && hasResend) {
      sent = (await sendViaResend(payload)) === true;
    }

    if (!sent) {
      return jsonResponse({ error: "E-posta gönderilemedi." }, 500);
    }

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
      console.error("Contact submission saved to email but CMS save failed:", saveError);
    }

    return jsonResponse({ success: true, message: "Keşif talebiniz alındı." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.";
    console.error("Contact form error:", error);
    return jsonResponse({ error: message }, 500);
  }
}
