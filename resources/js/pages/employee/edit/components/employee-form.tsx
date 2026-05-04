import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Employee } from '@/types';
import React from 'react';

interface Props {
    employee?: Employee;
    isEdit?: boolean;
}

export function EmployeeForm({ employee, isEdit = false }: Props) {
    const { data, setData, post, put, errors, processing } = useForm({
        name: employee?.user?.name || '',
        email: employee?.user?.email || '',
        nip: employee?.nip || '',
        position: employee?.position || '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && employee) {
            put(route('employee.update', { employee: employee.id }));
        } else {
            post(route('employee.store'));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <div className="space-y-2">
                <Label htmlFor="name">Nama Pegawai</Label>
                <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="nip">NIP</Label>
                <Input id="nip" value={data.nip} onChange={e => setData('nip', e.target.value)} />
                {errors.nip && <p className="text-sm text-destructive">{errors.nip}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="position">Jabatan</Label>
                <Input id="position" value={data.position} onChange={e => setData('position', e.target.value)} />
                {errors.position && <p className="text-sm text-destructive">{errors.position}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Kata Sandi {isEdit && '(Kosongkan jika tidak ingin diubah)'}</Label>
                <Input id="password" type="password" value={data.password} onChange={e => setData('password', e.target.value)} />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>
            <div className="flex items-center justify-end gap-4 mt-6">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Batal
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Menyimpan...' : 'Simpan'}
                </Button>
            </div>
        </form>
    );
}
