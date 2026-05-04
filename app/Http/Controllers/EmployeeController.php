<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('employee.view');

        $employees = Employee::with('user')->latest()->paginate(10);

        return Inertia::render('employee/index/page', [
            'employees' => $employees,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('employee.create');

        return Inertia::render('employee/create/page');
    }

    public function store(StoreEmployeeRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $user->assignRole('employee');

            Employee::create([
                'user_id'  => $user->id,
                'nip'      => $request->nip,
                'position' => $request->position,
            ]);
        });

        return redirect()->route('employee.index')
            ->with('success', 'Data pegawai berhasil ditambahkan.');
    }

    public function show(Employee $employee): Response
    {
        Gate::authorize('employee.view');

        $employee->load('user');

        return Inertia::render('employee/show/page', [
            'employee' => $employee,
        ]);
    }

    public function edit(Employee $employee): Response
    {
        Gate::authorize('employee.edit');

        $employee->load('user');

        return Inertia::render('employee/edit/page', [
            'employee' => $employee,
        ]);
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee): RedirectResponse
    {
        DB::transaction(function () use ($request, $employee) {
            $userData = [
                'name'  => $request->name,
                'email' => $request->email,
            ];

            if ($request->filled('password')) {
                $userData['password'] = Hash::make($request->password);
            }

            $employee->user->update($userData);

            $employee->update([
                'nip'      => $request->nip,
                'position' => $request->position,
            ]);
        });

        return redirect()->route('employee.index')
            ->with('success', 'Data pegawai berhasil diperbarui.');
    }

    public function destroy(Employee $employee): RedirectResponse
    {
        Gate::authorize('employee.delete');

        DB::transaction(function () use ($employee) {
            $user = $employee->user;
            $employee->delete();
            $user->delete();
        });

        return redirect()->route('employee.index')
            ->with('success', 'Data pegawai berhasil dihapus.');
    }
}
