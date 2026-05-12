<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;
use App\Models\Question;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class QuestionController extends Controller
{
    public function index(): Response
    {
        $this->authorize('question.view');

        $domain = request('domain');
        $search = request('search');

        $query = Question::query();
        if ($domain && $domain !== 'all') {
            $query->where('domain', $domain);
        }
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('indicator', 'like', "%$search%")
                    ->orWhere('question_text', 'like', "%$search%")
                    ->orWhere('domain', 'like', "%$search%");
            });
        }

        $questions = $query->orderBy('domain')->orderBy('order')->paginate(10)->withQueryString();

        $domains = [
            'governance' => 'Tata Kelola',
            'risk_management' => 'Manajemen Risiko',
            'framework' => 'Kerangka Kerja',
            'asset_management' => 'Manajemen Aset',
            'technology' => 'Teknologi',
        ];

        return Inertia::render('question/index/page', [
            'questions' => $questions,
            'domains' => $domains,
            'filter' => [
                'domain' => $domain,
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('question.create');

        return Inertia::render('question/create/page');
    }

    public function store(StoreQuestionRequest $request): RedirectResponse
    {
        $this->authorize('question.create');

        Question::create($request->validated());

        return redirect()->route('question.index')
            ->with('success', 'Pertanyaan berhasil ditambahkan.');
    }

    public function edit(Question $question): Response
    {
        $this->authorize('question.edit');

        return Inertia::render('question/edit/page', [
            'question' => $question,
        ]);
    }

    public function update(UpdateQuestionRequest $request, Question $question): RedirectResponse
    {
        $this->authorize('question.edit');

        $question->update($request->validated());

        return redirect()->route('question.index')
            ->with('success', 'Pertanyaan berhasil diperbarui.');
    }

    public function destroy(Question $question): RedirectResponse
    {
        $this->authorize('question.delete');

        $question->delete();

        return redirect()->route('question.index')
            ->with('success', 'Pertanyaan berhasil dihapus.');
    }
}
