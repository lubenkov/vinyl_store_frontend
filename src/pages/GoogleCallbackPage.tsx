import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/context/I18nContext';
import { OAUTH_STATE_KEY } from '@/lib/oauth';
import { buttonStyles } from '@/components/ui/Button';
import { EmptyState, Spinner } from '@/components/ui/States';

type CallbackError = 'missingToken' | 'stateMismatch' | null;

export function GoogleCallbackPage() {
    const { signIn } = useAuth();
    const { t } = useI18n();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState<CallbackError>(null);

    useEffect(() => {
        const params = new URLSearchParams(location.hash.replace(/^#/, ''));
        const accessToken = params.get('accessToken');
        const state = params.get('state');
        let expectedState: string | null = null;

        try {
            expectedState = sessionStorage.getItem(OAUTH_STATE_KEY);
            sessionStorage.removeItem(OAUTH_STATE_KEY);
        } catch {
            /* storage may be unavailable */
        }

        // Do not keep the token in the address bar or browser history.
        window.history.replaceState(
            null,
            '',
            `${location.pathname}${location.search}`,
        );

        if (!accessToken) {
            setError('missingToken');
            return;
        }

        if (!state || !expectedState || state !== expectedState) {
            setError('stateMismatch');
            return;
        }

        signIn(accessToken);
        navigate('/', { replace: true });
    }, [location.hash, location.pathname, location.search, navigate, signIn]);

    if (error) {
        return (
            <div className="container-page py-16">
                <EmptyState
                    title={t('google.failedTitle')}
                    description={
                        error === 'missingToken'
                            ? t('google.missingToken')
                            : t('google.stateMismatch')
                    }
                    action={
                        <Link to="/login" className={buttonStyles('secondary', 'md')}>
                            {t('google.backToLogin')}
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
        <div className="container-page py-24">
            <Spinner />
        </div>
    );
}
