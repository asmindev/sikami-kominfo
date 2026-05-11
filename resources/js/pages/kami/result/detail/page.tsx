import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, FileText } from 'lucide-react';
import { route } from 'ziggy-js';
import { DomainScore, DomainScoreCard } from './components/domain-score-card';
import { KamiChart } from './components/kami-chart';

const CATEGORY_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    not_eligible: { label: 'Tidak Layak', variant: 'destructive' },
    basic_framework: { label: 'Pemenuhan Kerangka Dasar', variant: 'secondary' },
    good_enough: { label: 'Cukup Baik', variant: 'outline' },
    good: { label: 'Baik', variant: 'default' },
};

interface KamiIndex {
    id: number;
    total_score: number;
    category: string;
    calculated_at: string;
    user: {
        name: string;
        nip?: string | null;
        position?: { id: number; name: string } | null;
    };
    domainScores: DomainScore[];
}

interface Props extends PageProps {
    kamiIndex: KamiIndex;
}

export default function KamiResultDetailPage({ kamiIndex }: Props) {
    const { user, domainScores = [] } = kamiIndex || {};

    return (
        <AdminLayout>
            <Head title="Rincian Hasil KAMI" />
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={route('kami.result')}>
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Rincian Nilai Indeks KAMI</h1>
                            <p className="text-sm text-muted-foreground">Keseluruhan hasil penilaian kompetensi keamanan informasi.</p>
                        </div>
                    </div>

                    <Button asChild>
                        <Link href={route('report.export-pdf', kamiIndex.id)}>
                            <FileText className="mr-2 h-4 w-4" /> Cetak PDF
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">Profil Penilaian</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <dt className="mb-1 font-medium text-muted-foreground">Nama Pegawai</dt>
                                    <dd className="text-base font-semibold">{user?.name}</dd>
                                    <dd className="text-muted-foreground">{user?.position?.name || user?.nip || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="mb-1 font-medium text-muted-foreground">Status & Kategori Akhir</dt>
                                    <dd>
                                        <Badge variant={CATEGORY_CONFIG[kamiIndex.category]?.variant || 'default'} className="mb-2 inline-flex">
                                            {CATEGORY_CONFIG[kamiIndex.category]?.label || kamiIndex.category}
                                        </Badge>
                                    </dd>
                                    <dd className="pt-1 font-mono text-xs text-muted-foreground">
                                        Dihitung pada: {new Date(kamiIndex.calculated_at).toLocaleDateString('id-ID')}
                                    </dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="relative overflow-hidden rounded-t-lg border-b bg-slate-50 pb-3">
                            <CardTitle className="relative z-10 text-lg">Total Skor Akhir</CardTitle>
                        </CardHeader>
                        <CardContent className="flex h-32 flex-col items-center justify-center">
                            <span className="font-mono text-5xl font-black text-slate-800">{Number(kamiIndex.total_score).toFixed(2)}</span>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    {domainScores.map((score: DomainScore) => (
                        <DomainScoreCard key={score.id} score={score} />
                    ))}
                </div>

                {domainScores.length > 0 && <KamiChart domainScores={domainScores} />}
            </div>
        </AdminLayout>
    );
}
