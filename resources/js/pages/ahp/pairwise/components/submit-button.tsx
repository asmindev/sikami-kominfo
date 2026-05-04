import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
    processing: boolean;
}

export function SubmitButton({ processing }: SubmitButtonProps) {
    return (
        <div className="flex justify-end pt-2">
            <Button type="submit" disabled={processing} size="sm" className="gap-1 text-xs sm:text-sm">
                {processing ? (
                    <>
                        <span className="animate-spin text-base">⏳</span>
                        Menyimpan...
                    </>
                ) : (
                    'Simpan & Hitung Bobot'
                )}
            </Button>
        </div>
    );
}
