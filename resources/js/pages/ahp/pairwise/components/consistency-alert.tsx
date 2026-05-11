import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BadgeAlert, BadgeCheck } from 'lucide-react';

interface ConsistencyAlertProps {
    isConsistent: boolean;
    cr: number | string;
}

export function ConsistencyAlert({ isConsistent, cr }: ConsistencyAlertProps) {
    const crValue = typeof cr === 'string' ? parseFloat(cr) : cr;

    if (isConsistent) {
        return (
            <Alert className="border-green-200 bg-green-50 text-green-900 dark:border-green-700 dark:bg-green-800/30">
                <BadgeCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="flex items-center gap-2 font-semibold text-green-800 dark:text-green-50">
                    Konsisten (CR = {crValue.toFixed(3)})
                </AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-300">
                    Nilai rasio konsistensi &le; 0.1. Matriks perbandingan dapat diterima dan bobot dapat digunakan.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-900 dark:border-red-700 dark:bg-red-800/30">
            <BadgeAlert className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertTitle className="flex items-center gap-2 font-semibold text-red-800 dark:text-red-50">
                Tidak Konsisten (CR = {crValue.toFixed(3)})
            </AlertTitle>
            <AlertDescription className="text-red-700 dark:text-red-300">
                Nilai rasio konsistensi &gt; 0.1. Matriks perbandingan tidak konsisten, harap perbaiki nilai perbandingan.
            </AlertDescription>
        </Alert>
    );
}
