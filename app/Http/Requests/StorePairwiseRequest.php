<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StorePairwiseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('ahp-pairwise.create');
    }

    public function rules(): array
    {
        return [
            'comparisons' => ['required', 'array'],
            'comparisons.*.criteria1_id' => ['required', 'integer', 'exists:ahp_criteria,id'],
            'comparisons.*.criteria2_id' => ['required', 'integer', 'exists:ahp_criteria,id'],
            'comparisons.*.comparison_value' => ['required', 'numeric', 'min:0.1111', 'max:9'],
        ];
    }
}
