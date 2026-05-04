# SIKAMI-AHP — GitHub Copilot Instructions

## 🎯 Project Overview

**App Name:** SIKAMI-AHP
**Thesis Title:** Tingkat Kesadaran Keamanan Informasi Menggunakan Metode Analytic Hierarchy Process (AHP) dan Indeks KAMI 5.0 pada Pegawai Dinas Komunikasi dan Informatika Kota Kendari
**Developer:** Muhammad Yusran Adhiputra Raeba (E1E121080)
**University:** Universitas Halu Oleo, Kendari

---

## 🛠️ Tech Stack

| Layer             | Technology                                          |
| ----------------- | --------------------------------------------------- |
| Backend Framework | Laravel 12                                          |
| Frontend Bridge   | Inertia.js v2                                       |
| Frontend UI       | React 19 + TypeScript (strict)                      |
| Styling           | Tailwind CSS v4                                     |
| UI Components     | shadcn/ui (latest)                                  |
| Authentication    | Laravel Fortify (minimal setup, login only)         |
| Authorization     | spatie/laravel-permission                           |
| Database          | MySQL 8                                             |
| ORM               | Eloquent Laravel                                    |
| State Management  | React useState / useReducer (no Redux, no Zustand)  |
| Navigation        | Inertia router + tightenco/ziggy (type-safe routes) |
| Icons             | Lucide React                                        |
| Charts            | Recharts                                            |
| PDF Export        | barryvdh/laravel-dompdf                             |
| Excel Export      | maatwebsite/excel                                   |
| Dev Environment   | Laragon / Laravel Herd                              |
| Package Manager   | Composer (PHP), NPM (JS)                            |

---

## 📁 Project Structure

```
sikami-ahp/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   │   └── LoginController.php       ← handles login page + logout
│   │   │   ├── DashboardController.php
│   │   │   ├── EmployeeController.php        ← admin kelola data pegawai (read only, referensi)
│   │   │   ├── LeaderController.php          ← admin kelola akun pimpinan
│   │   │   ├── QuestionController.php
│   │   │   ├── QuestionnaireController.php   ← pimpinan isi kuesioner KAMI
│   │   │   ├── AhpController.php
│   │   │   ├── KamiController.php
│   │   │   └── ReportController.php
│   │   └── Requests/
│   │       ├── StoreLeaderRequest.php
│   │       ├── UpdateLeaderRequest.php
│   │       ├── StorePairwiseRequest.php
│   │       ├── StoreQuestionnaireRequest.php
│   │       └── StoreQuestionRequest.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Leader.php                        ← pimpinan yang mengisi kuesioner
│   │   ├── Question.php
│   │   ├── Questionnaire.php                 ← belongs to Leader
│   │   ├── Answer.php
│   │   ├── AhpCriteria.php
│   │   ├── PairwiseComparison.php
│   │   ├── AhpResult.php
│   │   ├── KamiIndex.php                     ← belongs to Leader
│   │   ├── DomainScore.php
│   │   └── Report.php
│   └── Services/
│       ├── AhpService.php
│       └── KamiService.php
│
├── resources/
│   └── js/
│       ├── pages/
│       │   ├── auth/
│       │   │   └── login/
│       │   │       └── page.tsx
│       │   ├── dashboard/
│       │   │   └── page.tsx
│       │   ├── leader/
│       │   │   ├── index/
│       │   │   │   ├── page.tsx
│       │   │   │   ├── components/
│       │   │   │   │   ├── leader-table.tsx
│       │   │   │   │   └── leader-filter.tsx
│       │   │   │   ├── utils/
│       │   │   │   │   └── leader-helpers.ts
│       │   │   │   └── types.ts
│       │   │   ├── create/
│       │   │   │   ├── page.tsx
│       │   │   │   └── components/
│       │   │   │       └── leader-form.tsx
│       │   │   ├── edit/
│       │   │   │   ├── page.tsx
│       │   │   │   └── components/
│       │   │   │       └── leader-form.tsx
│       │   │   └── show/
│       │   │       └── page.tsx
│       │   ├── questionnaire/
│       │   │   ├── index/
│       │   │   │   ├── page.tsx              ← pimpinan: status pengisian
│       │   │   │   ├── components/
│       │   │   │   │   └── questionnaire-status.tsx
│       │   │   │   └── types.ts
│       │   │   ├── fill/
│       │   │   │   ├── page.tsx              ← pimpinan: isi kuesioner KAMI
│       │   │   │   ├── components/
│       │   │   │   │   ├── domain-section.tsx
│       │   │   │   │   └── question-item.tsx
│       │   │   │   └── types.ts
│       │   │   └── result/
│       │   │       ├── page.tsx              ← pimpinan: lihat hasil sendiri
│       │   │       └── components/
│       │   │           └── result-card.tsx
│       │   ├── question/
│       │   │   ├── index/
│       │   │   │   ├── page.tsx
│       │   │   │   └── components/
│       │   │   │       └── question-table.tsx
│       │   │   └── create/
│       │   │       └── page.tsx
│       │   ├── ahp/
│       │   │   ├── pairwise/
│       │   │   │   ├── page.tsx
│       │   │   │   ├── components/
│       │   │   │   │   ├── pairwise-matrix.tsx
│       │   │   │   │   └── consistency-alert.tsx
│       │   │   │   ├── utils/
│       │   │   │   │   └── matrix-helpers.ts
│       │   │   │   └── types.ts
│       │   │   └── result/
│       │   │       ├── page.tsx
│       │   │       └── components/
│       │   │           ├── weight-table.tsx
│       │   │           └── consistency-info.tsx
│       │   ├── kami/
│       │   │   ├── calculate/
│       │   │   │   ├── page.tsx
│       │   │   │   └── components/
│       │   │   │       └── calculate-form.tsx
│       │   │   └── result/
│       │   │       ├── page.tsx
│       │   │       ├── components/
│       │   │       │   ├── domain-score-card.tsx
│       │   │       │   └── kami-chart.tsx
│       │   │       └── types.ts
│       │   └── report/
│       │       └── index/
│       │           ├── page.tsx
│       │           └── components/
│       │               └── report-table.tsx
│       ├── components/
│       │   └── ui/                  ← shadcn/ui auto-generated components
│       ├── layouts/
│       │   ├── admin-layout.tsx
│       │   ├── leader-layout.tsx    ← layout untuk pimpinan
│       │   └── authenticated-layout.tsx
│       ├── lib/
│       │   └── utils.ts
│       └── types/
│           ├── index.ts
│           └── inertia.d.ts
│
├── routes/
│   └── web.php
└── database/
    ├── migrations/
    └── seeders/
```

