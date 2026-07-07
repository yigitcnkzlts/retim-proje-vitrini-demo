import { NextResponse } from "next/server";
import { Resend } from "resend";
import { siteConfig } from "@/data/site";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || siteConfig.email;

const serviceLabels: Record<string, string> = {
  mantolama: "Mantolama işlemleri",
  boya: "Onarım ve boya işlemleri",
  cati: "Çatı Yalıtım İşlemleri",
  drenaj: "Drenaj işlemleri",
  restorasyon: "Tarihi Bina Restorasyonu",
  guclendirme: "Yapı Güçlendirme İşlemleri",
  diger: "Diğer Uygulamalar",
};

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

async function sendViaWeb3Forms(payload: {
  name: string;
  phone: string;
  email: string;
  building: string;
  serviceLabel: string;
  message: string;
}) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
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
      from_name: payload.name,
      name: payload.name,
      email: payload.email || CONTACT_EMAIL,
      phone: payload.phone,
      building: payload.building || "Belirtilmedi",
      service: payload.serviceLabel,
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

  const data = (await response.json()) as { success?: boolean; message?: string };
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Web3Forms gönderimi başarısız.");
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
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

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
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();
    const building = String(body.building ?? "").trim();
    const service = String(body.service ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || !phone) {
      return NextResponse.json({ error: "Ad soyad ve telefon zorunludur." }, { status: 400 });
    }

    if (!process.env.WEB3FORMS_ACCESS_KEY && !process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          error:
            "E-posta servisi yapılandırılmamış. Vercel ortam değişkenlerine WEB3FORMS_ACCESS_KEY ekleyin.",
        },
        { status: 503 }
      );
    }

    const serviceLabel = service ? serviceLabels[service] || service : "Belirtilmedi";
    const payload = { name, phone, email, building, serviceLabel, message };

    const sent =
      (await sendViaWeb3Forms(payload)) ?? (await sendViaResend(payload));

    if (!sent) {
      return NextResponse.json({ error: "E-posta gönderilemedi." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
