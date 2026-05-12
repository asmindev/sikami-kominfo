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

===

<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to enhance the user's satisfaction building Laravel applications.

## Foundational Context
This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.5.5
- inertiajs/inertia-laravel (INERTIA) - v2
- laravel/fortify (FORTIFY) - v1
- laravel/framework (LARAVEL) - v12
- laravel/prompts (PROMPTS) - v0
- laravel/wayfinder (WAYFINDER) - v0
- tightenco/ziggy (ZIGGY) - v2
- laravel/mcp (MCP) - v0
- laravel/pint (PINT) - v1
- laravel/sail (SAIL) - v1
- pestphp/pest (PEST) - v4
- phpunit/phpunit (PHPUNIT) - v12
- @inertiajs/react (INERTIA) - v2
- react (REACT) - v19
- tailwindcss (TAILWINDCSS) - v4
- @laravel/vite-plugin-wayfinder (WAYFINDER) - v0
- eslint (ESLINT) - v9
- prettier (PRETTIER) - v3

## Conventions
- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts
- Do not create verification scripts or tinker when tests cover that functionality and prove it works. Unit and feature tests are more important.

## Application Structure & Architecture
- Stick to existing directory structure - don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling
- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Replies
- Be concise in your explanations - focus on what's important rather than explaining obvious details.

## Documentation Files
- You must only create documentation files if explicitly requested by the user.


=== boost rules ===

## Laravel Boost
- Laravel Boost is an MCP server that comes with powerful tools designed specifically for this application. Use them.

## Artisan
- Use the `list-artisan-commands` tool when you need to call an Artisan command to double check the available parameters.

## URLs
- Whenever you share a project URL with the user you should use the `get-absolute-url` tool to ensure you're using the correct scheme, domain / IP, and port.

## Tinker / Debugging
- You should use the `tinker` tool when you need to execute PHP to debug code or query Eloquent models directly.
- Use the `database-query` tool when you only need to read from the database.

## Reading Browser Logs With the `browser-logs` Tool
- You can read browser logs, errors, and exceptions using the `browser-logs` tool from Boost.
- Only recent browser logs will be useful - ignore old logs.

## Searching Documentation (Critically Important)
- Boost comes with a powerful `search-docs` tool you should use before any other approaches. This tool automatically passes a list of installed packages and their versions to the remote Boost API, so it returns only version-specific documentation specific for the user's circumstance. You should pass an array of packages to filter on if you know you need docs for particular packages.
- The 'search-docs' tool is perfect for all Laravel related packages, including Laravel, Inertia, Livewire, Filament, Tailwind, Pest, Nova, Nightwatch, etc.
- You must use this tool to search for Laravel-ecosystem documentation before falling back to other approaches.
- Search the documentation before making code changes to ensure we are taking the correct approach.
- Use multiple, broad, simple, topic based queries to start. For example: `['rate limiting', 'routing rate limiting', 'routing']`.
- Do not add package names to queries - package information is already shared. For example, use `test resource table`, not `filament 4 test resource table`.

### Available Search Syntax
- You can and should pass multiple queries at once. The most relevant results will be returned first.

1. Simple Word Searches with auto-stemming - query=authentication - finds 'authenticate' and 'auth'
2. Multiple Words (AND Logic) - query=rate limit - finds knowledge containing both "rate" AND "limit"
3. Quoted Phrases (Exact Position) - query="infinite scroll" - Words must be adjacent and in that order
4. Mixed Queries - query=middleware "rate limit" - "middleware" AND exact phrase "rate limit"
5. Multiple Queries - queries=["authentication", "middleware"] - ANY of these terms


=== php rules ===

## PHP

- Always use curly braces for control structures, even if it has one line.

### Constructors
- Use PHP 8 constructor property promotion in `__construct()`.
    - <code-snippet>public function __construct(public GitHub $github) { }</code-snippet>
- Do not allow empty `__construct()` methods with zero parameters.

### Type Declarations
- Always use explicit return type declarations for methods and functions.
- Use appropriate PHP type hints for method parameters.

<code-snippet name="Explicit Return Types and Method Params" lang="php">
protected function isAccessible(User $user, ?string $path = null): bool
{
    ...
}
</code-snippet>

## Comments
- Prefer PHPDoc blocks over comments. Never use comments within the code itself unless there is something _very_ complex going on.

## PHPDoc Blocks
- Add useful array shape type definitions for arrays when appropriate.

## Enums
- Typically, keys in an Enum should be TitleCase. For example: `FavoritePerson`, `BestLake`, `Monthly`.


=== inertia-laravel/core rules ===

## Inertia Core

