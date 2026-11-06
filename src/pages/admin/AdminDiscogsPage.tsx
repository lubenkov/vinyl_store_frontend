import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, ExternalLink, Search } from 'lucide-react';
import { api } from '@/lib/api';
import { useI18n } from '@/context/I18nContext';
import { useToast } from '@/context/ToastContext';
import { VinylCover } from '@/components/VinylCover';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Form';
import { EmptyState, ErrorState, Spinner } from '@/components/ui/States';

export function AdminDiscogsPage() {
    const { t, formatPrice } = useI18n();
    const { notify } = useToast();
    const queryClient = useQueryClient();

    const [input, setInput] = useState('');
    const [releaseId, setReleaseId] = useState<number | null>(null);
    const [inputError, setInputError] = useState<string | null>(null);

    const preview = useQuery({
        queryKey: ['discogs', releaseId],
        queryFn: ({ signal }) => api.discogs.scores(releaseId as number, signal),
        enabled: releaseId !== null,
        retry: false,
    });

    const importVinyl = useMutation({
        mutationFn: api.discogs.import,
        onSuccess: (vinyl) => {
            notify(t('adminDiscogs.imported', { name: vinyl.name }), 'success');
            void queryClient.invalidateQueries({ queryKey: ['vinyls'] });
        },
        onError: (error) => notify(error.message, 'error'),
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const id = Number(input.trim());
        if (!Number.isInteger(id) || id <= 0) {
            setInputError(t('adminDiscogs.invalidId'));
            return;
        }
        setInputError(null);
        setReleaseId(id);
    };

    return (
        <section className="space-y-6">
            <div>
                <h2 className="section-title">{t('adminDiscogs.title')}</h2>
                <p className="mt-1 max-w-2xl text-sm text-muted">
                    {t('adminDiscogs.description')}
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 rounded-2xl border border-ink-700 bg-ink-900/60 p-4 sm:flex-row sm:items-end"
            >
                <Field
                    label={t('adminDiscogs.idLabel')}
                    htmlFor="discogs-id"
                    error={inputError ?? undefined}
                    className="flex-1"
                >
                    <Input
                        id="discogs-id"
                        inputMode="numeric"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder={t('adminDiscogs.idPlaceholder')}
                    />
                </Field>
                <Button type="submit" loading={preview.isFetching}>
                    <Search className="h-4 w-4" />
                    {t('adminDiscogs.find')}
                </Button>
            </form>

            <div className="rounded-xl border border-ink-800 bg-ink-850/50 px-4 py-3 text-xs leading-relaxed text-muted">
                {t('adminDiscogs.credentialsPrefix')}{' '}
                <code className="text-cream/80">DISCOGS_KEY</code>{' '}
                {t('adminDiscogs.and')}{' '}
                <code className="text-cream/80">DISCOGS_SECRET</code>
                {t('adminDiscogs.credentialsSuffix')}
            </div>

            {releaseId === null ? (
                <EmptyState
                    title={t('adminDiscogs.enterIdTitle')}
                    description={t('adminDiscogs.enterIdDescription')}
                />
            ) : preview.isLoading ? (
                <Spinner />
            ) : preview.isError ? (
                <ErrorState
                    message={
                        preview.error instanceof Error
                            ? preview.error.message
                            : t('adminDiscogs.fetchError')
                    }
                    onRetry={() => void preview.refetch()}
                />
            ) : preview.data ? (
                <article className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/60">
                    <div className="grid gap-6 p-5 sm:grid-cols-[200px_1fr]">
                        <VinylCover vinyl={preview.data} />
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge tone="brass">Discogs #{releaseId}</Badge>
                                {preview.data.score !== undefined && (
                                    <Badge tone="neutral">
                                        {t('adminDiscogs.rating')}{' '}
                                        {typeof preview.data.score === 'number'
                                            ? preview.data.score.toFixed(2)
                                            : preview.data.score}
                                    </Badge>
                                )}
                            </div>
                            <h3 className="mt-3 font-display text-2xl text-cream">
                                {preview.data.name}
                            </h3>
                            <p className="mt-1 text-sm text-muted">{preview.data.author}</p>
                            <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-cream/80">
                                {preview.data.description}
                            </p>
                            <p className="mt-4 font-display text-2xl text-brass-400">
                                {formatPrice(preview.data.price)}
                            </p>

                            <div className="mt-5 flex flex-wrap gap-3">
                                <Button
                                    loading={importVinyl.isPending}
                                    onClick={() => importVinyl.mutate(releaseId)}
                                >
                                    <Download className="h-4 w-4" />
                                    {t('adminDiscogs.import')}
                                </Button>
                                <a
                                    href={`https://www.discogs.com/release/${releaseId}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-ink-600 px-4 text-sm text-cream transition hover:border-brass-500/60"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    {t('adminDiscogs.open')}
                                </a>
                            </div>
                            <p className="mt-3 text-xs text-muted">
                                {t('adminDiscogs.priceNote')}
                            </p>
                        </div>
                    </div>
                </article>
            ) : null}
        </section>
    );
}
