import { Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { Employee } from '@/types';

export function EmployeeTable({ employees }: { employees: Employee[] }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data pegawai ini?')) {
            destroy(route('employee.destroy', { employee: id }));
        }
    };

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>NIP</TableHead>
                        <TableHead>Jabatan</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.map((employee) => (
                        <TableRow key={employee.id}>
                            <TableCell className="font-medium">{employee.user?.name}</TableCell>
                            <TableCell>{employee.user?.email}</TableCell>
                            <TableCell>{employee.nip}</TableCell>
                            <TableCell>{employee.position}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Link href={route('employee.show', { employee: employee.id })}>
                                    <Button variant="secondary" size="sm">Detail</Button>
                                </Link>
                                <Link href={route('employee.edit', { employee: employee.id })}>
                                    <Button variant="outline" size="sm">Edit</Button>
                                </Link>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(employee.id)}>
                                    Hapus
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {employees.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                                Belum ada data pegawai.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
