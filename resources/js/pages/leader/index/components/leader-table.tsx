import { Can } from '@/components/can';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface User {
    id: number;
    name: string;
    email: string;
}

export function LeaderTable({ leaders }: { leaders: User[] }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus pimpinan ini?')) {
            destroy(route('leader.destroy', { leader: id }));
        }
    };

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leaders.map((leader) => (
                        <TableRow key={leader.id}>
                            <TableCell className="font-medium">{leader.name}</TableCell>
                            <TableCell>{leader.email}</TableCell>
                            <TableCell className="space-x-2 text-right">
                                <Can permission="leader.edit">
                                    <Link href={route('leader.edit', { leader: leader.id })}>
                                        <Button variant="outline" size="sm">
                                            Edit
                                        </Button>
                                    </Link>
                                </Can>
                                <Can permission="leader.delete">
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(leader.id)}>
                                        Hapus
                                    </Button>
                                </Can>
                            </TableCell>
                        </TableRow>
                    ))}
                    {leaders.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} className="py-6 text-center text-muted-foreground">
                                Belum ada data pimpinan.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
