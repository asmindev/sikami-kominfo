import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeAlert, BadgeCheck } from 'lucide-react';

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
                <CardDescription>Validasi kualitas nilai perbandingan yang dimasukkan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="space-y-1 rounded-lg bg-muted p-3">
                        <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Lambda Max</div>
                        <div className="font-mono text-xl font-bold">{lambdaMax.toFixed(3)}</div>
                    </div>
                    <div className="space-y-1 rounded-lg bg-muted p-3">
                        <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">CI</div>
                        <div className="font-mono text-xl font-bold">{ci.toFixed(3)}</div>
                    </div>
                </div>

                <div className="space-y-2 border-t pt-2 text-center">
                    <div className="text-sm font-medium text-muted-foreground">Consistency Ratio (CR)</div>
                    <div className="font-mono text-3xl font-extrabold tracking-tight">{cr.toFixed(3)}</div>
                </div>

                {isConsistent ? (
                    <Alert className="mt-4 border-green-200 bg-green-50 text-green-900 dark:border-green-800/50 dark:bg-green-900/50 dark:text-green-300">
                        <BadgeCheck className="left-3 h-5 w-5 text-green-600" />
                        <AlertTitle className="ml-1.5 items-center text-sm leading-5 font-bold text-green-800 dark:text-green-300">
                            Matriks Konsisten
                        </AlertTitle>
                        <AlertDescription className="mt-1 ml-1.5 text-xs text-green-700">Bobot AHP dapat dipercaya (CR &le; 0.1).</AlertDescription>
                    </Alert>
                ) : (
                    <Alert className="mt-4 border-red-200 bg-red-50 text-red-900 dark:border-red-800/50 dark:bg-red-900/50 dark:text-red-300">
                        <BadgeAlert className="left-3 h-5 w-5 text-red-600" />
                        <AlertTitle className="ml-1.5 items-center text-sm leading-5 font-bold text-red-800 dark:text-red-300">
                            Matriks Tidak Konsisten
                        </AlertTitle>
                        <AlertDescription className="mt-1 ml-1.5 text-xs text-red-700">
                            Mohon revisi perbandingan kriteria Anda, nilai rasio harus (CR &le; 0.1).
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
