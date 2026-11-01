import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { LogIn } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { AuthShell } from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Form';

interface LocationState {
    from?: { pathname?: string };
}

export function LoginPage() {
    const { user, signIn } = useAuth();
    const { notify } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as LocationState | null)?.from?.pathname ?? '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const login = useMutation({
        mutationFn: api.auth.login,
        onSuccess: (data) => {
            signIn(data.accessToken);
            notify('Вы вошли в аккаунт.', 'success');
            navigate(from, { replace: true });
        },
        onError: (mutationError: Error) => setError(mutationError.message),
    });

    if (user) return <Navigate to={from} replace />;

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        if (!email.trim() || !password) {
            setError('Заполните email и пароль.');
            return;
        }
        login.mutate({ email: email.trim(), password });
    };

    return (
        <AuthShell
            title="Вход"
            subtitle="Введите email и пароль, чтобы продолжить."
            footer={
                <span>
                    Нет аккаунта?{' '}
                    <Link to="/register" state={location.state} className="text-brass-400 link-underline">
                        Зарегистрироваться
                    </Link>
                </span>
            }
        >
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <Field label="Email" htmlFor="login-email">
                    <Input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        required
                    />
                </Field>
                <Field label="Пароль" htmlFor="login-password">
                    <Input
                        id="login-password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="••••••••"
                        required
                    />
                </Field>

                {error && (
                    <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200" role="alert">
                        {error}
                    </p>
                )}

                <Button type="submit" className="w-full" loading={login.isPending}>
                    <LogIn className="h-4 w-4" />
                    Войти
                </Button>
            </form>

            <div className="mt-4 rounded-xl border border-ink-700 bg-ink-850 p-3 text-xs leading-relaxed text-muted">
                Вход через Google в API отдаёт JWT только в httpOnly-cookie, а защищённые
                маршруты ждут заголовок <code className="text-cream/80">Authorization</code>.
                Поэтому кнопка Google появится после доработки бэкенда.
            </div>
        </AuthShell>
    );
}
