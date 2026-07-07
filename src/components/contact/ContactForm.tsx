"use client";

import { useState, FormEvent } from "react";

interface ContactFormProps {
  compact?: boolean;
}

export default function ContactForm({ compact = false }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          email: formData.get("email"),
          building: formData.get("building"),
          service: formData.get("service"),
          message: formData.get("message"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Form gönderilemedi. Lütfen tekrar deneyin.");
        return;
      }

      setSubmitted(true);
      form.reset();
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin veya WhatsApp üzerinden yazın.");
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-retim-navy">
            Ad Soyad
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            disabled={loading}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-retim-navy">
            Telefon
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            disabled={loading}
            className="input-field"
          />
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
              className="input-field"
            />
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
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="service" className="mb-1 block text-sm font-medium text-retim-navy">
              Hizmet Türü
            </label>
            <select id="service" name="service" disabled={loading} className="input-field">
              <option value="">Seçiniz</option>
              <option value="mantolama">Mantolama işlemleri</option>
              <option value="boya">Onarım ve boya işlemleri</option>
              <option value="cati">Çatı Yalıtım İşlemleri</option>
              <option value="drenaj">Drenaj işlemleri</option>
              <option value="restorasyon">Tarihi Bina Restorasyonu</option>
              <option value="guclendirme">Yapı Güçlendirme İşlemleri</option>
              <option value="diger">Diğer Uygulamalar</option>
            </select>
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
          className="input-field"
          placeholder="Projeniz hakkında kısa bilgi verin..."
        />
      </div>
      {error && (
        <p className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto disabled:opacity-60">
        {loading ? "Gönderiliyor..." : "Formu Gönder"}
      </button>
    </form>
  );
}
