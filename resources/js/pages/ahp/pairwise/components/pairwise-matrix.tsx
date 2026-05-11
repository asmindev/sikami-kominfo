import { Can } from '@/components/can';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { InstructionCard } from '@/pages/ahp/pairwise/components/instruction-card';
import { MatrixTable } from '@/pages/ahp/pairwise/components/matrix-table';
import { ScaleLegend } from '@/pages/ahp/pairwise/components/scale-legend';
import { SCALE_DESCRIPTIONS } from '@/pages/ahp/pairwise/constants';
import type { PairwiseMatrixProps } from '@/pages/ahp/pairwise/types';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';

interface ProgressIndicatorProps {
    filledComparisons: number;
    totalComparisons: number;
}

function ProgressIndicator({ filledComparisons, totalComparisons }: ProgressIndicatorProps) {
    const percentage = (filledComparisons / totalComparisons) * 100;

    return (
        <div className="flex items-center justify-between rounded-md border p-2 sm:p-3">
            <span className="text-xs font-medium text-foreground sm:text-sm">
                Progres: <span className="font-bold text-blue-600">{filledComparisons}</span>/<span className="font-bold">{totalComparisons}</span>
            </span>
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200 sm:h-2 sm:w-24 dark:bg-slate-600">
                <div className="h-full bg-blue-600 transition-all duration-300 dark:bg-blue-700" style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
}

export function PairwiseMatrix({ criteria = [], initialComparisons = [] }: PairwiseMatrixProps) {
    const n = criteria.length;
    const defaultMatrix = Array(n)
        .fill(null)
        .map(() => Array(n).fill(1));
    const scales = SCALE_DESCRIPTIONS.map((s) => s.value);

    // Initialize matrix from initial comparisons (only process upper triangle)
    initialComparisons.forEach((cmp) => {
        const idx1 = criteria.findIndex((c) => c.id === cmp.criteria1_id);
        const idx2 = criteria.findIndex((c) => c.id === cmp.criteria2_id);
        if (idx1 !== -1 && idx2 !== -1) {
            const val = Number(cmp.comparison_value);

            // Only set if it's in upper triangle (i < j) and value >= 1
            if (idx1 < idx2 && val >= 1) {
                // Find closest scale from 1-9
                let closestScale = val;
                let minDiff = Infinity;
                for (const scale of scales) {
                    if (Math.abs(scale - val) < minDiff) {
                        minDiff = Math.abs(scale - val);
                        closestScale = scale;
                    }
                }
                defaultMatrix[idx1][idx2] = closestScale;
                defaultMatrix[idx2][idx1] = 1 / closestScale;
            }
            // If value < 1 (reciprocal), skip - it will be calculated automatically
        }
    });

    const [matrix, setMatrix] = useState<number[][]>(defaultMatrix);

    const { post, processing, errors, transform } = useForm({
        comparisons: initialComparisons,
    });

    // Calculate filled comparisons (upper triangle)
    const totalComparisons = (n * (n - 1)) / 2;
    const filledComparisons = Array.from({ length: n }).reduce<number>((acc, _, i) => {
        for (let j = i + 1; j < n; j++) {
            if (matrix[i][j] !== 1) acc++;
        }
        return acc;
    }, 0);

    const handleCellChange = (rowIdx: number, colIdx: number, value: number) => {
        const newMatrix = matrix.map((row) => [...row]);
        newMatrix[rowIdx][colIdx] = value;
        newMatrix[colIdx][rowIdx] = 1 / value;
        setMatrix(newMatrix);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const comparisonsToSubmit: Array<{
            criteria1_id: number;
            criteria2_id: number;
            criteria1_index: number;
            criteria2_index: number;
            comparison_value: number;
        }> = [];

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    comparisonsToSubmit.push({
                        criteria1_id: criteria[i].id,
                        criteria2_id: criteria[j].id,
                        criteria1_index: i,
                        criteria2_index: j,
                        comparison_value: matrix[i][j],
                    });
                }
            }
        }

        transform((data) => ({
            ...data,
            comparisons: comparisonsToSubmit,
        }));

        post(route('ahp.store-pairwise'));
    };

    return (
        <TooltipProvider>
            <div className="space-y-4">
                <InstructionCard />
                <ProgressIndicator filledComparisons={filledComparisons} totalComparisons={totalComparisons} />
                <ScaleLegend />

                <Can
                    permission="ahp-pairwise.create"
                    fallback={
                        <p className="text-sm text-muted-foreground italic">
                            Anda hanya dapat melihat matriks perbandingan. Hubungi admin untuk melakukan perubahan.
                        </p>
                    }
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <MatrixTable criteria={criteria} matrix={matrix} errors={errors} onCellChange={handleCellChange} />

                        <div className="flex justify-end pt-2">
                            <Button type="submit" disabled={processing} size="sm" className="gap-1 text-xs sm:text-sm">
                                {processing ? (
                                    <>
                                        <span className="animate-spin text-base">⏳</span>
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Simpan & Hitung Bobot'
                                )}
                            </Button>
                        </div>
                    </form>
                </Can>
            </div>
        </TooltipProvider>
    );
}
