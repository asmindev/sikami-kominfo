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
            'answers.*.score' => ['required', 'integer', 'in:0,1,2,3'],
        ];
    }

    public function messages(): array
    {
        return [
            'answers.required' => 'Jawaban wajib diisi.',
            'answers.*.question_id.*' => 'Pertanyaan tidak valid.',
            'answers.*.score.required' => 'Skor jawaban wajib diisi (0 = Tidak Dilakukan s/d 3 = Diterapkan Menyeluruh).',
            'answers.*.score.in' => 'Skor jawaban harus salah satu dari: 0, 1, 2, atau 3.',
        ];
    }
}
