import AdminLayout from '@/layouts/admin-layout';
import type { PageProps, User } from '@/types';
import { Head } from '@inertiajs/react';
import { CalculateForm } from './components/calculate-form';

interface Props extends PageProps {
    leaders: User[];
}

export default function CalculatePage({ leaders }: Props) {
    return (
        <AdminLayout>
            <Head title="Hitung Indeks KAMI" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">Kalkulasi Indeks KAMI</h1>
                        <p className="text-sm text-muted-foreground">
                            Proses evaluasi keamanan berdasarkan jawaban kuesioner pimpinan dan bobot prioritas AHP yang telah diset.
                        </p>
                    </div>
                </div>

                <CalculateForm leaders={leaders} />
            </div>
        </AdminLayout>
    );
}
