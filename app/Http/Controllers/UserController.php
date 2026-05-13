<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Position;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $this->authorize('user.view');

        $users = User::with('position', 'roles')
            ->latest()
            ->paginate(10);

        return Inertia::render('user/index/page', [
            'users' => $users,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('user.create');

        $positions = Position::all();
        $roles = ['admin', 'leader', 'employee'];

        return Inertia::render('user/create/page', [
            'positions' => $positions,
            'roles' => $roles,
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $this->authorize('user.create');

        DB::transaction(function () use ($request) {
            $data = $request->validated();
            $role = $data['role'];
            unset($data['role']);

            $data['password'] = Hash::make($data['password']);

            $user = User::create($data);
            $user->assignRole($role);
        });

        return redirect()->route('user.index')
            ->with('success', 'Pengguna berhasil ditambahkan.');
    }

    public function edit(User $user): Response
    {
        $this->authorize('user.edit');

        $positions = Position::all();
        $roles = ['admin', 'leader', 'employee'];
        $userRole = $user->getRoleNames()->first();

        return Inertia::render('user/edit/page', [
            'user' => $user,
            'positions' => $positions,
            'roles' => $roles,
            'userRole' => $userRole,
        ]);
    }

    public function update(User $user, UpdateUserRequest $request): RedirectResponse
    {
        $this->authorize('user.edit');

        $data = $request->validated();
        $role = $data['role'];
        unset($data['role']);

        // Only hash password if provided
        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        // Update role
        $user->syncRoles([$role]);

        return redirect()->route('user.index')
            ->with('success', 'Pengguna berhasil diperbarui.');
    }

    public function destroy(User $user): RedirectResponse
    {
        $this->authorize('user.delete');

        $user->delete();

        return redirect()->route('user.index')
            ->with('success', 'Pengguna berhasil dihapus.');
    }
}
