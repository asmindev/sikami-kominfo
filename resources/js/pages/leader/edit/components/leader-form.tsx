import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import React from 'react';
import { route } from 'ziggy-js';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    leader?: User;
    isEdit?: boolean;
}

export function LeaderForm({ leader, isEdit = false }: Props) {
    const { data, setData, post, put, errors, processing } = useForm({
        name: leader?.name || '',
        email: leader?.email || '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && leader) {
            put(route('leader.update', { leader: leader.id }));
        } else {
            post(route('leader.store'));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nama Pimpinan</Label>
                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Kata Sandi {isEdit && '(Kosongkan jika tidak ingin diubah)'}</Label>
                <Input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>
            <div className="mt-6 flex items-center justify-end gap-4">
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
