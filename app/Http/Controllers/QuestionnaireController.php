<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQuestionnaireRequest;
use App\Models\Question;
use App\Models\Questionnaire;
use App\Models\Answer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class QuestionnaireController extends Controller
{
    public function index(): Response
    {
        $this->authorize('questionnaire.fill');

        $user = auth()->user();

        $questionnaires = Questionnaire::where('user_id', $user->id)
            ->latest()
            ->paginate(10);

        $hasActiveDraft = Questionnaire::where('user_id', $user->id)
            ->whereNull('submitted_at')
            ->exists();

        return Inertia::render('questionnaire/index/page', [
            'questionnaires' => $questionnaires,
            'hasActiveDraft' => $hasActiveDraft,
        ]);
    }

    public function fill(): Response|RedirectResponse
    {
        $this->authorize('questionnaire.fill');

        $user = auth()->user();
        $questionnaire = Questionnaire::where('user_id', $user->id)->latest()->first();

        if ($questionnaire && $questionnaire->submitted_at !== null) {
            return redirect()->route('questionnaire.result')
                ->with('message', 'Anda sudah mengisi kuesioner.');
        }

        $questions = Question::orderBy('domain')->orderBy('order')->get();

        return Inertia::render('questionnaire/fill/page', [
            'questions' => $questions,
        ]);
    }

    public function submit(StoreQuestionnaireRequest $request): RedirectResponse
    {
        $this->authorize('questionnaire.fill');

        DB::transaction(function () use ($request) {
            $user = Auth::user();

            // Delete any unsubmitted existing drafts if present to keep it clean
            Questionnaire::where('user_id', $user->id)->whereNull('submitted_at')->delete();

            $questionnaire = Questionnaire::create([
                'user_id'      => $user->id,
                'submitted_at' => now(),
            ]);

            $answersData = array_map(function ($answer) use ($questionnaire) {
                return [
                    'questionnaire_id' => $questionnaire->id,
                    'question_id'      => $answer['question_id'],
                    'score'            => $answer['score'],
                    'created_at'       => now(),
                    'updated_at'       => now(),
                ];
            }, $request->validated()['answers']);

            Answer::insert($answersData);
        });

        return redirect()->route('questionnaire.result')
            ->with('success', 'Kuesioner berhasil disubmit.');
    }

    public function result(): Response
    {
        $this->authorize('questionnaire-result.view');

        $user = auth()->user();

        // Eager load answers based on the latest submitted questionnaire
        $questionnaire = Questionnaire::with('answers.question')
            ->where('user_id', $user->id)
            ->whereNotNull('submitted_at')
            ->latest()
            ->first();

        // Look up if admin has calculated the specific result yet
        $kamiIndex = null;
        if ($user) {
            $kamiIndex = $user->kamiIndices()->with('domainScores')->latest()->first();
        }

        return Inertia::render('questionnaire/result/page', [
            'questionnaire' => $questionnaire,
            'kamiIndex'     => $kamiIndex,
        ]);
    }
}
