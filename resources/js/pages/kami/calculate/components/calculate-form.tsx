import { Can } from '@/components/can';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { User } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { AlertTriangle, Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

interface Props {
    leaders: User[];
    ahpReady: boolean;
}

export function CalculateForm({ leaders, ahpReady }: Props) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        system_type: 'tinggi',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('kami.process'));
    };

    const selectedLeader = leaders.find((l) => l.id.toString() === data.user_id);

    return (
        <div className="mx-auto max-w-xl space-y-4">
            {!ahpReady && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="space-y-1">
                        <p>Bobot AHP belum tersedia. Selesaikan matriks perbandingan AHP dan pastikan nilai CR ≤ 0.1 sebelum melakukan kalkulasi.</p>
                        <Link href={route('ahp.pairwise')} className="font-medium underline underline-offset-2">
                            Buka Matriks AHP →
                        </Link>
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Hitung Indeks KAMI</CardTitle>
                    <CardDescription>Pilih pimpinan yang telah mensubmit kuesioner dan tentukan kategori sistem elektronik.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Can
                            permission="kami-index.calculate"
                            fallback={<p className="text-sm text-muted-foreground">Anda tidak memiliki akses untuk melakukan kalkulasi.</p>}
                        >
                            {/* Pilih Pimpinan */}
                            <div className="space-y-2">
                                <Label>Pimpinan (Kuesioner Selesai)</Label>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={open}
                                            disabled={!ahpReady}
                                            className="w-full justify-between font-normal"
                                        >
                                            {selectedLeader ? selectedLeader.name : 'Pilih Pimpinan...'}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                        <Command>
                                            <CommandInput placeholder="Cari nama pimpinan..." />
                                            <CommandList>
                                                <CommandEmpty>Pimpinan tidak ditemukan.</CommandEmpty>
                                                <CommandGroup>
                                                    {leaders.map((leader) => (
                                                        <CommandItem
                                                            key={leader.id}
                                                            value={leader.name}
                                                            onSelect={() => {
                                                                setData('user_id', leader.id.toString());
                                                                setOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    'mr-2 h-4 w-4',
                                                                    data.user_id === leader.id.toString() ? 'opacity-100' : 'opacity-0',
                                                                )}
                                                            />
                                                            {leader.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                {errors.user_id && <p className="text-sm text-red-600">{errors.user_id}</p>}
                            </div>

                            {/* Kategori Sistem Elektronik */}
                            <div className="space-y-2">
                                <Label>Kategori Sistem Elektronik</Label>
                                <Select value={data.system_type} onValueChange={(val) => setData('system_type', val)} disabled={!ahpReady}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Kategori Sistem" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tinggi">Tinggi (Skor SE: 16–34)</SelectItem>
                                        <SelectItem value="rendah">Rendah (Skor SE: 10–15)</SelectItem>
                                        <SelectItem value="strategis">Strategis (Skor SE: 35–50)</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.system_type && <p className="text-sm text-red-600">{errors.system_type}</p>}
                            </div>

                            <Button type="submit" disabled={processing || !data.user_id || !ahpReady} className="w-full">
                                {processing ? 'Memproses...' : 'Mulai Perhitungan KAMI & AHP'}
                            </Button>
                        </Can>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
