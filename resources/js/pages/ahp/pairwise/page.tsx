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
    return (
        <AppLayout>
            <Head title="Perbandingan Berpasangan AHP" />
            <div className="space-y-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Perbandingan Berpasangan AHP</h1>
                    <p className="text-sm text-muted-foreground">
                        {existingComparisons.length > 0
                            ? 'Jawaban sebelumnya sudah dimuat. Ubah jika diperlukan, lalu simpan kembali.'
                            : 'Bandingkan tingkat kepentingan antar domain keamanan informasi satu per satu.'}
                    </p>
                </div>

                <PairwiseWizard criteria={criteria} existingComparisons={existingComparisons} />
            </div>
        </AppLayout>
    );
}