---

## 🗄️ Database Schema

> All column names use `snake_case`. All variable names in PHP and TypeScript use `camelCase`.

### Table: `users`

```sql
id, name, email, password, remember_token, timestamps
```

> Roles managed by spatie/laravel-permission (roles table, model_has_roles, etc.)

### Table: `leaders`

```sql
id, user_id (FK→users), nip VARCHAR(20) UNIQUE, position VARCHAR(100), unit VARCHAR(100), timestamps
```

> Represents pimpinan (leaders) at Diskominfo who fill in the KAMI questionnaire.
> A leader is NOT the same as a regular employee — only leaders have login access and fill questionnaires.

### Table: `questions`

```sql
id,
domain ENUM('governance','risk_management','framework','asset_management','technology'),
indicator VARCHAR(255),
question_text TEXT,
order INT,
timestamps
```

### Table: `questionnaires`

```sql
id, leader_id (FK→leaders), submitted_at TIMESTAMP NULLABLE, timestamps
```

> One questionnaire per leader. A leader can only have one active questionnaire at a time.

### Table: `answers`

```sql
id, questionnaire_id (FK), question_id (FK), score TINYINT (1-5), timestamps
```

### Table: `ahp_criteria`

```sql
id, name VARCHAR(100), code VARCHAR(50) UNIQUE, order TINYINT, timestamps
```

### Table: `pairwise_comparisons`

```sql
id, criteria1_id (FK→ahp_criteria), criteria2_id (FK→ahp_criteria),
comparison_value DECIMAL(10,4), timestamps
```

### Table: `ahp_results`

```sql
id, criteria_id (FK→ahp_criteria), weight DECIMAL(10,6), eigen_value DECIMAL(10,6),
ci DECIMAL(10,6), cr DECIMAL(10,6), lambda_max DECIMAL(10,6),
is_consistent BOOLEAN DEFAULT false, timestamps
```

### Table: `kami_indexes`

```sql
id, leader_id (FK→leaders),
total_score DECIMAL(10,4),
category ENUM('not_eligible','basic_framework','good_enough','good'),
calculated_at DATE,
timestamps
```

> Result of KAMI calculation for a specific leader's questionnaire responses.

### Table: `domain_scores`

```sql
id, kami_index_id (FK→kami_indexes), domain_name VARCHAR(100),
domain_score DECIMAL(10,4), ahp_weight DECIMAL(10,6), final_score DECIMAL(10,4),
timestamps
```

---

## 🔐 Roles & Permissions (spatie/laravel-permission)

### Permission Naming Convention

