# Permission System Guide - SIKAMI-AHP

Panduan lengkap penggunaan permission system yang terintegrasi dengan Laravel spatie/laravel-permission, Inertia.js, React, dan TypeScript.

---

## 📋 Struktur File

```
resources/js/
├── lib/
│   └── permissions.ts          ← Pure utility functions (no React/Inertia)
├── hooks/
│   └── use-permission.ts       ← React hook untuk akses permission
├── components/
│   ├── can.tsx                 ← Conditional rendering (Can, CanAll)
│   └── app-sidebar.tsx         ← Smart sidebar dengan permission checks
├── layouts/
│   └── admin-layout.tsx        ← Single layout untuk semua user
└── types/
    └── index.ts                ← Exports Permission, Role, AuthUser

app/Http/Middleware/
└── HandleInertiaRequests.php   ← Share auth ke Inertia
```

---

## 🔐 Available Permissions

Semua permission di-prefix dengan resource dan action dalam format `{resource}.{action}`.

### Dashboard

- `dashboard.view`

### Leader Management

- `leader.view`
- `leader.create`
- `leader.edit`
- `leader.delete`

### Question Management

- `question.view`
- `question.create`
- `question.edit`
- `question.delete`

### AHP Analysis

- `ahp-pairwise.view`
- `ahp-pairwise.create`
- `ahp-result.view`

### KAMI Index

- `kami-index.view`
- `kami-index.calculate`

### Reports

- `report.view`
- `report.export`

### Questionnaire (for Leaders)

- `questionnaire.fill`
- `questionnaire-result.view`

---

## 🔍 How It Works

### 1. **Backend (Laravel)**

```php
// app/Http/Middleware/HandleInertiaRequests.php
'auth' => [
    'user' => $request->user(),
    'permissions' => $request->user()?->getAllPermissions()->pluck('name') ?? [],
    'roles' => $request->user()?->getRoleNames() ?? [],
],
```

Spatie/laravel-permission automatically provides:

- `getAllPermissions()` - return all permissions of the user
- `getRoleNames()` - return all role names

### 2. **Frontend Type System (TypeScript)**

```typescript
// resources/js/lib/permissions.ts
export type Permission = 'dashboard.view' | 'leader.view' | ... // 18 total

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    roles: Role[];
    permissions: Permission[];
}
```

### 3. **React Hook (usePermission)**

```typescript
// resources/js/hooks/use-permission.ts
export function usePermission() {
    return {
        can(permission: Permission | Permission[]): boolean
        canAll(permissions: Permission[]): boolean
        hasRole(role: Role | Role[]): boolean     // utility only
        user: AuthUser | null
        permissions: Permission[]
        roles: Role[]
    };
}
```

### 4. **Component Wrapper (Can & CanAll)**

```tsx
// resources/js/components/can.tsx
<Can permission="leader.view">
    <DataTable />
</Can>

<CanAll permissions={['report.view', 'report.export']}>
    <ExportButton />
</CanAll>
```

---

## 💻 Usage Patterns

### Pattern 1: Hook untuk Conditional Logic

```tsx
import { usePermission } from '@/hooks/use-permission';

export default function ReportPage() {
    const { can, user } = usePermission();

    return (
        <>
            <h1>Laporan Keamanan</h1>

            {user && <p>Disusun oleh: {user.name}</p>}

            {can('report.export') && <Button>Export PDF</Button>}
        </>
    );
}
```

### Pattern 2: Can Component untuk Visibility (Recommended)

```tsx
import { Can } from '@/components/can';
import AdminLayout from '@/layouts/admin-layout';

export default function LeaderManagementPage() {
    return (
        <AdminLayout>
            <Can permission="leader.view">
                <div className="space-y-4">
                    <h1>Data Pimpinan</h1>
                    <LeaderTable />

                    <Can permission="leader.create">
                        <Button>Tambah Pimpinan Baru</Button>
                    </Can>
                </div>
            </Can>

            <Can permission="leader.view" fallback={<AccessDenied />}>
                <LeaderTable />
            </Can>
        </AdminLayout>
    );
}
```

### Pattern 3: Multiple Permissions Required

