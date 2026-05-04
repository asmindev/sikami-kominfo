import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps, Question } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface Props extends PageProps {
    questions: Question[];
}

const SCALE_LABELS: Record<number, string> = {
    1: 'Tidak Ada',
    2: 'Dalam Perencanaan',
    3: 'Dalam Penerapan',
    4: 'Diterapkan',
    5: 'Dikelola & Diukur',
};

const DOMAIN_LABELS: Record<string, string> = {
    governance: 'Tata Kelola Keamanan Informasi',
    risk_management: 'Pengelolaan Risiko Keamanan Informasi',
    framework: 'Kerangka Kerja Keamanan Informasi',
    asset_management: 'Pengelolaan Aset Informasi',
    technology: 'Teknologi & Keamanan Informasi',
};

export default function QuestionnaireFilPage({ questions }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        answers: Array<{ question_id: number; score: number }>;
    }>({
        answers: questions.map((q) => ({
            question_id: q.id,
            score: 1,
        })),
    });

    const handleScoreChange = (questionId: number, score: number) => {
        setData(
            'answers',
            data.answers.map((a) => (a.question_id === questionId ? { ...a, score } : a)),
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('questionnaire.submit'));
    };

    // Group questions by domain
    const groupedQuestions = questions.reduce(
        (acc, question) => {
            const domain = question.domain;
            if (!acc[domain]) {
                acc[domain] = [];
            }
            acc[domain].push(question);
            return acc;
        },
        {} as Record<string, Question[]>,
    );

    const domains = Object.keys(groupedQuestions) as Array<keyof typeof DOMAIN_LABELS>;

    return (
        <AdminLayout>
            <Head title="Isi Kuesioner KAMI" />
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">Kuesioner Indeks KAMI 5.0</h1>
                    <p className="text-sm text-muted-foreground">
                        Silakan jawab setiap pertanyaan dengan memilih tingkat kematangan keamanan informasi Anda.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {domains.map((domain) => (
                        <Card key={domain}>
                            <CardHeader>
                                <CardTitle className="text-lg">{DOMAIN_LABELS[domain]}</CardTitle>
                                <CardDescription>{domain}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {groupedQuestions[domain].map((question) => {
                                    const answer = data.answers.find((a) => a.question_id === question.id);
                                    const selectedScore = answer?.score || 1;

                                    return (
                                        <div key={question.id} className="border-b pb-4 last:border-0 last:pb-0">
                                            <div className="space-y-3">
                                                <div>
                                                    <Label className="text-base font-medium">{question.indicator}</Label>
                                                    <p className="mt-1 text-sm text-muted-foreground">{question.question_text}</p>
                                                </div>

                                                <RadioGroup
                                                    value={selectedScore.toString()}
                                                    onValueChange={(value) => handleScoreChange(question.id, parseInt(value))}
                                                >
                                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                                                        {Object.entries(SCALE_LABELS).map(([score, label]) => (
                                                            <div key={score} className="flex items-center gap-2">
                                                                <RadioGroupItem value={score} id={`q${question.id}-${score}`} />
                                                                <Label
                                                                    htmlFor={`q${question.id}-${score}`}
                                                                    className="flex cursor-pointer flex-col gap-1"
                                                                >
                                                                    <span className="font-semibold">{score}</span>
                                                                    <span className="text-xs text-muted-foreground">{label}</span>
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    ))}

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="submit" disabled={processing} className="min-w-[200px]">
                            {processing ? 'Mengirim...' : 'Kirim Kuesioner'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
