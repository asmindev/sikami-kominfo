import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { route } from 'ziggy-js';
import type { PageProps, Question, AhpDomain } from '@/types';
import React from 'react';

interface Props extends PageProps {
    question?: Question;
    isEdit?: boolean;
}

const DOMAINS: { value: AhpDomain; label: string }[] = [
    { value: 'governance', label: 'Tata Kelola' },
    { value: 'risk_management', label: 'Manajemen Risiko' },
    { value: 'framework', label: 'Kerangka Kerja' },
    { value: 'asset_management', label: 'Manajemen Aset' },
    { value: 'technology', label: 'Teknologi' },
];

export default function QuestionCreatePage({ question, isEdit = false }: Props) {
    const { data, setData, post, put, errors, processing } = useForm({
        domain: question?.domain || 'governance',
        indicator: question?.indicator || '',
        question_text: question?.question_text || '',
        order: question?.order || 1,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && question) {
            put(route('question.update', { question: question.id }));
        } else {
            post(route('question.store'));
        }
    };

    return (
        <AppLayout>
            <Head title={isEdit ? 'Edit Pertanyaan' : 'Tambah Pertanyaan'} />
            <div className="space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEdit ? 'Edit Pertanyaan KAMI' : 'Tambah Pertanyaan KAMI'}
                    </h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Formulir Pertanyaan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="domain">Domain KAMI</Label>
                                <Select
                                    value={data.domain}
                                    onValueChange={(val: AhpDomain) => setData('domain', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Domain" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DOMAINS.map(d => (
                                            <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.domain && <p className="text-sm text-destructive">{errors.domain}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="indicator">Indikator</Label>
                                <Input
                                    id="indicator"
                                    value={data.indicator}
                                    onChange={e => setData('indicator', e.target.value)}
                                    placeholder="Contoh: Keterlibatan pimpinan..."
                                />
                                {errors.indicator && <p className="text-sm text-destructive">{errors.indicator}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="question_text">Teks Pertanyaan</Label>
                                <Textarea
                                    id="question_text"
                                    value={data.question_text}
                                    onChange={e => setData('question_text', e.target.value)}
                                    placeholder="Tuliskan pertanyaan di sini..."
                                    rows={4}
                                />
                                {errors.question_text && <p className="text-sm text-destructive">{errors.question_text}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="order">Urutan (Opsional)</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    min="1"
                                    value={data.order}
                                    onChange={e => setData('order', parseInt(e.target.value))}
                                />
                                {errors.order && <p className="text-sm text-destructive">{errors.order}</p>}
                            </div>

                            <div className="flex items-center justify-end gap-4 mt-6">
                                <Button type="button" variant="outline" asChild>
                                    <Link href={route('question.index')}>Batal</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