- Inertia.js components should be placed in the `resources/js/Pages` directory unless specified differently in the JS bundler (vite.config.js).
- Use `Inertia::render()` for server-side routing instead of traditional Blade views.
- Use `search-docs` for accurate guidance on all things Inertia.

<code-snippet lang="php" name="Inertia::render Example">
// routes/web.php example
Route::get('/users', function () {
    return Inertia::render('Users/Index', [
        'users' => User::all()
    ]);
});
</code-snippet>


=== inertia-laravel/v2 rules ===

## Inertia v2

- Make use of all Inertia features from v1 & v2. Check the documentation before making any changes to ensure we are taking the correct approach.

### Inertia v2 New Features
- Polling
- Prefetching
- Deferred props
- Infinite scrolling using merging props and `WhenVisible`
- Lazy loading data on scroll

### Deferred Props & Empty States
- When using deferred props on the frontend, you should add a nice empty state with pulsing / animated skeleton.

### Inertia Form General Guidance
- The recommended way to build forms when using Inertia is with the `<Form>` component - a useful example is below. Use `search-docs` with a query of `form component` for guidance.
- Forms can also be built using the `useForm` helper for more programmatic control, or to follow existing conventions. Use `search-docs` with a query of `useForm helper` for guidance.
- `resetOnError`, `resetOnSuccess`, and `setDefaultsOnSuccess` are available on the `<Form>` component. Use `search-docs` with a query of 'form component resetting' for guidance.


=== laravel/core rules ===

## Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using the `list-artisan-commands` tool.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Database
- Always use proper Eloquent relationship methods with return type hints. Prefer relationship methods over raw queries or manual joins.
- Use Eloquent models and relationships before suggesting raw database queries
- Avoid `DB::`; prefer `Model::query()`. Generate code that leverages Laravel's ORM capabilities rather than bypassing them.
- Generate code that prevents N+1 query problems by using eager loading.
- Use Laravel's query builder for very complex database operations.

### Model Creation
- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `list-artisan-commands` to check the available options to `php artisan make:model`.

### APIs & Eloquent Resources
- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

### Controllers & Validation
- Always create Form Request classes for validation rather than inline validation in controllers. Include both validation rules and custom error messages.
- Check sibling Form Requests to see if the application uses array or string based validation rules.

### Queues
- Use queued jobs for time-consuming operations with the `ShouldQueue` interface.

### Authentication & Authorization
- Use Laravel's built-in authentication and authorization features (gates, policies, Sanctum, etc.).

### URL Generation
- When generating links to other pages, prefer named routes and the `route()` function.

### Configuration
- Use environment variables only in configuration files - never use the `env()` function directly outside of config files. Always use `config('app.name')`, not `env('APP_NAME')`.

### Testing
- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

### Vite Error
- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.


=== laravel/v12 rules ===

## Laravel 12

- Use the `search-docs` tool to get version specific documentation.
- Since Laravel 11, Laravel has a new streamlined file structure which this project uses.

### Laravel 12 Structure
- No middleware files in `app/Http/Middleware/`.
- `bootstrap/app.php` is the file to register middleware, exceptions, and routing files.
- `bootstrap/providers.php` contains application specific service providers.
- **No app\Console\Kernel.php** - use `bootstrap/app.php` or `routes/console.php` for console configuration.
- **Commands auto-register** - files in `app/Console/Commands/` are automatically available and do not require manual registration.

### Database
- When modifying a column, the migration must include all of the attributes that were previously defined on the column. Otherwise, they will be dropped and lost.
- Laravel 11 allows limiting eagerly loaded records natively, without external packages: `$query->latest()->limit(10);`.

### Models
- Casts can and likely should be set in a `casts()` method on a model rather than the `$casts` property. Follow existing conventions from other models.


=== wayfinder/core rules ===

## Laravel Wayfinder

Wayfinder generates TypeScript functions and types for Laravel controllers and routes which you can import into your client side code. It provides type safety and automatic synchronization between backend routes and frontend code.

### Development Guidelines
- Always use `search-docs` to check wayfinder correct usage before implementing any features.
- Always Prefer named imports for tree-shaking (e.g., `import { show } from '@/actions/...'`)
- Avoid default controller imports (prevents tree-shaking)
- Run `php artisan wayfinder:generate` after route changes if Vite plugin isn't installed

