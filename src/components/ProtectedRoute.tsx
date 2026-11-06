import type { ReactNode } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/context/I18nContext';
import { Spinner } from '@/components/ui/States';
import { buttonStyles } from '@/components/ui/Button';

interface ProtectedRouteProps {
    children: ReactNode;
    role?: 'admin';
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const { t } = useI18n();
    const location = useLocation();

    if (loading) {
        return (
            <div className="container-page py-24">
                <Spinner />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (role && user.role !== role) {
        return (
            <div className="container-page py-24">
                <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-12 text-center">
                    <ShieldAlert className="h-10 w-10 text-red-400" />
                    <h1 className="font-display text-2xl text-cream">
                        {t('protected.title')}
                    </h1>
                    <p className="text-sm text-muted">
                        {t('protected.description')}
                    </p>
                    <Link to="/" className={buttonStyles('secondary', 'sm')}>
                        {t('protected.back')}
                    </Link>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
