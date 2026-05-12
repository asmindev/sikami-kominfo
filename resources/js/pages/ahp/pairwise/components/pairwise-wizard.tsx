import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useForm } from '@inertiajs/react';
import { AlertCircle, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { route } from 'ziggy-js';
import type { Criteria, PairwiseComparison } from '../types';
import { PairQuestion } from './pair-question';
import { WizardProgress } from './wizard-progress';

interface Pair {
    i: number;
    j: number;
    a: Criteria;
    b: Criteria;
}

interface PairwiseWizardProps {
    criteria: Criteria[];
    existingComparisons: PairwiseComparison[];
}

/** Delay (ms) sebelum auto-advance ke pair berikutnya setelah memilih jawaban */
const AUTO_ADVANCE_DELAY = 500;

export function PairwiseWizard({ criteria, existingComparisons }: PairwiseWizardProps) {
    const pairs = useMemo<Pair[]>(() => {
        const result: Pair[] = [];
        for (let i = 0; i < criteria.length; i++) {
            for (let j = i + 1; j < criteria.length; j++) {
                result.push({ i, j, a: criteria[i], b: criteria[j] });
            }
        }
        return result;
    }, [criteria]);

    const totalPairs = pairs.length;

    const initialAnswers = useMemo<Record<string, number>>(() => {
        const filled: Record<string, number> = {};
        existingComparisons.forEach((cmp) => {
            const i = criteria.findIndex((c) => c.id === cmp.criteria1_id);
            const j = criteria.findIndex((c) => c.id === cmp.criteria2_id);
            if (i !== -1 && j !== -1 && i < j) {
                filled[`${i}-${j}`] = Number(cmp.comparison_value);
            }
        });
        return filled;
    }, [existingComparisons, criteria]);

    const [currentPair, setCurrentPair] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>(initialAnswers);
    const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { post, processing, errors, transform } = useForm<{
        comparisons: {
            criteria1_id: number;
            criteria2_id: number;
            criteria1_index: number;
            criteria2_index: number;
            comparison_value: number;
        }[];
    }>({ comparisons: [] });

    // Scroll ke atas setiap pindah pair
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPair]);

    // Derived state
    const currentKey = `${pairs[currentPair]?.i}-${pairs[currentPair]?.j}`;
    const currentValue = answers[currentKey] ?? null;
    const isFirst = currentPair === 0;
    const isLast = currentPair === totalPairs - 1;
    const isCurrentAnswered = currentValue !== null;
    const isAllAnswered = Object.keys(answers).length === totalPairs;

    // answeredSet: set of pair indices yang sudah dijawab — untuk WizardProgress dots
    const answeredSet = useMemo<Set<number>>(() => {
        const set = new Set<number>();
        pairs.forEach((pair, idx) => {
            if (answers[`${pair.i}-${pair.j}`] !== undefined) {
                set.add(idx);
            }
        });
        return set;
    }, [answers, pairs]);

    const goNext = useCallback(() => {
        if (!isLast) setCurrentPair((p) => p + 1);
    }, [isLast]);

    const handleAnswer = useCallback(
        (value: number) => {
            setAnswers((prev) => ({ ...prev, [currentKey]: value }));

            // Auto-advance ke pair berikutnya jika bukan yang terakhir
            if (!isLast) {
                if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
                autoAdvanceTimer.current = setTimeout(goNext, AUTO_ADVANCE_DELAY);
            }
        },
        [currentKey, isLast, goNext],
    );

    // Bersihkan timer saat unmount atau ganti pair
    useEffect(() => {
        return () => {
            if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
        };
    }, [currentPair]);

    function handlePrevious(): void {
        if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
        if (!isFirst) setCurrentPair((p) => p - 1);
    }

    function handleNext(): void {
        if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
        if (!isLast && isCurrentAnswered) setCurrentPair((p) => p + 1);
    }

    function handleSubmit(e: React.FormEvent): void {
        e.preventDefault();
        if (!isAllAnswered || processing) return;

        transform(() => ({
            comparisons: pairs.map((pair) => ({
                criteria1_id: pair.a.id,
                criteria2_id: pair.b.id,
                criteria1_index: pair.i,
                criteria2_index: pair.j,
                comparison_value: answers[`${pair.i}-${pair.j}`],
            })),
        }));

        post(route('ahp.store-pairwise'));
    }

    const serverError = errors.comparisons ?? (Object.values(errors)[0] as string | undefined);

    if (!pairs.length) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Tidak ada kriteria yang ditemukan. Pastikan data AHP criteria sudah tersedia.</AlertDescription>
            </Alert>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Progress */}
            <WizardProgress currentPair={currentPair} totalPairs={totalPairs} answeredSet={answeredSet} />

            {/* Kartu perbandingan */}
            <Card>
                <CardContent className="pt-6">
                    <PairQuestion domainA={pairs[currentPair].a} domainB={pairs[currentPair].b} value={currentValue} onChange={handleAnswer} />
                </CardContent>

                <CardFooter className="flex items-center justify-between gap-3 border-t pt-4">
                    <Button type="button" variant="outline" onClick={handlePrevious} disabled={isFirst}>
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Sebelumnya
                    </Button>

                    {isLast ? (
                        <Button type="submit" disabled={!isAllAnswered || processing}>
                            <Save className="mr-1.5 h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan & Hitung Bobot'}
                        </Button>
                    ) : (
                        <Button type="button" onClick={handleNext} disabled={!isCurrentAnswered}>
                            Berikutnya
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    )}
                </CardFooter>
            </Card>

            {/* Peringatan jika di halaman terakhir tapi belum semua dijawab */}
            {isLast && !isAllAnswered && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Masih ada <strong>{totalPairs - Object.keys(answers).length}</strong> perbandingan yang belum diisi. Kembali dan lengkapi
                        sebelum menyimpan.
                    </AlertDescription>
                </Alert>
            )}

            {/* Error dari server */}
            {serverError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{serverError}</AlertDescription>
                </Alert>
            )}
        </form>
    );
}