```
Format   : {resource}.{action}
Resource : kebab-case (single or multi-word with hyphen)
Action   : kebab-case single word

Pattern examples:
  dashboard.view
  employee.view
  employee.create
  employee.edit
  employee.delete
  question.view
  question.create
  question.edit
  question.delete
  ahp-pairwise.view
  ahp-pairwise.create
  ahp-result.view
  kami-index.view
  kami-index.calculate
  report.view
  report.export
  questionnaire.fill
  questionnaire-result.view

Rules:
  ✅ Single-word resource  → no hyphen      → employee.edit
  ✅ Multi-word resource   → use hyphen     → ahp-pairwise.view, kami-index.view
  ✅ Action word           → always single kebab-case word
  ✅ Separator between resource and action  → dot (.)
  ❌ Never use spaces      → 'view dashboard' ← WRONG
  ❌ Never use underscores → 'ahp_pairwise.view' ← WRONG
  ❌ Never use camelCase   → 'ahpPairwise.view' ← WRONG
```

### Roles

```
'admin'   → full access — manages system, leaders, questions, AHP, KAMI, reports
'leader'  → restricted access — fills KAMI questionnaire, views own result only
```

### Permissions per Role

```php
// admin permissions:
'dashboard.view'
'leader.view'
'leader.create'
'leader.edit'
'leader.delete'
'question.view'
'question.create'
'question.edit'
'question.delete'
'ahp-pairwise.view'
'ahp-pairwise.create'
'ahp-result.view'
'kami-index.view'
'kami-index.calculate'
'report.view'
'report.export'

// leader permissions:
'questionnaire.fill'
'questionnaire-result.view'
```

### Usage in Controller

```php
// Protect with role middleware in routes/web.php
Route::middleware(['auth', 'role:admin'])->group(...);
Route::middleware(['auth', 'role:leader'])->group(...);

// Check permission inline in controller
$this->authorize('leader.edit');

// In model/controller
if (auth()->user()->hasRole('admin')) { ... }
if (auth()->user()->hasRole('leader')) { ... }
if (auth()->user()->can('ahp-pairwise.view')) { ... }
if (auth()->user()->can('questionnaire.fill')) { ... }
```

### Seeder Example

```php
// database/seeders/RoleAndPermissionSeeder.php
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

$adminPermissions = [
    'dashboard.view',
    'leader.view', 'leader.create', 'leader.edit', 'leader.delete',
    'question.view', 'question.create', 'question.edit', 'question.delete',
    'ahp-pairwise.view', 'ahp-pairwise.create',
    'ahp-result.view',
    'kami-index.view', 'kami-index.calculate',
    'report.view', 'report.export',
];

$leaderPermissions = [
    'questionnaire.fill',
    'questionnaire-result.view',
];

foreach ([...$adminPermissions, ...$leaderPermissions] as $permission) {
    Permission::firstOrCreate(['name' => $permission]);
}

$adminRole  = Role::firstOrCreate(['name' => 'admin']);
$leaderRole = Role::firstOrCreate(['name' => 'leader']);

$adminRole->syncPermissions($adminPermissions);
$leaderRole->syncPermissions($leaderPermissions);
```

---

## 🔢 Core Business Logic

### AHP Criteria (5 KAMI domains)

```
1. governance         → Tata Kelola Keamanan Informasi
2. risk_management    → Pengelolaan Risiko Keamanan Informasi
3. framework          → Kerangka Kerja Keamanan Informasi
4. asset_management   → Pengelolaan Aset Informasi
5. technology         → Teknologi & Keamanan Informasi
```

### AHP Calculation Steps

```
1. Build pairwise comparison matrix (5×5)
2. Sum each column
3. Normalize: divide each element by its column sum
4. Priority Vector: average of each row
5. λ_max = sum(column_sum × weight) / n
6. CI = (λ_max - n) / (n - 1)
7. CR = CI / IR   →   IR[n=5] = 1.12
8. CR ≤ 0.1 → consistent ✅ | CR > 0.1 → revise matrix ❌
```

### Random Index (IR) Table

```
n=1: 0.00 | n=2: 0.00 | n=3: 0.58 | n=4: 0.90 | n=5: 1.12
n=6: 1.24 | n=7: 1.32 | n=8: 1.41 | n=9: 1.45 | n=10: 1.49
```

### Saaty Scale

```
1 = Sama pentingnya
2 = Nilai antara 1 dan 3
3 = Sedikit lebih penting
4 = Nilai antara 3 dan 5
5 = Lebih penting
6 = Nilai antara 5 dan 7
7 = Sangat lebih penting
8 = Nilai antara 7 dan 9
9 = Mutlak lebih penting
1/x = Kebalikan dari nilai di atas
```

### KAMI Index Categories (from thesis Table 2.1)

