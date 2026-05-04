import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';
import { LeaderForm } from './components/leader-form';

export default function LeaderCreatePage() {
    return (
        <AdminLayout>
            <Head title="Tambah Pimpinan" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">Tambah Pimpinan</h1>
                </div>
                <LeaderForm />
            </div>
        </AdminLayout>
    );
}
