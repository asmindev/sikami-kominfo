import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BadgeCheck, BadgeAlert } from 'lucide-react';

interface ConsistencyInfoProps {
  isConsistent: boolean;
  cr: number;
  ci: number;
  lambdaMax: number;
}

export function ConsistencyInfo({ isConsistent, cr, ci, lambdaMax }: ConsistencyInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Indeks Konsistensi</CardTitle>
        <CardDescription>
          Validasi kualitas nilai perbandingan yang dimasukkan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1 p-3 bg-slate-50 rounded-lg">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Lambda Max</div>
            <div className="text-xl font-bold font-mono text-slate-800">{lambdaMax.toFixed(3)}</div>
          </div>
          <div className="space-y-1 p-3 bg-slate-50 rounded-lg">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">CI</div>
            <div className="text-xl font-bold font-mono text-slate-800">{ci.toFixed(3)}</div>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t text-center">
          <div className="text-sm font-medium text-muted-foreground">Consistency Ratio (CR)</div>
          <div className="text-3xl font-extrabold tracking-tight font-mono">{cr.toFixed(3)}</div>
        </div>

        {isConsistent ? (
          <Alert className="bg-green-50 text-green-900 border-green-200 mt-4">
            <BadgeCheck className="h-5 w-5 text-green-600 left-3" />
            <AlertTitle className="text-green-800 text-sm font-bold ml-1.5 leading-5 items-center">
              Matriks Konsisten
            </AlertTitle>
            <AlertDescription className="text-green-700 text-xs ml-1.5 mt-1">
              Bobot AHP dapat dipercaya (CR &le; 0.1).
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-red-50 text-red-900 border-red-200 mt-4">
            <BadgeAlert className="h-5 w-5 text-red-600 left-3" />
            <AlertTitle className="text-red-800 text-sm font-bold ml-1.5 leading-5 items-center">
              Matriks Tidak Konsisten
            </AlertTitle>
            <AlertDescription className="text-red-700 text-xs ml-1.5 mt-1">
              Mohon revisi perbandingan kriteria Anda, nilai rasio harus (CR &le; 0.1).
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
