"use client";

import { FormEvent, useEffect, useState } from "react";
import type { SiteSettingsMap } from "@/lib/cms/site-settings";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettingsMap | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d: { settings: SiteSettingsMap }) => setSettings(d.settings));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!settings) return;
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setMessage(res.ok ? "Ayarlar kaydedildi." : "Kayıt başarısız.");
  }

  if (!settings) return <div className="p-8 text-sm text-gray-500">Yükleniyor...</div>;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-retim-navy">Site Ayarları</h1>
      <p className="mt-1 text-sm text-gray-600">İletişim bilgileri — footer ve iletişim sayfasında kullanılır.</p>

      <form onSubmit={handleSubmit} className="admin-card mt-6 max-w-2xl space-y-4">
        {(
          [
            ["phone", "Mobil / WhatsApp"],
            ["officePhone", "Ofis Telefonu"],
            ["whatsapp", "WhatsApp Numarası"],
            ["email", "E-posta"],
            ["address", "Adres"],
            ["workingHours", "Çalışma Saatleri"],
          ] as const
        ).map(([key, label]) => (
          <label key={key}>
            <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
            <input
              className="input-field"
              value={settings[key]}
              onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
            />
          </label>
        ))}
        {message && <p className="text-sm text-green-700">{message}</p>}
        <button type="submit" className="btn-primary">Kaydet</button>
      </form>
    </div>
  );
}
