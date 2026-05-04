<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('employee.create');
    }

    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'nip'      => ['required', 'string', 'max:20', 'unique:employees,nip'],
            'position' => ['required', 'string', 'max:100'],
            'password' => ['required', 'string', 'min:8'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'     => 'Nama pengguna wajib diisi.',
            'email.required'    => 'Email pengguna wajib diisi.',
            'email.unique'      => 'Email tersebut sudah terdaftar.',
            'nip.required'      => 'NIP wajib diisi.',
            'nip.unique'        => 'NIP tersebut sudah terdaftar.',
            'position.required' => 'Jabatan wajib diisi.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.min'      => 'Kata sandi minimal berisi 8 karakter.',
        ];
    }
}