```tsx
import { CanAll } from '@/components/can';

export default function ReportExportPage() {
    return (
        <CanAll permissions={['report.view', 'report.export']} fallback={<p>Anda hanya bisa view, tidak bisa export</p>}>
            <ExportForm />
        </CanAll>
    );
}
```

### Pattern 4: Role Info (Utility Only)

```tsx
const { hasRole, user } = usePermission();

// ✅ OK - untuk display atau logging
if (hasRole('admin')) {
    <AdminBadge />;
}

// ❌ JANGAN - untuk access gate, gunakan can() instead
if (hasRole('admin')) {
    // DO NOT grant access based on role
}
```

---

## 🎯 Layout System

### AdminLayout (Single Layout for All Users)

Satu layout yang dipakai semua authenticated users (admin & leader).

Navigasi ditampilkan/disembunyikan berdasarkan permission via AppSidebar:

- Admin melihat: Dashboard, Manajemen Data, Analisis & Evaluasi, Laporan
- Leader melihat: Hanya sections yang sesuai permission-nya

```tsx
import AdminLayout from '@/layouts/admin-layout';

export default function AnyPage() {
    return (
        <AdminLayout>
            <h1>Konten halaman</h1>
        </AdminLayout>
    );
}
```

**Keuntungan:**

- ✅ Single source of truth untuk layout
- ✅ Sidebar smart (auto-hide items tanpa permission)
- ✅ Responsive dan konsisten
- ✅ Mudah di-maintain
- ✅ Permission control di AppSidebar & Can components

---

## 🔒 Permission Checking Rules

### ✅ **DO: Use Permission Checks**

```tsx
// Benar - permission check
if (can('leader.edit')) {
    // show edit button
}

// Benar - Can component
<Can permission="leader.edit">
    <EditButton />
</Can>;

// Benar - multiple permissions
can(['leader.create', 'leader.edit']); // true jika punya salah satu

// Benar - all permissions required
canAll(['report.view', 'report.export']); // true jika punya SEMUA
```

### ❌ **DON'T: Use Role Checks for Access Control**

```tsx
// SALAH - jangan gunakan role untuk access gate
if (hasRole('admin')) {
    return <AdminPanel />;
}

// SALAH - hardcode role string
if (userRole === 'admin') {
    return <AdminPanel />;
}

// SALAH - assumption admin punya semua akses
if (hasRole('admin')) {
    showAllFeatures();
}

// BENAR - gunakan permission
if (can('ahp-pairwise.create')) {
    return <CreatePairwiseForm />;
}
```

### ⚙️ **hasRole() untuk Informasi Saja**

```tsx
const { hasRole, user } = usePermission();

// OK - untuk display atau info
{
    hasRole('admin') && <AdminBadge />;
}

// OK - untuk logging
if (hasRole('leader')) {
    logUserAction('leader_action', user?.id);
}

// ❌ JANGAN untuk access gate
if (hasRole('admin')) {
    /* grant access */
}
```

---

## 🛠️ Sidebar Implementation Details

### AppSidebar (Admin)

- ✅ Setiap nav item wrapped dengan `<Can>` component
- ✅ Grup heading hanya muncul jika ada permission di dalamnya
- ✅ Active state check dengan `url.startsWith()`
- ✅ All internal navigation dengan `<Link>` dari Inertia
- ✅ Icons dari Lucide React

```tsx
// Contoh: Laporan grup hanya muncul jika user punya report.view ATAU report.export
<Can permission={['report.view', 'report.export']}>
    <SidebarGroup>
        <SidebarGroupLabel>Laporan</SidebarGroupLabel>
        <SidebarMenu>
            <Can permission="report.view">
                <SidebarMenuItem>{/* Laporan item */}</SidebarMenuItem>
            </Can>
            <Can permission="report.export">
                <SidebarMenuItem>{/* Cetak Dokumen item */}</SidebarMenuItem>
            </Can>
        </SidebarMenu>
    </SidebarGroup>
</Can>
```

### LeaderSidebar (Leader)

- ✅ Simple structure hanya 2 items: Isi Kuesioner & Hasil Saya
- ✅ Setiap item punya conditional rendering
- ✅ Breadcrumb di header

---

## 📱 Responsive Behavior

Semua layout menggunakan:

