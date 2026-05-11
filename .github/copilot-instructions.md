# SIKAMI-AHP — GitHub Copilot Instructions

## Project Overview

App untuk mengukur tingkat kesadaran keamanan informasi menggunakan metode AHP dan Indeks KAMI 5.0 pada Dinas Komunikasi dan Informatika Kota Kendari. Developer: Muhammad Yusran Adhiputra Raeba (E1E121080), Universitas Halu Oleo.

---

## Tech Stack

- **Backend:** Laravel 12
- **Frontend Bridge:** Inertia.js v2
- **UI:** React 19 + TypeScript strict
- **Styling:** Tailwind CSS v4 (CSS-first, no config file, gunakan `@theme` directive)
- **Components:** shadcn/ui (latest)
- **Auth:** Laravel Fortify — minimal, hanya login & logout. Semua fitur lain (register, reset password, 2FA, email verification) dinonaktifkan
- **Authorization:** spatie/laravel-permission
- **Database:** MySQL 8 + Eloquent ORM
- **Routing (frontend):** tightenco/ziggy — semua URL wajib pakai `route()` dari `ziggy-js`, tidak boleh hardcode string URL
- **State:** React useState / useReducer — tidak pakai Redux atau Zustand
- **Icons:** Lucide React
- **Charts:** Recharts
- **PDF:** barryvdh/laravel-dompdf
- **Excel:** maatwebsite/excel

---

## Roles & Users

Ada 3 role: `admin`, `leader`, `employee`

- **Admin** — mengelola sistem, data user, pertanyaan, AHP, KAMI, laporan
- **Leader** (pimpinan) — mengisi kuesioner KAMI dan melihat hasil sendiri
- **Employee** (pegawai) — akun referensi internal, belum punya permission aktif saat ini

Semua user disimpan di tabel `users` + spatie permission untuk role. Tidak ada tabel `employees` terpisah. Jabatan/status user diambil dari relasi ke tabel `positions`.

Setelah login: admin → `dashboard`, leader → `questionnaire.index`

---

## Database Schema

| Tabel                  | Kolom penting                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `users`                | id, name, email, password, nip VARCHAR(20) UNIQUE NULLABLE, position_id (FK→positions) NULLABLE — roles via spatie |
| `positions`            | id, name VARCHAR(100), description TEXT NULLABLE — jabatan/status user di instansi                                 |
| `questions`            | id, domain (enum), indicator, question_text, order                                                                 |
| `questionnaires`       | id, user_id (FK→users, role leader), submitted_at                                                                  |
| `answers`              | id, questionnaire_id, question_id, score (1–5)                                                                     |
| `ahp_criteria`         | id, name, code, order                                                                                              |
| `pairwise_comparisons` | id, criteria1_id, criteria2_id, comparison_value                                                                   |
| `ahp_results`          | id, criteria_id, weight, eigen_value, ci, cr, lambda_max, is_consistent                                            |
| `kami_indexes`         | id, user_id (FK→users, role leader), total_score, category (enum), calculated_at                                   |
| `domain_scores`        | id, kami_index_id, domain_name, domain_score, ahp_weight, final_score                                              |

Tabel `positions` — sederhana, hanya untuk mendeskripsikan jabatan atau status user di instansi (contoh: Kepala Dinas, Sekretaris, Kepala Bidang).

Kolom `nip` dan `position_id` di tabel `users` keduanya nullable di level database. Namun validasi di Form Request dibedakan berdasarkan role:

- Role `leader` atau `employee` → `position_id` **required**, `nip` required
- Role `admin` → `position_id` dan `nip` **tidak divalidasi**, boleh null — admin adalah akun sistem, bukan pegawai struktural instansi

Domain enum untuk `questions`: `governance`, `risk_management`, `framework`, `asset_management`, `technology`

Category enum untuk `kami_indexes`: `not_eligible`, `basic_framework`, `good_enough`, `good`

---

## Permissions (spatie/laravel-permission)

**Format wajib:** `{resource}.{action}`

- Resource 1 kata → tanpa hyphen: `employee.edit`
- Resource 2+ kata → pakai hyphen: `ahp-pairwise.view`, `kami-index.calculate`
- Separator resource–action → titik `.`
- Tidak boleh pakai spasi, underscore, atau camelCase

