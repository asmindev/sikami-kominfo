import { Link, usePage } from '@inertiajs/react';
import { Calculator, FileText, LayoutDashboard, Shield } from 'lucide-react';
import * as React from 'react';
import { route } from 'ziggy-js';

import { Can } from '@/components/can';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import { usePermission } from '@/hooks/use-permission';
import type { Permission } from '@/lib/permissions';
import type { PageProps } from '@/types';
import { NavUser } from './nav-user';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { props: pageProps, url } = usePage<PageProps>();
    const { auth } = pageProps;
    const { can } = usePermission();

    const dashboardItem = {
        title: 'Dashboard',
        url: route('dashboard'),
        icon: LayoutDashboard,
        isActive: url.startsWith('/dashboard'),
        permission: 'dashboard.view' as Permission,
    };

    // Define all nav items with their permissions
    const dataManagementItems = [
        {
            title: 'Data Pimpinan',
            url: route('leader.index'),
            isActive: url.startsWith('/leader'),
            permission: 'leader.view' as Permission,
        },
        {
            title: 'Data Pertanyaan',
            url: route('question.index'),
            isActive: url.startsWith('/question'),
            permission: 'question.view' as Permission,
        },
    ];

    const ahpItems = [
        {
            title: 'Matriks Perbandingan',
            url: route('ahp.pairwise'),
            isActive: url.startsWith('/ahp/pairwise'),
            permission: 'ahp-pairwise.view' as Permission,
        },
        {
            title: 'Hasil Bobot',
            url: route('ahp.result'),
            isActive: url.startsWith('/ahp/result'),
            permission: 'ahp-result.view' as Permission,
        },
    ];

    const kamiItems = [
        {
            title: 'Kalkulasi Evaluasi',
            url: route('kami.calculate'),
            isActive: url.startsWith('/kami/calculate'),
            permission: 'kami-index.calculate' as Permission,
        },
        {
            title: 'Data Rapor',
            url: route('kami.result'),
            isActive: url.startsWith('/kami/result'),
            permission: 'kami-index.view' as Permission,
        },
    ];

    const reportItems = [
        {
            title: 'Laporan',
            url: route('report.index'),
            isActive: url.startsWith('/report'),
            permission: 'report.view' as Permission,
        },
        {
            title: 'Cetak Dokumen',
            url: route('report.index'),
            isActive: url.startsWith('/report'),
            permission: 'report.export' as Permission,
        },
    ];

    // Check if user has any permission in a group
    const hasAnyPermissionInGroup = (permissions: Permission[]): boolean => {
        return permissions.some((perm) => can(perm));
    };

    return (
        <Sidebar {...props} collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('dashboard')}>
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Shield className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-bold tracking-wide">SIKAMI-AHP</span>
                                    <span className="text-xs">Indeks KAMI 5.0</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <Can permission={dashboardItem.permission}>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={dashboardItem.title} isActive={dashboardItem.isActive}>
                                <Link href={dashboardItem.url} className="font-medium">
                                    {<dashboardItem.icon />}
                                    <span>{dashboardItem.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </Can>
                </SidebarMenu>

                {/* Manajemen Data */}
                <Can permission={dataManagementItems.map((item) => item.permission)}>
                    <SidebarGroup>
                        <SidebarGroupLabel>Manajemen Data</SidebarGroupLabel>
                        <SidebarMenu>
                            {dataManagementItems.map((item) => (
                                <Can key={item.title} permission={item.permission}>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                                            <Link href={item.url} className="font-medium">
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </Can>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </Can>

                {/* Analisis & Evaluasi */}
                <Can permission={[...ahpItems.map((item) => item.permission), ...kamiItems.map((item) => item.permission)]}>
                    <SidebarGroup>
                        <SidebarGroupLabel>Analisis & Evaluasi</SidebarGroupLabel>
                        <SidebarMenu>
                            {/* AHP Section */}
                            <Can permission={ahpItems.map((item) => item.permission)}>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={url.startsWith('/ahp')}>
                                        <div className="cursor-pointer font-medium">
                                            <Calculator className="size-4" />
                                            <span>Metode AHP</span>
                                        </div>
                                    </SidebarMenuButton>
                                    <SidebarMenuSub>
                                        {ahpItems.map((item) => (
                                            <Can key={item.title} permission={item.permission}>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuSubButton asChild isActive={item.isActive}>
                                                        <Link href={item.url}>{item.title}</Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            </Can>
                                        ))}
                                    </SidebarMenuSub>
                                </SidebarMenuItem>
                            </Can>

                            {/* KAMI Section */}
                            <Can permission={kamiItems.map((item) => item.permission)}>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={url.startsWith('/kami')}>
                                        <div className="cursor-pointer font-medium">
                                            <Shield className="size-4" />
                                            <span>Indeks KAMI</span>
                                        </div>
                                    </SidebarMenuButton>
                                    <SidebarMenuSub>
                                        {kamiItems.map((item) => (
                                            <Can key={item.title} permission={item.permission}>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuSubButton asChild isActive={item.isActive}>
                                                        <Link href={item.url}>{item.title}</Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            </Can>
                                        ))}
                                    </SidebarMenuSub>
                                </SidebarMenuItem>
                            </Can>
                        </SidebarMenu>
                    </SidebarGroup>
                </Can>

                {/* Laporan */}
                <Can permission={reportItems.map((item) => item.permission)}>
                    <SidebarGroup>
                        <SidebarGroupLabel>Laporan</SidebarGroupLabel>
                        <SidebarMenu>
                            {reportItems.map((item) => (
                                <Can key={item.title} permission={item.permission}>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                                            <Link href={item.url} className="font-medium">
                                                <FileText className="size-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </Can>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </Can>
            </SidebarContent>
            <SidebarRail />
            <SidebarFooter>
                <NavUser
                    user={{
                        name: auth.user?.name || 'Guest',
                        email: auth.user?.email || '',
                        avatar: '',
                    }}
                />
            </SidebarFooter>
        </Sidebar>
    );
}
