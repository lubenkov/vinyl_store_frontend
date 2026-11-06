import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { CalendarDays, Mail, Pencil, Receipt, ShieldCheck, Trash2, UserRound } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/context/I18nContext';
import { useToast } from '@/context/ToastContext';
import { initials } from '@/lib/format';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Form';
import { Modal } from '@/components/ui/Modal';
import { Stars } from '@/components/ui/Stars';

interface ProfileForm {
    firstName: string;
    lastName: string;
}

export function ProfilePage() {
    const { user, refresh, signOut } = useAuth();
    const { t, formatPrice, formatDate, formatDateTime } = useI18n();
    const { notify } = useToast();
    const navigate = useNavigate();

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [form, setForm] = useState<ProfileForm>({
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? '',
    });
    const [formError, setFormError] = useState<string | null>(null);

    const updateProfile = useMutation({
        mutationFn: () =>
            api.users.update({
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
            }),
        onSuccess: async () => {
            await refresh();
            setEditOpen(false);
            notify(t('profile.updated'), 'success');
        },
        onError: (error) => setFormError(error.message),
    });

    const deleteProfile = useMutation({
        mutationFn: api.users.remove,
        onSuccess: () => {
            signOut();
            notify(t('profile.deleted'), 'success');
            navigate('/');
        },
        onError: (error) => notify(error.message, 'error'),
    });

    if (!user) return null;

    const openEditor = () => {
        setForm({
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
        });
        setFormError(null);
        setEditOpen(true);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError(null);
        if (!form.firstName.trim() || !form.lastName.trim()) {
            setFormError(t('profile.nameRequired'));
            return;
        }
        updateProfile.mutate();
    };

    const purchases = user.purchases ?? [];
    const reviews = user.reviews ?? [];

    return (
        <div className="container-page py-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt=""
                            className="h-20 w-20 rounded-2xl border border-ink-700 object-cover"
                        />
                    ) : (
                        <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brass-400 to-brass-600 font-display text-2xl font-semibold text-ink-950">
                            {initials(user.firstName, user.lastName)}
                        </span>
                    )}
                    <div>
                        <h1 className="font-display text-3xl text-cream">
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="mt-1 flex items-center gap-2 text-sm text-muted">
                            <Mail className="h-4 w-4" />
                            {user.email}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                            <Badge tone={user.role === 'admin' ? 'brass' : 'neutral'}>
                                {user.role === 'admin' ? (
                                    <>
                                        <ShieldCheck className="h-3 w-3" />
                                        {t('profile.admin')}
                                    </>
                                ) : (
                                    <>
                                        <UserRound className="h-3 w-3" />
                                        {t('profile.customer')}
                                    </>
                                )}
                            </Badge>
                            {user.birthdate && (
                                <span className="inline-flex items-center gap-1 text-xs text-muted">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    {formatDate(user.birthdate)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={openEditor}>
                        <Pencil className="h-4 w-4" />
                        {t('common.edit')}
                    </Button>
                    <Button variant="ghost" onClick={() => setDeleteOpen(true)}>
                        <Trash2 className="h-4 w-4" />
                        {t('profile.deleteAccount')}
                    </Button>
                </div>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
                <section className="card p-5">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="font-display text-xl text-cream">
                            {t('profile.purchases')}
                        </h2>
                        <span className="text-sm text-muted">{purchases.length}</span>
                    </div>
                    <div className="mt-4 space-y-3">
                        {purchases.length === 0 ? (
                            <p className="rounded-xl border border-dashed border-ink-700 px-4 py-6 text-center text-sm text-muted">
                                {t('profile.noPurchases')}
                            </p>
                        ) : (
                            purchases.map((purchase) => (
                                <div
                                    key={purchase.id}
                                    className="flex items-center justify-between gap-3 rounded-xl border border-ink-800 bg-ink-850/60 px-4 py-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-800 text-brass-400">
                                            <Receipt className="h-4 w-4" />
                                        </span>
                                        <div>
                                            <p className="text-sm text-cream">
                                                {t('profile.orderLine', {
                                                    id: purchase.id,
                                                    vinylId: purchase.vinylId,
                                                })}
                                            </p>
                                            <p className="text-xs text-muted">
                                                {formatDateTime(purchase.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-brass-400">
                                            {formatPrice(purchase.amount)}
                                        </p>
                                        <p className="text-xs text-muted">
                                            {purchase.status === 'demo'
                                                ? t('common.demoNoCharge')
                                                : purchase.status}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <section className="card p-5">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="font-display text-xl text-cream">
                            {t('profile.myReviews')}
                        </h2>
                        <span className="text-sm text-muted">{reviews.length}</span>
                    </div>
                    <div className="mt-4 space-y-3">
                        {reviews.length === 0 ? (
                            <p className="rounded-xl border border-dashed border-ink-700 px-4 py-6 text-center text-sm text-muted">
                                {t('profile.noReviews')}
                            </p>
                        ) : (
                            reviews.map((review) => (
                                <article
                                    key={review.id}
                                    className="rounded-xl border border-ink-800 bg-ink-850/60 px-4 py-3"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <Stars value={review.score} size={13} />
                                        <span className="text-xs text-muted">
                                            {formatDate(review.createdAt)}
                                        </span>
                                    </div>
                                    <p className="mt-2 line-clamp-3 text-sm text-cream/85">
                                        {review.content}
                                    </p>
                                </article>
                            ))
                        )}
                    </div>
                </section>
            </div>

            <Modal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                title={t('profile.editTitle')}
                footer={
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            className="flex-1"
                            onClick={() => setEditOpen(false)}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            className="flex-1"
                            form="profile-form"
                            type="submit"
                            loading={updateProfile.isPending}
                        >
                            {t('common.save')}
                        </Button>
                    </div>
                }
            >
                <form id="profile-form" className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label={t('profile.firstName')} htmlFor="profile-first-name">
                            <Input
                                id="profile-first-name"
                                value={form.firstName}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        firstName: event.target.value,
                                    }))
                                }
                                required
                            />
                        </Field>
                        <Field label={t('profile.lastName')} htmlFor="profile-last-name">
                            <Input
                                id="profile-last-name"
                                value={form.lastName}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        lastName: event.target.value,
                                    }))
                                }
                                required
                            />
                        </Field>
                    </div>
                    {formError && (
                        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                            {formError}
                        </p>
                    )}
                </form>
            </Modal>

            <Modal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                title={t('profile.deleteTitle')}
                size="sm"
                footer={
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            className="flex-1"
                            onClick={() => setDeleteOpen(false)}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant="danger"
                            className="flex-1"
                            loading={deleteProfile.isPending}
                            onClick={() => deleteProfile.mutate()}
                        >
                            {t('common.delete')}
                        </Button>
                    </div>
                }
            >
                <p className="text-sm leading-relaxed text-muted">
                    {t('profile.deleteBody')}
                </p>
            </Modal>
        </div>
    );
}
