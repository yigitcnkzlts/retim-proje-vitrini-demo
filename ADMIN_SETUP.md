# Retim Admin Panel — Kurulum

## 1. Supabase projesi oluşturun

1. [supabase.com](https://supabase.com) → Yeni proje
2. **SQL Editor** → `supabase/schema.sql` dosyasının içeriğini yapıştırıp çalıştırın
3. **Storage** → Yeni bucket: `cms-uploads` (Public: açık)

## 2. Ortam değişkenleri

`.env.local` dosyasına ekleyin (`.env.example` şablonuna bakın):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

ADMIN_PASSWORD=guclu-bir-sifre
ADMIN_SESSION_SECRET=rastgele-uzun-bir-metin
```

Vercel'de de aynı değişkenleri **Settings → Environment Variables** altına ekleyin.

## 3. Verileri aktarın

```powershell
cd "D:\Proje Vitrini Demo"
npm run seed
```

Bu komut mevcut projeleri, referansları ve çözüm ortaklarını veritabanına yükler.

## 4. Giriş

- URL: **`/admin`** veya **`/admin/login`**
- Şifre: `ADMIN_PASSWORD` değeri
- Sitede link yok — bookmark olarak kaydedin

## Panel bölümleri

| Bölüm | Ne yapılır |
|-------|------------|
| **Projeler** | Proje açıklaması, kapsam, öne çıkan maddeler, süre, görsel |
| **Referanslar** | Katalog + arşiv ekleme/silme (katalog → otomatik proje) |
| **Çözüm Ortakları** | Logo ve firma adı |
| **Keşif Talepleri** | Formdan gelen talepler |
| **Site Ayarları** | Telefon, adres, e-posta |

## Notlar

- Supabase bağlı değilken site statik verilerle çalışmaya devam eder
- Admin panelde değişiklik yaptıktan sonra site ~60 sn içinde güncellenir (ISR)
- Görsel yükleme için `cms-uploads` bucket'ı public olmalıdır
