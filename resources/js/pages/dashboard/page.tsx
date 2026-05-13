import AppLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';

export default function DashboardPage() {
    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="space-y-6 pt-4">
                {/* Hero Section */}
                <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 p-8 shadow-sm">
                    <div className="flex items-start gap-6">
                        <img src="/logo.png" alt="Kominfo Sultra" className="size-20 rounded-lg border object-cover p-2" />
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold tracking-tight text-primary">SIKAMI-AHP</h1>
                            <p className="mt-1 text-lg font-semibold text-primary/80">Kominfo Sultra</p>
                            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                                Selamat datang di Sistem Penilaian Keamanan Informasi menggunakan Metode Analytical Hierarchy Process (AHP) dan Indeks
                                KAMI 5.0. Sistem ini dirancang untuk mengukur tingkat kesadaran keamanan informasi di Dinas Komunikasi dan Informatika
                                Provinsi Sulawesi Tenggara.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistics atau Quick Access */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <p className="text-sm font-medium text-muted-foreground">Status Sistem</p>
                        <p className="mt-2 text-xl font-bold text-green-600">Aktif ✓</p>
                    </div>
                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <p className="text-sm font-medium text-muted-foreground">Versi KAMI</p>
                        <p className="mt-2 text-xl font-bold text-primary">5.0</p>
                    </div>
                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <p className="text-sm font-medium text-muted-foreground">Metode Analisis</p>
                        <p className="mt-2 text-lg font-bold text-primary">AHP</p>
                    </div>
                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <p className="text-sm font-medium text-muted-foreground">Institusi</p>
                        <p className="mt-2 text-sm font-bold text-primary">Kominfo Sultra</p>
                    </div>
                </div>

                {/* Info Box */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">Tentang Sistem</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <h3 className="mb-2 font-medium text-primary">📊 Metode AHP</h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                Sistem menggunakan Analytical Hierarchy Process (AHP) untuk melakukan pembobotan berbagai kriteria keamanan informasi
                                secara objektif dan terukur.
                            </p>
                        </div>
                        <div>
                            <h3 className="mb-2 font-medium text-primary">🔐 Indeks KAMI 5.0</h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                Menggunakan Indeks KAMI terbaru (5.0) untuk mengevaluasi maturity level keamanan informasi dari tingkat dasar hingga
                                dikelola dan diukur.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
