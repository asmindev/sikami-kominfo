import { Can } from '@/components/can';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { ConsistencyInfo } from './components/consistency-info';
import { WeightTable } from './components/weight-table';

interface AhpResultData {
    criteria_id: number;
    weight: string;
    eigen_value: string;
    ci: string;
    cr: string;
    lambda_max: string;
    is_consistent: boolean;
    criteria: {
        id: number;
        name: string;
        code: string;
    };
}

interface Props extends PageProps {
    results: AhpResultData[];
}

export default function AhpResultPage({ results }: Props) {
    if (!results.length) {
        return (
            <AppLayout>
                <Head title="Hasil AHP" />
                <div className="mx-auto w-full">
                    <Card>
                        <CardHeader className="border-b pb-8 text-center">
                            <CardTitle className="text-xl">Hasil Belum Tersedia</CardTitle>
                            <CardDescription>Anda belum mengatur perbandingan berpasangan kriteria.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center pt-8">
                            <Button asChild>
                                <Link href={route('ahp.pairwise')}>Atur Bobot Kriteria Sekarang</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    // extract general consistency info from the first result row (it's the same for all in standard setup)
    const firstResult = results[0];

    return (
        <Can
            permission="ahp-result.view"
            fallback={
                <AppLayout>
                    <Head title="Tidak Diizinkan" />
                    <div className="text-center text-muted-foreground">Anda tidak memiliki akses ke halaman ini.</div>
                </AppLayout>
            }
        >
            <AppLayout>
                <Head title="Hasil Perhitungan AHP" />
                <div className="mx-auto w-full">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight">Hasil AHP Domain KAMI</h1>
                            <p className="text-sm text-muted-foreground">Menampilkan bobot prioritas dan nilai konsistensi hasil AHP.</p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href={route('ahp.pairwise')}>Ubah Perbandingan</Link>
                        </Button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Bobot Prioritas Kriteria (Domain)</CardTitle>
                                    <CardDescription>Nilai akhir bobot untuk setiap domain keamanan informasi.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <WeightTable results={results} />
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <ConsistencyInfo
                                isConsistent={firstResult.is_consistent}
                                cr={parseFloat(firstResult.cr)}
                                ci={parseFloat(firstResult.ci)}
                                lambdaMax={parseFloat(firstResult.lambda_max)}
                            />
                        </div>
                    </div>
                </div>
            </AppLayout>
        </Can>
    );
}
