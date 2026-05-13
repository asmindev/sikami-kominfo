import { Link, usePage } from '@inertiajs/react';
import { Calculator, ChevronRight, ClipboardList, FileText, LayoutDashboard, Shield, Users } from 'lucide-react';
import * as React from 'react';
import { route } from 'ziggy-js';

import { Can } from '@/components/can';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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

    const dataManagementItems = [
        {
            title: 'Data Pengguna',
            url: route().has('user.index') ? route('user.index') : '#',
            icon: Users,
            isActive: url.startsWith('/user'),
            permission: 'user.view' as Permission,
        },
        {
            title: 'Data Jabatan',
            url: route().has('position.index') ? route('position.index') : '#',
            icon: Shield,
            isActive: url.startsWith('/position'),
            permission: 'position.view' as Permission,
        },
        {
            title: 'Data Pertanyaan',
            url: route('question.index'),
            icon: ClipboardList,
            isActive: url.startsWith('/question'),
            permission: 'question.view' as Permission,
        },
        {
            title: 'Isi Kuis',
            url: route('questionnaire.index'),
            icon: FileText,
            isActive: url.startsWith('/questionnaire/fill'),
            permission: 'questionnaire.fill' as Permission,
        },
        {
            title: 'Hasil Kuesioner',
            url: route('questionnaire.result'),
            icon: FileText,
            isActive: url.startsWith('/questionnaire/result'),
            permission: 'questionnaire-result.view' as Permission,
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

    return (
        <Sidebar collapsible="icon" {...props}>
            {/* ── Header ── */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('dashboard')}>
                                <div className="flex aspect-square size-10 items-center justify-center rounded-lg border p-0.5">
                                    <img src="/logo.png" alt="Kominfo Sultra" className="size-full object-cover" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-bold tracking-wide">SIKAMI-AHP</span>
                                    <span className="text-xs">Kominfo Sultra</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* ── Content ── */}
            <SidebarContent>
                {/* Dashboard */}
                <SidebarGroup>
                    <SidebarMenu>
                        <Can permission={dashboardItem.permission}>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip={dashboardItem.title} isActive={dashboardItem.isActive}>
                                    <Link href={dashboardItem.url}>
                                        <dashboardItem.icon />
                                        <span>{dashboardItem.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </Can>
                    </SidebarMenu>
                </SidebarGroup>

                {/* Manajemen Data */}
                <Can permission={dataManagementItems.map((i) => i.permission)}>
                    <SidebarGroup>
                        <SidebarGroupLabel>Manajemen Data</SidebarGroupLabel>
                        <SidebarMenu>
                            {dataManagementItems.map((item) => (
                                <Can key={item.title} permission={item.permission}>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                                            <Link href={item.url}>
                                                <item.icon />
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
                <Can permission={[...ahpItems.map((i) => i.permission), ...kamiItems.map((i) => i.permission)]}>
                    <SidebarGroup>
                        <SidebarGroupLabel>Analisis &amp; Evaluasi</SidebarGroupLabel>
                        <SidebarMenu>
                            {/* AHP — collapsible submenu */}
                            <Can permission={ahpItems.map((i) => i.permission)}>
                                <Collapsible asChild defaultOpen={url.startsWith('/ahp')} className="group/collapsible">
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip="Metode AHP" isActive={url.startsWith('/ahp')}>
                                                <Calculator />
                                                <span>Metode AHP</span>
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {ahpItems.map((item) => (
                                                    <Can key={item.title} permission={item.permission}>
                                                        <SidebarMenuSubItem>
                                                            <SidebarMenuSubButton asChild isActive={item.isActive}>
                                                                <Link href={item.url}>
                                                                    <span>{item.title}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    </Can>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            </Can>

                            {/* KAMI — collapsible submenu */}
                            <Can permission={kamiItems.map((i) => i.permission)}>
                                <Collapsible asChild defaultOpen={url.startsWith('/kami')} className="group/collapsible">
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip="Indeks KAMI" isActive={url.startsWith('/kami')}>
                                                <Shield />
                                                <span>Indeks KAMI</span>
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {kamiItems.map((item) => (
                                                    <Can key={item.title} permission={item.permission}>
                                                        <SidebarMenuSubItem>
                                                            <SidebarMenuSubButton asChild isActive={item.isActive}>
                                                                <Link href={item.url}>
                                                                    <span>{item.title}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    </Can>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            </Can>
                        </SidebarMenu>
                    </SidebarGroup>
                </Can>

                {/* Laporan */}
                <Can permission={reportItems.map((i) => i.permission)}>
                    <SidebarGroup>
                        <SidebarGroupLabel>Laporan</SidebarGroupLabel>
                        <SidebarMenu>
                            {reportItems.map((item) => (
                                <Can key={item.title} permission={item.permission}>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                                            <Link href={item.url}>
                                                <FileText />
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

            {/* ── Footer ── */}
            <SidebarFooter>
                <NavUser
                    user={{
                        name: auth.user?.name ?? 'Guest',
                        email: auth.user?.email ?? '',
                        avatar: '',
                    }}
                />
            </SidebarFooter>
        </Sidebar>
    );
}
