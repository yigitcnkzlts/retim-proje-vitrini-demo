"use client";

import { useState, FormEvent } from "react";
import { submitContactToWeb3Forms } from "@/lib/contact/web3forms";
import {
  hasContactErrors,
  validateContactForm,
  type ContactFieldErrors,
} from "@/lib/contact/validate";

interface ContactFormProps {
  compact?: boolean;
}

function fieldClass(hasError: boolean) {
  return hasError ? "input-field border-red-400 focus:border-red-500 focus:ring-red-500" : "input-field";
}

export default function ContactForm({ compact = false }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      building: String(formData.get("building") ?? "").trim(),
      service: String(formData.get("service") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    const validationErrors = validateContactForm(payload, { compact });
    if (hasContactErrors(validationErrors)) {
      setFieldErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      await submitContactToWeb3Forms(payload);
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Bağlantı hatası. Lütfen tekrar deneyin veya WhatsApp üzerinden yazın."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-sm border border-green-200 bg-green-50 p-6">
        <h3 className="font-semibold text-green-800">Talebiniz Alındı</h3>
        <p className="mt-2 text-sm text-green-700">
          Keşif talebiniz retim@retim.com.tr adresine iletildi. En kısa sürede size dönüş yapılacaktır.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <input
        id="botcheck"
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-retim-navy">
            Ad Soyad <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={3}
            disabled={loading}
            autoComplete="name"
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            className={fieldClass(Boolean(fieldErrors.name))}
          />
          {fieldErrors.name && (
            <p id="name-error" className="mt-1 text-xs text-red-600">
              {fieldErrors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-retim-navy">
            Telefon <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            disabled={loading}
            autoComplete="tel"
            placeholder="0539 333 35 95"
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
            className={fieldClass(Boolean(fieldErrors.phone))}
          />
          {fieldErrors.phone && (
            <p id="phone-error" className="mt-1 text-xs text-red-600">
              {fieldErrors.phone}
            </p>
          )}
        </div>
      </div>
      {!compact && (
        <>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-retim-navy">
              E-posta
            </label>
            <input
              id="email"
              name="email"
              type="email"
              disabled={loading}
              autoComplete="email"
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              className={fieldClass(Boolean(fieldErrors.email))}
            />
            {fieldErrors.email && (
              <p id="email-error" className="mt-1 text-xs text-red-600">
                {fieldErrors.email}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="building" className="mb-1 block text-sm font-medium text-retim-navy">
              Bina / Proje Adı
            </label>
            <input
              id="building"
              name="building"
              type="text"
              disabled={loading}
              autoComplete="organization"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="service" className="mb-1 block text-sm font-medium text-retim-navy">
              Hizmet Türü <span className="text-red-500">*</span>
            </label>
            <select
              id="service"
              name="service"
              required
              disabled={loading}
              autoComplete="off"
              aria-invalid={Boolean(fieldErrors.service)}
              aria-describedby={fieldErrors.service ? "service-error" : undefined}
              className={fieldClass(Boolean(fieldErrors.service))}
            >
              <option value="">Seçiniz</option>
              <option value="mantolama">Mantolama işlemleri</option>
              <option value="boya">Onarım ve boya işlemleri</option>
              <option value="cati">Çatı Yalıtım İşlemleri</option>
              <option value="drenaj">Drenaj işlemleri</option>
              <option value="restorasyon">Tarihi Bina Restorasyonu</option>
              <option value="guclendirme">Yapı Güçlendirme İşlemleri</option>
              <option value="diger">Diğer Uygulamalar</option>
            </select>
            {fieldErrors.service && (
              <p id="service-error" className="mt-1 text-xs text-red-600">
                {fieldErrors.service}
              </p>
            )}
          </div>
        </>
      )}
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-retim-navy">
          Mesajınız
        </label>
        <textarea
          id="message"
          name="message"
          rows={compact ? 3 : 4}
          disabled={loading}
          autoComplete="off"
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
          className={fieldClass(Boolean(fieldErrors.message))}
          placeholder="Projeniz hakkında kısa bilgi verin..."
        />
        {fieldErrors.message && (
          <p id="message-error" className="mt-1 text-xs text-red-600">
            {fieldErrors.message}
          </p>
        )}
      </div>
      {error && (
        <p className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto disabled:opacity-60">
        {loading ? "Gönderiliyor..." : "Formu Gönder"}
      </button>
    </form>
  );
}
