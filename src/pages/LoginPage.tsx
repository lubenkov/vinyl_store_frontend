import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { LogIn } from 'lucide-react';
import { api, apiUrl } from '@/lib/api';
import { createOAuthState, OAUTH_STATE_KEY } from '@/lib/oauth';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { AuthShell } from '@/components/auth/AuthShell';
import { Button, buttonStyles } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Form';

interface LocationState {
    from?: { pathname?: string };
}

function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.87z"
            />
            <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.88-3c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24z"
            />
            <path
                fill="#FBBC05"
                d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.29V6.62H1.29A12 12 0 0 0 0 12c0 1.94.46 3.77 1.29 5.38l3.98-3.09z"
            />
            <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
            />
        </svg>
    );
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

    useEffect(() => {
        const code = new URLSearchParams(location.search).get('error');
        if (code === 'google_account_exists') {
            setError(
                'Этот email уже зарегистрирован с паролем. Войдите с помощью пароля.',
            );
        } else if (code === 'google') {
            setError('Не удалось войти через Google. Попробуйте ещё раз.');
        }
    }, [location.search]);

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

    const handleGoogleLogin = () => {
        try {
            const state = createOAuthState();
            sessionStorage.setItem(OAUTH_STATE_KEY, state);
            window.location.assign(
                `${apiUrl('/auth/google')}?state=${encodeURIComponent(state)}`,
            );
        } catch {
            setError('Браузер не позволяет начать вход через Google.');
        }
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

            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-muted">
                <span className="h-px flex-1 bg-ink-700" />
                или
                <span className="h-px flex-1 bg-ink-700" />
            </div>

            <button
                type="button"
                onClick={handleGoogleLogin}
                className={buttonStyles('secondary', 'md', 'w-full')}
            >
                <GoogleIcon />
                Продолжить с Google
            </button>
        </AuthShell>
    );
}
