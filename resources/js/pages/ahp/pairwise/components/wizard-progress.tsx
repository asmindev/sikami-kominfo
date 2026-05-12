import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface WizardProgressProps {
    currentPair: number;
    totalPairs: number;
    answeredSet: Set<number>; // index mana saja yang sudah dijawab
}

export function WizardProgress({ currentPair, totalPairs, answeredSet }: WizardProgressProps) {
    const answeredCount = answeredSet.size;
    const percentage = Math.round((answeredCount / totalPairs) * 100);

    return (
        <div className="space-y-3">
            {/* Counter + persen */}
            <div className="flex items-baseline justify-between">
                <p className="text-sm text-muted-foreground">
                    Pertanyaan <span className="text-xl font-black text-foreground">{currentPair + 1}</span>
                    <span className="text-muted-foreground"> / {totalPairs}</span>
                </p>
                <p className="text-xs font-medium text-muted-foreground">
                    {answeredCount === totalPairs ? (
                        <span className="font-semibold text-green-600">Semua selesai ✓</span>
                    ) : (
                        <>
                            {answeredCount} dari {totalPairs} selesai
                        </>
                    )}
                </p>
            </div>

            {/* Progress bar */}
            <Progress value={percentage} className="h-1" />

            {/* Step circles */}
            <div className="flex items-center justify-between">
                {Array.from({ length: totalPairs }).map((_, idx) => {
                    const isActive = idx === currentPair;
                    const isDone = answeredSet.has(idx) && !isActive;
                    const isPending = !isActive && !isDone;

                    return (
                        <div
                            key={idx}
                            title={`Perbandingan ${idx + 1}`}
                            className={cn(
                                'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-200',
                                isActive && 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background',
                                isDone && 'bg-green-500 text-white',
                                isPending && 'bg-muted text-muted-foreground',
                            )}
                        >
                            {isDone ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : idx + 1}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
