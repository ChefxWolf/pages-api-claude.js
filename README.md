# ⚡ ChefXVid — Kurulum Rehberi
### Kod bilgisi gerektirmez · Tamamen ücretsiz · ~10 dakika

---

## 🔑 ADIM 1 — Anthropic API Key Al (2 dakika)

1. **https://console.anthropic.com** adresine git
2. Sağ üstten **Sign Up** ile hesap oluştur (Google ile giriş yapabilirsin)
3. Sol menüden **API Keys** sekmesine tıkla
4. **Create Key** butonuna bas
5. Çıkan uzun kodu kopyala ve bir yere kaydet  
   _(sk-ant-... ile başlar, bunu kimseyle paylaşma!)_

> 💡 Yeni hesaplara $5 ücretsiz kredi verilir. ChefXVid için bu yeterlidir.

---

## 📁 ADIM 2 — GitHub'a Yükle (3 dakika)

1. **https://github.com** adresine git, ücretsiz hesap oluştur
2. Sağ üstten **+** → **New repository** tıkla
3. Repository name: `chefxvid`
4. **Public** seç → **Create repository** bas
5. Sayfada çıkan **uploading an existing file** linkine tıkla
6. Bu klasördeki **tüm dosyaları** sürükle-bırak veya seç
   - `package.json`
   - `next.config.js`
   - `.env.local.example`
   - `pages/` klasörü (içindeki `index.jsx` ve `api/claude.js` ile birlikte)
7. **Commit changes** butonuna bas

---

## 🚀 ADIM 3 — Vercel'e Deploy Et (3 dakika)

1. **https://vercel.com** adresine git
2. **Sign Up** → **Continue with GitHub** ile giriş yap
3. **Add New Project** → **Import Git Repository**
4. Az önce oluşturduğun `chefxvid` reposunu seç
5. **Framework Preset**: `Next.js` seçili gelir ✓
6. **Deploy** butonuna bas ve bekle (~1 dakika)

---

## 🔐 ADIM 4 — API Key'i Ekle (1 dakika)

Deploy tamamlandıktan sonra:

1. Vercel dashboard'unda projeye tıkla
2. Üstten **Settings** sekmesine git
3. Sol menüden **Environment Variables** seç
4. Şunları gir:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-...` (Adım 1'de kopyaladığın key)
5. **Save** bas
6. Üstten **Deployments** → en üstteki deployment → **Redeploy** bas

---

## ✅ ADIM 5 — Test Et

Vercel sana şöyle bir URL verir: `chefxvid-xxxx.vercel.app`

Bu URL'yi tarayıcıda açarak ChefXVid'i kullanabilirsin! 🎉

---

## ❓ Sık Karşılaşılan Sorunlar

| Sorun | Çözüm |
|-------|-------|
| "API key bulunamadı" hatası | Adım 4'ü tekrar yap, Redeploy'u unutma |
| Sayfa açılmıyor | Vercel'de Deployments'a bak, kırmızı hata var mı? |
| Video analizi çalışmıyor | Anthropic hesabına giriş yap, kredi kaldı mı kontrol et |
| Trendler güncellenmiyor | Normal — web arama zaman zaman yavaş olabilir |

---

## 💰 Maliyet

- **Vercel hosting:** Tamamen ücretsiz (Hobby plan)
- **Anthropic API:** Kullandıkça öde
  - 1 video analizi ≈ $0.02–0.05 (birkaç kuruş)
  - Aylık 100 analiz ≈ $2–5

---

*Yardım için: github.com/chefxvid/support*
