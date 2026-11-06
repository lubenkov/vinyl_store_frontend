import type { ReactNode } from 'react';
import { AlertTriangle, Disc3, Loader2, RefreshCw } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';

export function Spinner({ className = 'h-8 w-8' }: { className?: string }) {
    const { t } = useI18n();

    return (
        <div className="flex items-center justify-center py-16" role="status" aria-live="polite">
            <Loader2 className={`${className} animate-spin text-brass-500`} />
            <span className="sr-only">{t('common.loading')}</span>
        </div>
    );
}

export function EmptyState({
    title,
    description,
    action,
    icon,
}: {
    title: string;
    description?: string;
    action?: ReactNode;
    icon?: ReactNode;
}) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-700 px-6 py-16 text-center">
            <div className="mb-4 text-brass-500/80">{icon ?? <Disc3 className="h-10 w-10" />}</div>
            <h3 className="font-display text-xl text-cream">{title}</h3>
            {description && <p className="mt-2 max-w-md text-sm text-muted">{description}</p>}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}

export function ErrorState({
    message,
    onRetry,
    className,
}: {
    message: string;
    onRetry?: () => void;
    className?: string;
}) {
    const { t } = useI18n();

    return (
        <div
            className={`flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-12 text-center ${className ?? ''}`}
            role="alert"
        >
            <AlertTriangle className="h-8 w-8 text-red-400" />
            <p className="max-w-lg text-sm text-red-100">{message}</p>
            {onRetry && (
                <Button variant="secondary" size="sm" onClick={onRetry}>
                    <RefreshCw className="h-4 w-4" />
                    {t('common.retry')}
                </Button>
            )}
        </div>
    );
}
