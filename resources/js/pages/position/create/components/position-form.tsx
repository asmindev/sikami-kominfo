import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form } from '@inertiajs/react';
import { route } from 'ziggy-js';

export function PositionForm({
    method = 'POST',
    action,
    position,
    onSubmit,
}: {
    method?: string;
    action: string;
    position?: any;
    onSubmit?: () => void;
}) {
    return (
        <Form method={method} action={action} onSubmit={onSubmit}>
            <div className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">Nama Jabatan</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="Contoh: Kepala Dinas, Kepala Bidang, Staf"
                        defaultValue={position?.name}
                        required
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi</Label>
                    <Textarea
                        id="description"
                        name="description"
                        placeholder="Deskripsi jabatan (opsional)"
                        defaultValue={position?.description}
                        rows={4}
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <Button type="submit">
                        {position ? 'Perbarui Jabatan' : 'Tambah Jabatan'}
                    </Button>
                </div>
            </div>
        </Form>
    );
}