- `SidebarProvider` dari shadcn/ui
- `collapsible="icon"` pada sidebar
- Responsive breadcrumb (`hidden md:block`)
- Mobile-friendly header dengan `SidebarTrigger`

---

## 🔧 Setting Permissions & Roles (Backend)

### Database Seeder

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

$adminRole = Role::firstOrCreate(['name' => 'admin']);
$leaderRole = Role::firstOrCreate(['name' => 'leader']);

$adminRole->syncPermissions($adminPermissions);
$leaderRole->syncPermissions($leaderPermissions);
```

### Assign Role to User

```php
// In controller or migration
$user->assignRole('admin');
$user->assignRole('leader');

// Grant individual permission
$user->givePermissionTo('leader.view');

// Check permission in controller
if ($request->user()->can('leader.edit')) {
    // allow action
}
```

---

## 🔐 Backend Authorization (Laravel Controller)

### 1. **Role Middleware** (Coarse-grained Access)

Routes grouped by role in `routes/web.php`:

```php
// Only admin can access these routes
Route::middleware(['role:admin'])->group(function () {
    Route::resource('/leader', LeaderController::class);
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// Only leader can access these routes
Route::middleware(['role:leader'])->group(function () {
    Route::get('/questionnaire/fill', [QuestionnaireController::class, 'fill'])->name('questionnaire.fill');
});
```

### 2. **Permission Authorization** (Fine-grained Access)

In controller methods, use `$this->authorize()` to check specific permissions:

```php
// app/Http/Controllers/LeaderController.php

class LeaderController extends Controller
{
    public function index()
    {
        // Check permission before showing leader list
        $this->authorize('leader.view');

        return Inertia::render('leader/index/page', [
            'leaders' => Leader::paginate(10),
        ]);
    }

    public function store(StoreLeaderRequest $request)
    {
        // Check permission before creating
        $this->authorize('leader.create');

        Leader::create($request->validated());

        return redirect()->route('leader.index')
            ->with('success', 'Pimpinan berhasil ditambahkan.');
    }

    public function edit(Leader $leader)
    {
        // Check permission before editing
        $this->authorize('leader.edit');

        return Inertia::render('leader/edit/page', [
            'leader' => $leader,
        ]);
    }

    public function destroy(Leader $leader)
    {
        // Check permission before deleting
        $this->authorize('leader.delete');

        $leader->delete();

        return redirect()->route('leader.index')
            ->with('success', 'Pimpinan berhasil dihapus.');
    }
}
```

### 3. **Exception Handling** (bootstrap/app.php)

Authorization exceptions automatically redirected based on role:

```php
// bootstrap/app.php
->withExceptions(function (Exceptions $exceptions): void {
    // Handle permission denied from middleware
    $exceptions->render(function (\Spatie\Permission\Exceptions\UnauthorizedException $e) {
        return redirect('/')->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
    });

    // Handle permission denied from $this->authorize()
    $exceptions->render(function (\Illuminate\Auth\Access\AuthorizationException $e, \Illuminate\Http\Request $request) {
        if ($request->user()?->hasRole('admin')) {
            return redirect()->route('dashboard')
                ->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
        }

        if ($request->user()?->hasRole('leader')) {
            return redirect()->route('questionnaire.index')
                ->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
        }

        return redirect('/')->with('error', 'Anda tidak memiliki akses.');
    });
})->create();
```

### 4. **Authorization Flow**

```
Request → Role Middleware → Controller → Permission Check → Action
   ↓
if role doesn't match → UnauthorizedException → redirect home
   ↓
if role matches, execute → $this->authorize('permission') → AuthorizationException
   ↓
if permission denied → redirect (admin→dashboard, leader→questionnaire)
   ↓
if permission granted → execute controller action
```

### 5. **Example: Questionnaire Controller (Leader)**

```php
// app/Http/Controllers/QuestionnaireController.php

class QuestionnaireController extends Controller
{
    public function fill()
    {
        // Check permission
        $this->authorize('questionnaire.fill');

        $questionnaire = Questionnaire::where('leader_id', auth()->user()->leader->id)
            ->firstOrFail();

        return Inertia::render('questionnaire/fill/page', [
            'questionnaire' => $questionnaire->load('answers'),
        ]);
    }

    public function submit(StoreQuestionnaireRequest $request)
    {
        // Check permission
        $this->authorize('questionnaire.fill');

        $questionnaire = Questionnaire::where('leader_id', auth()->user()->leader->id)
            ->firstOrFail();

        // Save answers & mark submitted
        foreach ($request->answers as $questionId => $score) {
            Answer::updateOrCreate(
                ['questionnaire_id' => $questionnaire->id, 'question_id' => $questionId],
                ['score' => $score]
            );
        }

        $questionnaire->update(['submitted_at' => now()]);

        return redirect()->route('questionnaire.result')
            ->with('success', 'Kuesioner berhasil disubmit.');
    }

    public function result()
    {
        // Check permission
        $this->authorize('questionnaire-result.view');

        $questionnaire = Questionnaire::where('leader_id', auth()->user()->leader->id)
            ->with('answers', 'kamiIndex')
            ->firstOrFail();

        return Inertia::render('questionnaire/result/page', [
            'kamiIndex' => $questionnaire->kamiIndex,
        ]);
    }
}
```

---

## 🎓 Best Practices

1. **Always use Permission checks, not Role checks** - Permission system adalah satu sumber kebenaran
2. **Use Can component di sidebar** - Cleaner dan lebih deklaratif
3. **Use hook untuk complex logic** - Ketika butuh multiple permission checks
4. **Remember hasRole() adalah utility only** - Gunakan untuk display/logging saja
5. **Leverage type safety** - Permission type adalah union, akan error jika typo
6. **Keep nav items in layout** - Jangan hardcode di component individual
7. **Use route() dari ziggy** - Never hardcode URL strings
8. **Test permission flow** - Pastikan user visibility match dengan backend authorization

---

## 🚫 Common Mistakes

### ❌ Mistake 1: Checking role di template

```tsx
// SALAH
if (user?.roles.some((r) => r.name === 'admin')) {
    // show features
}
```

### ❌ Mistake 2: Assuming admin punya semua akses

```tsx
// SALAH
const hasAccess = hasRole('admin') || can('something.specific');
```

### ❌ Mistake 3: Not hiding nav when no permission

```tsx
// SALAH - akan render empty grup
<SidebarGroup>
    <SidebarGroupLabel>Laporan</SidebarGroupLabel>
    {/* jika user tidak punya permission, grup tetap visible */}
</SidebarGroup>
```

### ✅ Solution: Wrap dengan Can

```tsx
// BENAR
<Can permission={['report.view', 'report.export']}>
    <SidebarGroup>
        <SidebarGroupLabel>Laporan</SidebarGroupLabel>
        {/* now grup hanya render jika ada permission */}
    </SidebarGroup>
</Can>
```

---

## 📚 Quick Reference

| Kebutuhan                    | Cara          | Contoh                                              |
| ---------------------------- | ------------- | --------------------------------------------------- |
| Cek 1 permission             | `can()`       | `can('leader.view')`                                |
| Cek beberapa permission (OR) | `can([])`     | `can(['leader.create', 'leader.edit'])`             |
| Cek semua permission (AND)   | `canAll()`    | `canAll(['report.view', 'report.export'])`          |
| Conditional render           | `<Can>`       | `<Can permission="leader.view"><Button /></Can>`    |
| Multiple perms render        | `<CanAll>`    | `<CanAll permissions={[...]}<Component /></CanAll>` |
| Check role (info only)       | `hasRole()`   | `hasRole('admin')`                                  |
| Get user object              | `user`        | `const { user } = usePermission()`                  |
| Get permissions list         | `permissions` | `const { permissions } = usePermission()`           |

---

## ✨ Summary

✅ **3-layer architecture:**

1. Backend: spatie/laravel-permission
2. Middleware: share via HandleInertiaRequests
3. Frontend: usePermission hook + Can components

✅ **Type-safe:** Permission, Role, AuthUser types prevent typos

✅ **Performance:** Pure functions dalam lib/permissions.ts dapat ditest tanpa React

✅ **Flexible:** Gunakan hook atau component sesuai kebutuhan

✅ **DRY:** Sidebar nav items auto-hide jika tidak ada permission

🚀 **Siap digunakan di pages dan components di seluruh project!**
