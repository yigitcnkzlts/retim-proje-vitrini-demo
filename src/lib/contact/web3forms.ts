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

async function parseJsonSafe(response: Response): Promise<Record<string, unknown>> {
  const text = await response.text();
  const trimmed = text.trim();

  if (!trimmed) {
    throw new Error("Form servisi boş yanıt döndürdü.");
  }

  if (trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html")) {
    throw new Error(
      "Form servisi geçici olarak yanıt veremedi. Lütfen birkaç dakika sonra tekrar deneyin veya WhatsApp ile yazın."
    );
  }

  try {
    return JSON.parse(trimmed) as Record<string, unknown>;
  } catch {
    throw new Error("Form servisi beklenmeyen yanıt döndürdü. Lütfen tekrar deneyin.");
  }
}

/** Sunucudan access key alır — Vercel env değişince rebuild gerekmez */
export async function fetchWeb3FormsAccessKey(): Promise<string> {
  const response = await fetch("/api/contact/config", {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const data = await parseJsonSafe(response);

  if (!response.ok) {
    const message =
      (typeof data.error === "string" && data.error) ||
      "Form yapılandırması eksik. WEB3FORMS_ACCESS_KEY Vercel'e ekleyin.";
    throw new Error(message);
  }

  const accessKey = typeof data.accessKey === "string" ? data.accessKey.trim() : "";
  if (!accessKey) {
    throw new Error(
      "Form anahtarı bulunamadı. Vercel ortam değişkenlerine WEB3FORMS_ACCESS_KEY ekleyip redeploy yapın."
    );
  }

  return accessKey;
}

export async function submitContactToWeb3Forms(payload: ContactFormPayload): Promise<void> {
  const accessKey = await fetchWeb3FormsAccessKey();
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
      email: payload.email || "noreply@retim.com.tr",
      replyto: payload.email || undefined,
      phone: payload.phone,
      building: payload.building || "Belirtilmedi",
      service: serviceLabel,
      botcheck: false,
      message: buildPlainMessage(payload, serviceLabel),
    }),
  });

  const data = await parseJsonSafe(response);
  const success = data.success === true;

  if (!response.ok || !success) {
    const message =
      (typeof data.message === "string" && data.message) ||
      "Form gönderilemedi. Lütfen tekrar deneyin.";
    throw new Error(message);
  }
}
