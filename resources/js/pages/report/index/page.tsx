import { Can } from '@/components/can';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FileSpreadsheet } from 'lucide-react';
import { route } from 'ziggy-js';
import { ReportTable } from './components/report-table';

interface ReportPageProps extends PageProps {
    reports: {
        data: any[];
        links: any[];
        current_page: number;
        last_page: number;
    };
}

export default function ReportPage({ reports }: ReportPageProps) {
    return (
        <AppLayout>
            <Head title="Cetak Laporan" />
            <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">Cetak Laporan KAMI</h1>
                        <p className="text-sm text-muted-foreground">Rekapitulasi akhir evaluasi untuk diunduh sebagai PDF atau Excel.</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                        <Can permission="report.export">
                            <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700" asChild>
                                <Link href={route('report.export-excel')}>
                                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                                    Eksport Semua (Excel)
                                </Link>
                            </Button>
                        </Can>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Riwayat Perhitungan</CardTitle>
                        <CardDescription>Pilih data yang ingin Anda unduh laporannya.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ReportTable reports={reports.data || []} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
