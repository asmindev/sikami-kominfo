import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { route } from 'ziggy-js';

interface Props extends PageProps {
    isAdminView?: boolean;
    kamiIndex?: KamiIndexData | null;
    questionnaires?: { data: QuestionnaireRow[] } | null;
}

interface QuestionnaireRow {
    id: number;
    submitted_at: string | null;
    answers_count?: number;
    user?: {
        name?: string | null;
        position?: {
            name?: string | null;
        } | null;
    } | null;
}

interface KamiIndexData {
    total_score: number | string;
    category: string;
    calculated_at: string;
    user?: {
        name?: string | null;
    } | null;
    domain_scores?: DomainScoreData[] | null;
}

interface DomainScoreData {
    id: number;
    domain_name: string;
    final_score: number | string;
    domain_score: number | string;
    ahp_weight: number | string;
}

const CATEGORY_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    not_eligible: { label: 'Tidak Layak', variant: 'destructive' },
    basic_framework: { label: 'Pemenuhan Kerangka Kerja Dasar', variant: 'secondary' },
    good_enough: { label: 'Cukup Baik', variant: 'outline' },
    good: { label: 'Baik', variant: 'default' },
};

const domainLabels: Record<string, string> = {
    governance: 'Tata Kelola',
    risk_management: 'Risiko',
    framework: 'Kerangka Kerja',
    asset_management: 'Aset',
    technology: 'Teknologi',
};

export default function QuestionnaireResultPage({ isAdminView, kamiIndex, questionnaires }: Props) {
    if (isAdminView) {
        const questionnaireRows = questionnaires?.data ?? [];

        return (
            <AppLayout>
                <Head title="Hasil Evaluasi Indeks KAMI" />
                <div className="mx-auto w-full space-y-6">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">Hasil Evaluasi Indeks KAMI</h1>
                        <p className="text-sm text-muted-foreground">Daftar semua kuesioner yang sudah disubmit oleh pimpinan.</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Semua Hasil Kuis</CardTitle>
                            <CardDescription>Menampilkan seluruh kuesioner yang sudah selesai diisi.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-hidden rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>No</TableHead>
                                            <TableHead>Pimpinan</TableHead>
                                            <TableHead>Jabatan</TableHead>
                                            <TableHead>Jumlah Jawaban</TableHead>
                                            <TableHead>Disubmit</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {questionnaireRows.length > 0 ? (
                                            questionnaireRows.map((questionnaire, index) => (
                                                <TableRow key={questionnaire.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{questionnaire.user?.name ?? '-'}</TableCell>
                                                    <TableCell>{questionnaire.user?.position?.name ?? '-'}</TableCell>
                                                    <TableCell>{questionnaire.answers_count ?? 0}</TableCell>
                                                    <TableCell>
                                                        {questionnaire.submitted_at
                                                            ? new Date(questionnaire.submitted_at).toLocaleDateString('id-ID')
                                                            : '-'}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                                                    Belum ada kuesioner yang disubmit.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    if (!kamiIndex) {
        return (
            <AppLayout>
                <Head title="Hasil Evaluasi Indeks KAMI" />
                <div className="mx-auto w-full space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight">Hasil Evaluasi Indeks KAMI</h1>
                            <p className="text-sm text-muted-foreground">Belum ada hasil evaluasi yang dihitung untuk Anda.</p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href={route('questionnaire.index')}>Kembali ke Daftar</Link>
                        </Button>
                    </div>
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <p>
                                Kuesioner Anda telah tersimpan. Data Indeks KAMI belum tersedia karena Admin perlu memproses hasil evaluasi tersebut
                                terlebih dahulu.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    const domainScores = kamiIndex?.domain_scores || [];

    const chartData = domainScores.map((score) => ({
        name: domainLabels[score.domain_name] || score.domain_name,
        'Nilai Akhir (Skor x Bobot)': Number(score.final_score).toFixed(2),
        'Skor Mentah': Number(score.domain_score).toFixed(2),
    }));

    return (
        <AppLayout>
            <Head title="Hasil Evaluasi Indeks KAMI" />
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">Hasil Evaluasi Indeks KAMI</h1>
                        <p className="text-sm text-muted-foreground">Menampilkan hasil perhitungan skor Indeks KAMI dan bobot AHP.</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={route('questionnaire.index')}>Kembali ke Daftar</Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="col-span-2">
                        <CardHeader>
                            <CardTitle>Ringkasan Hasil</CardTitle>
                            <CardDescription>Skor Akhir Berdasarkan Kategori TINGGI / RENDAH</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 flex items-center justify-between border-b pb-4">
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-muted-foreground">Total Skor Keseluruhan</div>
                                    <div className="text-4xl font-bold">{Number(kamiIndex.total_score).toFixed(2)}</div>
                                </div>
                                <div className="space-y-1 text-right">
                                    <div className="text-sm font-medium text-muted-foreground">Kategori</div>
                                    <Badge variant={CATEGORY_CONFIG[kamiIndex.category]?.variant || 'default'} className="py-1 text-lg">
                                        {CATEGORY_CONFIG[kamiIndex.category]?.label || kamiIndex.category}
                                    </Badge>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-5 gap-4 text-center">
                                {domainScores.map((ds) => (
                                    <div key={ds.id} className="space-y-2">
                                        <div
                                            className="line-clamp-1 text-xs font-semibold text-muted-foreground"
                                            title={domainLabels[ds.domain_name]}
                                        >
                                            {domainLabels[ds.domain_name]}
                                        </div>
                                        <div className="rounded-md bg-slate-100 px-2 py-1 text-xl font-bold">{Number(ds.final_score).toFixed(2)}</div>
                                        <div className="text-[10px] text-muted-foreground">Bobot: {(Number(ds.ahp_weight) * 100).toFixed(1)}%</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Info Penilaian</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Pimpinan</div>
                                <div>{kamiIndex.user?.name || '-'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Tanggal Selesai</div>
                                <div>
                                    {new Date(kamiIndex.calculated_at).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Grafik Perbandingan Domain</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-100 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Nilai Akhir (Skor x Bobot)" fill="#2563eb" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Skor Mentah" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
