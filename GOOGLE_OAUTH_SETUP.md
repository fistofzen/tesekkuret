# Google OAuth Kurulum Talimatları

## 1. Google Cloud Console'a Git
https://console.cloud.google.com/

## 2. Yeni Proje Oluştur veya Mevcut Projeyi Seç
- Sol üst köşeden proje seçin veya yeni proje oluşturun

## 3. OAuth Consent Screen Yapılandır
- Sol menüden **APIs & Services** > **OAuth consent screen**
- **External** seç ve **Create**
- Uygulama bilgilerini doldur:
  - **App name**: TeşekkürVar
  - **User support email**: sizin@email.com
  - **Developer contact**: sizin@email.com
- **Save and Continue**

## 4. OAuth Client ID Oluştur
- Sol menüden **APIs & Services** > **Credentials**
- **Create Credentials** > **OAuth client ID**
- **Application type**: Web application
- **Name**: TeşekkürVar Web Client
- **Authorized JavaScript origins**:
  - `http://localhost:3000`
  - `https://yourdomain.com` (production için)
- **Authorized redirect URIs**:
  - `http://localhost:3000/api/auth/callback/google`
  - `https://yourdomain.com/api/auth/callback/google` (production için)
- **Create**

## 5. Credentials'ı Kopyala
- Client ID ve Client Secret'i kopyala

## 6. .env Dosyasını Güncelle
```bash
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

## 7. Dev Server'ı Yeniden Başlat
```bash
npm run dev
```

## Test Et
- Tarayıcıda http://localhost:3000 aç
- "Giriş Yap / Üye Ol" butonuna tıkla
- "Google ile Giriş Yap" butonuna tıkla
- Google hesabınızla giriş yap

## Önemli Notlar
- OAuth consent screen'i **External** olarak ayarladıysanız ve yayınlamadıysanız, sadece test kullanıcıları giriş yapabilir
- Test kullanıcısı eklemek için: **OAuth consent screen** > **Test users** > **Add users**
- Production'a geçmeden önce uygulamanızı Google'a gönderip onay almalısınız
