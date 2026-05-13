import { Can } from '@/components/can';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';

export function UserTable({ users }: { users: any }) {
    const handleDelete = (userId: number, userName: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus pengguna "${userName}"? Tindakan ini tidak dapat dibatalkan.`)) {
            router.delete(route('user.destroy', userId));
        }
    };

    return (
        <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>NIP</TableHead>
                        <TableHead>Jabatan</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.data && users.data.length > 0 ? (
                        users.data.map((user: any) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.nip || '-'}</TableCell>
                                <TableCell>{user.position?.name || '-'}</TableCell>
                                <TableCell>
                                    <span className="inline-block rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary capitalize">
                                        {user.roles?.[0]?.name || '-'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Can permission="user.edit">
                                            <Link href={route('user.edit', user.id)}>
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </Can>
                                        <Can permission="user.delete">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(user.id, user.name)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </Can>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                                Tidak ada data pengguna
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
