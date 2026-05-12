import AppLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { LeaderForm } from './components/leader-form';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props extends PageProps {
    leader: User;
}

export default function LeaderEditPage({ leader }: Props) {
    return (
        <AppLayout>
            <Head title="Edit Pimpinan" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">Edit Pimpinan</h1>
                </div>
                <LeaderForm leader={leader} isEdit />
            </div>
        </AppLayout>
    );
}
