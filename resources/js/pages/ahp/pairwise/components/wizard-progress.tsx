import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface WizardProgressProps {
    currentPair: number;
    totalPairs: number;
    answeredCount: number;
}

export function WizardProgress({ currentPair, totalPairs, answeredCount }: WizardProgressProps) {
    const percentage = Math.round((answeredCount / totalPairs) * 100);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">
                    <span className="font-bold text-foreground">{answeredCount}</span> dari{' '}
                    <span className="font-bold text-foreground">{totalPairs}</span> perbandingan selesai
                </span>
                <span className="font-mono text-xs text-muted-foreground">{percentage}%</span>
            </div>

            <Progress value={percentage} className="h-2" />

            {/* Dot indicator */}
            <div className="flex justify-center gap-1.5">
                {Array.from({ length: totalPairs }).map((_, idx) => {
                    const isActive = idx === currentPair;
                    const isAnswered = idx !== currentPair && answeredCount > idx;

                    // Determine which dots are answered based on index
                    return (
                        <div
                            key={idx}
                            className={cn(
                                'h-2.5 w-2.5 rounded-full transition-all duration-200',
                                isActive && 'scale-125 bg-blue-500',
                                !isActive && isAnswered && 'bg-green-500',
                                !isActive && !isAnswered && 'bg-muted',
                            )}
                            title={`Perbandingan ${idx + 1}`}
                        />
                    );
                })}
            </div>
        </div>
    );
}