```
Sistem Elektronik TINGGI (score 16–34):
  0   – 387  → Tidak Layak
  388 – 646  → Pemenuhan Kerangka Kerja Dasar
  647 – 828  → Cukup Baik
  829 – 916  → Baik

Sistem Elektronik RENDAH (score 10–15):
  0   – 247  → Tidak Layak
  248 – 443  → Pemenuhan Kerangka Kerja Dasar
  444 – 760  → Cukup Baik
  761 – 916  → Baik
```

### Questionnaire Score Scale

```
1 → Tidak Ada
2 → Dalam Perencanaan
3 → Dalam Penerapan
4 → Diterapkan
5 → Dikelola & Diukur
```

---

## 📐 Naming Conventions

### PHP (Laravel)

```
Controllers  : PascalCase + Controller suffix  → EmployeeController.php
Models       : PascalCase singular             → Employee.php, AhpResult.php
Form Requests: PascalCase                      → StoreEmployeeRequest.php
Services     : PascalCase + Service suffix     → AhpService.php
Migrations   : snake_case timestamp prefix     → 2025_01_01_create_employees_table.php
Seeders      : PascalCase + Seeder suffix      → RoleSeeder.php
Variables    : camelCase                       → $employeeId, $ahpWeight
Methods      : camelCase                       → calculateWeight(), getConsistencyRatio()
Constants    : UPPER_SNAKE_CASE               → DOMAIN_GOVERNANCE
```

### TypeScript / React

```
Page files       : kebab-case → page.tsx, employee-form.tsx, domain-score-card.tsx
Component files  : kebab-case → pairwise-matrix.tsx, consistency-alert.tsx
Utility files    : kebab-case → matrix-helpers.ts, employee-helpers.ts
Type files       : kebab-case → types.ts, inertia.d.ts
Variables        : camelCase  → employeeId, ahpWeight, totalScore
Interfaces/Types : PascalCase → Employee, AhpResult, KamiIndex
Enums            : PascalCase → KamiCategory, AhpDomain
Functions        : camelCase  → calculateWeight(), formatScore()
React components : PascalCase (in export) → export default function EmployeeTable()
```

### Routes

```
URL pattern   : kebab-case            → /ahp/pairwise-comparison, /kami/calculate
Route names   : dot notation          → ahp.pairwise, kami.calculate, employee.index
```

### Database

```
Table names   : snake_case plural     → employees, kami_indexes, pairwise_comparisons
Column names  : snake_case            → employee_id, is_consistent, total_score
```

---

## 📐 Coding Conventions

### Laravel Controller Pattern

```php
// Always use Inertia::render() — never return JSON or Blade for pages
// Always use Form Request classes for validation
// Always delegate business logic to Service classes

use Inertia\Inertia;

public function index(): \Inertia\Response
{
    return Inertia::render('employee/index/page', [
        'employees' => EmployeeResource::collection(
            Employee::with('user')->paginate(10)
        ),
    ]);
}

// ✅ Inertia redirect after store/update/delete
public function store(StoreEmployeeRequest $request): \Illuminate\Http\RedirectResponse
{
    Employee::create($request->validated());
    return redirect()->route('employee.index')
        ->with('success', 'Data pegawai berhasil ditambahkan.');
}
```

### TypeScript Page Component Pattern

```tsx
// resources/js/pages/employee/index/page.tsx

import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '@/layouts/admin-layout';
import { EmployeeTable } from './components/employee-table';
import type { Employee, PageProps } from '@/types';

interface Props extends PageProps {
    employees: {
        data: Employee[];
        links: Record<string, string>;
        meta: Record<string, number>;
    };
}

export default function EmployeeIndexPage({ employees }: Props) {
    return (
        <AdminLayout>
            <Head title="Data Pegawai" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Data Pegawai</h1>
                    <Link href={route('employee.create')}>
                        <Button>Tambah Pegawai</Button>
                    </Link>
                </div>
                <EmployeeTable employees={employees.data} />
            </div>
        </AdminLayout>
    );
}
```

### Inertia Form Pattern (TypeScript)

```tsx
import { useForm } from '@inertiajs/react';
import type { Employee } from '../types';

interface EmployeeFormData {
    name: string;
    email: string;
    nip: string;
    position: string;
    password: string;
}

export function EmployeeForm() {
    const { data, setData, post, errors, processing } = useForm<EmployeeFormData>({
        name: '',
        email: '',
        nip: '',
        position: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('employee.store'));
    };

    return <form onSubmit={handleSubmit}>{/* Use shadcn/ui Input, Label, Button components */}</form>;
}
```

### Global Types Pattern

