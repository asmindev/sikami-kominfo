import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-layout';

export default function DashboardPage() {
    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="space-y-6">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                    <p className="text-sm text-muted-foreground">
                        Selamat datang di Sistem Penilaian Keamanan Informasi (SIKAMI-AHP).
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
