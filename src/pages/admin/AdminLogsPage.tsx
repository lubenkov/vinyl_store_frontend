import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw, Search } from 'lucide-react';
import { api } from '@/lib/api';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Form';
import { EmptyState, ErrorState, Spinner } from '@/components/ui/States';

export function AdminLogsPage() {
    const { t, formatDateTime } = useI18n();
    const [filter, setFilter] = useState('');
    const query = useQuery({
        queryKey: ['logs'],
        queryFn: ({ signal }) => api.logs.list(signal),
    });

    const logs = useMemo(() => {
        const rows = query.data ?? [];
        const needle = filter.trim().toLowerCase();
        if (!needle) return rows;
        return rows.filter((entry) => entry.action.toLowerCase().includes(needle));
    }, [query.data, filter]);

    return (
        <section className="space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 className="section-title">{t('adminLogs.title')}</h2>
                    <p className="mt-1 text-sm text-muted">
                        {t('adminLogs.description')}
                    </p>
                </div>
                <Button
                    variant="secondary"
                    onClick={() => void query.refetch()}
                    loading={query.isFetching}
                >
                    <RefreshCw className="h-4 w-4" />
                    {t('adminLogs.refresh')}
                </Button>
            </div>

            <div className="relative max-w-md">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                    placeholder={t('adminLogs.filterPlaceholder')}
                    className="pl-10"
                    aria-label={t('adminLogs.filterAria')}
                />
            </div>

            {query.isLoading ? (
                <Spinner />
            ) : query.isError ? (
                <ErrorState
                    message={query.error instanceof Error ? query.error.message : t('common.loadError')}
                    onRetry={() => void query.refetch()}
                />
            ) : logs.length === 0 ? (
                <EmptyState
                    title={filter ? t('adminLogs.noMatches') : t('adminLogs.empty')}
                    description={
                        filter
                            ? t('adminLogs.tryAnother')
                            : t('adminLogs.emptyDescription')
                    }
                />
            ) : (
                <div className="table-shell">
                    <table>
                        <thead>
                            <tr>
                                <th className="w-16">#</th>
                                <th className="w-44">{t('adminLogs.time')}</th>
                                <th>{t('adminLogs.action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((entry) => (
                                <tr key={entry.id}>
                                    <td className="font-mono text-xs text-muted">{entry.id}</td>
                                    <td className="whitespace-nowrap text-xs text-muted">
                                        {formatDateTime(entry.timestamp)}
                                    </td>
                                    <td className="text-sm text-cream/85">
                                        <span className="line-clamp-3 break-words" title={entry.action}>
                                            {entry.action}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {query.data && (
                <p className="text-xs text-muted">
                    {t('adminLogs.shown', {
                        shown: logs.length,
                        total: query.data.length,
                    })}
                </p>
            )}
        </section>
    );
}