### Feature Overview
- Form Support: Use `.form()` with `--with-form` flag for HTML form attributes — `<form {...store.form()}>` → `action="/posts" method="post"`
- HTTP Methods: Call `.get()`, `.post()`, `.patch()`, `.put()`, `.delete()` for specific methods — `show.head(1)` → `{ url: "/posts/1", method: "head" }`
- Invokable Controllers: Import and invoke directly as functions. For example, `import StorePost from '@/actions/.../StorePostController'; StorePost()`
- Named Routes: Import from `@/routes/` for non-controller routes. For example, `import { show } from '@/routes/post'; show(1)` for route name `post.show`
- Parameter Binding: Detects route keys (e.g., `{post:slug}`) and accepts matching object properties — `show("my-post")` or `show({ slug: "my-post" })`
- Query Merging: Use `mergeQuery` to merge with `window.location.search`, set values to `null` to remove — `show(1, { mergeQuery: { page: 2, sort: null } })`
- Query Parameters: Pass `{ query: {...} }` in options to append params — `show(1, { query: { page: 1 } })` → `"/posts/1?page=1"`
- Route Objects: Functions return `{ url, method }` shaped objects — `show(1)` → `{ url: "/posts/1", method: "get" }`
- URL Extraction: Use `.url()` to get URL string — `show.url(1)` → `"/posts/1"`

### Example Usage

<code-snippet name="Wayfinder Basic Usage" lang="typescript">
    // Import controller methods (tree-shakable)
    import { show, store, update } from '@/actions/App/Http/Controllers/PostController'

    // Get route object with URL and method...
    show(1) // { url: "/posts/1", method: "get" }

    // Get just the URL...
    show.url(1) // "/posts/1"

    // Use specific HTTP methods...
    show.get(1) // { url: "/posts/1", method: "get" }
    show.head(1) // { url: "/posts/1", method: "head" }

    // Import named routes...
    import { show as postShow } from '@/routes/post' // For route name 'post.show'
    postShow(1) // { url: "/posts/1", method: "get" }
</code-snippet>


### Wayfinder + Inertia
If your application uses the `<Form>` component from Inertia, you can use Wayfinder to generate form action and method automatically.
<code-snippet name="Wayfinder Form Component (React)" lang="typescript">

<Form {...store.form()}><input name="title" /></Form>

</code-snippet>


=== pint/core rules ===

## Laravel Pint Code Formatter

