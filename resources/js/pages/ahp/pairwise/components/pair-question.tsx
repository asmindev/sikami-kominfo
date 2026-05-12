import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Criteria } from '../types';

interface ScaleOption {
    value: number;
    labelFn: (nameA: string, nameB: string) => string;
    saaty: string;
}

const OPTIONS_A: ScaleOption[] = [
    { value: 7, labelFn: (a) => `${a} jauh lebih penting`, saaty: '7' },
    { value: 5, labelFn: (a) => `${a} lebih penting`, saaty: '5' },
    { value: 3, labelFn: (a) => `${a} sedikit lebih penting`, saaty: '3' },
];

const OPTION_EQUAL: ScaleOption = {
    value: 1,
    labelFn: () => 'Keduanya sama penting',
    saaty: '1',
};

const OPTIONS_B: ScaleOption[] = [
    { value: 1 / 3, labelFn: (_, b) => `${b} sedikit lebih penting`, saaty: '1/3' },
    { value: 1 / 5, labelFn: (_, b) => `${b} lebih penting`, saaty: '1/5' },
    { value: 1 / 7, labelFn: (_, b) => `${b} jauh lebih penting`, saaty: '1/7' },
];

type OptionColor = 'domain-a' | 'neutral' | 'domain-b';

const COLOR_CLASSES: Record<OptionColor, { base: string; selected: string; badge: string; badgeSelected: string; borderLeft: string }> = {
    'domain-a': {
        base: 'border-domain-a/20 hover:bg-domain-a/5',
        selected: 'border-domain-a bg-domain-a text-domain-a-foreground',
        badge: 'bg-domain-a/10 text-domain-a',
        badgeSelected: 'bg-domain-a-foreground/20 text-domain-a-foreground',
        borderLeft: 'border-l-domain-a/50',
    },
    neutral: {
        base: 'border-border hover:bg-muted',
        selected: 'border-foreground/60 bg-foreground/80 text-background',
        badge: 'bg-muted text-muted-foreground',
        badgeSelected: 'bg-background/20 text-background',
        borderLeft: 'border-l-foreground/30',
    },
    'domain-b': {
        base: 'border-domain-b/20 hover:bg-domain-b/5',
        selected: 'border-domain-b bg-domain-b text-domain-b-foreground',
        badge: 'bg-domain-b/10 text-domain-b',
        badgeSelected: 'bg-domain-b-foreground/20 text-domain-b-foreground',
        borderLeft: 'border-l-domain-b/50',
    },
};

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
    color: OptionColor;
    onClick: () => void;
}) {
    const label = opt.labelFn(nameA, nameB);
    const c = COLOR_CLASSES[color];

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'flex w-full items-center gap-3 rounded-lg border border-l-4 px-4 py-3 text-left transition-all duration-150',
                selected ? c.selected : [c.base, c.borderLeft],
            )}
        >
            <span className="flex-1 text-sm leading-snug font-medium">{label}</span>
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
                <div className="rounded-xl border-2 border-domain-a/30 bg-domain-a/10 p-4 text-center">
                    <p className="mb-1 text-[10px] font-bold tracking-widest text-domain-a uppercase">Domain A</p>
                    <p className="text-sm leading-snug font-bold text-foreground">{domainA.name}</p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-black text-muted-foreground">
                    VS
                </div>

                <div className="rounded-xl border-2 border-domain-b/30 bg-domain-b/10 p-4 text-center">
                    <p className="mb-1 text-[10px] font-bold tracking-widest text-domain-b uppercase">Domain B</p>
                    <p className="text-sm leading-snug font-bold text-foreground">{domainB.name}</p>
                </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">Pilih tingkat kepentingan relatif antar kedua domain ini.</p>

            {/* Grup A */}
            <div className="space-y-1.5">
                <p className="px-1 text-[11px] font-semibold tracking-wider text-domain-a uppercase">{domainA.name} lebih penting</p>
                {OPTIONS_A.map((opt) => (
                    <OptionButton
                        key={opt.saaty}
                        opt={opt}
                        nameA={domainA.name}
                        nameB={domainB.name}
                        selected={isSame(value, opt.value)}
                        color="domain-a"
                        onClick={() => onChange(opt.value)}
                    />
                ))}
            </div>

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

            <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs font-medium text-muted-foreground">atau</span>
                <Separator className="flex-1" />
            </div>

            {/* Grup B */}
            <div className="space-y-1.5">
                <p className="px-1 text-[11px] font-semibold tracking-wider text-domain-b uppercase">{domainB.name} lebih penting</p>
                {OPTIONS_B.map((opt) => (
                    <OptionButton
                        key={opt.saaty}
                        opt={opt}
                        nameA={domainA.name}
                        nameB={domainB.name}
                        selected={isSame(value, opt.value)}
                        color="domain-b"
                        onClick={() => onChange(opt.value)}
                    />
                ))}
            </div>
        </div>
    );
}
