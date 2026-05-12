<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('question.create');
    }

    public function rules(): array
    {
        return [
            'domain' => ['required', 'in:governance,risk_management,framework,asset_management,technology'],
            'indicator' => ['required', 'string', 'max:10'],
            'maturity_level' => ['required', 'integer', 'in:1,2,3'],
            'score_weight' => ['required', 'integer', 'in:3,6,9'],
            'question_text' => ['required', 'string'],
            'order' => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'domain.required' => 'Domain KAMI wajib dipilih.',
            'domain.in' => 'Domain KAMI tidak valid.',
            'indicator.required' => 'Indikator pertanyaan wajib diisi.',
            'maturity_level.required' => 'Level kematangan wajib dipilih.',
            'maturity_level.in' => 'Level kematangan harus 1, 2, atau 3.',
            'score_weight.required' => 'Bobot skor wajib diisi.',
            'score_weight.in' => 'Bobot skor harus 3 (Level 1), 6 (Level 2), atau 9 (Level 3).',
            'question_text.required' => 'Teks pertanyaan wajib diisi.',
            'order.required' => 'Urutan pertanyaan wajib diisi.',
            'order.integer' => 'Urutan harus berupa angka.',
        ];
    }
}
