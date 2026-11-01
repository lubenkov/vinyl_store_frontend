import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    ChevronLeft,
    ChevronRight,
    CreditCard,
    MessageSquare,
    ShoppingBag,
    Trash2,
} from 'lucide-react';
import { ApiError, api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { averageScore, formatDate, formatPrice, initials, pluralize } from '@/lib/format';
import { VinylCover } from '@/components/VinylCover';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Field, Select, Textarea } from '@/components/ui/Form';
import { Modal } from '@/components/ui/Modal';
import { Stars } from '@/components/ui/Stars';
import { EmptyState, ErrorState, Spinner } from '@/components/ui/States';
import type { CreateReviewInput, Purchase, Review } from '@/types/api';

const REVIEWS_PER_PAGE = 5;

const CURRENCIES = [
    { value: 'usd', label: 'USD — доллар США' },
    { value: 'eur', label: 'EUR — евро' },
    { value: 'gbp', label: 'GBP — фунт стерлингов' },
];

function ReviewItem({
    review,
    canDelete,
    onDelete,
    deleting,
}: {
    review: Review;
    canDelete: boolean;
    onDelete: (id: number) => void;
    deleting: boolean;
}) {
    return (
        <article className="rounded-2xl border border-ink-700 bg-ink-900/60 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-700 text-xs font-semibold text-cream">
                        {review.user
                            ? initials(review.user.firstName, review.user.lastName)
                            : `#${review.userId}`}
                    </span>
                    <div>
                        <p className="text-sm font-medium text-cream">
                            {review.user
                                ? `${review.user.firstName} ${review.user.lastName}`
                                : `Пользователь #${review.userId}`}
                        </p>
                        <p className="text-xs text-muted">{formatDate(review.createdAt)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Stars value={review.score} size={14} />
                    {canDelete && (
                        <button
                            type="button"
                            onClick={() => onDelete(review.id)}
                            disabled={deleting}
                            className="rounded-lg p-1.5 text-muted transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                            aria-label="Удалить отзыв"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-cream/85">
                {review.content}
            </p>
        </article>
    );
}

export function VinylDetailPage() {
    const { id } = useParams();
    const vinylId = Number(id);
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user, isAdmin } = useAuth();
    const { notify } = useToast();

    const [reviewPage, setReviewPage] = useState(1);
    const [score, setScore] = useState(0);
    const [content, setContent] = useState('');
    const [buyOpen, setBuyOpen] = useState(false);
    const [currency, setCurrency] = useState('usd');
    const [purchase, setPurchase] = useState<Purchase | null>(null);
    const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

    const vinylQuery = useQuery({
        queryKey: ['vinyl', vinylId],
        queryFn: ({ signal }) => api.vinyls.get(vinylId, signal),
        enabled: Number.isFinite(vinylId),
    });

    const reviewsQuery = useQuery({
        queryKey: ['vinyl-reviews', vinylId, reviewPage],
        queryFn: ({ signal }) =>
            api.vinyls.reviews(vinylId, reviewPage, REVIEWS_PER_PAGE, signal),
        enabled: Number.isFinite(vinylId),
    });

    const invalidateReviews = () => {
        void queryClient.invalidateQueries({ queryKey: ['vinyl', vinylId] });
        void queryClient.invalidateQueries({ queryKey: ['vinyl-reviews', vinylId] });
    };

    const addReview = useMutation({
        mutationFn: (input: CreateReviewInput) => api.vinyls.addReview(vinylId, input),
        onSuccess: () => {
            notify('Спасибо! Отзыв опубликован.', 'success');
            setContent('');
            setScore(0);
            setReviewPage(1);
            invalidateReviews();
        },
        onError: (error) => notify(error.message, 'error'),
    });

    const deleteReview = useMutation({
        mutationFn: (reviewId: number) => api.reviews.remove(reviewId),
        onSuccess: () => {
            notify('Отзыв удалён.', 'success');
            setReviewToDelete(null);
            invalidateReviews();
        },
        onError: (error) => notify(error.message, 'error'),
    });

    const buy = useMutation({
        mutationFn: () => api.purchases.create(vinylId, currency),
        onSuccess: (data) => {
            setPurchase(data);
            notify('Заказ создан. Проверьте статус платежа.', 'success');
        },
        onError: (error) => notify(error.message, 'error'),
    });

    if (!Number.isFinite(vinylId)) {
        return (
            <div className="container-page py-16">
                <EmptyState
                    title="Пластинка не найдена"
                    description="В адресе страницы указан некорректный идентификатор."
                    action={
                        <Link to="/">
                            <Button variant="secondary">Вернуться в каталог</Button>
                        </Link>
                    }
                />
            </div>
        );
    }

    if (vinylQuery.isLoading) {
        return (
            <div className="container-page py-16">
                <Spinner />
            </div>
        );
    }

    if (vinylQuery.isError) {
        const error = vinylQuery.error;
        const notFound = error instanceof ApiError && error.status === 404;
        return (
            <div className="container-page py-16">
                {notFound ? (
                    <EmptyState
                        title="Пластинка не найдена"
                        description="Возможно, запись удалили из каталога."
                        action={
                            <Link to="/">
                                <Button variant="secondary">Вернуться в каталог</Button>
                            </Link>
                        }
                    />
                ) : (
                    <ErrorState
                        message={error instanceof Error ? error.message : 'Ошибка загрузки'}
                        onRetry={() => void vinylQuery.refetch()}
                    />
                )}
            </div>
        );
    }

    const vinyl = vinylQuery.data;
    if (!vinyl) return null;

    const scoreAverage = averageScore(vinyl.reviews);
    const reviewCount = vinyl.reviews?.length ?? 0;
    const reviews = reviewsQuery.data ?? [];
    const canGoNext = reviews.length === REVIEWS_PER_PAGE;

    const handleBuyClick = () => {
        if (!user) {
            navigate('/login', { state: { from: location } });
            return;
        }
        setPurchase(null);
        setBuyOpen(true);
    };

    const submitReview = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (score < 1) {
            notify('Поставьте оценку от 1 до 5.', 'error');
            return;
        }
        if (content.trim().length < 3) {
            notify('Напишите хотя бы пару слов об этой пластинке.', 'error');
            return;
        }
        addReview.mutate({ score, content: content.trim() });
    };

    return (
        <div className="container-page py-8 sm:py-12">
            <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted" aria-label="Хлебные крошки">
                <Link to="/" className="transition hover:text-cream">
                    Каталог
                </Link>
                <span>/</span>
                <span className="truncate text-cream/80">{vinyl.name}</span>
            </nav>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-12">
                <div className="lg:sticky lg:top-24 lg:self-start">
                    <div className="overflow-hidden rounded-2xl border border-ink-700 shadow-card">
                        <VinylCover vinyl={vinyl} eager />
                    </div>
                    <div className="mt-4 flex items-center justify-between rounded-xl border border-ink-800 bg-ink-900/50 px-4 py-3 text-sm">
                        <span className="text-muted">Позиция в каталоге</span>
                        <span className="font-mono text-cream/80">#{vinyl.id}</span>
                    </div>
                </div>

                <div className="min-w-0">
                    <p className="text-sm uppercase tracking-[0.18em] text-brass-400">
                        {vinyl.author || 'Неизвестный исполнитель'}
                    </p>
                    <h1 className="mt-2 font-display text-3xl leading-tight text-cream sm:text-5xl">
                        {vinyl.name}
                    </h1>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        {scoreAverage !== null ? (
                            <span className="inline-flex items-center gap-2">
                                <Stars value={scoreAverage} size={16} />
                                <span className="text-sm text-cream">
                                    {scoreAverage.toFixed(1)}
                                </span>
                                <span className="text-sm text-muted">
                                    · {reviewCount}{' '}
                                    {pluralize(reviewCount, ['отзыв', 'отзыва', 'отзывов'])}
                                </span>
                            </span>
                        ) : (
                            <Badge tone="neutral">Пока без отзывов</Badge>
                        )}
                        <Badge tone="brass">Винил</Badge>
                    </div>

                    <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-cream/80">
                        {vinyl.description || 'Описание к этой пластинке пока не добавлено.'}
                    </p>

                    <div className="mt-8 rounded-2xl border border-ink-700 bg-ink-900/70 p-5">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-muted">Цена</p>
                                <p className="mt-1 font-display text-3xl text-brass-400">
                                    {formatPrice(vinyl.price)}
                                </p>
                            </div>
                            <Button size="lg" onClick={handleBuyClick}>
                                <ShoppingBag className="h-5 w-5" />
                                {user ? 'Купить' : 'Войти и купить'}
                            </Button>
                        </div>
                        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted">
                            <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-brass-500/70" />
                            Оплата проходит через Stripe: сумма берётся из базы, а на почту
                            приходит подтверждение заказа.
                        </p>
                    </div>

                    <section className="mt-10" aria-labelledby="reviews-title">
                        <div className="flex items-center justify-between gap-4">
                            <h2 id="reviews-title" className="section-title">
                                Отзывы
                                <span className="ml-2 align-middle text-base text-muted">
                                    {reviewCount > 0 ? `(${reviewCount})` : ''}
                                </span>
                            </h2>
                        </div>

                        <div className="mt-5 space-y-4">
                            {reviewsQuery.isLoading ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 2 }).map((_, index) => (
                                        <div
                                            key={index}
                                            className="h-28 animate-pulse rounded-2xl bg-ink-800/60"
                                        />
                                    ))}
                                </div>
                            ) : reviewsQuery.isError ? (
                                <ErrorState
                                    message="Не удалось загрузить отзывы"
                                    onRetry={() => void reviewsQuery.refetch()}
                                />
                            ) : reviews.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-ink-700 px-5 py-8 text-center text-sm text-muted">
                                    <MessageSquare className="mx-auto mb-3 h-6 w-6 text-brass-500/70" />
                                    Отзывов пока нет. Будьте первым.
                                </div>
                            ) : (
                                reviews.map((review) => (
                                    <ReviewItem
                                        key={review.id}
                                        review={review}
                                        canDelete={isAdmin}
                                        onDelete={() => setReviewToDelete(review)}
                                        deleting={deleteReview.isPending}
                                    />
                                ))
                            )}
                        </div>

                        {(reviewPage > 1 || canGoNext) && (
                            <div className="mt-5 flex items-center justify-center gap-3">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    disabled={reviewPage <= 1}
                                    onClick={() => setReviewPage((page) => Math.max(1, page - 1))}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Назад
                                </Button>
                                <span className="text-sm text-muted">Страница {reviewPage}</span>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    disabled={!canGoNext}
                                    onClick={() => setReviewPage((page) => page + 1)}
                                >
                                    Дальше
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        <div className="mt-8 rounded-2xl border border-ink-700 bg-ink-900/60 p-5">
                            <h3 className="font-display text-xl text-cream">Оставить отзыв</h3>
                            {user ? (
                                <form className="mt-4 space-y-4" onSubmit={submitReview}>
                                    <div>
                                        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
                                            Ваша оценка
                                        </p>
                                        <Stars value={score} size={26} onChange={setScore} />
                                    </div>
                                    <Field label="Впечатления" htmlFor="review-content">
                                        <Textarea
                                            id="review-content"
                                            value={content}
                                            onChange={(event) => setContent(event.target.value)}
                                            placeholder="Как звучит пластинка, состояние конверта, качество издания…"
                                            maxLength={2000}
                                        />
                                    </Field>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-xs text-muted">
                                            {content.length} / 2000
                                        </span>
                                        <Button type="submit" loading={addReview.isPending}>
                                            Опубликовать
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                    <p className="text-sm text-muted">
                                        Отзывы могут оставлять только авторизованные покупатели.
                                    </p>
                                    <Link
                                        to="/login"
                                        state={{ from: location }}
                                        className="text-sm text-brass-400 link-underline"
                                    >
                                        Войти в аккаунт
                                    </Link>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            <Modal
                open={buyOpen}
                onClose={() => setBuyOpen(false)}
                title={purchase ? 'Заказ создан' : 'Оформление покупки'}
                description={
                    purchase
                        ? 'Платёж зарегистрирован на стороне бэкенда.'
                        : 'Проверьте состав заказа и валюту.'
                }
                size="sm"
                footer={
                    purchase ? (
                        <Button className="w-full" onClick={() => setBuyOpen(false)}>
                            Готово
                        </Button>
                    ) : (
                        <div className="flex gap-3">
                            <Button
                                variant="secondary"
                                className="flex-1"
                                onClick={() => setBuyOpen(false)}
                            >
                                Отмена
                            </Button>
                            <Button
                                className="flex-1"
                                loading={buy.isPending}
                                onClick={() => buy.mutate()}
                            >
                                <CreditCard className="h-4 w-4" />
                                Оплатить
                            </Button>
                        </div>
                    )
                }
            >
                {purchase ? (
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted">Пластинка</span>
                            <span className="text-right text-cream">{vinyl.name}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted">Сумма</span>
                            <span className="text-cream">{formatPrice(purchase.amount)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted">Номер заказа</span>
                            <span className="font-mono text-cream/80">#{purchase.id}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted">Статус платежа</span>
                            <Badge tone={purchase.status === 'succeeded' ? 'green' : 'brass'}>
                                {purchase.status}
                            </Badge>
                        </div>
                        <p className="rounded-xl border border-ink-700 bg-ink-850 p-3 text-xs leading-relaxed text-muted">
                            Бэкенд создаёт PaymentIntent, но не возвращает client_secret.
                            Поэтому ввод карты на фронтенде не подключён: для реальной оплаты
                            нужен Stripe Elements и доработка ответа API.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex gap-4 rounded-xl border border-ink-700 bg-ink-850 p-3">
                            <div className="w-20 shrink-0">
                                <VinylCover vinyl={vinyl} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs uppercase tracking-wider text-muted">
                                    {vinyl.author}
                                </p>
                                <p className="mt-1 line-clamp-2 text-sm text-cream">
                                    {vinyl.name}
                                </p>
                                <p className="mt-2 text-sm font-semibold text-brass-400">
                                    {formatPrice(vinyl.price)}
                                </p>
                            </div>
                        </div>
                        <Field label="Валюта" htmlFor="purchase-currency">
                            <Select
                                id="purchase-currency"
                                value={currency}
                                onChange={(event) => setCurrency(event.target.value)}
                            >
                                {CURRENCIES.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Select>
                        </Field>
                        <p className="text-xs leading-relaxed text-muted">
                            Итоговая сумма списывается Stripe в выбранной валюте. Сумма
                            заказа берётся из базы данных, а не из запроса.
                        </p>
                    </div>
                )}
            </Modal>

            <Modal
                open={reviewToDelete !== null}
                onClose={() => setReviewToDelete(null)}
                title="Удалить отзыв?"
                size="sm"
                footer={
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            className="flex-1"
                            onClick={() => setReviewToDelete(null)}
                        >
                            Отмена
                        </Button>
                        <Button
                            variant="danger"
                            className="flex-1"
                            loading={deleteReview.isPending}
                            onClick={() =>
                                reviewToDelete && deleteReview.mutate(reviewToDelete.id)
                            }
                        >
                            Удалить
                        </Button>
                    </div>
                }
            >
                <p className="text-sm text-muted">
                    Отзыв будет удалён без возможности восстановления.
                </p>
            </Modal>
        </div>
    );
}
