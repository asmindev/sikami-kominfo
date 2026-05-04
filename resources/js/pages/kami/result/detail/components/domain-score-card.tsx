import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Note: domainLabels is a mapping utility, could be shared
const domainLabels: Record<string, string> = {
  governance: 'Tata Kelola',
  risk_management: 'Manajemen Risiko',
  framework: 'Kerangka Kerja',
  asset_management: 'Pengelolaan Aset',
  technology: 'Teknologi Informasi',
};

interface DomainScore {
  id: number;
  domain_name: string;
  domain_score: number;
  ahp_weight: number;
  final_score: number;
  created_at: string;
}

export function DomainScoreCard({ score }: { score: DomainScore }) {
  const final = Number(score.final_score).toFixed(2);
  const raw = Number(score.domain_score).toFixed(2);
  const weightPercent = (Number(score.ahp_weight) * 100).toFixed(1);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-muted-foreground truncate" title={domainLabels[score.domain_name]}>
          {domainLabels[score.domain_name] || score.domain_name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-mono">{final}</div>
        <div className="flex justify-between items-center text-xs text-muted-foreground mt-4 border-t pt-2">
           <div>Bobot: <span className="font-semibold">{weightPercent}%</span></div>
           <div>Asli: <span className="font-semibold">{raw}</span></div>
        </div>
      </CardContent>
    </Card>
  );
}
