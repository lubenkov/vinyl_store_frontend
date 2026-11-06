import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { LogIn } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/context/I18nContext';
import { useToast } from '@/context/ToastContext';
import { AuthShell } from '@/components/auth/AuthShell';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Form';

interface LocationState {
    from?: { pathname?: string };
}

export function LoginPage() {
    const { user, signIn } = useAuth();
    const { t } = useI18n();
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
            setError(t('login.googleAccountExists'));
        } else if (code === 'google_email_not_verified') {
            setError(t('login.googleEmailNotVerified'));
        } else if (code === 'google') {
            setError(t('login.googleFailed'));
        }
    }, [location.search, t]);

    const login = useMutation({
        mutationFn: api.auth.login,
        onSuccess: (data) => {
            signIn(data.accessToken);
            notify(t('login.success'), 'success');
            navigate(from, { replace: true });
        },
        onError: (mutationError: Error) => setError(mutationError.message),
    });

    if (user) return <Navigate to={from} replace />;

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        if (!email.trim() || !password) {
            setError(t('login.missing'));
            return;
        }
        login.mutate({ email: email.trim(), password });
    };

    return (
        <AuthShell
            title={t('login.title')}
            subtitle={t('login.subtitle')}
            footer={
                <span>
                    {t('login.noAccount')}{' '}
                    <Link to="/register" state={location.state} className="text-brass-400 link-underline">
                        {t('login.register')}
                    </Link>
                </span>
            }
        >
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <Field label={t('login.email')} htmlFor="login-email">
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
                <Field label={t('login.password')} htmlFor="login-password">
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
                    {t('login.submit')}
                </Button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-muted">
                <span className="h-px flex-1 bg-ink-700" />
                {t('common.or')}
                <span className="h-px flex-1 bg-ink-700" />
            </div>

            <GoogleAuthButton onError={setError} className="w-full" />
        </AuthShell>
    );
}
