import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { route } from 'ziggy-js';
import type { Employee, PageProps } from '@/types';
import { Badge } from '@/components/ui/badge';

interface Props extends PageProps {
    employee: Employee;
    recentQuestionnaires: any[];
}

export default function EmployeeShowPage({ employee, recentQuestionnaires }: Props) {
    return (
        <AdminLayout>
            <Head title={`Detail Pegawai - ${employee.user.name}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">Detail Pegawai</h1>
                        <p className="text-muted-foreground text-sm">
                            Informasi lengkap tentang pegawai dan riwayat penilaian KAMI
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route('employee.index')}>Kembali</Link>
                        </Button>
                        <Button asChild>
                            <Link href={route('employee.edit', { employee: employee.id })}>
                                Edit Data
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profil Pengguna</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="font-semibold text-sm text-muted-foreground">Nama</div>
                                <div className="col-span-2">{employee.user.name}</div>

                                <div className="font-semibold text-sm text-muted-foreground">Email</div>
                                <div className="col-span-2">{employee.user.email}</div>

                                <div className="font-semibold text-sm text-muted-foreground">NIP</div>
                                <div className="col-span-2">{employee.nip}</div>

                                <div className="font-semibold text-sm text-muted-foreground">Jabatan</div>
                                <div className="col-span-2">{employee.position}</div>

                                <div className="font-semibold text-sm text-muted-foreground">Bergabung</div>
                                <div className="col-span-2">
                                    {new Date(employee.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Status Kuesioner</CardTitle>
                            <CardDescription>Riwayat pengisian kuesioner Indeks KAMI</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentQuestionnaires.length > 0 ? (
                                <div className="space-y-4">
                                    {recentQuestionnaires.map((q) => (
                                        <div key={q.id} className="flex justify-between items-center p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">
                                                    {q.submitted_at
                                                        ? `Selesai: ${new Date(q.submitted_at).toLocaleDateString('id-ID')}`
                                                        : 'Belum Selesai'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Mulai: {new Date(q.created_at).toLocaleDateString('id-ID')}
                                                </p>
                                            </div>
                                            <Badge variant={q.submitted_at ? 'default' : 'secondary'}>
                                                {q.submitted_at ? 'Selesai' : 'Draft'}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-muted-foreground">
                                    Belum ada kuesioner yang dibuat untuk pegawai ini.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
