import { Can } from '@/components/can';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps, Question } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { QuestionTable } from './components/question-table';

interface Props extends PageProps {
    questions: {
        data: Question[];
        links: any;
        meta: any;
    };
}

export default function QuestionIndexPage({ questions, auth }: Props) {
    return (
        <AdminLayout>
            <Head title="Data Pertanyaan KAMI" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">Data Pertanyaan KAMI</h1>
                        <p className="text-sm text-muted-foreground">Kelola pertanyaan untuk kuesioner Indeks KAMI</p>
                    </div>
                    <Can permission="question.create">
                        <Button asChild>
                            <Link href={route('question.create')}>Tambah Pertanyaan</Link>
                        </Button>
                    </Can>
                </div>

                <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <QuestionTable questions={questions.data} />
                </div>
            </div>
        </AdminLayout>
    );
}
