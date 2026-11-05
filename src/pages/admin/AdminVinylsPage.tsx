import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { cleanDescription, formatPrice } from '@/lib/format';
import { VinylCover } from '@/components/VinylCover';
import { Button } from '@/components/ui/Button';
import { Field, Input, Textarea } from '@/components/ui/Form';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState, ErrorState, Spinner } from '@/components/ui/States';
import type { Vinyl } from '@/types/api';

const PAGE_SIZE = 10;

interface VinylFormState {
    name: string;
    author: string;
    description: string;
    price: string;
    image: string;
}

const EMPTY_FORM: VinylFormState = {
    name: '',
    author: '',
    description: '',
    price: '',
    image: '',
};

export function AdminVinylsPage() {
    const queryClient = useQueryClient();
    const { notify } = useToast();

    const [page, setPage] = useState(1);
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<Vinyl | null>(null);
    const [deleting, setDeleting] = useState<Vinyl | null>(null);
    const [form, setForm] = useState<VinylFormState>(EMPTY_FORM);
    const [formError, setFormError] = useState<string | null>(null);

    const query = useQuery({
        queryKey: ['vinyls', 'admin', page],
        queryFn: () =>
            api.vinyls.list({
                limit: PAGE_SIZE,
                offset: (page - 1) * PAGE_SIZE,
                sortBy: 'id',
                order: 'DESC',
            }),
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['vinyls'] });

    const createVinyl = useMutation({
        mutationFn: api.vinyls.create,
        onSuccess: (vinyl) => {
            notify(`Пластинка «${vinyl.name}» добавлена.`, 'success');
            setFormOpen(false);
            setPage(1);
            void invalidate();
        },
        onError: (error) => setFormError(error.message),
    });

    const updateVinyl = useMutation({
        mutationFn: ({ id, input }: { id: number; input: Parameters<typeof api.vinyls.update>[1] }) =>
            api.vinyls.update(id, input),
        onSuccess: () => {
            notify('Изменения сохранены.', 'success');
            setFormOpen(false);
            void invalidate();
        },
        onError: (error) => setFormError(error.message),
    });

    const deleteVinyl = useMutation({
        mutationFn: api.vinyls.remove,
        onSuccess: () => {
            notify('Пластинка удалена.', 'success');
            setDeleting(null);
            if (query.data?.rows.length === 1 && page > 1) setPage(page - 1);
            void invalidate();
        },
        onError: (error) => notify(error.message, 'error'),
    });

    const openCreate = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
        setFormError(null);
        setFormOpen(true);
    };

    const openEdit = (vinyl: Vinyl) => {
        setEditing(vinyl);
        setForm({
            name: vinyl.name,
            author: vinyl.author,
            description: cleanDescription(vinyl.description),
            price: String(vinyl.price),
            image: vinyl.image ?? '',
        });
        setFormError(null);
        setFormOpen(true);
    };

    const setField = (field: keyof VinylFormState, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError(null);

        const price = Number(form.price);
        if (!form.name.trim() || !form.author.trim()) {
            setFormError('Название и исполнитель обязательны.');
            return;
        }
        if (!Number.isFinite(price) || price <= 0) {
            setFormError('Цена должна быть положительным числом.');
            return;
        }

        const input = {
            name: form.name.trim(),
            author: form.author.trim(),
            description: form.description.trim(),
            price,
            image: form.image.trim(),
        };

        if (editing) updateVinyl.mutate({ id: editing.id, input });
        else createVinyl.mutate(input);
    };

    const total = query.data?.count ?? 0;
    const rows = query.data?.rows ?? [];

    return (
        <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="section-title">Пластинки</h2>
                    <p className="mt-1 text-sm text-muted">
                        Всего в каталоге: {total}. Новые записи — первыми.
                    </p>
                </div>
                <Button onClick={openCreate}>
                    <Plus className="h-4 w-4" />
                    Добавить пластинку
                </Button>
            </div>

            {query.isLoading ? (
                <Spinner />
            ) : query.isError ? (
                <ErrorState
                    message={query.error instanceof Error ? query.error.message : 'Ошибка загрузки'}
                    onRetry={() => void query.refetch()}
                />
            ) : rows.length === 0 ? (
                <EmptyState
                    title="Каталог пуст"
                    description="Добавьте первую пластинку вручную или импортируйте релиз из Discogs."
                    action={
                        <Button onClick={openCreate}>
                            <Plus className="h-4 w-4" />
                            Добавить пластинку
                        </Button>
                    }
                />
            ) : (
                <div className="table-shell">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Пластинка</th>
                                <th className="hidden sm:table-cell">Исполнитель</th>
                                <th>Цена</th>
                                <th className="hidden md:table-cell">Отзывы</th>
                                <th className="text-right">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((vinyl) => (
                                <tr key={vinyl.id}>
                                    <td className="font-mono text-xs text-muted">{vinyl.id}</td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 shrink-0">
                                                <VinylCover vinyl={vinyl} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm text-cream">
                                                    {vinyl.name}
                                                </p>
                                                <p className="truncate text-xs text-muted sm:hidden">
                                                    {vinyl.author}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="hidden max-w-48 truncate text-sm text-muted sm:table-cell">
                                        {vinyl.author}
                                    </td>
                                    <td className="whitespace-nowrap text-sm text-brass-400">
                                        {formatPrice(vinyl.price)}
                                    </td>
                                    <td className="hidden text-sm text-muted md:table-cell">
                                        {vinyl.reviews?.length ?? 0}
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                to={`/vinyls/${vinyl.id}`}
                                                className="rounded-lg p-2 text-muted transition hover:bg-ink-800 hover:text-cream"
                                                aria-label="Открыть страницу пластинки"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => openEdit(vinyl)}
                                                className="rounded-lg p-2 text-muted transition hover:bg-ink-800 hover:text-cream"
                                                aria-label="Редактировать"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeleting(vinyl)}
                                                className="rounded-lg p-2 text-muted transition hover:bg-red-500/10 hover:text-red-400"
                                                aria-label="Удалить"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {total > 0 && (
                <Pagination page={page} pageSize={PAGE_SIZE} total={total} onChange={setPage} />
            )}

            <Modal
                open={formOpen}
                onClose={() => setFormOpen(false)}
                title={editing ? 'Редактировать пластинку' : 'Новая пластинка'}
                description={
                    editing
                        ? `ID ${editing.id}. Изменения попадут в журнал действий.`
                        : 'Заполните карточку товара. Обложка задаётся ссылкой.'
                }
                footer={
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            className="flex-1"
                            onClick={() => setFormOpen(false)}
                        >
                            Отмена
                        </Button>
                        <Button
                            className="flex-1"
                            type="submit"
                            form="vinyl-form"
                            loading={createVinyl.isPending || updateVinyl.isPending}
                        >
                            {editing ? 'Сохранить' : 'Добавить'}
                        </Button>
                    </div>
                }
            >
                <form id="vinyl-form" className="space-y-4" onSubmit={handleSubmit}>
                    <Field label="Название" htmlFor="vinyl-name">
                        <Input
                            id="vinyl-name"
                            value={form.name}
                            onChange={(event) => setField('name', event.target.value)}
                            placeholder="Kind of Blue"
                            required
                        />
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Исполнитель" htmlFor="vinyl-author">
                            <Input
                                id="vinyl-author"
                                value={form.author}
                                onChange={(event) => setField('author', event.target.value)}
                                placeholder="Miles Davis"
                                required
                            />
                        </Field>
                        <Field label="Цена, USD" htmlFor="vinyl-price">
                            <Input
                                id="vinyl-price"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={form.price}
                                onChange={(event) => setField('price', event.target.value)}
                                placeholder="24.99"
                                required
                            />
                        </Field>
                    </div>
                    <Field label="Ссылка на обложку" htmlFor="vinyl-image">
                        <Input
                            id="vinyl-image"
                            type="url"
                            value={form.image}
                            onChange={(event) => setField('image', event.target.value)}
                            placeholder="https://…"
                        />
                    </Field>
                    <Field label="Описание" htmlFor="vinyl-description">
                        <Textarea
                            id="vinyl-description"
                            value={form.description}
                            onChange={(event) => setField('description', event.target.value)}
                            placeholder="Издание, состояние конверта, особенности пресса…"
                        />
                    </Field>
                    {formError && (
                        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                            {formError}
                        </p>
                    )}
                </form>
            </Modal>

            <Modal
                open={deleting !== null}
                onClose={() => setDeleting(null)}
                title="Удалить пластинку?"
                size="sm"
                footer={
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            className="flex-1"
                            onClick={() => setDeleting(null)}
                        >
                            Отмена
                        </Button>
                        <Button
                            variant="danger"
                            className="flex-1"
                            loading={deleteVinyl.isPending}
                            onClick={() => deleting && deleteVinyl.mutate(deleting.id)}
                        >
                            Удалить
                        </Button>
                    </div>
                }
            >
                <p className="text-sm text-muted">
                    «{deleting?.name}» будет удалена вместе со связанными отзывами и покупками.
                </p>
            </Modal>
        </section>
    );
}
