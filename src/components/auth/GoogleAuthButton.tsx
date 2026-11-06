import { apiUrl } from '@/lib/api';
import { OAUTH_STATE_KEY, createOAuthState } from '@/lib/oauth';
import { useI18n } from '@/context/I18nContext';
import { buttonStyles } from '@/components/ui/Button';

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

interface GoogleAuthButtonProps {
    label?: string;
    className?: string;
    onError?: (message: string) => void;
}

export function GoogleAuthButton({
    label,
    className,
    onError,
}: GoogleAuthButtonProps) {
    const { t } = useI18n();

    const handleClick = () => {
        try {
            const state = createOAuthState();
            sessionStorage.setItem(OAUTH_STATE_KEY, state);
            window.location.assign(
                `${apiUrl('/auth/google')}?state=${encodeURIComponent(state)}`,
            );
        } catch {
            onError?.(t('google.browserBlocked'));
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={buttonStyles('secondary', 'md', className)}
        >
            <GoogleIcon />
            {label ?? t('auth.googleContinue')}
        </button>
    );
}
