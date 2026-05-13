import { Can } from '@/components/can';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/admin-layout';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { route } from 'ziggy-js';
import { PositionTable } from './components/position-table';

export default function PositionIndexPage({ positions }: { positions: any }) {
    return (
        <AppLayout>
            <Head title="Data Jabatan" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Data Jabatan</h1>
                        <p className="text-muted-foreground">Kelola data jabatan/posisi pengguna</p>
                    </div>
                    <Can permission="position.create">
                        <Link href={route('position.create')}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Jabatan
                            </Button>
                        </Link>
                    </Can>
                </div>

                <PositionTable positions={positions} />
            </div>
        </AppLayout>
    );
}
