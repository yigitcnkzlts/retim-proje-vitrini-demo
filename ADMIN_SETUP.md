# Retim Admin Panel — Kurulum

## 1. Supabase projesi oluşturun

1. [supabase.com](https://supabase.com) → Yeni proje oluşturun
2. **SQL Editor** → migration dosyalarını sırayla yapıştırıp **Run** ile çalıştırın:
   - `supabase/migrations/0001_init.sql` — ana tablolar, indeksler, RLS, `cms-uploads` bucket
   - `supabase/migrations/0002_faq_items.sql` — Bilgi Merkezi SSS (`faq_items`)
   - `supabase/migrations/0003_site_visits.sql` — **ziyaretçi / sayfa görüntüleme** (`site_visits`)
   - Bucket ayrıca otomatik oluşur; **Storage** sekmesinden `cms-uploads` bucket'ının **Public** olduğunu doğrulayın

   Ziyaretçi tablosu için alternatif:

   ```powershell
   npm run setup:analytics
   ```

   `.env.local` içinde `SUPABASE_DB_URL` (Database → Connection string → URI) varsa migration otomatik uygulanır; yoksa komut hangi SQL dosyasını çalıştırmanız gerektiğini yazar.

## 2. Ortam değişkenleri

`.env.local` dosyasına ekleyin (`.env.example` şablonuna bakın):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Önerilen — bcrypt hash (adım 2b'ye bakın)
ADMIN_PASSWORD_HASH=$2a$12$...
# Alternatif — sadece geliştirmede kullanın
ADMIN_PASSWORD=guclu-bir-sifre
ADMIN_SESSION_SECRET=rastgele-uzun-bir-metin
```

Vercel'de de aynı değişkenleri **Settings → Environment Variables** altına ekleyin.

### 2b. Şifre hash'i üretme (önerilen)

```powershell
cd "D:\Proje Vitrini Demo"
npm run hash-password "Guclu-Sifreniz-123"
```

Çıkan `$2a$...` değerini `ADMIN_PASSWORD_HASH` olarak kaydedin; `ADMIN_PASSWORD`'ü kaldırın veya boş bırakın.

## 3. Verileri aktarın

```powershell
cd "D:\Proje Vitrini Demo"
npm run seed
```

Bu komut mevcut projeleri, referansları, çözüm ortaklarını, hizmetleri, ana sayfa ve hakkımızda içeriğini veritabanına yükler.

## 4. Giriş

- URL: **`/admin`** veya **`/admin/login`**
- Şifre: `ADMIN_PASSWORD_HASH` (veya geliştirmede `ADMIN_PASSWORD`) değeriniz
- Sitede link yok — bookmark olarak kaydedin
- 15 dakikada 8 hatalı denemeden sonra geçici olarak kilitlenir (rate limit)

## Panel bölümleri

| Bölüm | Ne yapılır |
|-------|------------|
| **Ana Sayfa** | Hero başlığı/açıklaması, istatistikler, keşif formu üst metni |
| **Hizmetler** | Hizmet ekle/düzenle/sil, görsel yükleme, aktif/öne çıkan |
| **Hakkımızda** | Kurumsal metinler, kurucu adı/unvanı/görseli |
| **Projeler** | Proje açıklaması, kapsam, öne çıkan maddeler, süre, görsel |
| **Referanslar** | Katalog + arşiv ekleme/silme (katalog → otomatik proje) |
| **Çözüm Ortakları** | Logo ve firma adı |
| **Keşif Talepleri** | Formdan gelen talepler; durum (Yeni/Görüşüldü/Sürüyor/Kapandı), not, arama/filtre, CSV export |
| **Bilgi Merkezi** | SSS soru-cevap ekle/düzenle/çıkar |
| **Site Ayarları** | Telefon, WhatsApp, adres, e-posta, çalışma saatleri, harita |
| **Dashboard** | Bugün/dün/7 gün benzersiz ziyaretçi ve sayfa görüntüleme (Supabase `site_visits`) |

## Notlar

- Supabase bağlı değilken site statik verilerle (`src/data/*`) çalışmaya devam eder
- Admin panelde değişiklik yaptıktan sonra ilgili sayfa anında (`revalidatePath`) güncellenir
- Görsel yükleme için `cms-uploads` bucket'ı public olmalıdır; `next.config.ts` Supabase Storage görsellerine izin verir
- İletişim formu Web3Forms ile e-posta gönderir; başarılı gönderimden sonra talep ayrıca admin panelde **Keşif Talepleri** altında görünür
