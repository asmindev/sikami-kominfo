import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const domainLabels: Record<string, string> = {
  governance: 'Tata Kelola',
  risk_management: 'Risiko',
  framework: 'Kerangka Kerja',
  asset_management: 'Aset',
  technology: 'Teknologi',
};

interface KamiChartProps {
  domainScores: any[];
}

export function KamiChart({ domainScores }: KamiChartProps) {
  const chartData = domainScores.map(score => ({
    name: domainLabels[score.domain_name] || score.domain_name,
    'Skor Bobot (Final)': parseFloat(score.final_score).toFixed(2),
    'Skor Mentah': parseFloat(score.domain_score).toFixed(2),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribusi Skor Domain</CardTitle>
        <CardDescription>Perbandingan nilai perolehan berdasarkan skala KAMI.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Skor Bobot (Final)" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={60} />
              <Bar dataKey="Skor Mentah" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
