import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps, Question } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import { DomainStep } from './components/domain-step';
import { StepIndicator } from './components/step-indicator';

interface Props extends PageProps {
    questions: Question[];
}

const DOMAIN_ORDER = ['governance', 'risk_management', 'framework', 'asset_management', 'technology'] as const;

const DOMAIN_LABELS: Record<string, string> = {
    governance: 'Tata Kelola Keamanan Informasi',
    risk_management: 'Pengelolaan Risiko Keamanan Informasi',
    framework: 'Kerangka Kerja Keamanan Informasi',
    asset_management: 'Pengelolaan Aset Informasi',
    technology: 'Teknologi & Keamanan Informasi',
};

const DOMAIN_DESCRIPTIONS: Record<string, string> = {
    governance: 'Mengevaluasi struktur tata kelola dan komitmen manajemen terhadap keamanan informasi.',
    risk_management: 'Menilai efektivitas proses pengelolaan risiko keamanan informasi di instansi.',
    framework: 'Memastikan adanya kerangka kerja, kebijakan, dan prosedur keamanan informasi yang memadai.',
    asset_management: 'Mengevaluasi perlindungan terhadap aset informasi dan sumber daya terkait.',
    technology: 'Menilai kontrol teknis, pengamanan aplikasi, dan infrastruktur sistem informasi.',
};

export default function QuestionnaireFilPage({ questions }: Props) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    // Initialize all answers to null
    const { data, setData, post, processing } = useForm<{
        answers: Array<{ question_id: number; score: number | null }>;
    }>({
        answers: questions.map((q) => ({
            question_id: q.id,
            score: null,
        })),
    });

    // Create a map for easier lookup and update
    const answerMap = data.answers.reduce(
        (acc, curr) => {
            acc[curr.question_id] = curr.score;
            return acc;
        },
        {} as Record<number, number | null>,
    );

    const handleScoreChange = (questionId: number, score: number) => {
        setData(
            'answers',
            data.answers.map((a) => (a.question_id === questionId ? { ...a, score } : a)),
        );
    };

    // Group questions by domain and order them
    const groupedQuestions = DOMAIN_ORDER.reduce(
        (acc, domain) => {
            acc[domain] = questions.filter((q) => q.domain === domain).sort((a, b) => a.order - b.order);
            return acc;
        },
        {} as Record<string, Question[]>,
    );

    const currentDomain = DOMAIN_ORDER[currentStep];
    const currentDomainQuestions = groupedQuestions[currentDomain] || [];

    // Check if current step is fully answered
    const answeredCount = currentDomainQuestions.filter((q) => answerMap[q.id] !== null).length;
    const isCurrentStepComplete = answeredCount === currentDomainQuestions.length;

    // Check if all questions are answered
    const isAllComplete = data.answers.every((a) => a.score !== null);

    const steps = DOMAIN_ORDER.map((domain) => {
        const domainQuestions = groupedQuestions[domain] || [];
        return {
            id: domain,
            title: DOMAIN_LABELS[domain].split(' ')[0], // Short title
            count: domainQuestions.length,
        };
    });

    const handleNext = () => {
        if (currentStep < DOMAIN_ORDER.length - 1) {
            setCurrentStep((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = () => {
        setIsConfirmOpen(false);
        // Only send answers that have a score (though validation ensures all are answered)
        const validAnswers = data.answers.filter((a) => a.score !== null) as Array<{
            question_id: number;
            score: number;
        }>;

        post(route('questionnaire.submit'), {
            onBefore: () => {
                // Ensure only valid answers are sent
                setData('answers', validAnswers);
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Isi Kuesioner KAMI" />
            <div className="w-full pb-10">
                <div className="mb-6 space-y-2 pt-6 text-center">
                    <h1 className="text-2xl font-bold tracking-tight">Kuesioner Indeks KAMI 5.0</h1>
                    <p className="text-sm text-muted-foreground">
                        Silakan jawab setiap pertanyaan dengan memilih tingkat penerapan keamanan informasi Anda.
                    </p>
                </div>

                <div className="sticky top-16 z-20 mb-6 border-b bg-background/5 pt-2 pb-4 backdrop-blur">
                    <StepIndicator currentStep={currentStep} steps={steps} answeredCount={answeredCount} totalCount={currentDomainQuestions.length} />
                </div>

                <div className="space-y-6 px-4">
                    <DomainStep
                        domainName={DOMAIN_LABELS[currentDomain]}
                        description={DOMAIN_DESCRIPTIONS[currentDomain]}
                        questions={currentDomainQuestions}
                        answers={answerMap}
                        onAnswerChange={handleScoreChange}
                    />

                    {!isCurrentStepComplete && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>Harap jawab semua pertanyaan pada bagian ini sebelum melanjutkan.</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex justify-between border-t pt-6">
                        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0 || processing}>
                            Kembali
                        </Button>

                        {currentStep < DOMAIN_ORDER.length - 1 ? (
                            <Button onClick={handleNext} disabled={!isCurrentStepComplete}>
                                Lanjut
                            </Button>
                        ) : (
                            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                                <DialogTrigger asChild>
                                    <Button disabled={!isAllComplete || processing}>{processing ? 'Mengirim...' : 'Kirim Kuesioner'}</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Konfirmasi Pengiriman</DialogTitle>
                                        <DialogDescription>
                                            Anda akan mengirim kuesioner. Setelah dikirim, jawaban tidak dapat diubah. Lanjutkan?
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="mt-4">
                                        <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
                                            Batal
                                        </Button>
                                        <Button onClick={handleSubmit} disabled={processing}>
                                            Ya, Kirim Sekarang
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
