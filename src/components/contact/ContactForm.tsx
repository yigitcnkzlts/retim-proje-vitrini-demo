"use client";

import { useState, FormEvent } from "react";

interface ContactFormProps {
  compact?: boolean;
}

export default function ContactForm({ compact = false }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-sm border border-green-200 bg-green-50 p-6">
        <h3 className="font-semibold text-green-800">Talebiniz Alındı</h3>
        <p className="mt-2 text-sm text-green-700">
          Talebiniz demo olarak alınmıştır. Gerçek entegrasyonda form e-posta veya CRM
          sistemine iletilecektir.
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
            className="w-full rounded-sm border border-retim-gray-dark px-4 py-2.5 text-sm focus:border-retim-orange focus:outline-none focus:ring-1 focus:ring-retim-orange"
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
            className="w-full rounded-sm border border-retim-gray-dark px-4 py-2.5 text-sm focus:border-retim-orange focus:outline-none focus:ring-1 focus:ring-retim-orange"
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
              className="w-full rounded-sm border border-retim-gray-dark px-4 py-2.5 text-sm focus:border-retim-orange focus:outline-none focus:ring-1 focus:ring-retim-orange"
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
              className="w-full rounded-sm border border-retim-gray-dark px-4 py-2.5 text-sm focus:border-retim-orange focus:outline-none focus:ring-1 focus:ring-retim-orange"
            />
          </div>
          <div>
            <label htmlFor="service" className="mb-1 block text-sm font-medium text-retim-navy">
              Hizmet Türü
            </label>
            <select
              id="service"
              name="service"
              className="w-full rounded-sm border border-retim-gray-dark px-4 py-2.5 text-sm focus:border-retim-orange focus:outline-none focus:ring-1 focus:ring-retim-orange"
            >
              <option value="">Seçiniz</option>
              <option value="mantolama">Mantolama işlemleri</option>
              <option value="boya">Onarım ve boya işlemleri</option>
              <option value="cati">Çatı Yalıtım İşlemleri</option>
              <option value="teras">Teras işlemleri</option>
              <option value="drenaj">Drenaj işlemleri</option>
              <option value="su-deposu">Su Deposu işlemleri</option>
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
          className="w-full rounded-sm border border-retim-gray-dark px-4 py-2.5 text-sm focus:border-retim-orange focus:outline-none focus:ring-1 focus:ring-retim-orange"
          placeholder="Projeniz hakkında kısa bilgi verin..."
        />
      </div>
      <button type="submit" className="btn-primary w-full sm:w-auto">
        Formu Gönder
      </button>
    </form>
  );
}