```tsx
// resources/js/types/index.ts

export interface User {
    id: number;
    name: string;
    email: string;
    roles: string[];
}

export interface Employee {
    id: number;
    userId: number;
    nip: string;
    position: string;
    user: User;
    createdAt: string;
    updatedAt: string;
}

export interface AhpResult {
    id: number;
    criteriaId: number;
    weight: number;
    eigenValue: number;
    ci: number;
    cr: number;
    lambdaMax: number;
    isConsistent: boolean;
}

export type KamiCategory = 'not_eligible' | 'basic_framework' | 'good_enough' | 'good';

export type AhpDomain = 'governance' | 'risk_management' | 'framework' | 'asset_management' | 'technology';

// Inertia shared page props
export interface PageProps {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}
```

---

## 🚦 Route Structure

```php
// routes/web.php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeaderController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\QuestionnaireController;
use App\Http\Controllers\AhpController;
use App\Http\Controllers\KamiController;
use App\Http\Controllers\ReportController;

// Guest — Fortify handles POST /login internally
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
});

Route::middleware('auth')->group(function () {
    // Admin only
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Leader management (admin creates/manages leader accounts)
        Route::resource('/leader', LeaderController::class);

        // Question management
        Route::resource('/question', QuestionController::class);

        // AHP
        Route::get('/ahp/pairwise', [AhpController::class, 'pairwise'])->name('ahp.pairwise');
        Route::post('/ahp/pairwise', [AhpController::class, 'storePairwise'])->name('ahp.store-pairwise');
        Route::get('/ahp/result', [AhpController::class, 'result'])->name('ahp.result');

        // KAMI — admin triggers calculation after leader submits questionnaire
        Route::get('/kami/calculate', [KamiController::class, 'calculate'])->name('kami.calculate');
        Route::post('/kami/calculate', [KamiController::class, 'process'])->name('kami.process');
        Route::get('/kami/result', [KamiController::class, 'result'])->name('kami.result');
        Route::get('/kami/result/{kamiIndex}', [KamiController::class, 'show'])->name('kami.show');

        // Reports
        Route::get('/report', [ReportController::class, 'index'])->name('report.index');
        Route::get('/report/export-pdf/{kamiIndex}', [ReportController::class, 'exportPdf'])->name('report.export-pdf');
        Route::get('/report/export-excel', [ReportController::class, 'exportExcel'])->name('report.export-excel');
    });

    // Leader only — pimpinan mengisi kuesioner KAMI
    Route::middleware(['role:leader'])->group(function () {
        Route::get('/questionnaire', [QuestionnaireController::class, 'index'])->name('questionnaire.index');
        Route::get('/questionnaire/fill', [QuestionnaireController::class, 'fill'])->name('questionnaire.fill');
        Route::post('/questionnaire/submit', [QuestionnaireController::class, 'submit'])->name('questionnaire.submit');
        Route::get('/questionnaire/result', [QuestionnaireController::class, 'result'])->name('questionnaire.result');
    });
});
```

---

## 🔑 Fortify Setup (Minimal — Login Only)

> Only enable what is needed. This app only requires **login** and **logout**. All registration, password reset, email verification, and two-factor auth features are **disabled**.

### Installation

```bash
composer require laravel/fortify
php artisan fortify:install
php artisan migrate
```

### config/fortify.php — Minimal Config

```php
<?php

use Laravel\Fortify\Features;

return [
    'guard'     => 'web',
    'passwords' => 'users',
    'username'  => 'email',
    'email'     => 'email',
    'home'      => '/dashboard',   // redirect after login (admin default)

    // ✅ Only keep what we need
    'features' => [
        // Features::registration(),        ❌ disabled — admin creates accounts
        // Features::resetPasswords(),      ❌ disabled — not needed
        // Features::emailVerification(),   ❌ disabled — not needed
        // Features::updateProfileInformation(), ❌ disabled
        // Features::updatePasswords(),     ❌ disabled
        // Features::twoFactorAuthentication(),  ❌ disabled
    ],

    'limiters' => [
        'login' => 'login',     // rate limiting on login attempts
    ],
];
```

### app/Providers/FortifyServiceProvider.php — Minimal Setup

```php
<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Fortify\Fortify;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class FortifyServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Render login page via Inertia
        Fortify::loginView(function () {
            return Inertia::render('auth/login/page');
        });

        // Custom authentication logic — redirect based on role after login
        Fortify::authenticateUsing(function (Request $request) {
            $user = User::where('email', $request->email)->first();

            if ($user && Hash::check($request->password, $user->password)) {
                return $user;
            }
        });

        // Custom redirect after login based on role
        Fortify::redirects('login', function () {
            $user = auth()->user();

            if ($user->hasRole('admin')) {
                return route('dashboard');
            }

            if ($user->hasRole('leader')) {
                return route('questionnaire.index');
            }

            return '/';
        });
    }
}
```

### app/Http/Controllers/Auth/LoginController.php

```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    // Only used to render the login page (GET /login)
    // POST /login is handled automatically by Fortify
    public function create(): Response
    {
        return Inertia::render('auth/login/page');
    }
}
```

