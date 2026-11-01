import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, ExternalLink, Search } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/format';
import { VinylCover } from '@/components/VinylCover';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Form';
import { EmptyState, ErrorState, Spinner } from '@/components/ui/States';

export function AdminDiscogsPage() {
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
            notify(`«${vinyl.name}» импортирована в каталог.`, 'success');
            void queryClient.invalidateQueries({ queryKey: ['vinyls'] });
        },
        onError: (error) => notify(error.message, 'error'),
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const id = Number(input.trim());
        if (!Number.isInteger(id) || id <= 0) {
            setInputError('Введите числовой ID релиза Discogs.');
            return;
        }
        setInputError(null);
        setReleaseId(id);
    };

    return (
        <section className="space-y-6">
            <div>
                <h2 className="section-title">Импорт из Discogs</h2>
                <p className="mt-1 max-w-2xl text-sm text-muted">
                    Найдите релиз по ID, проверьте карточку и добавьте его в каталог одним
                    нажатием. Импорт доступен только администратору.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 rounded-2xl border border-ink-700 bg-ink-900/60 p-4 sm:flex-row sm:items-end"
            >
                <Field label="ID релиза Discogs" htmlFor="discogs-id" error={inputError ?? undefined} className="flex-1">
                    <Input
                        id="discogs-id"
                        inputMode="numeric"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder="Например, 249504"
                    />
                </Field>
                <Button type="submit" loading={preview.isFetching}>
                    <Search className="h-4 w-4" />
                    Найти релиз
                </Button>
            </form>

            <div className="rounded-xl border border-ink-800 bg-ink-850/50 px-4 py-3 text-xs leading-relaxed text-muted">
                Для запросов к Discogs на бэкенде должны быть заданы{' '}
                <code className="text-cream/80">DISCOGS_KEY</code> и{' '}
                <code className="text-cream/80">DISCOGS_SECRET</code>. Без них API вернёт
                ошибку.
            </div>

            {releaseId === null ? (
                <EmptyState
                    title="Укажите ID релиза"
                    description="ID виден в адресе страницы релиза на discogs.com: /release/249504-..."
                />
            ) : preview.isLoading ? (
                <Spinner />
            ) : preview.isError ? (
                <ErrorState
                    message={
                        preview.error instanceof Error
                            ? preview.error.message
                            : 'Не удалось получить релиз'
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
                                        Рейтинг:{' '}
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
                                    Импортировать в каталог
                                </Button>
                                <a
                                    href={`https://www.discogs.com/release/${releaseId}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-ink-600 px-4 text-sm text-cream transition hover:border-brass-500/60"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Открыть на Discogs
                                </a>
                            </div>
                            <p className="mt-3 text-xs text-muted">
                                Цена берётся из lowest_price Discogs; если её нет, будет 0.
                                Проверьте цену после импорта.
                            </p>
                        </div>
                    </div>
                </article>
            ) : null}
        </section>
    );
}
