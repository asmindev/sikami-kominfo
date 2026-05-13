<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('user.edit');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($this->user->id)],
            'password' => ['nullable', 'string', 'min:8'],
            'nip' => ['nullable', 'string', 'max:20', Rule::unique('users', 'nip')->ignore($this->user->id)],
            'position_id' => ['nullable', 'integer', 'exists:positions,id'],
            'role' => ['required', 'string', 'in:admin,leader,employee'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama pengguna wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Email tidak valid.',
            'email.unique' => 'Email tersebut sudah terdaftar.',
            'password.min' => 'Kata sandi minimal berisi 8 karakter.',
            'nip.unique' => 'NIP tersebut sudah terdaftar.',
            'position_id.exists' => 'Jabatan yang dipilih tidak valid.',
            'role.required' => 'Role wajib dipilih.',
            'role.in' => 'Role yang dipilih tidak valid.',
        ];
    }
}
