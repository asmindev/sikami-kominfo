import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useForm } from '@inertiajs/react';
import { AlertCircle, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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

export function PairwiseWizard({ criteria, existingComparisons }: PairwiseWizardProps) {
    // Generate semua pasangan upper triangle
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

    // Pre-fill dari existingComparisons jika ada
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

    const currentKey = `${pairs[currentPair]?.i}-${pairs[currentPair]?.j}`;
    const currentValue = answers[currentKey] ?? null;
    const answeredCount = Object.keys(answers).length;
    const isCurrentAnswered = currentValue !== null;
    const isAllAnswered = answeredCount === totalPairs;
    const isFirst = currentPair === 0;
    const isLast = currentPair === totalPairs - 1;

    function handleAnswer(value: number): void {
        setAnswers((prev) => ({ ...prev, [currentKey]: value }));
    }

    function handlePrevious(): void {
        if (!isFirst) setCurrentPair((p) => p - 1);
    }

    function handleNext(): void {
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
        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
            {/* Progress */}
            <WizardProgress currentPair={currentPair} totalPairs={totalPairs} answeredCount={answeredCount} />

            {/* Kartu perbandingan */}
            <Card className="shadow-sm">
                <CardContent className="pt-6">
                    <PairQuestion
                        pairIndex={currentPair + 1}
                        totalPairs={totalPairs}
                        domainA={pairs[currentPair].a}
                        domainB={pairs[currentPair].b}
                        value={currentValue}
                        onChange={handleAnswer}
                    />
                </CardContent>

                <CardFooter className="flex items-center justify-between gap-3 border-t pt-4">
                    {/* Sebelumnya */}
                    <Button type="button" variant="outline" onClick={handlePrevious} disabled={isFirst}>
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Sebelumnya
                    </Button>

                    {/* Berikutnya atau Simpan */}
                    {isLast ? (
                        <Button type="submit" disabled={!isAllAnswered || processing} className="gap-1">
                            <Save className="h-4 w-4" />
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

            {/* Error dari server */}
            {serverError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{serverError}</AlertDescription>
                </Alert>
            )}

            {/* Hint: semua harus dijawab sebelum simpan */}
            {isLast && !isAllAnswered && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Masih ada <strong>{totalPairs - answeredCount}</strong> perbandingan yang belum diisi. Kembali dan isi semua perbandingan
                        sebelum menyimpan.
                    </AlertDescription>
                </Alert>
            )}
        </form>
    );
}
