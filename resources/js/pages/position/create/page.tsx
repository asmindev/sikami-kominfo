import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-layout';
import { PositionForm } from './components/position-form';
import { route } from 'ziggy-js';

export default function PositionCreatePage() {
    return (
        <AppLayout>
            <Head title="Tambah Jabatan" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tambah Jabatan Baru</h1>
                    <p className="text-muted-foreground">Tambahkan data jabatan/posisi baru</p>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <PositionForm
                        method="POST"
                        action={route('position.store')}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
