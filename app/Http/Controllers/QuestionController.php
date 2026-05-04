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

        $questions = Question::orderBy('domain')->orderBy('order')->paginate(15);

        return Inertia::render('question/index/page', [
            'questions' => $questions,
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
