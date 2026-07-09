import type { ContactFormPayload } from "@/lib/contact/web3forms";

export type ContactFieldErrors = Partial<Record<keyof ContactFormPayload, string>>;

const phoneDigits = (value: string) => value.replace(/\D/g, "");

export function validateContactForm(
  payload: ContactFormPayload,
  options: { compact?: boolean } = {}
): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  if (!payload.name.trim()) {
    errors.name = "Ad soyad zorunludur.";
  } else if (payload.name.trim().length < 3) {
    errors.name = "Ad soyad en az 3 karakter olmalıdır.";
  }

  const digits = phoneDigits(payload.phone);
  if (!payload.phone.trim()) {
    errors.phone = "Telefon zorunludur.";
  } else if (digits.length < 10 || digits.length > 13) {
    errors.phone = "Geçerli bir telefon numarası girin (ör. 0539 333 35 95).";
  }

  if (!options.compact && payload.email.trim()) {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim());
    if (!emailOk) {
      errors.email = "Geçerli bir e-posta adresi girin.";
    }
  }

  if (!options.compact && !payload.service.trim()) {
    errors.service = "Lütfen bir hizmet türü seçin.";
  }

  if (payload.message.trim() && payload.message.trim().length < 2) {
    errors.message = "Mesaj çok kısa.";
  }

  return errors;
}

export function hasContactErrors(errors: ContactFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
