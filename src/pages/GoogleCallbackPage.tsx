import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { buttonStyles } from '@/components/ui/Button';
import { EmptyState, Spinner } from '@/components/ui/States';

export function GoogleCallbackPage() {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(location.hash.replace(/^#/, ''));
        const accessToken = params.get('accessToken');

        if (!accessToken) {
            setError('Google не вернул токен. Попробуйте войти ещё раз.');
            return;
        }

        // Do not keep the token in the address bar or browser history.
        window.history.replaceState(
            null,
            '',
            `${location.pathname}${location.search}`,
        );
        signIn(accessToken);
        navigate('/', { replace: true });
    }, [location.hash, location.pathname, location.search, navigate, signIn]);

    if (error) {
        return (
            <div className="container-page py-16">
                <EmptyState
                    title="Вход через Google не удался"
                    description={error}
                    action={
                        <Link to="/login" className={buttonStyles('secondary', 'md')}>
                            Вернуться ко входу
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
