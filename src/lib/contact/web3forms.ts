const serviceLabels: Record<string, string> = {
  mantolama: "Mantolama işlemleri",
  boya: "Onarım ve boya işlemleri",
  cati: "Çatı Yalıtım İşlemleri",
  drenaj: "Drenaj işlemleri",
  restorasyon: "Tarihi Bina Restorasyonu",
  guclendirme: "Yapı Güçlendirme İşlemleri",
  diger: "Diğer Uygulamalar",
};

export interface ContactFormPayload {
  name: string;
  phone: string;
  email: string;
  building: string;
  service: string;
  message: string;
}

export function getServiceLabel(service: string): string {
  if (!service) return "Belirtilmedi";
  return serviceLabels[service] || service;
}

function buildPlainMessage(payload: ContactFormPayload, serviceLabel: string): string {
  return [
    "Yeni Keşif Talebi",
    "",
    `Ad Soyad: ${payload.name}`,
    `Telefon: ${payload.phone}`,
    `E-posta: ${payload.email || "Belirtilmedi"}`,
    `Bina / Proje: ${payload.building || "Belirtilmedi"}`,
    `Hizmet Türü: ${serviceLabel}`,
    "",
    "Mesaj:",
    payload.message || "—",
  ].join("\n");
}

export async function submitContactToWeb3Forms(payload: ContactFormPayload): Promise<void> {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim();
  if (!accessKey) {
    throw new Error(
      "Form yapılandırması eksik. Vercel ortam değişkenlerine NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ekleyin."
    );
  }

  const serviceLabel = getServiceLabel(payload.service);

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
      service: serviceLabel,
      botcheck: false,
      message: buildPlainMessage(payload, serviceLabel),
    }),
  });

  const text = await response.text();
  let data: { success?: boolean; message?: string } = {};

  try {
    data = JSON.parse(text) as { success?: boolean; message?: string };
  } catch {
    throw new Error("Form servisi beklenmeyen yanıt döndürdü. Lütfen tekrar deneyin.");
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Form gönderilemedi. Lütfen tekrar deneyin.");
  }
}

export async function logContactSubmission(payload: ContactFormPayload): Promise<void> {
  try {
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...payload, logOnly: true }),
    });
  } catch {
    // Mail gittiyse kayıt hatası kullanıcıyı etkilemesin.
  }
}
