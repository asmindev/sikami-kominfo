import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Question } from '@/types';

interface QuestionCardProps {
    question: Question;
    value: number | null;
    onChange: (value: number) => void;
}

const SCALE_LABELS: Record<number, string> = {
    0: 'Tidak Dilakukan',
    1: 'Dalam Perencanaan',
    2: 'Dalam Penerapan / Diterapkan Sebagian',
    3: 'Diterapkan Menyeluruh',
};

const MATURITY_BADGES: Record<number, { label: string; className: string }> = {
    1: { label: 'Fondasi', className: 'bg-muted text-muted-foreground hover:bg-muted' },
    2: { label: 'Berkembang', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200' },
    3: { label: 'Terkelola', className: 'bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-200' },
};

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
    const maturity = MATURITY_BADGES[question.maturity_level || 1] || MATURITY_BADGES[1];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Indikator {question.indicator}</CardTitle>
                <Badge variant="outline" className={maturity.className}>
                    Level {question.maturity_level || 1} - {maturity.label}
                </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-base">{question.question_text}</p>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    {Object.entries(SCALE_LABELS).map(([scoreStr, label]) => {
                        const score = parseInt(scoreStr);
                        const isSelected = value === score;
                        return (
                            <button
                                key={score}
                                type="button"
                                onClick={() => onChange(score)}
                                className={cn(
                                    'flex flex-col items-center justify-center rounded-lg border-2 p-3 text-center transition-all hover:bg-accent',
                                    isSelected ? 'border-primary bg-primary/5 text-primary' : 'border-muted bg-transparent text-muted-foreground',
                                )}
                            >
                                <span className="text-lg font-bold">{score}</span>
                                <span className="text-xs">{label}</span>
                            </button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