**Admin permissions:**
`dashboard.view`, `user.view/create/edit/delete`, `position.view/create/edit/delete`, `leader.view/create/edit/delete`, `question.view/create/edit/delete`, `ahp-pairwise.view/create`, `ahp-result.view`, `kami-index.view/calculate`, `report.view/export`

**Leader permissions:**
`questionnaire.fill`, `questionnaire-result.view`

**Employee permissions:**
Belum ada permission aktif — role `employee` dibuat di seeder tapi kosong untuk saat ini

**Aturan penggunaan:**

- Satu-satunya middleware di route adalah `auth` — tidak ada `role:` atau `permission:` middleware sama sekali
- Semua access control decision ada di controller via `$this->authorize('{permission}')` di baris pertama setiap method — ini satu-satunya tempat
- Route file bersih dari logic akses, hanya grouping dengan `middleware('auth')`
- Di React gunakan `can()` dari `usePermission()` hook atau `<Can>` component untuk show/hide UI — ini bukan security, hanya UX
- `hasRole()` boleh ada sebagai utility tapi **tidak boleh** dipakai untuk access control decision
- Fortify redirect setelah login menggunakan `can()` bukan `hasRole()` untuk tentukan arah redirect

---

## Permission System (Frontend)

Tiga file yang wajib ada:

- `lib/permissions.ts` — type `Permission`, type `Role`, type `AuthUser`, pure helper functions (`can`, `canAll`, `hasRole`). File ini tidak boleh import React atau Inertia
- `hooks/use-permission.ts` — hook yang wraps `usePage()` dan expose `can()`, `canAll()`, `hasRole()`, `user`, `permissions`, `roles`
- `components/can.tsx` — dua component: `<Can permission="...">` dan `<CanAll permissions={[...]}>` untuk conditional render

Permissions di-share dari backend via `HandleInertiaRequests` sebagai `auth.permissions[]` dan `auth.roles[]`.

---

## AHP Business Logic

**5 kriteria** sesuai domain KAMI:

1. `governance` — Tata Kelola Keamanan Informasi
2. `risk_management` — Pengelolaan Risiko Keamanan Informasi
3. `framework` — Kerangka Kerja Keamanan Informasi
4. `asset_management` — Pengelolaan Aset Informasi
5. `technology` — Teknologi & Keamanan Informasi

**Langkah perhitungan (7 step):**

1. Bangun matriks perbandingan berpasangan 5×5
2. Jumlahkan setiap kolom
3. Normalisasi: bagi setiap elemen dengan jumlah kolomnya
4. Priority Vector: rata-rata setiap baris
5. λ_max: rata-rata dari (weighted sum / weight) per baris
6. CI = (λ_max - n) / (n - 1)
7. CR = CI / IR → IR untuk n=5 adalah 1.12. CR ≤ 0.1 = konsisten ✅

**Skala Saaty dropdown:** hanya tampilkan 1–9 (bilangan bulat). Nilai kebalikan (1/2 s/d 1/9) dihitung otomatis oleh sistem di lower triangle — tidak perlu dipilih pengguna.

**Kategori KAMI (threshold dari Tabel 2.1 skripsi)** berdasarkan kategori sistem elektronik (Rendah/Tinggi/Strategis) dengan skor berbeda-beda. Lihat tabel lengkap di BAB II skripsi.

**Skala jawaban kuesioner:** 1=Tidak Ada, 2=Dalam Perencanaan, 3=Dalam Penerapan, 4=Diterapkan, 5=Dikelola & Diukur

---

## Naming Conventions

**PHP:**

- File: PascalCase → `EmployeeController.php`, `AhpService.php`
- Variables & methods: camelCase → `$ahpWeight`, `calculateWeight()`
- Constants: UPPER_SNAKE_CASE

**TypeScript:**

- File: kebab-case → `pairwise-matrix.tsx`, `use-permission.ts`, `types.ts`
- Variables & functions: camelCase
- Interfaces & Types: PascalCase → `AhpResult`, `KamiIndex`
- React component exports: PascalCase

**Routes:**

