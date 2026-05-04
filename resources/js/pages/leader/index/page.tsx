import { Can } from '@/components/can';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { LeaderTable } from './components/leader-table';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props extends PageProps {
    leaders: {
        data: User[];
        links: Record<string, string>;
        meta: Record<string, number>;
    };
}

export default function LeaderIndexPage({ leaders }: Props) {
    return (
        <AdminLayout>
            <Head title="Data Pimpinan" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Data Pimpinan</h1>
                    <Can permission="leader.create">
                        <Link href={route('leader.create')}>
                            <Button>Tambah Pimpinan</Button>
                        </Link>
                    </Can>
                </div>
                <LeaderTable leaders={leaders.data} />
            </div>
        </AdminLayout>
    );
}
