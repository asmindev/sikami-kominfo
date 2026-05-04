import { getDomainShort } from './utils';

export function getTooltipText(i: number, j: number, rowCode: string, colCode: string): string {
    if (i === j) {
        return 'Setiap domain memiliki tingkat kepentingan yang sama dengan dirinya sendiri (nilai = 1)';
    }
    if (i > j) {
        return `Nilai ini dihitung otomatis sebagai kebalikan dari perbandingan ${getDomainShort(colCode)} dengan ${getDomainShort(rowCode)}. Tidak dapat diubah.`;
    }
    // Upper triangle (editable)
    return `Bandingkan ${getDomainShort(rowCode)} dengan ${getDomainShort(colCode)}. Pilih angka yang menunjukkan seberapa penting ${getDomainShort(rowCode)} dibanding ${getDomainShort(colCode)}.`;
}
