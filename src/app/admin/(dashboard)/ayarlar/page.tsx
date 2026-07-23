"use client";

import { FormEvent, useEffect, useState } from "react";
import type { SiteSettingsMap } from "@/lib/cms/site-settings";

const FIELDS: Array<[keyof SiteSettingsMap, string]> = [
  ["phone", "Mobil / WhatsApp görünen"],
  ["officePhone", "Ofis Telefonu"],
  ["whatsapp", "WhatsApp Numarası"],
  ["email", "E-posta"],
  ["address", "Tam Adres"],
  ["addressLine1", "Adres satır 1"],
  ["addressLine2", "Adres satır 2"],
  ["workingHours", "Çalışma Saatleri"],
  ["workingHoursClosed", "Kapalı günler"],
  ["mapsUrl", "Google Maps linki"],
  ["mapsEmbedUrl", "Google Maps embed URL"],
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettingsMap | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d: { settings: SiteSettingsMap }) => setSettings(d.settings));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Kayıt başarısız.");
      } else {
        setMessage("Ayarlar kaydedildi.");
      }
    } catch {
      setError("Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.");
    } finally {
      setSaving(false);
    }
  }

  if (!settings) return <div className="p-8 text-sm text-gray-500">Yükleniyor...</div>;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-retim-navy">Site Ayarları</h1>
      <p className="mt-1 text-sm text-gray-600">
        İletişim bilgileri — üst bar, footer, WhatsApp ve iletişim sayfasında kullanılır.
      </p>

      <form onSubmit={handleSubmit} className="admin-card mt-6 max-w-2xl space-y-4">
        {FIELDS.map(([key, label]) => (
          <label key={key}>
            <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
            <input
              className="input-field"
              value={settings[key]}
              onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
            />
          </label>
        ))}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
}