### Login Page Component

```tsx
// resources/js/pages/auth/login/page.tsx

import { useForm, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

export default function LoginPage() {
    const { data, setData, post, errors, processing } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // POST to Fortify's /login endpoint via Ziggy named route
        post(route('login'));
    };

    return (
        <>
            <Head title="Masuk" />
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center text-xl">SIKAMI-AHP</CardTitle>
                        <p className="text-center text-sm text-slate-500">Sistem Penilaian Keamanan Informasi</p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@example.com"
                                    autoComplete="email"
                                />
                                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="password">Kata Sandi</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                {processing ? 'Memproses...' : 'Masuk'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
```

### Logout Button (in layout)

```tsx
// Use Inertia router to POST to Fortify's /logout endpoint
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';

<Button variant="ghost" onClick={() => router.post(route('logout'))}>
    Keluar
</Button>;
```

### What Fortify Handles Automatically

```
✅ POST /login        → authenticate user, redirect by role
✅ POST /logout       → invalidate session, redirect to /login
✅ Rate limiting      → blocks brute-force login attempts
✅ Session guard      → standard Laravel session auth

❌ GET /register      → disabled
❌ POST /register     → disabled
❌ GET /forgot-password → disabled
❌ POST /forgot-password → disabled
❌ Two-factor auth    → disabled
❌ Email verification → disabled
```

### What We Handle Manually

```
✅ GET /login         → LoginController::create() → renders Inertia login page
✅ Role-based redirect after login → FortifyServiceProvider
✅ All protected routes → web.php with role:admin / role:employee middleware
```

---

## 🗺️ Ziggy — Type-Safe Routes

> All URL generation in TypeScript **must** use `route()` from `ziggy-js`. Never hardcode URL strings.

### Installation

```bash
composer require tightenco/ziggy
npm install ziggy-js
```

### Laravel Setup

```php
// app/Http/Middleware/HandleInertiaRequests.php
// Share Ziggy route data with every Inertia response

use Tighten\Ziggy\Ziggy;

public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'auth' => [
            'user' => $request->user()?->load('roles'),
        ],
        'ziggy' => fn () => [
            ...(new Ziggy)->toArray(),
            'location' => $request->url(),
        ],
        'flash' => [
            'success' => $request->session()->get('success'),
            'error'   => $request->session()->get('error'),
        ],
    ]);
}
```

```php
// resources/views/app.blade.php
// Include Ziggy routes in the HTML — required for ziggy-js to work

<!DOCTYPE html>
<html>
<head>
    @routes         {{-- ← outputs window.Ziggy with all named routes --}}
    @viteReactRefresh
    @vite(['resources/js/app.tsx'])
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
```

### TypeScript Setup

```ts
// resources/js/app.tsx
// Initialize Ziggy with the server-provided config

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';

// Make route() available globally via the Ziggy data injected by @routes blade directive
declare global {
    function route(name: RouteParamsWithQueryOverload | string): string;
    function route(
        name: string,
        params?: RouteParamsWithQueryOverload | RouteParam,
        absolute?: boolean,
    ): string;
}

createInertiaApp({
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
```

```ts
// resources/js/types/inertia.d.ts
// Extend Inertia PageProps to include Ziggy

import type { Config } from 'ziggy-js';

declare module '@inertiajs/core' {
    interface PageProps {
        ziggy: Config & { location: string };
        auth: {
            user: {
                id: number;
                name: string;
                email: string;
                roles: { name: string }[];
            };
        };
        flash?: {
            success?: string;
            error?: string;
        };
    }
}
```

### Usage in TypeScript Components

```tsx
// ✅ Always import route from ziggy-js explicitly
import { route } from 'ziggy-js';
import { Link, router, useForm } from '@inertiajs/react';

// --- Navigation with Link ---
<Link href={route('employee.index')}>
    Daftar Pegawai
</Link>

// --- Navigation with router (programmatic) ---
router.visit(route('employee.show', { employee: 5 }));
router.visit(route('employee.edit', { employee: id }));

// --- Form submit with useForm ---
const { post, put, delete: destroy } = useForm({ ... });

post(route('employee.store'));
put(route('employee.update', { employee: id }));
destroy(route('employee.destroy', { employee: id }));

// --- Route with query params ---
router.visit(route('kami.result', { page: 2, search: 'yusran' }));

// --- Logout ---
router.post(route('logout'));

// --- Check current route (active nav highlight) ---
import { usePage } from '@inertiajs/react';

const { url } = usePage();
const isActive = url.startsWith('/employee');
```

### All Named Routes Reference

