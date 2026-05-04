import { Can } from '@/components/can';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download } from 'lucide-react';
import { route } from 'ziggy-js';

const CATEGORY_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    not_eligible: { label: 'Tidak Layak', variant: 'destructive' },
    basic_framework: { label: 'Pemenuhan Kerangka Dasar', variant: 'secondary' },
    good_enough: { label: 'Cukup Baik', variant: 'outline' },
    good: { label: 'Baik', variant: 'default' },
};

interface ReportTableProps {
    reports: any[];
}

export function ReportTable({ reports }: ReportTableProps) {
    if (reports.length === 0) {
        return (
            <div className="flex h-32 items-center justify-center rounded-md border bg-slate-50 text-slate-500">
                Belum ada hasil kalkulasi untuk di-export.
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Skor</TableHead>
                        <TableHead className="w-[120px] text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reports.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.user?.name}</TableCell>
                            <TableCell>
                                <Badge variant={CATEGORY_CONFIG[item.category]?.variant || 'default'}>
                                    {CATEGORY_CONFIG[item.category]?.label || item.category}
                                </Badge>
                            </TableCell>
                            <TableCell>{Number(item.total_score).toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                                <Can permission="report.export">
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={route('report.export-pdf', item.id)} target="_blank" rel="noopener noreferrer">
                                            <Download className="mr-2 h-4 w-4" />
                                            PDF
                                        </a>
                                    </Button>
                                </Can>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
