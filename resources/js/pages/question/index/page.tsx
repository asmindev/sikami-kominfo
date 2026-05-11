import { Can } from '@/components/can';
import PaginationNav from '@/components/pagination-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps, Question } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { QuestionTable } from './components/question-table';

interface Props extends PageProps {
    questions: {
        data: Question[];
        links: any;
        meta: any;
    };
    domains: Record<string, string>;
    filter: {
        domain?: string;
        search?: string;
    };
}

export default function QuestionIndexPage({ questions, domains, filter, auth }: Props) {
    const { data, setData, get } = useForm({
        domain: filter?.domain ?? '',
        search: filter?.search ?? '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        get(route('question.index'));
    };

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

                <form onSubmit={handleSearch} className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                        <Select value={data.domain} onValueChange={(v) => setData('domain', v)}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Semua Domain" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Domain</SelectItem>
                                {Object.entries(domains || {}).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>
                                        {label as string}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder="Cari indikator atau teks pertanyaan"
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                            className="w-105"
                        />
                        <Button type="submit">Cari</Button>
                    </div>
                </form>

                <div className="rounded-lg border p-4 shadow-sm">
                    <QuestionTable questions={questions.data} meta={questions.meta} />

                    <div className="mt-4">
                        <PaginationNav links={questions.links} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
