<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StorePositionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('position.create');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100', 'unique:positions,name'],
            'description' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama jabatan wajib diisi.',
            'name.unique' => 'Nama jabatan sudah terdaftar.',
            'name.max' => 'Nama jabatan maksimal 100 karakter.',
            'description.max' => 'Deskripsi maksimal 500 karakter.',
        ];
    }
}
