<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateLeaderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('leader.edit');
    }

    public function rules(): array
    {
        $leader = $this->route('leader');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$leader->id],
            'password' => ['nullable', 'string', 'min:8'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama pimpinan wajib diisi.',
            'email.required' => 'Email pimpinan wajib diisi.',
            'email.unique' => 'Email tersebut sudah terdaftar.',
            'password.min' => 'Kata sandi minimal berisi 8 karakter.',
        ];
    }
}
