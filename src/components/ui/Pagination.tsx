import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface PaginationProps {
    page: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
    className?: string;
}

function buildPages(current: number, totalPages: number): Array<number | 'ellipsis'> {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    const pages: Array<number | 'ellipsis'> = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(totalPages - 1, current + 1);

    if (start > 2) pages.push('ellipsis');
    for (let page = start; page <= end; page += 1) pages.push(page);
    if (end < totalPages - 1) pages.push('ellipsis');
    pages.push(totalPages);
    return pages;
}

export function Pagination({ page, pageSize, total, onChange, className }: PaginationProps) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    if (totalPages <= 1) return null;

    const pages = buildPages(page, totalPages);

    return (
        <nav className={cn('flex flex-wrap items-center justify-center gap-1.5', className)} aria-label="Пагинация">
            <button
                type="button"
                onClick={() => onChange(page - 1)}
                disabled={page <= 1}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-700 text-muted transition hover:border-brass-500/50 hover:text-cream disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Предыдущая страница"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            {pages.map((item, index) =>
                item === 'ellipsis' ? (
                    <span key={`ellipsis-${index}`} className="px-1 text-muted">
                        …
                    </span>
                ) : (
                    <button
                        key={item}
                        type="button"
                        onClick={() => onChange(item)}
                        aria-current={item === page ? 'page' : undefined}
                        className={cn(
                            'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm transition',
                            item === page
                                ? 'border-brass-500 bg-brass-500 font-semibold text-ink-950'
                                : 'border-ink-700 text-muted hover:border-brass-500/50 hover:text-cream',
                        )}
                    >
                        {item}
                    </button>
                ),
            )}

            <button
                type="button"
                onClick={() => onChange(page + 1)}
                disabled={page >= totalPages}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-700 text-muted transition hover:border-brass-500/50 hover:text-cream disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Следующая страница"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </nav>
    );
}