- URL: kebab-case → `/ahp/pairwise`, `/kami/calculate`
- Named routes: dot notation → `ahp.pairwise`, `kami.calculate`

**Database:**

- Tables: snake_case plural → `kami_indexes`, `pairwise_comparisons`
- Columns: snake_case → `is_consistent`, `total_score`

---

## Folder Structure (Frontend Pages)

Setiap halaman mengikuti pola: `pages/{module}/{action}/page.tsx`

Komponen spesifik halaman: `pages/{module}/{action}/components/`

Utils spesifik halaman: `pages/{module}/{action}/utils/`

Types spesifik halaman: `pages/{module}/{action}/types.ts`

Types global/shared: `types/index.ts`

shadcn components: `components/ui/`

Permission system: `lib/permissions.ts`, `hooks/use-permission.ts`, `components/can.tsx`

Layouts: `layouts/admin-layout.tsx`, `layouts/leader-layout.tsx`, `layouts/authenticated-layout.tsx`

---

## Controller Pattern

- Selalu `return Inertia::render()` — tidak boleh return JSON untuk halaman
- Selalu gunakan Form Request class untuk validasi
- Selalu delegasi business logic ke Service class (`AhpService`, `KamiService`)
- Setelah store/update/destroy → `return redirect()->route(...)->with('success', '...')`
- Flash message sukses/error dalam bahasa Indonesia

---

## Sidebar Pattern

Gunakan shadcn/ui sidebar dengan `collapsible="icon"` (pattern sidebar-07).

Sub-menu (AHP dan KAMI) menggunakan `Collapsible` dari shadcn dengan `ChevronRight` yang rotate saat expand.

Setiap nav item dibungkus `<Can permission="...">`. Jika semua item dalam satu grup tidak punya permission → sembunyikan seluruh grup beserta heading-nya.

Active state berdasarkan `usePage().url`.

---

## Language Rules

| Yang pakai English               | Yang pakai Indonesia     |
| -------------------------------- | ------------------------ |
| Variable, function, method names | Label & teks UI          |
| Route names                      | Pesan error & notifikasi |
| DB column & table names          | Judul halaman            |
| TypeScript interfaces & types    | Pesan validasi           |
| PHP class & method names         | Header tabel             |
| Code comments                    | Flash messages           |

---

## Strict Rules

- Tidak boleh pakai Axios atau fetch langsung — pakai Inertia router
- Tidak boleh return JSON dari controller untuk halaman — selalu `Inertia::render()`
- Tidak boleh taruh business logic di controller — pakai Service class
- Tidak boleh hardcode URL string di TypeScript — selalu `route()` dari `ziggy-js`
- Tidak boleh pakai `window.route()` — selalu import eksplisit dari `ziggy-js`
- Tidak boleh pakai `.jsx` — selalu `.tsx`
- Tidak boleh nama file TypeScript PascalCase — selalu kebab-case
- Tidak boleh nama file PHP kebab-case — selalu PascalCase
- Tidak boleh pakai kolom `role` di tabel `users` — gunakan spatie permission
- Tidak boleh pakai `role:` atau `permission:` middleware di route — satu-satunya middleware yang boleh adalah `auth`
- Tidak boleh taruh access control logic di route file — selalu di controller via `authorize()`
- Tidak boleh pakai `hasRole()` untuk access control decision — selalu `can()` / `authorize()`
- Tidak boleh simpan bobot AHP jika CR > 0.1
- Tidak boleh pakai `<a href>` untuk navigasi internal — pakai Inertia `<Link>`
- Tidak boleh taruh komponen spesifik halaman di luar folder `components/` milik halaman itu
- Tidak boleh buat tabel `employees` — data pegawai cukup di `users` + role `employee`
- Tidak boleh buat tabel `leaders` — pimpinan cukup di `users` + role `leader`
- Tidak boleh taruh kolom jabatan sebagai string langsung di `users` — selalu relasi FK ke `positions`
- Tidak boleh wajibkan `position_id` untuk role `admin` di level database — nullable di skema, wajib hanya di Form Request untuk role `leader` dan `employee`
- Tidak boleh link questionnaire ke tabel selain `users` — questionnaire belongs to user (role leader)
