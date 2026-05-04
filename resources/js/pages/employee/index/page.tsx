import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '@/layouts/admin-layout';
import { EmployeeTable } from './components/employee-table';
import { Button } from '@/components/ui/button';
import type { Employee, PageProps } from '@/types';

interface Props extends PageProps {
    employees: {
        data: Employee[];
        links: Record<string, string>;
        meta: Record<string, number>;
    };
}

export default function EmployeeIndexPage({ employees }: Props) {
    return (
        <AdminLayout>
            <Head title="Data Pegawai" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Data Pegawai</h1>
                    <Link href={route('employee.create')}>
                        <Button>Tambah Pegawai</Button>
                    </Link>
                </div>
                <EmployeeTable employees={employees.data} />
            </div>
        </AdminLayout>
    );
}
