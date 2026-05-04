import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { EmployeeForm } from './components/employee-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Employee, PageProps } from '@/types';

interface Props extends PageProps {
    employee: Employee;
}

export default function EmployeeEditPage({ employee }: Props) {
    return (
        <AdminLayout>
            <Head title={`Edit Pegawai - ${employee.user.name}`} />
            <div className="space-y-6 max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Data Pegawai</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <EmployeeForm employee={employee} isEdit />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
