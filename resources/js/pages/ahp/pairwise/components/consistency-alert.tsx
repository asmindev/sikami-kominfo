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
            <Alert className="border-green-200 bg-green-50 text-green-900">
                <BadgeCheck className="h-4 w-4 text-green-600" />
                <AlertTitle className="flex items-center gap-2 font-semibold text-green-800">Konsisten (CR = {crValue.toFixed(3)})</AlertTitle>
                <AlertDescription className="text-green-700">
                    Nilai rasio konsistensi &le; 0.1. Matriks perbandingan dapat diterima dan bobot dapat digunakan.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-900">
            <BadgeAlert className="h-4 w-4 text-red-600" />
            <AlertTitle className="flex items-center gap-2 font-semibold text-red-800">Tidak Konsisten (CR = {crValue.toFixed(3)})</AlertTitle>
            <AlertDescription className="text-red-700">
                Nilai rasio konsistensi &gt; 0.1. Matriks perbandingan tidak konsisten, harap perbaiki nilai perbandingan.
            </AlertDescription>
        </Alert>
    );
}
