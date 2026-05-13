import { Can } from '@/components/can';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/admin-layout';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { route } from 'ziggy-js';
import { UserTable } from './components/user-table';

export default function UserIndexPage({ users }: { users: any }) {
    return (
        <AppLayout>
            <Head title="Data Pengguna" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Data Pengguna</h1>
                        <p className="text-muted-foreground">Kelola data pengguna sistem SIKAMI-AHP</p>
                    </div>
                    <Can permission="user.create">
                        <Link href={route('user.create')}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Pengguna
                            </Button>
                        </Link>
                    </Can>
                </div>

                <UserTable users={users} />
            </div>
        </AppLayout>
    );
}
