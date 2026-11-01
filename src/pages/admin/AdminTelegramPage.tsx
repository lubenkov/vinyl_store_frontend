import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Form';

interface TelegramForm {
    name: string;
    link: string;
    price: string;
}

const EMPTY_FORM: TelegramForm = { name: '', link: '', price: '' };

export function AdminTelegramPage() {
    const { notify } = useToast();
    const [form, setForm] = useState<TelegramForm>(EMPTY_FORM);
    const [error, setError] = useState<string | null>(null);

    const sendVinyl = useMutation({
        mutationFn: () =>
            api.telegram.sendVinyl({
                name: form.name.trim(),
                link: form.link.trim(),
                price: Number(form.price),
            }),
        onSuccess: () => {
            notify('Карточка отправлена в Telegram.', 'success');
            setForm(EMPTY_FORM);
        },
        onError: (mutationError) => setError(mutationError.message),
    });

    const setField = (field: keyof TelegramForm, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
        setError(null);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (!form.name.trim()) {
            setError('Укажите название пластинки.');
            return;
        }
        try {
            const url = new URL(form.link);
            if (!['http:', 'https:'].includes(url.protocol)) throw new Error('bad protocol');
        } catch {
            setError('Ссылка должна быть полным URL (http/https).');
            return;
        }
        const price = Number(form.price);
        if (!Number.isFinite(price) || price < 0) {
            setError('Цена должна быть неотрицательным числом.');
            return;
        }
        sendVinyl.mutate();
    };

    return (
        <section className="space-y-6">
            <div>
                <h2 className="section-title">Уведомление в Telegram</h2>
                <p className="mt-1 max-w-2xl text-sm text-muted">
                    Отправьте карточку пластинки в чат магазина. Сообщение уходит через Bot
                    API на стороне бэкенда.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="grid gap-4 rounded-2xl border border-ink-700 bg-ink-900/60 p-5 sm:max-w-2xl"
            >
                <Field label="Название" htmlFor="telegram-name">
                    <Input
                        id="telegram-name"
                        value={form.name}
                        onChange={(event) => setField('name', event.target.value)}
                        placeholder="Blue Train"
                        required
                    />
                </Field>
                <Field
                    label="Ссылка на пластинку"
                    htmlFor="telegram-link"
                    hint="Полный URL, например https://example.com/vinyls/42"
                >
                    <Input
                        id="telegram-link"
                        type="url"
                        value={form.link}
                        onChange={(event) => setField('link', event.target.value)}
                        placeholder="https://…"
                        required
                    />
                </Field>
                <Field label="Цена, USD" htmlFor="telegram-price">
                    <Input
                        id="telegram-price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={(event) => setField('price', event.target.value)}
                        placeholder="29.99"
                        required
                    />
                </Field>

                {error && (
                    <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                        {error}
                    </p>
                )}

                <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-muted">
                        Нужны <code className="text-cream/80">TELEGRAM_BOT_TOKEN</code> и{' '}
                        <code className="text-cream/80">TELEGRAM_CHAT_ID</code> в .env бэкенда.
                    </p>
                    <Button type="submit" loading={sendVinyl.isPending}>
                        <Send className="h-4 w-4" />
                        Отправить
                    </Button>
                </div>
            </form>
        </section>
    );
}
