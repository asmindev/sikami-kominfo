import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

type Props = {
    links: Array<any>;
    className?: string;
};

export default function PaginationNav({ links, className }: Props) {
    if (!links || !links.length) return null;
    // Extract numeric page links
    const numericLinks = links
        .filter((l) => /^[0-9]+$/.test(String(l.label || '')))
        .map((l) => ({
            page: parseInt(String(l.label), 10),
            url: l.url,
            active: !!l.active,
        }));

    const prevLink = links.find((l) => /Previous|«/i.test(String(l.label || '')));
    const nextLink = links.find((l) => /Next|»/i.test(String(l.label || '')));

    let windowLinks = numericLinks;

    if (numericLinks.length > 7) {
        const currentIndex = numericLinks.findIndex((l) => l.active) || 0;
        const currentPage = numericLinks[currentIndex];

        // Always show first 2 pages
        const firstPages = numericLinks.slice(0, 2);

        // Always show last 2 pages
        const lastPages = numericLinks.slice(-2);

        // Center 3 pages around current page
        let start = currentIndex - 1;
        if (start < 0) start = 0;
        if (start > numericLinks.length - 3) start = numericLinks.length - 3;
        const centerPages = numericLinks.slice(start, start + 3);

        // Merge and deduplicate
        const pageSet = new Set<number>();
        const allPages: typeof numericLinks = [];

        for (const p of [...firstPages, ...centerPages, ...lastPages]) {
            if (!pageSet.has(p.page)) {
                pageSet.add(p.page);
                allPages.push(p);
            }
        }

        windowLinks = allPages.sort((a, b) => a.page - b.page);
    }

    return (
        <nav aria-label="Pagination navigation" className={className}>
            <Pagination>
                <PaginationContent>
                    {prevLink?.url && (
                        <PaginationItem key="prev">
                            <PaginationPrevious href={prevLink.url} aria-label="Previous page">
                                <ChevronLeft size={16} />
                            </PaginationPrevious>
                        </PaginationItem>
                    )}

                    {windowLinks[0]?.page > 1 && (
                        <PaginationItem key="ellipsis-start">
                            <PaginationEllipsis>
                                <MoreHorizontal size={16} />
                            </PaginationEllipsis>
                        </PaginationItem>
                    )}

                    {windowLinks.map((l, idx) => (
                        <>
                            {idx > 0 && l.page - windowLinks[idx - 1].page > 1 && (
                                <PaginationItem key={`ellipsis-${idx}`}>
                                    <PaginationEllipsis>
                                        <MoreHorizontal size={16} />
                                    </PaginationEllipsis>
                                </PaginationItem>
                            )}
                            <PaginationItem key={l.page}>
                                <PaginationLink href={l.url} isActive={l.active}>
                                    {l.page}
                                </PaginationLink>
                            </PaginationItem>
                        </>
                    ))}

                    {nextLink?.url && (
                        <PaginationItem key="next">
                            <PaginationNext href={nextLink.url} aria-label="Next page">
                                <ChevronRight size={16} />
                            </PaginationNext>
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
        </nav>
    );
}
