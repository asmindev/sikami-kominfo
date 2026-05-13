import { Can } from '@/components/can';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link, router } from '@inertiajs/react';
import { Edit, Trash2, Users } from 'lucide-react';
import { route } from 'ziggy-js';

export function PositionTable({ positions }: { positions: any }) {
    const handleDelete = (positionId: number, positionName: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus jabatan "${positionName}"? Tindakan ini tidak dapat dibatalkan.`)) {
            router.delete(route('position.destroy', positionId));
        }
    };

    return (
        <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama Jabatan</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead className="text-center">Jumlah Pengguna</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {positions.data && positions.data.length > 0 ? (
                        positions.data.map((position: any) => (
                            <TableRow key={position.id}>
                                <TableCell className="font-medium">{position.name}</TableCell>
                                <TableCell className="max-w-xs truncate text-sm text-muted-foreground">{position.description || '-'}</TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-sm">
                                        <Users className="h-4 w-4" />
                                        {position.users_count || 0}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Can permission="position.edit">
                                            <Link href={route('position.edit', position.id)}>
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </Can>
                                        <Can permission="position.delete">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(position.id, position.name)}
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
                            <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                                Tidak ada data jabatan
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
