# 📌 Kominfo Branding Setup

## ✅ Perubahan yang Telah Dilakukan:

### 1. **Login Page** — Redesign dengan Backdrop Image

- ✅ Background image dari URL Kominfo: `https://web.komdigi.go.id/resource/dXBsb2Fkcy8yMDI1LzcvMjkvNGZjZDA2YWEtMWZhMy00MThkLThjNzktOWQ3MjE0YTMwODM0LmpwZWc=`
- ✅ Semi-transparent overlay backdrop
- ✅ Glass-morphism effect untuk form
- ✅ Logo Kominfo (PNG)
- ✅ Nama institusi "Kominfo Sultra"
- ✅ Deskripsi sistem dengan typography profesional
- ✅ Blue button (#0066FF equivalent)

**File:** `resources/js/pages/auth/login/page.tsx`

---

### 2. **Sidebar Header** — Logo & Branding

- ✅ Menampilkan logo Kominfo (PNG) dalam rounded container
- ✅ Subtitle berubah dari "Indeks KAMI 5.0" → "Kominfo Sultra"
- ✅ Logo ditampilkan saat sidebar expanded dan tetap responsif saat collapsed

**File:** `resources/js/components/app-sidebar.tsx`

---

### 3. **Admin Layout Header** — Logo di Header

- ✅ Logo Kominfo ditampilkan di top header
- ✅ Teks "SIKAMI-AHP" + "Kominfo Sultra" dalam layout yang profesional
- ✅ Responsive design dengan flex layout

**File:** `resources/js/layouts/admin-layout.tsx`

---

### 4. **Dashboard Page** — Hero Section & Branding

- ✅ Hero section dengan gradient background biru
- ✅ Logo Kominfo ditampilkan besar dengan shadow
- ✅ Deskripsi sistem yang informatif
- ✅ Statistics cards untuk quick access
- ✅ Info box tentang metode AHP dan Indeks KAMI 5.0

**File:** `resources/js/pages/dashboard/page.tsx`

---

## 📁 Folder Struktur

Folder untuk logo telah dibuat di:

```
public/storage/kominfo/
```

---

## 🖼️ **PENTING: Setup Logo PNG**

### **Langkah 1: Siapkan File Logo**

1. Pastikan Anda memiliki file PNG logo Kominfo Sultra
2. Rename file menjadi: `logo.png`
3. Ukuran rekomendasi:
    - **Minimal:** 256x256px
    - **Optimal:** 512x512px atau lebih
    - **Format:** PNG dengan transparent background (opsional)

### **Langkah 2: Upload Logo**

**Opsi A — Copy Manual:**

```bash
# Pastikan Anda di folder project
cp /path/to/logo.png public/logo.png
```

**Opsi B — Upload via Admin:**
Jika nanti ada fitur upload, simpan ke folder yang sama.

**Opsi C — Drag & Drop (Jika VS Code):**

1. Buka File Explorer di VS Code
2. Navigate ke `public/storage/kominfo/`
3. Drag logo.png ke folder tersebut

### **Langkah 3: Verify**

Setelah upload, cek apakah file tersedia:

```bash
ls -la public/storage/kominfo/
```

Harus ada: `logo.png`

---

## 🎨 Lokasi Logo di UI

Logo akan muncul di:

| Lokasi           | File                                      | Catatan                                |
| ---------------- | ----------------------------------------- | -------------------------------------- |
| Login Page       | `resources/js/pages/auth/login/page.tsx`  | Size: 80x80px, centered di atas form   |
| Sidebar Header   | `resources/js/components/app-sidebar.tsx` | Size: 32x32px, di sebelah "SIKAMI-AHP" |
| Dashboard Header | `resources/js/layouts/admin-layout.tsx`   | Size: 32x32px, di navigation bar atas  |
| Dashboard Page   | `resources/js/pages/dashboard/page.tsx`   | Size: 80x80px, di hero section         |

---

## 🚀 Testing

Setelah upload logo.png, jalankan:

```bash
npm run dev
# atau
composer run dev
```

Kemudian akses:

- **Login:** `http://localhost:5173/login` (atau port Anda)
- **Dashboard:** `http://localhost:5173/dashboard`

---

## ⚠️ Jika Logo Tidak Muncul

1. **Check path:**

    ```bash
    ls -la public/logo.png
    ```

    Pastikan file ada dengan nama `logo.png` (case-sensitive)

2. **Clear cache:**

    ```bash
    npm run build
    # atau refresh browser dengan Ctrl+Shift+Del (clear cache)
    ```

3. **Check browser console:**
   Buka DevTools (F12) → Console tab → check error message

4. **Alternative:** Jika ada error CORS, Anda bisa gunakan file dari domain eksternal (sudah dilakukan untuk backdrop login)

---

## 📝 Notes

- **Backdrop Image:** Menggunakan URL langsung dari Kominfo, tidak perlu download lokal
- **Logo PNG:** Perlu Anda simpan lokal di `public/logo.png`
- **CSS:** Tidak ada perubahan CSS, semua menggunakan inline styles dan Tailwind classes
- **Responsive:** Design sudah responsive untuk mobile dan desktop

---

Silakan upload logo PNG dan test aplikasinya! 🎯
