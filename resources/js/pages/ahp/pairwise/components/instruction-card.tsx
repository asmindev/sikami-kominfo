import { Card, CardContent } from '@/components/ui/card';

export function InstructionCard() {
    return (
        <Card className="border bg-muted/30">
            <CardContent className="pt-4">
                <p className="text-xs leading-relaxed text-foreground sm:text-sm">
                    <span className="font-semibold">Cara mengisi:</span> Untuk setiap baris, bandingkan domain tersebut dengan domain di kolom. Pilih
                    angka yang menunjukkan seberapa penting domain baris dibanding kolom.
                </p>
                <p className="mt-2 text-xs text-muted-foreground italic sm:text-sm">
                    Contoh: Jika Anda memilih <span className="font-semibold">3</span> untuk persilangan Tata Kelola & Pengelolaan Risiko, artinya
                    Tata Kelola sedikit lebih penting dari Pengelolaan Risiko.
                </p>
            </CardContent>
        </Card>
    );
}
