<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeaderRequest;
use App\Http\Requests\UpdateLeaderRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class LeaderController extends Controller
{
    public function index(): Response
    {
        $this->authorize('leader.view');

        $leaders = User::role('leader')->with('questionnaires', 'kamiIndices')->latest()->paginate(10);

        return Inertia::render('leader/index/page', [
            'leaders' => $leaders,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('leader.create');

        return Inertia::render('leader/create/page');
    }

    public function store(StoreLeaderRequest $request): RedirectResponse
    {
        $this->authorize('leader.create');

        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $user->assignRole('leader');
        });

        return redirect()->route('leader.index')
            ->with('success', 'Pimpinan berhasil ditambahkan.');
    }

    public function edit(User $leader): Response
    {
        $this->authorize('leader.edit');

        return Inertia::render('leader/edit/page', [
            'leader' => $leader,
        ]);
    }

    public function update(User $leader, UpdateLeaderRequest $request): RedirectResponse
    {
        $this->authorize('leader.edit');

        $data = $request->validated();

        // Only hash password if provided
        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $leader->update($data);

        return redirect()->route('leader.index')
            ->with('success', 'Pimpinan berhasil diperbarui.');
    }

    public function destroy(User $leader): RedirectResponse
    {
        $this->authorize('leader.delete');

        $leader->delete();

        return redirect()->route('leader.index')
            ->with('success', 'Pimpinan berhasil dihapus.');
    }
}
