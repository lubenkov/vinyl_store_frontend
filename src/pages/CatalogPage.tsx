import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Disc3, Search, SlidersHorizontal } from 'lucide-react';
import { api } from '@/lib/api';
import { useDebouncedValue } from '@/lib/useDebouncedValue';
import { pluralize } from '@/lib/format';
import { VinylCard } from '@/components/VinylCard';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Form';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState, ErrorState } from '@/components/ui/States';

const SORT_OPTIONS = [
    { value: 'name', label: 'Название' },
    { value: 'author', label: 'Исполнитель' },
    { value: 'price', label: 'Цена' },
    { value: 'id', label: 'ID' },
];

const PAGE_SIZES = [8, 12, 24, 48];

const SEARCH_OPTIONS = [
    { value: 'name', label: 'По названию' },
    { value: 'author', label: 'По исполнителю' },
];

function CatalogSkeleton() {
    return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/60">
                    <div className="aspect-square animate-pulse bg-ink-800" />
                    <div className="space-y-3 p-4">
                        <div className="h-3 w-1/2 animate-pulse rounded bg-ink-800" />
                        <div className="h-4 w-4/5 animate-pulse rounded bg-ink-800" />
                        <div className="h-4 w-1/3 animate-pulse rounded bg-ink-800" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function CatalogPage() {
    const [params, setParams] = useSearchParams();

    const page = Math.max(1, Number(params.get('page') ?? 1) || 1);
    const requestedLimit = Number(params.get('limit') ?? 12);
    const limit = PAGE_SIZES.includes(requestedLimit) ? requestedLimit : 12;
    const sortBy = params.get('sortBy') ?? 'name';
    const order = (params.get('order') === 'DESC' ? 'DESC' : 'ASC') as 'ASC' | 'DESC';
    const searchBy = params.get('searchBy') ?? 'name';
    const searchTerm = params.get('searchTerm') ?? '';

    const [searchInput, setSearchInput] = useState(searchTerm);
    const debouncedSearch = useDebouncedValue(searchInput, 400);
    const lastPushedSearch = useRef(searchTerm);

    const update = useCallback(
        (patch: Record<string, string | number | undefined>) => {
            setParams(
                (current) => {
                    const next = new URLSearchParams(current);
                    Object.entries(patch).forEach(([key, value]) => {
                        if (value === undefined || value === '') next.delete(key);
                        else next.set(key, String(value));
                    });
                    return next;
                },
                { replace: true },
            );
        },
        [setParams],
    );

    useEffect(() => {
        if (searchTerm === lastPushedSearch.current) return;
        lastPushedSearch.current = searchTerm;
        setSearchInput(searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        if (debouncedSearch === searchTerm) return;
        lastPushedSearch.current = debouncedSearch;
        update({ searchTerm: debouncedSearch || undefined, page: 1 });
    }, [debouncedSearch, searchTerm, update]);

    const query = useQuery({
        queryKey: ['vinyls', { page, limit, sortBy, order, searchBy, searchTerm }],
        queryFn: async () => {
            const base = {
                limit,
                offset: (page - 1) * limit,
                sortBy,
                order,
            };
            if (!searchTerm) return api.vinyls.list(base);
            // «Везде»: сначала по названию, при пустом результате — по исполнителю.
            if (searchBy === 'author') {
                return api.vinyls.list({ ...base, searchBy: 'author', searchTerm });
            }
            const byName = await api.vinyls.list({ ...base, searchBy: 'name', searchTerm });
            if (byName.count > 0) return byName;
            return api.vinyls.list({ ...base, searchBy: 'author', searchTerm });
        },
        placeholderData: keepPreviousData,
    });

    const total = query.data?.count ?? 0;
    const rows = query.data?.rows ?? [];
    const hasFilters = Boolean(searchTerm);

    const summary = useMemo(() => {
        if (query.isLoading) return 'Загружаем каталог…';
        if (query.isError) return 'Каталог недоступен';
        return `Найдено ${total} ${pluralize(total, ['пластинка', 'пластинки', 'пластинок'])}`;
    }, [query.isLoading, query.isError, total]);

    const resetFilters = () => {
        setSearchInput('');
        setParams(new URLSearchParams(), { replace: true });
    };

    return (
        <>
            <section className="relative overflow-hidden border-b border-ink-800">
                <div className="pointer-events-none absolute -right-24 -top-32 hidden lg:block">
                    <div className="relative h-[420px] w-[420px] animate-spin-slow rounded-full border border-ink-700 bg-[repeating-radial-gradient(circle_at_center,#141211_0px,#141211_2px,#0b0a09_3px,#0b0a09_6px)] shadow-[0_40px_120px_-40px_rgba(214,159,85,0.35)]">
                        <div className="absolute inset-[38%] rounded-full bg-gradient-to-br from-brass-400 to-brass-600" />
                        <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-950" />
                    </div>
                </div>

                <div className="container-page relative py-14 sm:py-20">
                    <p className="text-xs uppercase tracking-[0.3em] text-brass-400">
                        Каталог винила
                    </p>
                    <h1 className="mt-4 max-w-2xl font-display text-4xl leading-tight text-cream sm:text-6xl">
                        Пластинки, которые хочется слушать целиком
                    </h1>
                    <p className="mt-5 max-w-xl text-base text-muted">
                        Отобранный винил с описанием, оценками покупателей и покупкой в пару
                        кликов. Поиск по названию и исполнителю, сортировка по цене и новизне.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <a href="#catalog" className="inline-flex h-11 items-center rounded-xl bg-brass-500 px-5 text-sm font-medium text-ink-950 transition hover:bg-brass-400">
                            Смотреть каталог
                        </a>
                        <span className="inline-flex items-center gap-2 text-sm text-muted">
                            <Disc3 className="h-4 w-4 text-brass-500" />
                            Отобранный винил с отзывами
                        </span>
                    </div>
                </div>
            </section>

            <section id="catalog" className="container-page scroll-mt-20 py-10">
                <div className="rounded-2xl border border-ink-700 bg-ink-900/50 p-4 sm:p-5">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                                <Input
                                    value={searchInput}
                                    onChange={(event) => setSearchInput(event.target.value)}
                                    placeholder="Найти пластинку или исполнителя…"
                                    className="pl-10"
                                    aria-label="Поиск по каталогу"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select
                                    value={searchBy}
                                    onChange={(event) =>
                                        update({ searchBy: event.target.value, page: 1 })
                                    }
                                    aria-label="Поле поиска"
                                    className="sm:w-44"
                                >
                                    {SEARCH_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Select>
                                {hasFilters && (
                                    <Button variant="ghost" size="md" onClick={resetFilters}>
                                        Сбросить
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 border-t border-ink-800 pt-4">
                            <span className="mr-1 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted">
                                <SlidersHorizontal className="h-3.5 w-3.5" />
                                Сортировка
                            </span>
                            <Select
                                value={sortBy}
                                onChange={(event) =>
                                    update({ sortBy: event.target.value, page: 1 })
                                }
                                aria-label="Сортировать по"
                                className="w-full sm:w-44"
                            >
                                {SORT_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Select>
                            <Select
                                value={order}
                                onChange={(event) =>
                                    update({ order: event.target.value, page: 1 })
                                }
                                aria-label="Направление сортировки"
                                className="w-full sm:w-40"
                            >
                                <option value="ASC">По возрастанию</option>
                                <option value="DESC">По убыванию</option>
                            </Select>
                            <span className="ml-auto text-sm text-muted">{summary}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    {query.isLoading ? (
                        <CatalogSkeleton />
                    ) : query.isError ? (
                        <ErrorState
                            message={
                                query.error instanceof Error
                                    ? query.error.message
                                    : 'Не удалось загрузить каталог'
                            }
                            onRetry={() => void query.refetch()}
                        />
                    ) : rows.length === 0 ? (
                        <EmptyState
                            title="Ничего не нашлось"
                            description={
                                hasFilters
                                    ? 'Попробуйте изменить запрос или сбросить фильтры.'
                                    : 'Каталог пока пуст. Запустите сидер на бэкенде или добавьте пластинки в админке.'
                            }
                            action={
                                hasFilters ? (
                                    <Button variant="secondary" onClick={resetFilters}>
                                        Сбросить фильтры
                                    </Button>
                                ) : undefined
                            }
                        />
                    ) : (
                        <div
                            className={`grid gap-5 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
                                query.isFetching ? 'opacity-60' : 'opacity-100'
                            }`}
                        >
                            {rows.map((vinyl) => (
                                <VinylCard key={vinyl.id} vinyl={vinyl} />
                            ))}
                        </div>
                    )}
                </div>

                {!query.isError && total > 0 && (
                    <div className="mt-10 flex flex-col items-center gap-4">
                        <Pagination
                            page={page}
                            pageSize={limit}
                            total={total}
                            onChange={(nextPage) => {
                                update({ page: nextPage });
                                document
                                    .getElementById('catalog')
                                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                        />
                        <div className="flex items-center gap-2 text-sm text-muted">
                            <span>На странице:</span>
                            <Select
                                value={limit}
                                onChange={(event) =>
                                    update({ limit: event.target.value, page: 1 })
                                }
                                className="h-9 w-auto py-0 text-sm"
                                aria-label="Количество пластинок на странице"
                            >
                                {PAGE_SIZES.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
}
