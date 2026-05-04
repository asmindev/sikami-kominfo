import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface AhpResultData {
  criteria: {
    id: number;
    name: string;
    code: string;
  };
  weight: string;
}

export function WeightTable({ results }: { results: AhpResultData[] }) {
  // Sort desc by weight to show priorities
  const sorted = [...results].sort((a, b) => parseFloat(b.weight) - parseFloat(a.weight));

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[80px]">Rank</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead className="text-right">Bobot Prioritas</TableHead>
            <TableHead className="text-right w-[150px]">Persentase</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((item, idx) => {
            const wInfo = parseFloat(item.weight);
            return (
              <TableRow key={item.criteria.id}>
                <TableCell>
                  <Badge variant={idx === 0 ? "default" : "secondary"}>
                    {idx + 1}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {item.criteria.name} <span className="text-muted-foreground font-normal ml-1">({item.criteria.code})</span>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {wInfo.toFixed(5)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {(wInfo * 100).toFixed(2)}%
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