- You must run `vendor/bin/pint --dirty` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test`, simply run `vendor/bin/pint` to fix any formatting issues.


=== pest/core rules ===

## Pest
### Testing
- If you need to verify a feature is working, write or update a Unit / Feature test.

### Pest Tests
- All tests must be written using Pest. Use `php artisan make:test --pest {name}`.
- You must not remove any tests or test files from the tests directory without approval. These are not temporary or helper files - these are core to the application.
- Tests should test all of the happy paths, failure paths, and weird paths.
- Tests live in the `tests/Feature` and `tests/Unit` directories.
- Pest tests look and behave like this:
<code-snippet name="Basic Pest Test Example" lang="php">
it('is true', function () {
    expect(true)->toBeTrue();
});
</code-snippet>

### Running Tests
- Run the minimal number of tests using an appropriate filter before finalizing code edits.
- To run all tests: `php artisan test`.
- To run all tests in a file: `php artisan test tests/Feature/ExampleTest.php`.
- To filter on a particular test name: `php artisan test --filter=testName` (recommended after making a change to a related file).
- When the tests relating to your changes are passing, ask the user if they would like to run the entire test suite to ensure everything is still passing.

### Pest Assertions
- When asserting status codes on a response, use the specific method like `assertForbidden` and `assertNotFound` instead of using `assertStatus(403)` or similar, e.g.:
<code-snippet name="Pest Example Asserting postJson Response" lang="php">
it('returns all', function () {
    $response = $this->postJson('/api/docs', []);

    $response->assertSuccessful();
});
</code-snippet>

### Mocking
- Mocking can be very helpful when appropriate.
- When mocking, you can use the `Pest\Laravel\mock` Pest function, but always import it via `use function Pest\Laravel\mock;` before using it. Alternatively, you can use `$this->mock()` if existing tests do.
- You can also create partial mocks using the same import or self method.

### Datasets
- Use datasets in Pest to simplify tests which have a lot of duplicated data. This is often the case when testing validation rules, so consider going with this solution when writing tests for validation rules.

<code-snippet name="Pest Dataset Example" lang="php">
it('has emails', function (string $email) {
    expect($email)->not->toBeEmpty();
})->with([
    'james' => 'james@laravel.com',
    'taylor' => 'taylor@laravel.com',
]);
</code-snippet>


=== pest/v4 rules ===

## Pest 4

- Pest v4 is a huge upgrade to Pest and offers: browser testing, smoke testing, visual regression testing, test sharding, and faster type coverage.
- Browser testing is incredibly powerful and useful for this project.
- Browser tests should live in `tests/Browser/`.
- Use the `search-docs` tool for detailed guidance on utilizing these features.

### Browser Testing
- You can use Laravel features like `Event::fake()`, `assertAuthenticated()`, and model factories within Pest v4 browser tests, as well as `RefreshDatabase` (when needed) to ensure a clean state for each test.
- Interact with the page (click, type, scroll, select, submit, drag-and-drop, touch gestures, etc.) when appropriate to complete the test.
- If requested, test on multiple browsers (Chrome, Firefox, Safari).
- If requested, test on different devices and viewports (like iPhone 14 Pro, tablets, or custom breakpoints).
- Switch color schemes (light/dark mode) when appropriate.
- Take screenshots or pause tests for debugging when appropriate.

### Example Tests

<code-snippet name="Pest Browser Test Example" lang="php">
it('may reset the password', function () {
    Notification::fake();

    $this->actingAs(User::factory()->create());

    $page = visit('/sign-in'); // Visit on a real browser...

    $page->assertSee('Sign In')
        ->assertNoJavascriptErrors() // or ->assertNoConsoleLogs()
        ->click('Forgot Password?')
        ->fill('email', 'nuno@laravel.com')
        ->click('Send Reset Link')
        ->assertSee('We have emailed your password reset link!')

    Notification::assertSent(ResetPassword::class);
});
</code-snippet>

<code-snippet name="Pest Smoke Testing Example" lang="php">
$pages = visit(['/', '/about', '/contact']);

$pages->assertNoJavascriptErrors()->assertNoConsoleLogs();
</code-snippet>


=== inertia-react/core rules ===

## Inertia + React

- Use `router.visit()` or `<Link>` for navigation instead of traditional links.

<code-snippet name="Inertia Client Navigation" lang="react">

import { Link } from '@inertiajs/react'
<Link href="/">Home</Link>

</code-snippet>


=== inertia-react/v2/forms rules ===

## Inertia + React Forms

<code-snippet name="`<Form>` Component Example" lang="react">

import { Form } from '@inertiajs/react'

export default () => (
    <Form action="/users" method="post">
        {({
            errors,
            hasErrors,
            processing,
            wasSuccessful,
            recentlySuccessful,
            clearErrors,
            resetAndClearErrors,
            defaults
        }) => (
        <>
        <input type="text" name="name" />

        {errors.name && <div>{errors.name}</div>}

        <button type="submit" disabled={processing}>
            {processing ? 'Creating...' : 'Create User'}
        </button>

        {wasSuccessful && <div>User created successfully!</div>}
        </>
    )}
    </Form>
)

</code-snippet>


=== tailwindcss/core rules ===

## Tailwind Core

- Use Tailwind CSS classes to style HTML, check and use existing tailwind conventions within the project before writing your own.
- Offer to extract repeated patterns into components that match the project's conventions (i.e. Blade, JSX, Vue, etc..)
- Think through class placement, order, priority, and defaults - remove redundant classes, add classes to parent or child carefully to limit repetition, group elements logically
- You can use the `search-docs` tool to get exact examples from the official documentation when needed.

### Spacing
- When listing items, use gap utilities for spacing, don't use margins.

    <code-snippet name="Valid Flex Gap Spacing Example" lang="html">
        <div class="flex gap-8">
            <div>Superior</div>
            <div>Michigan</div>
            <div>Erie</div>
        </div>
    </code-snippet>


### Dark Mode
- If existing pages and components support dark mode, new pages and components must support dark mode in a similar way, typically using `dark:`.


=== tailwindcss/v4 rules ===

## Tailwind 4

- Always use Tailwind CSS v4 - do not use the deprecated utilities.
- `corePlugins` is not supported in Tailwind v4.
- In Tailwind v4, configuration is CSS-first using the `@theme` directive — no separate `tailwind.config.js` file is needed.
<code-snippet name="Extending Theme in CSS" lang="css">
@theme {
  --color-brand: oklch(0.72 0.11 178);
}
</code-snippet>

- In Tailwind v4, you import Tailwind using a regular CSS `@import` statement, not using the `@tailwind` directives used in v3:

<code-snippet name="Tailwind v4 Import Tailwind Diff" lang="diff">
   - @tailwind base;
   - @tailwind components;
   - @tailwind utilities;
   + @import "tailwindcss";
</code-snippet>


### Replaced Utilities
- Tailwind v4 removed deprecated utilities. Do not use the deprecated option - use the replacement.
- Opacity values are still numeric.

| Deprecated |	Replacement |
|------------+--------------|
| bg-opacity-* | bg-black/* |
| text-opacity-* | text-black/* |
| border-opacity-* | border-black/* |
| divide-opacity-* | divide-black/* |
| ring-opacity-* | ring-black/* |
| placeholder-opacity-* | placeholder-black/* |
| flex-shrink-* | shrink-* |
| flex-grow-* | grow-* |
| overflow-ellipsis | text-ellipsis |
| decoration-slice | box-decoration-slice |
| decoration-clone | box-decoration-clone |
</laravel-boost-guidelines>
