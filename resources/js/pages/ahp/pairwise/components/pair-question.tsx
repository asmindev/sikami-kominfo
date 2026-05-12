import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Criteria } from '../types';

interface ScaleOption {
    value: number;
    labelFn: (nameA: string, nameB: string) => string;
    saaty: string;
    intensity: 'high' | 'mid' | 'low';
}

const OPTIONS_A: ScaleOption[] = [
    { value: 7, labelFn: (a) => `${a} jauh lebih penting`, saaty: '7', intensity: 'high' },
    { value: 5, labelFn: (a) => `${a} lebih penting`, saaty: '5', intensity: 'mid' },
    { value: 3, labelFn: (a) => `${a} sedikit lebih penting`, saaty: '3', intensity: 'low' },
];

const OPTION_EQUAL: ScaleOption = {
    value: 1,
    labelFn: () => 'Keduanya sama penting',
    saaty: '1',
    intensity: 'mid',
};

const OPTIONS_B: ScaleOption[] = [
    { value: 1 / 3, labelFn: (_, b) => `${b} sedikit lebih penting`, saaty: '1/3', intensity: 'low' },
    { value: 1 / 5, labelFn: (_, b) => `${b} lebih penting`, saaty: '1/5', intensity: 'mid' },
    { value: 1 / 7, labelFn: (_, b) => `${b} jauh lebih penting`, saaty: '1/7', intensity: 'high' },
];

interface PairQuestionProps {
    domainA: Criteria;
    domainB: Criteria;
    value: number | null;
    onChange: (value: number) => void;
}

function isSame(a: number | null, b: number): boolean {
    return a !== null && Math.abs(a - b) < 0.001;
}

function OptionButton({
    opt,
    nameA,
    nameB,
    selected,
    color,
    onClick,
}: {
    opt: ScaleOption;
    nameA: string;
    nameB: string;
    selected: boolean;
    color: 'blue' | 'neutral' | 'orange';
    onClick: () => void;
}) {
    const label = opt.labelFn(nameA, nameB);

    const colorMap = {
        blue: {
            base: 'border-l-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40',
            selected: 'border-l-blue-600 bg-blue-600 text-white hover:bg-blue-700',
            badge: 'bg-blue-100 text-blue-700',
            badgeSelected: 'bg-white/20 text-white',
        },
        neutral: {
            base: 'border-l-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40',
            selected: 'border-l-slate-600 bg-slate-700 text-white hover:bg-slate-800',
            badge: 'bg-slate-100 text-slate-700',
            badgeSelected: 'bg-white/20 text-white',
        },
        orange: {
            base: 'border-l-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40',
            selected: 'border-l-orange-600 bg-orange-500 text-white hover:bg-orange-600',
            badge: 'bg-orange-100 text-orange-700',
            badgeSelected: 'bg-white/20 text-white',
        },
    };

    const c = colorMap[color];

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'flex w-full items-center gap-3 rounded-lg border border-l-4 border-border px-4 py-3 text-left transition-all duration-150',
                selected ? c.selected : c.base,
            )}
        >
            {/* Teks label */}
            <span className="flex-1 text-sm leading-snug font-medium">{label}</span>

            {/* Badge nilai Saaty */}
            <span className={cn('shrink-0 rounded-md px-2 py-0.5 font-mono text-xs font-bold', selected ? c.badgeSelected : c.badge)}>
                {opt.saaty}
            </span>
        </button>
    );
}

export function PairQuestion({ domainA, domainB, value, onChange }: PairQuestionProps) {
    return (
        <div className="space-y-5">
            {/* Dua domain */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 text-center dark:border-blue-800 dark:bg-blue-950">
                    <p className="mb-1 text-[10px] font-bold tracking-widest text-blue-500 uppercase">Domain A</p>
                    <p className="text-sm leading-snug font-bold text-blue-900 dark:text-blue-100">{domainA.name}</p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-black text-muted-foreground">
                    VS
                </div>

                <div className="rounded-xl border-2 border-orange-200 bg-orange-50 p-4 text-center dark:border-orange-800 dark:bg-orange-950">
                    <p className="mb-1 text-[10px] font-bold tracking-widest text-orange-500 uppercase">Domain B</p>
                    <p className="text-sm leading-snug font-bold text-orange-900 dark:text-orange-100">{domainB.name}</p>
                </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">Pilih tingkat kepentingan relatif antar kedua domain ini.</p>

            {/* Grup A */}
            <div className="space-y-1.5">
                <p className="px-1 text-[11px] font-semibold tracking-wider text-blue-600 uppercase">{domainA.name} lebih penting</p>
                {OPTIONS_A.map((opt) => (
                    <OptionButton
                        key={opt.saaty}
                        opt={opt}
                        nameA={domainA.name}
                        nameB={domainB.name}
                        selected={isSame(value, opt.value)}
                        color="blue"
                        onClick={() => onChange(opt.value)}
                    />
                ))}
            </div>

            {/* Separator + Equal */}
            <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs font-medium text-muted-foreground">atau</span>
                <Separator className="flex-1" />
            </div>

            <OptionButton
                opt={OPTION_EQUAL}
                nameA={domainA.name}
                nameB={domainB.name}
                selected={isSame(value, OPTION_EQUAL.value)}
                color="neutral"
                onClick={() => onChange(OPTION_EQUAL.value)}
            />

            {/* Separator + Grup B */}
            <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs font-medium text-muted-foreground">atau</span>
                <Separator className="flex-1" />
            </div>

            <div className="space-y-1.5">
                <p className="px-1 text-[11px] font-semibold tracking-wider text-orange-600 uppercase">{domainB.name} lebih penting</p>
                {OPTIONS_B.map((opt) => (
                    <OptionButton
                        key={opt.saaty}
                        opt={opt}
                        nameA={domainA.name}
                        nameB={domainB.name}
                        selected={isSame(value, opt.value)}
                        color="orange"
                        onClick={() => onChange(opt.value)}
                    />
                ))}
            </div>
        </div>
    );
}
