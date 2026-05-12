import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calculator, Eye } from 'lucide-react';
import { route } from 'ziggy-js';

interface KamiIndex {
    id: number;
    total_score: number;
    category: string;
    calculated_at: string;
    user?: {
        name: string;
    };
}

interface Props extends PageProps {
    kamiIndices: {
        data: KamiIndex[];
    };
}

const CATEGORY_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    not_eligible: { label: 'Tidak Layak', variant: 'destructive' },
    basic_framework: { label: 'Pemenuhan Kerangka Dasar', variant: 'secondary' },
    good_enough: { label: 'Cukup Baik', variant: 'outline' },
    good: { label: 'Baik', variant: 'default' },
};

export default function KamiResultPage({ kamiIndices }: Props) {
    return (
        <AppLayout>
            <Head title="Hasil Indeks KAMI" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">Data Evaluasi Indeks KAMI</h1>
                        <p className="text-sm text-muted-foreground">Menampilkan senarai hasil kalkulasi Indeks KAMI seluruh pegawai.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('kami.calculate')}>
                            <Calculator className="mr-2 h-4 w-4" />
                            Hitung Baru
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Pimpinan</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Total Skor Akhir</TableHead>
                                    <TableHead>Tgl Hitung</TableHead>
                                    <TableHead className="w-25"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {kamiIndices.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                            Belum ada data evaluasi
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    kamiIndices.data.map((index) => (
                                        <TableRow key={index.id}>
                                            <TableCell className="font-medium">{index.user?.name || '-'}</TableCell>
                                            <TableCell>
                                                <Badge variant={CATEGORY_CONFIG[index.category]?.variant || 'default'}>
                                                    {CATEGORY_CONFIG[index.category]?.label || index.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-mono text-lg font-bold">{Number(index.total_score).toFixed(2)}</span>
                                            </TableCell>
                                            <TableCell>{new Date(index.calculated_at).toLocaleDateString('id-ID')}</TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={route('kami.show', index.id)}>
                                                        <Eye className="mr-1 h-4 w-4" /> Detail
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
