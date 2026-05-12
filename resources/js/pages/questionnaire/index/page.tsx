import { Can } from '@/components/can';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { QuestionnaireTable } from './components/questionnaire-table';

interface Props extends PageProps {
    questionnaires: {
        data: any[];
        links: any;
        meta: any;
    };
    hasActiveDraft?: boolean;
}

export default function QuestionnaireIndexPage({ questionnaires, hasActiveDraft }: Props) {
    return (
        <AppLayout>
            <Head title="Kuesioner Indeks KAMI" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">Kuesioner Indeks KAMI</h1>
                        <p className="text-sm text-muted-foreground">
                            <Can permission="questionnaire.fill">Isi kuesioner Indeks KAMI untuk mengevaluasi keamanan informasi</Can>
                            <Can
                                permission={['kami-index.view', 'kami-index.calculate']}
                                fallback={<span>Pantau pengisian kuesioner Indeks KAMI pimpinan</span>}
                            >
                                Pantau pengisian kuesioner Indeks KAMI pimpinan
                            </Can>
                        </p>
                    </div>
                    <Can permission="questionnaire.fill">
                        {!hasActiveDraft && (
                            <Button asChild>
                                <Link href={route('questionnaire.fill')}>Buat Kuesioner Baru</Link>
                            </Button>
                        )}
                    </Can>
                </div>

                <div className="rounded-lg border p-4 shadow-sm">
                    <QuestionnaireTable questionnaires={questionnaires.data} />
                </div>
            </div>
        </AppLayout>
    );
}
