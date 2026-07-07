import { NextResponse } from "next/server";
import { Resend } from "resend";
import { siteConfig } from "@/data/site";

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

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "E-posta servisi henüz yapılandırılmamış. Lütfen doğrudan arayın veya WhatsApp üzerinden yazın." },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const to = process.env.CONTACT_EMAIL || siteConfig.email;
    const from = process.env.CONTACT_FROM || `Retim İletişim <onboarding@resend.dev>`;
    const serviceLabel = service ? serviceLabels[service] || service : "Belirtilmedi";

    const html = `
      <h2>Yeni Keşif Talebi</h2>
      <p><strong>Ad Soyad:</strong> ${escapeHtml(name)}</p>
      <p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>
      <p><strong>E-posta:</strong> ${escapeHtml(email || "Belirtilmedi")}</p>
      <p><strong>Bina / Proje:</strong> ${escapeHtml(building || "Belirtilmedi")}</p>
      <p><strong>Hizmet Türü:</strong> ${escapeHtml(serviceLabel)}</p>
      <p><strong>Mesaj:</strong></p>
      <p>${escapeHtml(message || "—").replace(/\n/g, "<br />")}</p>
    `;

    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email || undefined,
      subject: `Yeni Keşif Talebi — ${name}`,
      html,
    });

    if (error) {
      return NextResponse.json({ error: "E-posta gönderilemedi. Lütfen tekrar deneyin." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Beklenmeyen bir hata oluştu." }, { status: 500 });
  }
}
