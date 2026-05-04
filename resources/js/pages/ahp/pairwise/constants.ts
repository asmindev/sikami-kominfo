import type { ScaleDescription } from './types';

// Mapping dari kode ke nama lengkap Indonesia
export const DOMAIN_NAMES: Record<string, string> = {
    governance: 'Tata Kelola Keamanan Informasi',
    risk_management: 'Pengelolaan Risiko Keamanan Informasi',
    framework: 'Kerangka Kerja Keamanan Informasi',
    asset_management: 'Pengelolaan Aset Informasi',
    technology: 'Teknologi & Keamanan Informasi',
};

// Singkatan pendek untuk header kolom
export const DOMAIN_SHORTS: Record<string, string> = {
    governance: 'TK',
    risk_management: 'PR',
    framework: 'KK',
    asset_management: 'PA',
    technology: 'TI',
};

// Label deskriptif untuk skala Saaty (1-9)
export const SCALE_LABELS: Record<number, string> = {
    9: '9 — Mutlak lebih penting',
    8: '8 — Nilai antara 7 dan 9',
    7: '7 — Sangat lebih penting',
    6: '6 — Nilai antara 5 dan 7',
    5: '5 — Lebih penting',
    4: '4 — Nilai antara 3 dan 5',
    3: '3 — Sedikit lebih penting',
    2: '2 — Nilai antara 1 dan 3',
    1: '1 — Sama penting',
};

// Skala Saaty dengan deskripsi (hanya 1-9, tanpa nilai kebalikan)
export const SCALE_DESCRIPTIONS: ScaleDescription[] = [
    { value: 9, label: '9', description: 'Mutlak lebih penting', color: 'bg-blue-900' },
    { value: 8, label: '8', description: 'Nilai antara 7 dan 9', color: 'bg-blue-800' },
    { value: 7, label: '7', description: 'Sangat lebih penting', color: 'bg-blue-700' },
    { value: 6, label: '6', description: 'Nilai antara 5 dan 7', color: 'bg-blue-600' },
    { value: 5, label: '5', description: 'Lebih penting', color: 'bg-blue-500' },
    { value: 4, label: '4', description: 'Nilai antara 3 dan 5', color: 'bg-blue-400' },
    { value: 3, label: '3', description: 'Sedikit lebih penting', color: 'bg-blue-300' },
    { value: 2, label: '2', description: 'Nilai antara 1 dan 3', color: 'bg-blue-200' },
    { value: 1, label: '1', description: 'Sama penting', color: 'bg-gray-400' },
];