```ts
// These are the named routes available in this project.
// Use these exact strings with route() — Ziggy will validate them.

// Auth
'login'; // GET  /login
'logout'; // POST /logout (Fortify)

// Admin — Dashboard
'dashboard'; // GET  /dashboard

// Admin — Leader management
'leader.index'; // GET  /leader
'leader.create'; // GET  /leader/create
'leader.store'; // POST /leader
'leader.show'; // GET  /leader/{leader}
'leader.edit'; // GET  /leader/{leader}/edit
'leader.update'; // PUT  /leader/{leader}
'leader.destroy'; // DELETE /leader/{leader}

// Admin — Question
'question.index'; // GET  /question
'question.create'; // GET  /question/create
'question.store'; // POST /question
'question.edit'; // GET  /question/{question}/edit
'question.update'; // PUT  /question/{question}
'question.destroy'; // DELETE /question/{question}

// Admin — AHP
'ahp.pairwise'; // GET  /ahp/pairwise
'ahp.store-pairwise'; // POST /ahp/pairwise
'ahp.result'; // GET  /ahp/result

// Admin — KAMI
'kami.calculate'; // GET  /kami/calculate
'kami.process'; // POST /kami/calculate
'kami.result'; // GET  /kami/result
'kami.show'; // GET  /kami/result/{kamiIndex}

// Admin — Report
'report.index'; // GET  /report
'report.export-pdf'; // GET  /report/export-pdf/{kamiIndex}
'report.export-excel'; // GET  /report/export-excel

// Employee — Questionnaire
'questionnaire.index'; // GET  /questionnaire
'questionnaire.fill'; // GET  /questionnaire/fill
'questionnaire.submit'; // POST /questionnaire/submit
'questionnaire.result'; // GET  /questionnaire/result
```

---

## 🧮 AhpService Implementation

```php
<?php
// app/Services/AhpService.php

namespace App\Services;

class AhpService
{
    private array $randomIndex = [
        1 => 0.00, 2 => 0.00, 3 => 0.58, 4 => 0.90,
        5 => 1.12, 6 => 1.24, 7 => 1.32, 8 => 1.41,
        9 => 1.45, 10 => 1.49,
    ];

    public function calculateWeight(array $matrix): array
    {
        $n = count($matrix);

        // Step 1: Column sums
        $columnSums = array_fill(0, $n, 0.0);
        for ($j = 0; $j < $n; $j++) {
            for ($i = 0; $i < $n; $i++) {
                $columnSums[$j] += $matrix[$i][$j];
            }
        }

        // Step 2: Normalize matrix
        $normalized = [];
        for ($i = 0; $i < $n; $i++) {
            for ($j = 0; $j < $n; $j++) {
                $normalized[$i][$j] = $matrix[$i][$j] / $columnSums[$j];
            }
        }

        // Step 3: Priority vector (row averages)
        $weights = [];
        for ($i = 0; $i < $n; $i++) {
            $weights[$i] = array_sum($normalized[$i]) / $n;
        }

        // Step 4: Weighted sum vector
        $weightedSum = array_fill(0, $n, 0.0);
        for ($i = 0; $i < $n; $i++) {
            for ($j = 0; $j < $n; $j++) {
                $weightedSum[$i] += $matrix[$i][$j] * $weights[$j];
            }
        }

        // Step 5: λ_max
        $lambdaValues = [];
        for ($i = 0; $i < $n; $i++) {
            $lambdaValues[] = $weightedSum[$i] / $weights[$i];
        }
        $lambdaMax = array_sum($lambdaValues) / $n;

        // Step 6: Consistency Index
        $ci = ($lambdaMax - $n) / ($n - 1);

        // Step 7: Consistency Ratio
        $ir = $this->randomIndex[$n];
        $cr = $ir > 0 ? $ci / $ir : 0.0;

        return [
            'weights'     => $weights,
            'lambdaMax'   => $lambdaMax,
            'ci'          => $ci,
            'cr'          => $cr,
            'ir'          => $ir,
            'isConsistent' => $cr <= 0.1,
            'n'           => $n,
        ];
    }

    public function buildMatrix(array $comparisons, int $n): array
    {
        $matrix = array_fill(0, $n, array_fill(0, $n, 1.0));
        foreach ($comparisons as $comparison) {
            $i = $comparison['criteria1_index'];
            $j = $comparison['criteria2_index'];
            $value = $comparison['comparison_value'];
            $matrix[$i][$j] = $value;
            $matrix[$j][$i] = 1 / $value;
        }
        return $matrix;
    }
}
```

---

## 🎨 UI/UX Guidelines

### shadcn/ui Usage

```tsx
// Always use shadcn/ui components — never write raw HTML for UI elements
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
```

### KAMI Category Badge Pattern

