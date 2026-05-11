# Girayoloji v8 — Kurulum

## 1. Paketleri kur

```cmd
npm install
```

## 2. .env.local olustur

Proje klasorunde `.env.local` dosyasi:

```
MONGODB_URI="mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/girayoloji?retryWrites=true&w=majority"
NEXTAUTH_SECRET="girayoloji-gizli-anahtar-2026"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=""
ADMIN_EMAIL="giray@girayoloji.com"
```

## 3. Cloudinary ayarla (foto/video icin)

1. cloudinary.com → ucretsiz hesap ac
2. Dashboard'dan **Cloud Name** kopyala → `.env.local`'e yapistir
3. Settings → Upload → "Add upload preset"
4. **Signing Mode**: Unsigned sec
5. Preset adini kaydet → `.env.local`'e ekle

## 4. Calistir

```cmd
npm run dev
```

http://localhost:3000

## 5. MongoDB seed (ilk kez)

Tarayicida F12 → Console → "allow pasting" yaz → Enter → sonra:

```js
fetch('/api/seed', {method:'POST'}).then(r=>r.json()).then(console.log)
```

## Yeni Ozellikler (v8)

- ✅ Kayit formunda kullanici adi alani
- ✅ /ayarlar sayfasi (Profil, Foto, Sifre, Tercihler)
- ✅ Header'da @kullaniciadi gosterimi
- ✅ Profili Duzenle modali (foto + emoji + bilgiler)
- ✅ Cloudinary ile foto/video yukleme (mobil + masaustu)
- ✅ Uzun videolar artik YouTube embed
- ✅ Hikaye + Kisa video + Makale ekleme tek sayfada
- ✅ Sifre degistirme

## Admin

- URL: /admin/login
- Kullanici: **admin**
- Sifre: **1234**
