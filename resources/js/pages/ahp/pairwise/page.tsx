import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { PairwiseWizard } from './components/pairwise-wizard';
import type { Criteria, PairwiseComparison } from './types';

interface Props extends PageProps {
    criteria: Criteria[];
    existingComparisons: PairwiseComparison[];
}

export default function PairwisePage({ criteria = [], existingComparisons = [] }: Props) {
    const hasExisting = existingComparisons.length > 0;

    return (
        <AppLayout>
            <Head title="Perbandingan Berpasangan AHP" />
            <div className="space-y-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Perbandingan Berpasangan AHP</h1>
                    <p className="text-sm text-muted-foreground">
                        Tentukan bobot prioritas antar domain dengan membandingkan setiap pasang domain secara langsung.
                    </p>
                </div>

                <Card>
                    <CardHeader className="border-b pb-4">
                        <CardTitle className="text-base">{hasExisting ? 'Perbarui Perbandingan' : 'Mulai Perbandingan'}</CardTitle>
                        <CardDescription>
                            {hasExisting
                                ? 'Jawaban sebelumnya sudah dimuat. Ubah sesuai kebutuhan lalu simpan kembali.'
                                : 'Jawab 10 pertanyaan perbandingan berikut satu per satu menggunakan skala Saaty.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <PairwiseWizard criteria={criteria} existingComparisons={existingComparisons} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
