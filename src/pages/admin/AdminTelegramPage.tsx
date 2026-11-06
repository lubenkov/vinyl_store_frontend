import { useMemo, useState, type FormEvent } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Disc3, Send } from 'lucide-react';
import { api } from '@/lib/api';
import { useI18n } from '@/context/I18nContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { Field, Select } from '@/components/ui/Form';

function getLinkOrigin() {
    const origin = new URL(window.location.origin);
    if (origin.hostname === 'localhost') {
        // Use the loopback IP: it is a valid URL and works without a TLD.
        origin.hostname = '127.0.0.1';
    }
    return origin.origin;
}

export function AdminTelegramPage() {
    const { t, formatPrice } = useI18n();
    const { notify } = useToast();
    const [vinylId, setVinylId] = useState('');
    const [error, setError] = useState<string | null>(null);

    const vinylsQuery = useQuery({
        queryKey: ['vinyls', 'telegram-picker'],
        queryFn: () =>
            api.vinyls.list({
                limit: 100,
                offset: 0,
                sortBy: 'name',
                order: 'ASC',
            }),
    });

    const vinyls = useMemo(() => vinylsQuery.data?.rows ?? [], [vinylsQuery.data?.rows]);
    const selectedVinyl = useMemo(
        () => vinyls.find((vinyl) => String(vinyl.id) === vinylId) ?? null,
        [vinylId, vinyls],
    );
    const vinylLink = selectedVinyl
        ? new URL(`/vinyls/${selectedVinyl.id}`, getLinkOrigin()).toString()
        : '';

    const sendVinyl = useMutation({
        mutationFn: () => {
            if (!selectedVinyl) throw new Error(t('adminTelegram.selectRequired'));
            return api.telegram.sendVinyl({
                name: selectedVinyl.name,
                link: vinylLink,
                price: Number(selectedVinyl.price),
            });
        },
        onSuccess: () => {
            notify(t('adminTelegram.sent'), 'success');
            setVinylId('');
            setError(null);
        },
        onError: (mutationError) => setError(mutationError.message),
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (!selectedVinyl) {
            setError(t('adminTelegram.selectFromList'));
            return;
        }

        const price = Number(selectedVinyl.price);
        if (!Number.isFinite(price) || price < 0) {
            setError(t('adminTelegram.invalidPrice'));
            return;
        }

        sendVinyl.mutate();
    };

    const listError = vinylsQuery.isError
        ? vinylsQuery.error instanceof Error
            ? vinylsQuery.error.message
            : t('adminTelegram.loadError')
        : null;

    return (
        <section className="space-y-6">
            <div>
                <h2 className="section-title">{t('adminTelegram.title')}</h2>
                <p className="mt-1 max-w-2xl text-sm text-muted">
                    {t('adminTelegram.description')}
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="grid gap-4 rounded-2xl border border-ink-700 bg-ink-900/60 p-5 sm:max-w-2xl"
            >
                <Field
                    label={t('adminTelegram.record')}
                    htmlFor="telegram-vinyl"
                    hint={t('adminTelegram.linkHint')}
                >
                    <Select
                        id="telegram-vinyl"
                        value={vinylId}
                        onChange={(event) => {
                            setVinylId(event.target.value);
                            setError(null);
                        }}
                        required
                        disabled={vinylsQuery.isLoading || Boolean(listError) || vinyls.length === 0}
                    >
                        <option value="">
                            {vinylsQuery.isLoading
                                ? t('adminTelegram.loadingCatalog')
                                : vinyls.length === 0
                                  ? t('adminTelegram.emptyCatalog')
                                  : t('adminTelegram.selectPlaceholder')}
                        </option>
                        {vinyls.map((vinyl) => (
                            <option key={vinyl.id} value={vinyl.id}>
                                {vinyl.name} — {vinyl.author} ({formatPrice(vinyl.price)})
                            </option>
                        ))}
                    </Select>
                </Field>

                {selectedVinyl && (
                    <div className="rounded-xl border border-ink-700 bg-ink-850 p-4">
                        <div className="flex items-start gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink-800 text-brass-400">
                                <Disc3 className="h-5 w-5" />
                            </span>
                            <div className="min-w-0 space-y-1">
                                <p className="text-sm text-cream">{selectedVinyl.name}</p>
                                <p className="text-xs uppercase tracking-wider text-muted">
                                    {selectedVinyl.author}
                                </p>
                                <p className="text-sm font-semibold text-brass-400">
                                    {formatPrice(selectedVinyl.price)}
                                </p>
                                <p className="break-all text-xs text-muted">{vinylLink}</p>
                            </div>
                        </div>
                    </div>
                )}

                {listError && (
                    <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                        {listError}
                    </p>
                )}

                {error && (
                    <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                        {error}
                    </p>
                )}

                <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-muted">
                        {t('adminTelegram.envPrefix')}{' '}
                        <code className="text-cream/80">TELEGRAM_BOT_TOKEN</code>{' '}
                        {t('adminDiscogs.and')}{' '}
                        <code className="text-cream/80">TELEGRAM_CHAT_ID</code>{' '}
                        {t('adminTelegram.envSuffix')}
                    </p>
                    <Button
                        type="submit"
                        loading={sendVinyl.isPending}
                        disabled={!selectedVinyl || Boolean(listError)}
                    >
                        <Send className="h-4 w-4" />
                        {t('adminTelegram.send')}
                    </Button>
                </div>
            </form>
        </section>
    );
}
