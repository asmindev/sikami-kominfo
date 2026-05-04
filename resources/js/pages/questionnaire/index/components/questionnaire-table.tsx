import { Can } from '@/components/can';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface Props {
    questionnaires: any[];
}

export function QuestionnaireTable({ questionnaires }: Props) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-16">No</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Mulai</TableHead>
                        <TableHead>Selesai</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {questionnaires.length > 0 ? (
                        questionnaires.map((q, index) => (
                            <TableRow key={q.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <Badge variant={q.submitted_at ? 'default' : 'secondary'}>{q.submitted_at ? 'Selesai' : 'Draft'}</Badge>
                                </TableCell>
                                <TableCell>{new Date(q.created_at).toLocaleDateString('id-ID')}</TableCell>
                                <TableCell>{q.submitted_at ? new Date(q.submitted_at).toLocaleDateString('id-ID') : '-'}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Can permission="questionnaire.fill">
                                            {!q.submitted_at && (
                                                <Button variant="default" size="sm" asChild>
                                                    <Link href={route('questionnaire.fill')}>Lanjut Isi</Link>
                                                </Button>
                                            )}
                                        </Can>
                                        <Can permission="questionnaire-result.view">
                                            {q.submitted_at && (
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={route('questionnaire.result')}>Lihat Hasil</Link>
                                                </Button>
                                            )}
                                        </Can>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                                Belum ada data kuesioner
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
