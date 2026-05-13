<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePositionRequest;
use App\Http\Requests\UpdatePositionRequest;
use App\Models\Position;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PositionController extends Controller
{
    public function index(): Response
    {
        $this->authorize('position.view');

        $positions = Position::withCount('users')
            ->latest()
            ->paginate(10);

        return Inertia::render('position/index/page', [
            'positions' => $positions,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('position.create');

        return Inertia::render('position/create/page');
    }

    public function store(StorePositionRequest $request): RedirectResponse
    {
        $this->authorize('position.create');

        Position::create($request->validated());

        return redirect()->route('position.index')
            ->with('success', 'Jabatan berhasil ditambahkan.');
    }

    public function edit(Position $position): Response
    {
        $this->authorize('position.edit');

        return Inertia::render('position/edit/page', [
            'position' => $position,
        ]);
    }

    public function update(Position $position, UpdatePositionRequest $request): RedirectResponse
    {
        $this->authorize('position.edit');

        $position->update($request->validated());

        return redirect()->route('position.index')
            ->with('success', 'Jabatan berhasil diperbarui.');
    }

    public function destroy(Position $position): RedirectResponse
    {
        $this->authorize('position.delete');

        if ($position->users()->exists()) {
            return redirect()->route('position.index')
                ->with('error', 'Tidak dapat menghapus jabatan yang masih digunakan oleh pengguna.');
        }

        $position->delete();

        return redirect()->route('position.index')
            ->with('success', 'Jabatan berhasil dihapus.');
    }
}
