import { Can } from '@/components/can';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import { InstructionCard } from './components/instruction-card';
import { MatrixTable } from './components/matrix-table';
import { ProgressIndicator } from './components/progress-indicator';
import { ScaleLegend } from './components/scale-legend';
import { SubmitButton } from './components/submit-button';
import { SCALE_DESCRIPTIONS } from './constants';
import type { PairwiseMatrixProps } from './types';

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

                        <SubmitButton processing={processing} />
                    </form>
                </Can>
            </div>
        </TooltipProvider>
    );
}
