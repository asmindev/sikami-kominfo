import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { EmployeeForm } from './components/employee-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EmployeeCreatePage() {
    return (
        <AdminLayout>
            <Head title="Tambah Pegawai" />
            <div className="space-y-6 max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Tambah Pegawai Baru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <EmployeeForm />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
