import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
    currentStep: number;
    steps: Array<{
        id: string;
        title: string;
        count: number;
    }>;
    answeredCount: number;
    totalCount: number;
}

export function StepIndicator({ currentStep, steps, answeredCount, totalCount }: StepIndicatorProps) {
    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;

                    return (
                        <div key={step.id} className="relative flex flex-1 flex-col items-center">
                            {/* Line connecting steps */}
                            {index !== steps.length - 1 && (
                                <div className={cn('absolute top-4 left-1/2 h-1 w-full -translate-y-1/2', isCompleted ? 'bg-primary' : 'bg-muted')} />
                            )}

                            {/* Step Circle */}
                            <div
                                className={cn(
                                    'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background',
                                    isCompleted
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : isActive
                                          ? 'border-primary text-primary'
                                          : 'border-muted text-muted-foreground',
                                )}
                            >
                                {isCompleted ? <Check className="h-4 w-4" /> : <span>{index + 1}</span>}
                            </div>

                            {/* Step Title */}
                            <div className="mt-2 text-center">
                                <p className={cn('text-xs font-medium', isActive ? 'text-primary' : 'text-muted-foreground')}>{step.title}</p>
                                <p className="text-[10px] text-muted-foreground">{step.count} soal</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 rounded-md bg-muted/30 py-2 text-center text-sm font-medium text-muted-foreground">
                Progres Step Ini:{' '}
                <span className={cn('font-bold', answeredCount === totalCount ? 'text-green-600' : 'text-primary')}>{answeredCount}</span> dari{' '}
                {totalCount} pertanyaan terjawab
            </div>
        </div>
    );
}
