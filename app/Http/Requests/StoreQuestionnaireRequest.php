<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreQuestionnaireRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('questionnaire.fill');
    }

    public function rules(): array
    {
        return [
            'answers' => ['required', 'array'],
            'answers.*.question_id' => ['required', 'integer', 'exists:questions,id'],
            'answers.*.score' => ['required', 'integer', 'min:1', 'max:5'],
        ];
    }

    public function messages(): array
    {
        return [
            'answers.required' => 'Jawaban wajib diisi.',
            'answers.*.question_id.*' => 'Pertanyaan tidak valid.',
            'answers.*.score.required' => 'Skor jawaban wajib diisi (1 = Tidak Ada s/d 5 = Dikelola & Diukur).',
            'answers.*.score.min' => 'Skor jawaban minimal adalah 1 (Tidak Ada).',
            'answers.*.score.max' => 'Skor jawaban maksimal adalah 5 (Dikelola & Diukur).',
        ];
    }
}
