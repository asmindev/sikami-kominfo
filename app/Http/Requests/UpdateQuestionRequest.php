<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('question.edit');
    }

    public function rules(): array
    {
        return [
            'domain' => ['required', 'in:governance,risk_management,framework,asset_management,technology'],
            'indicator' => ['required', 'string', 'max:10'],
            'maturity_level' => ['required', 'integer', 'in:1,2,3'],
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
            'question_text.required' => 'Teks pertanyaan wajib diisi.',
            'order.required' => 'Urutan pertanyaan wajib diisi.',
            'order.integer' => 'Urutan harus berupa angka.',
        ];
    }
}
