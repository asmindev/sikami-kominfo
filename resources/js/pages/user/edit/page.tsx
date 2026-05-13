import AppLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { UserForm } from '../create/components/user-form';

export default function UserEditPage({ user, positions, roles }: { user: any; positions: any[]; roles: string[] }) {
    return (
        <AppLayout>
            <Head title={`Edit Pengguna - ${user.name}`} />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Pengguna</h1>
                    <p className="text-muted-foreground">Perbarui data pengguna: {user.name}</p>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <UserForm method="PUT" action={route('user.update', user.id)} user={user} positions={positions} roles={roles} />
                </div>
            </div>
        </AppLayout>
    );
}
