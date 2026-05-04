import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface AdminLayoutProps {
    children: React.ReactNode;
    header?: React.ReactNode;
}

export default function AdminLayout({ children, header }: AdminLayoutProps) {
    const { props } = usePage<PageProps>();

    useEffect(() => {
        const flash = props?.flash || { type: 'message', content: '' };
        console.log(flash);

        if (flash.content) {
            toast[flash.type ?? 'message'](flash.content);
        }
    }, [props.flash]);
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex min-w-0 flex-col">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <h1 className="font-black">SIKAMI</h1>
                    {header && <div className="ml-auto">{header}</div>}
                </header>

                <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-auto p-4 pt-0">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
