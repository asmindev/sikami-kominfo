import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-layout';
import { PositionForm } from '../create/components/position-form';
import { route } from 'ziggy-js';

export default function PositionEditPage({ position }: { position: any }) {
    return (
        <AppLayout>
            <Head title={`Edit Jabatan - ${position.name}`} />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Jabatan</h1>
                    <p className="text-muted-foreground">Perbarui data jabatan: {position.name}</p>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <PositionForm
                        method="PUT"
                        action={route('position.update', position.id)}
                        position={position}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
