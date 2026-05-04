import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import { route } from 'ziggy-js';
import { DomainScoreCard } from './components/domain-score-card';
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
  employee: {
    nip: string;
    position: string;
    user: {
      name: string;
    }
  };
  domainScores: any[];
}

interface Props extends PageProps {
  kamiIndex: KamiIndex;
}

export default function KamiResultDetailPage({ kamiIndex }: Props) {
  const { employee, domainScores = [] } = kamiIndex || {};

  return (
    <AdminLayout>
      <Head title="Rincian Hasil KAMI" />
      <div className="space-y-6 max-w-5xl mx-auto">
         <div className="flex items-center justify-between">
           <div className="flex items-center space-x-3">
             <Button variant="ghost" size="icon" asChild>
                <Link href={route('kami.result')}>
                   <ArrowLeft className="h-5 w-5" />
                </Link>
             </Button>
             <div>
                <h1 className="text-2xl font-bold tracking-tight">Rincian Nilai Indeks KAMI</h1>
                <p className="text-muted-foreground text-sm">Keseluruhan hasil penilaian kompetensi keamanan informasi.</p>
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
                             <dt className="text-muted-foreground mb-1 font-medium">Nama Pegawai</dt>
                             <dd className="font-semibold text-base">{employee?.user?.name}</dd>
                             <dd className="text-muted-foreground">{employee?.position}</dd>
                         </div>
                         <div>
                             <dt className="text-muted-foreground mb-1 font-medium">Status & Kategori Akhir</dt>
                             <dd>
                                 <Badge variant={CATEGORY_CONFIG[kamiIndex.category]?.variant || 'default'} className="mb-2 inline-flex">
                                     {CATEGORY_CONFIG[kamiIndex.category]?.label || kamiIndex.category}
                                 </Badge>
                             </dd>
                             <dd className="font-mono text-xs text-muted-foreground pt-1">
                               Dihitung pada: {new Date(kamiIndex.calculated_at).toLocaleDateString('id-ID')}
                             </dd>
                         </div>
                     </dl>
                 </CardContent>
            </Card>
            <Card>
                 <CardHeader className="pb-3 bg-slate-50 border-b relative overflow-hidden rounded-t-lg">
                     <CardTitle className="text-lg relative z-10">Total Skor Akhir</CardTitle>
                 </CardHeader>
                 <CardContent className="flex flex-col justify-center items-center h-32">
                     <span className="text-5xl font-black font-mono text-slate-800">
                        {Number(kamiIndex.total_score).toFixed(2)}
                     </span>
                 </CardContent>
            </Card>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
             {domainScores.map((score: any) => (
                 <DomainScoreCard key={score.id} score={score} />
             ))}
         </div>

         {domainScores.length > 0 && <KamiChart domainScores={domainScores} />}
      </div>
    </AdminLayout>
  );
}
