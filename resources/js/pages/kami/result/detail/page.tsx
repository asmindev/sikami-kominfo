import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, FileText, ShieldCheck, TrendingUp, User } from 'lucide-react';
import { route } from 'ziggy-js';
import { DomainScore, DomainScoreCard } from './components/domain-score-card';
import { KamiChart } from './components/kami-chart';

const CATEGORY_CONFIG: Record<
    string,
    {
        label: string;
        variant: 'default' | 'secondary' | 'destructive' | 'outline';
        description: string;
        color: string;
    }
> = {
    not_eligible: {
        label: 'Tidak Layak',
        variant: 'destructive',
        description: 'Instansi belum memenuhi persyaratan dasar keamanan informasi.',
        color: 'text-red-600',
    },
    basic_framework: {
        label: 'Pemenuhan Kerangka Kerja Dasar',
        variant: 'secondary',
        description: 'Instansi telah memenuhi kerangka kerja dasar namun masih perlu peningkatan.',
        color: 'text-amber-600',
    },
    good_enough: {
        label: 'Cukup Baik',
        variant: 'outline',
        description: 'Instansi telah menerapkan keamanan informasi dengan cukup baik.',
        color: 'text-blue-600',
    },
    good: {
        label: 'Baik',
        variant: 'default',
        description: 'Instansi telah menerapkan keamanan informasi dengan sangat baik.',
        color: 'text-green-600',
    },
};

interface KamiIndexData {
    id: number;
    total_score: number;
    category: string;
    calculated_at: string;
    user: {
        name: string;
        email: string;
        nip?: string | null;
        position?: { id: number; name: string } | null;
    };
    domain_scores: DomainScore[];
}

interface Props extends PageProps {
    kamiIndex: KamiIndexData;
}

export default function KamiShowPage({ kamiIndex }: Props) {
    console.log('KamiIndex Data:', kamiIndex); // Debug log to check the data structure
    const { user, domain_scores: domainScores = [] } = kamiIndex;
    const config = CATEGORY_CONFIG[kamiIndex.category] ?? CATEGORY_CONFIG.not_eligible;
    console.log('Category Config:', config); // Debug log to check category configuration
    console.log('Domain Scores:', domainScores); // Debug log to check domain scores data

    const totalDomainScore = domainScores.reduce((sum, d) => sum + Number(d.domain_score), 0);
    const highestDomain = domainScores.reduce((max, d) => (Number(d.final_score) > Number(max.final_score) ? d : max), domainScores[0]);
    const lowestDomain = domainScores.reduce((min, d) => (Number(d.final_score) < Number(min.final_score) ? d : min), domainScores[0]);

    return (
        <AdminLayout>
            <Head title="Rincian Hasil KAMI" />
            <div className="w-full space-y-6 pb-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={route('kami.result')}>
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Rincian Nilai Indeks KAMI</h1>
                            <p className="text-sm text-muted-foreground">Hasil penilaian keamanan informasi berdasarkan KAMI 5.0 dan bobot AHP</p>
                        </div>
                    </div>
                    <Button asChild>
                        <a href={route('report.export-pdf', kamiIndex.id)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Cetak PDF
                        </a>
                    </Button>
                </div>

                {/* Profil + Skor Utama */}
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Profil Pimpinan */}
                    <Card className="md:col-span-2">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <User className="h-4 w-4 text-muted-foreground" />
                                Profil Pimpinan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Nama</p>
                                    <p className="text-base font-semibold">{user?.name ?? '-'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Jabatan</p>
                                    <p className="font-medium">{user?.position?.name ?? '-'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">NIP</p>
                                    <p className="font-mono">{user?.nip ?? '-'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Tanggal Penilaian</p>
                                    <p>
                                        {new Date(kamiIndex.calculated_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            {/* Kategori */}
                            <div className="space-y-2">
                                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Status Kesiapan</p>
                                <div className="flex items-center gap-3">
                                    <Badge variant={config.variant} className="px-3 py-1 text-sm">
                                        {config.label}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{config.description}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Skor */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                                Total Indeks KAMI
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center gap-2 pt-4">
                            <span className={`font-mono text-5xl font-black ${config.color}`}>{Number(kamiIndex.total_score).toFixed(2)}</span>
                            <span className="text-xs text-muted-foreground">dari maks. 916</span>
                            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full rounded-full bg-primary transition-all"
                                    style={{ width: `${Math.min((Number(kamiIndex.total_score) / 916) * 100, 100)}%` }}
                                />
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {((Number(kamiIndex.total_score) / 916) * 100).toFixed(1)}% dari nilai maksimum
                            </span>
                        </CardContent>
                    </Card>
                </div>

                {/* Statistik Ringkas */}
                {domainScores.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="pt-5">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                    <p className="text-xs text-muted-foreground">Domain Tertinggi</p>
                                </div>
                                <p className="mt-1 text-sm leading-tight font-semibold">{highestDomain?.domain_name}</p>
                                <p className="font-mono text-xl font-bold text-green-600">{Number(highestDomain?.final_score).toFixed(2)}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-5">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 rotate-180 text-red-500" />
                                    <p className="text-xs text-muted-foreground">Domain Terendah</p>
                                </div>
                                <p className="mt-1 text-sm leading-tight font-semibold">{lowestDomain?.domain_name}</p>
                                <p className="font-mono text-xl font-bold text-red-500">{Number(lowestDomain?.final_score).toFixed(2)}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-5">
                                <p className="text-xs text-muted-foreground">Total Skor Mentah</p>
                                <p className="mt-1 text-xs text-muted-foreground">Sebelum bobot AHP</p>
                                <p className="font-mono text-xl font-bold">{totalDomainScore.toFixed(2)}</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Skor per Domain */}
                {domainScores.length > 0 && (
                    <>
                        <div>
                            <h2 className="mb-3 font-semibold">Skor per Domain</h2>
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                                {domainScores.map((score) => (
                                    <DomainScoreCard key={score.id} score={score} />
                                ))}
                            </div>
                        </div>
                        <KamiChart domainScores={domainScores} />
                    </>
                )}

                {domainScores.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center text-sm text-muted-foreground">Data skor domain tidak tersedia.</CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
