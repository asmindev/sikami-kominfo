<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $adminPermissions = [
            'dashboard.view',
            'user.view',
            'user.create',
            'user.edit',
            'user.delete',
            'position.view',
            'position.create',
            'position.edit',
            'position.delete',
            'question.view',
            'question.create',
            'question.edit',
            'question.delete',
            'questionnaire.fill',
            'questionnaire-result.view',
            'ahp-pairwise.view',
            'ahp-pairwise.create',
            'ahp-result.view',
            'kami-index.view',
            'kami-index.calculate',
            'report.view',
            'report.export',
        ];

        $leaderPermissions = [
            'questionnaire.fill',
            'questionnaire-result.view',
        ];

        foreach ([...$adminPermissions, ...$leaderPermissions] as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $leaderRole = Role::firstOrCreate(['name' => 'leader']);
        $employeeRole = Role::firstOrCreate(['name' => 'employee']);

        $adminRole->syncPermissions($adminPermissions);
        $leaderRole->syncPermissions($leaderPermissions);
        $employeeRole->syncPermissions([]);
    }
}
