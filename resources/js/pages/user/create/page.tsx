import AppLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { UserForm } from './components/user-form';

export default function UserCreatePage({ positions, roles }: { positions: any[]; roles: string[] }) {
    return (
        <AppLayout>
            <Head title="Tambah Pengguna" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tambah Pengguna Baru</h1>
                    <p className="text-muted-foreground">Tambahkan pengguna baru ke dalam sistem</p>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <UserForm method="POST" action={route('user.store')} positions={positions} roles={roles} />
                </div>
            </div>
        </AppLayout>
    );
}
