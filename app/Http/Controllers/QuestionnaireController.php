<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQuestionnaireRequest;
use App\Models\Answer;
use App\Models\Question;
use App\Models\Questionnaire;
use App\Models\User;
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

        /** @var User $user */
        $user = Auth::user();
        // if roles admin
        if ($user->hasRole('admin')) {
            $questionnaires = Questionnaire::with(['user.position'])
                ->withCount('answers')
                ->whereNotNull('submitted_at')
                ->latest()
                ->paginate(15);

            return Inertia::render('questionnaire/result/page', [
                'isAdminView' => true,
                'questionnaires' => $questionnaires,
            ]);
        } else {

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
    }

    public function fill(): Response|RedirectResponse
    {
        $this->authorize('questionnaire.fill');

        /** @var User $user */
        $user = Auth::user();
        $questionnaire = Questionnaire::with('answers')->where('user_id', $user->id)->latest()->first();

        if ($questionnaire && $questionnaire->submitted_at !== null) {
            return redirect()->route('questionnaire.result')
                ->with('message', 'Anda sudah mengisi kuesioner.');
        }

        $questions = Question::orderBy('domain')->orderBy('order')->get();
        // Extract existing draft answers if available
        $draftAnswers = $questionnaire ? $questionnaire->answers->pluck('score', 'question_id')->toArray() : null;

        return Inertia::render('questionnaire/fill/page', [
            'questions' => $questions,
            'draftAnswers' => $draftAnswers,
        ]);
    }

    public function draft(\Illuminate\Http\Request $request): RedirectResponse
    {
        $this->authorize('questionnaire.fill');

        $request->validate([
            'answers' => ['nullable', 'array'],
            'answers.*.question_id' => ['required', 'integer', 'exists:questions,id'],
            'answers.*.score' => ['nullable', 'integer', 'min:1', 'max:5'],
        ]);

        DB::transaction(function () use ($request) {
            $user = Auth::user();

            $questionnaire = Questionnaire::firstOrCreate(
                ['user_id' => $user->id, 'submitted_at' => null],
                ['user_id' => $user->id]
            );

            // Delete old draft answers
            $questionnaire->answers()->delete();

            if (! empty($request->answers)) {
                $answersData = array_map(function ($answer) use ($questionnaire) {
                    return [
                        'questionnaire_id' => $questionnaire->id,
                        'question_id' => $answer['question_id'],
                        'score' => $answer['score'] ?? null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }, array_filter($request->answers, fn($a) => ! is_null($a['score'] ?? null)));

                if (! empty($answersData)) {
                    Answer::insert($answersData);
                }
            }
        });

        return redirect()->back()->with('success', 'Draft kuesioner berhasil disimpan.');
    }

    public function submit(StoreQuestionnaireRequest $request): RedirectResponse
    {
        $this->authorize('questionnaire.fill');

        DB::transaction(function () use ($request) {
            $user = Auth::user();

            // Delete any unsubmitted existing drafts if present to keep it clean
            Questionnaire::where('user_id', $user->id)->whereNull('submitted_at')->delete();

            $questionnaire = Questionnaire::create([
                'user_id' => $user->id,
                'submitted_at' => now(),
            ]);

            $answersData = array_map(function ($answer) use ($questionnaire) {
                return [
                    'questionnaire_id' => $questionnaire->id,
                    'question_id' => $answer['question_id'],
                    'score' => $answer['score'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }, $request->validated()['answers']);

            Answer::insert($answersData);
        });

        return redirect()->route('questionnaire.result')
            ->with('success', 'Kuesioner berhasil disubmit.');
    }

    public function result(): Response|RedirectResponse
    {
        $this->authorize('questionnaire-result.view');

        /** @var User $user */
        $user = Auth::user();

        if ($user->can('user.view')) {
            $questionnaires = Questionnaire::with(['user.position'])
                ->withCount('answers')
                ->whereNotNull('submitted_at')
                ->latest()
                ->paginate(15);

            return Inertia::render('questionnaire/result/page', [
                'isAdminView' => true,
                'questionnaires' => $questionnaires,
            ]);
        }

        // Eager load answers based on the latest submitted questionnaire
        $questionnaire = Questionnaire::with('answers.question')
            ->where('user_id', $user->id)
            ->whereNotNull('submitted_at')
            ->latest()
            ->first();

        // Look up if admin has calculated the specific result yet
        $kamiIndex = null;
        if ($user) {
            $kamiIndex = $user->kamiIndices()
                ->with(['user:id,name,email,nip,position_id', 'user.position:id,name', 'domainScores'])
                ->latest()
                ->first();
        }
        if (!$kamiIndex) {
            return redirect()->route('questionnaire.index')
                ->with('message', 'Hasil evaluasi Indeks KAMI belum tersedia. Silakan hubungi admin untuk informasi lebih lanjut.');
        }

        return Inertia::render('kami/result/detail/page', [
            'isAdminView' => false,
            'questionnaire' => $questionnaire,
            'kamiIndex' => $kamiIndex,
        ]);
    }
}
