import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { UserPlus } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { AuthShell } from '@/components/auth/AuthShell';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Form';

interface LocationState {
    from?: { pathname?: string };
}

interface FormState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const INITIAL_FORM: FormState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
};

export function RegisterPage() {
    const { user, signIn } = useAuth();
    const { notify } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as LocationState | null)?.from?.pathname ?? '/';

    const [form, setForm] = useState<FormState>(INITIAL_FORM);
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
    const [serverError, setServerError] = useState<string | null>(null);

    const register = useMutation({
        mutationFn: api.auth.register,
        onSuccess: (data) => {
            signIn(data.accessToken);
            notify('Аккаунт создан. Добро пожаловать!', 'success');
            navigate(from, { replace: true });
        },
        onError: (mutationError: Error) => setServerError(mutationError.message),
    });

    if (user) return <Navigate to={from} replace />;

    const setField = (field: keyof FormState, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
    };

    const validate = (): boolean => {
        const next: Partial<Record<keyof FormState, string>> = {};
        if (!form.firstName.trim()) next.firstName = 'Укажите имя.';
        if (!form.lastName.trim()) next.lastName = 'Укажите фамилию.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            next.email = 'Введите корректный email.';
        }
        if (form.password.length < 8) {
            next.password = 'Пароль должен быть не короче 8 символов.';
        }
        if (form.confirmPassword !== form.password) {
            next.confirmPassword = 'Пароли не совпадают.';
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setServerError(null);
        if (!validate()) return;
        register.mutate({
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            password: form.password,
        });
    };

    return (
        <AuthShell
            title="Регистрация"
            subtitle="Создайте аккаунт, чтобы покупать пластинки и писать отзывы."
            footer={
                <span>
                    Уже есть аккаунт?{' '}
                    <Link to="/login" state={location.state} className="text-brass-400 link-underline">
                        Войти
                    </Link>
                </span>
            }
        >
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Имя" htmlFor="register-first-name" error={errors.firstName}>
                        <Input
                            id="register-first-name"
                            value={form.firstName}
                            onChange={(event) => setField('firstName', event.target.value)}
                            autoComplete="given-name"
                            placeholder="Иван"
                            required
                        />
                    </Field>
                    <Field label="Фамилия" htmlFor="register-last-name" error={errors.lastName}>
                        <Input
                            id="register-last-name"
                            value={form.lastName}
                            onChange={(event) => setField('lastName', event.target.value)}
                            autoComplete="family-name"
                            placeholder="Петров"
                            required
                        />
                    </Field>
                </div>

                <Field label="Email" htmlFor="register-email" error={errors.email}>
                    <Input
                        id="register-email"
                        type="email"
                        value={form.email}
                        onChange={(event) => setField('email', event.target.value)}
                        autoComplete="email"
                        placeholder="you@example.com"
                        required
                    />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                        label="Пароль"
                        htmlFor="register-password"
                        hint="Минимум 8 символов"
                        error={errors.password}
                    >
                        <Input
                            id="register-password"
                            type="password"
                            value={form.password}
                            onChange={(event) => setField('password', event.target.value)}
                            autoComplete="new-password"
                            placeholder="••••••••"
                            required
                        />
                    </Field>
                    <Field
                        label="Повторите пароль"
                        htmlFor="register-confirm"
                        error={errors.confirmPassword}
                    >
                        <Input
                            id="register-confirm"
                            type="password"
                            value={form.confirmPassword}
                            onChange={(event) => setField('confirmPassword', event.target.value)}
                            autoComplete="new-password"
                            placeholder="••••••••"
                            required
                        />
                    </Field>
                </div>

                {serverError && (
                    <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200" role="alert">
                        {serverError}
                    </p>
                )}

                <Button type="submit" className="w-full" loading={register.isPending}>
                    <UserPlus className="h-4 w-4" />
                    Создать аккаунт
                </Button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-muted">
                <span className="h-px flex-1 bg-ink-700" />
                или
                <span className="h-px flex-1 bg-ink-700" />
            </div>

            <GoogleAuthButton
                label="Зарегистрироваться через Google"
                onError={setServerError}
                className="w-full"
            />
        </AuthShell>
    );
}