```tsx
const categoryConfig: Record<KamiCategory, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    not_eligible: { label: 'Tidak Layak', variant: 'destructive' },
    basic_framework: { label: 'Pemenuhan Kerangka Kerja Dasar', variant: 'secondary' },
    good_enough: { label: 'Cukup Baik', variant: 'outline' },
    good: { label: 'Baik', variant: 'default' },
};

<Badge variant={categoryConfig[category].variant}>{categoryConfig[category].label}</Badge>;
```

### Tailwind CSS v4 Notes

```tsx
// Tailwind v4 uses CSS-first configuration (no tailwind.config.js)
// Theme customization goes in app.css using @theme directive
// Use cn() from '@/lib/utils' for conditional classes (shadcn pattern)
import { cn } from '@/lib/utils';

<div className={cn('base-class', isActive && 'active-class')} />;
```

### Color Palette

```
Primary   : blue-800   → pemerintah / formal
Secondary : slate-900  → dark background
Accent    : blue-500   → interactive elements
Success   : green-600  → kategori Baik
Warning   : amber-600  → kategori Cukup Baik
Danger    : red-600    → Tidak Layak / CR > 0.1
Muted     : slate-500
Background: slate-50
```

---

## 🌐 Language Rules

```
✅ Variable names         → English  (employeeId, totalScore, isConsistent)
✅ Function names         → English  (calculateWeight, getCategory, submitForm)
✅ Route names            → English  (employee.index, ahp.pairwise, kami.result)
✅ Database column names  → English  (employee_id, total_score, is_consistent)
✅ TypeScript interfaces  → English  (Employee, AhpResult, KamiIndex)
✅ PHP class/method names → English  (EmployeeController, calculateWeight())
✅ Comments in code       → English

✅ UI labels & text       → Indonesian (Tambah Pegawai, Simpan, Batal)
✅ Error messages (UI)    → Indonesian (Data berhasil disimpan.)
✅ Page titles            → Indonesian (Data Pegawai, Hasil Perhitungan AHP)
✅ Notifications/toasts   → Indonesian (Pegawai berhasil dihapus.)
✅ Validation messages    → Indonesian (Kolom nama wajib diisi.)
✅ Table headers (UI)     → Indonesian (Nama, Jabatan, NIP, Aksi)
```

---

## ✅ UAT Requirements (from thesis Table 3.4)

When implementing any feature, ensure it satisfies:

**Functional:**

- Input questionnaire KAMI 5.0 without errors
- AHP weight calculation is automatic and accurate
- Evaluation results display correctly per calculation
- Data is saved and retrievable
- Report feature is accessible

**Usability:**

- Interface understandable without special training
- Input is easy to complete
- Results are easy to read
- Validation notifications appear on incomplete input
- Navigation between pages is smooth

**Compatibility:**

- Works on Chrome, Firefox, Safari
- Works on Windows and macOS
- Responsive across different screen sizes

---

## 🚫 Strict Rules — Never Do This

```
❌ Never use Axios or fetch() directly — always use Inertia router
❌ Never return JSON from controllers for pages — always Inertia::render()
❌ Never put business logic in controllers — use Service classes
❌ Never hardcode IR values — use the array constant in AhpService
❌ Never save AHP weights without CR ≤ 0.1 validation
❌ Never use <a href> for internal navigation — use Inertia <Link>
❌ Never write raw CSS files — use Tailwind utility classes only
❌ Never use 'role' column on users table — use spatie/laravel-permission
❌ Never use .jsx extension — always .tsx for TypeScript
❌ Never put page-specific components outside the page's own components/ folder
❌ Never name TypeScript files in PascalCase — always kebab-case
❌ Never name PHP files in kebab-case — always PascalCase
❌ Never hardcode URL strings like '/employee' or '/login' in TypeScript — always use route() from ziggy-js
❌ Never use the global window.route() — always import route from 'ziggy-js' explicitly
```

---

## 💡 Copilot Tips

- When generating **migrations**, strictly follow the Database Schema section above
- When generating **AHP logic**, reference the 7-step calculation in Core Business Logic
- When generating **React pages**, always place in `pages/{module}/{action}/page.tsx`
- When generating **components**, place in `pages/{module}/{action}/components/`
- When generating **types**, place in `pages/{module}/{action}/types.ts` for local or `types/index.ts` for shared
- When generating **shadcn components**, always import from `@/components/ui/`
- When generating **roles/permissions**, use spatie helpers (`hasRole()`, `can()`, `assignRole()`)
- When generating **route() calls** in TypeScript, always `import { route } from 'ziggy-js'` — never hardcode URLs
- When generating **named routes**, reference the "All Named Routes Reference" in the Ziggy section
- When generating **UI text, labels, messages** → use Indonesian language
- When generating **variable names, routes, functions** → use English
- Always generate **TypeScript** — never plain JavaScript
- Always add **loading state** using `processing` from `useForm` on submit buttons
