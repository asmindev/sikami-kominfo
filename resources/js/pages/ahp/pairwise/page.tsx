import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { ConsistencyAlert } from './components/consistency-alert';
import { PairwiseMatrix } from './components/pairwise-matrix';
import type { Criteria, PairwiseComparison } from './types';

interface AhpResult {
    id: number;
    criteria_id: number;
    weight: number;
    eigen_value: number;
    ci: number;
    cr: number;
    lambda_max: number;
    is_consistent: boolean;
}

interface Props extends PageProps {
    criteria: Criteria[];
    existingComparisons: PairwiseComparison[];
    lastResult: AhpResult | null;
}

export default function PairwisePage({ criteria = [], existingComparisons = [], lastResult }: Props) {
    return (
        <AdminLayout>
            <Head title="Perbandingan Berpasangan AHP" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">Perbandingan Berpasangan AHP</h1>
                        <p className="text-sm text-muted-foreground">
                            Tentukan bobot prioritas antar domain menggunakan metode Analytic Hierarchy Process (AHP).
                        </p>
                    </div>
                </div>

                {lastResult && (
                    <ConsistencyAlert
                        isConsistent={lastResult.is_consistent}
                        cr={typeof lastResult.cr === 'string' ? parseFloat(lastResult.cr) : lastResult.cr}
                    />
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Matriks Perbandingan</CardTitle>
                        <CardDescription>Beri nilai perbandingan antara domain keamanan informasi berdasarkan skala Saaty (1-9).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PairwiseMatrix criteria={criteria} initialComparisons={existingComparisons} />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
