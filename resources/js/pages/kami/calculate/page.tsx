import AppLayout from '@/layouts/admin-layout';
import type { PageProps, User } from '@/types';
import { Head } from '@inertiajs/react';
import { CalculateForm } from './components/calculate-form';

interface Props extends PageProps {
    leaders: User[];
    ahpReady: boolean;
}

export default function KamiCalculatePage({ leaders, ahpReady }: Props) {
    return (
        <AppLayout>
            <Head title="Kalkulasi Indeks KAMI" />
            <div className="space-y-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Kalkulasi Indeks KAMI</h1>
                    <p className="text-sm text-muted-foreground">Hitung indeks KAMI berdasarkan jawaban kuesioner pimpinan dan bobot AHP.</p>
                </div>
                <CalculateForm leaders={leaders} ahpReady={ahpReady} />
            </div>
        </AppLayout>
    );
}
