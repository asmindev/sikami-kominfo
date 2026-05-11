import { Can } from '@/components/can';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Question } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface Props {
    questions: Question[];
    meta?: any;
}

export function QuestionTable({ questions, meta }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus pertanyaan ini?')) {
            destroy(route('question.destroy', { question: id }));
        }
    };

    const domainLabels: Record<string, string> = {
        governance: 'Tata Kelola',
        risk_management: 'Manajemen Risiko',
        framework: 'Kerangka Kerja',
        asset_management: 'Manajemen Aset',
        technology: 'Teknologi',
    };

    // Calculate offset from meta.from, atau compute dari current_page dan per_page
    const offset = meta?.from ? meta.from - 1 : meta?.current_page && meta?.per_page ? (meta.current_page - 1) * meta.per_page : 0;

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-16">No</TableHead>
                        <TableHead>Domain</TableHead>
                        <TableHead>Indikator</TableHead>
                        <TableHead>Pertanyaan</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {questions.length > 0 ? (
                        questions.map((question, index) => (
                            <TableRow key={question.id}>
                                <TableCell>{offset + index + 1}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{domainLabels[question.domain] || question.domain}</Badge>
                                </TableCell>
                                <TableCell>{question.indicator}</TableCell>
                                <TableCell className="max-w-md truncate" title={question.question_text}>
                                    {question.question_text}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Can permission="question.edit">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('question.edit', { question: question.id })}>Edit</Link>
                                            </Button>
                                        </Can>
                                        <Can permission="question.delete">
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(question.id)}>
                                                Hapus
                                            </Button>
                                        </Can>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                                Belum ada data pertanyaan
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
