import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Criteria } from '../types';

interface ScaleOption {
    value: number;
    labelFn: (nameA: string, nameB: string) => string;
    badge: string;
    side: 'a' | 'equal' | 'b';
}

const SCALE_OPTIONS: ScaleOption[] = [
    {
        value: 7,
        labelFn: (a) => `${a} jauh lebih penting`,
        badge: '7',
        side: 'a',
    },
    {
        value: 5,
        labelFn: (a) => `${a} lebih penting`,
        badge: '5',
        side: 'a',
    },
    {
        value: 3,
        labelFn: (a) => `${a} sedikit lebih penting`,
        badge: '3',
        side: 'a',
    },
    {
        value: 1,
        labelFn: () => 'Sama penting',
        badge: '1',
        side: 'equal',
    },
    {
        value: 1 / 3,
        labelFn: (_, b) => `${b} sedikit lebih penting`,
        badge: '1/3',
        side: 'b',
    },
    {
        value: 1 / 5,
        labelFn: (_, b) => `${b} lebih penting`,
        badge: '1/5',
        side: 'b',
    },
    {
        value: 1 / 7,
        labelFn: (_, b) => `${b} jauh lebih penting`,
        badge: '1/7',
        side: 'b',
    },
];

interface PairQuestionProps {
    pairIndex: number;
    totalPairs: number;
    domainA: Criteria;
    domainB: Criteria;
    value: number | null;
    onChange: (value: number) => void;
}

function isSameValue(a: number | null, b: number): boolean {
    if (a === null) return false;
    return Math.abs(a - b) < 0.001;
}

export function PairQuestion({ pairIndex, totalPairs, domainA, domainB, value, onChange }: PairQuestionProps) {
    return (
        <div className="space-y-6">
            {/* Header pasangan */}
            <div className="space-y-4 text-center">
                <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                    Perbandingan {pairIndex} dari {totalPairs}
                </p>

                <div className="flex items-center justify-center gap-4">
                    <div className="flex-1 rounded-xl border-2 border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-950">
                        <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Domain A</p>
                        <p className="mt-1 text-base leading-tight font-bold text-blue-900 dark:text-blue-100">{domainA.name}</p>
                    </div>

                    <div className="shrink-0 rounded-full bg-muted px-3 py-1">
                        <span className="text-sm font-bold text-muted-foreground">vs</span>
                    </div>

                    <div className="flex-1 rounded-xl border-2 border-orange-200 bg-orange-50 px-4 py-3 dark:border-orange-800 dark:bg-orange-950">
                        <p className="text-xs font-medium text-orange-600 dark:text-orange-400">Domain B</p>
                        <p className="mt-1 text-base leading-tight font-bold text-orange-900 dark:text-orange-100">{domainB.name}</p>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground">Mana yang lebih penting untuk keamanan informasi instansi Anda?</p>
            </div>

            {/* 7 tombol pilihan */}
            <div className="space-y-2">
                {SCALE_OPTIONS.map((opt) => {
                    const isSelected = isSameValue(value, opt.value);
                    const label = opt.labelFn(domainA.name, domainB.name);

                    return (
                        <button
                            key={opt.badge}
                            type="button"
                            onClick={() => onChange(opt.value)}
                            className={cn(
                                'flex w-full items-center justify-between rounded-lg border-2 px-4 py-3 text-left transition-all duration-150',
                                isSelected
                                    ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                                    : 'border-border bg-background text-foreground hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950',
                            )}
                        >
                            <span className="text-sm font-medium">{label}</span>
                            <Badge
                                variant={isSelected ? 'secondary' : 'outline'}
                                className={cn(
                                    'ml-3 shrink-0 font-mono text-xs',
                                    isSelected && 'bg-white/20 text-white',
                                )}
                            >
                                {opt.badge}
                            </Badge>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
