import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { cn } from '@/lib/cn';

type ToastKind = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    kind: ToastKind;
}

interface ToastContextValue {
    notify: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const kindStyles: Record<ToastKind, string> = {
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100',
    error: 'border-red-500/30 bg-red-500/10 text-red-100',
    info: 'border-brass-500/30 bg-brass-500/10 text-brass-200',
};

const kindIcons: Record<ToastKind, ReactNode> = {
    success: <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />,
    error: <XCircle className="h-5 w-5 shrink-0 text-red-400" />,
    info: <Info className="h-5 w-5 shrink-0 text-brass-400" />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
    const { t } = useI18n();
    const [toasts, setToasts] = useState<Toast[]>([]);
    const nextId = useRef(0);

    const dismiss = useCallback((id: number) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const notify = useCallback(
        (message: string, kind: ToastKind = 'info') => {
            const id = nextId.current++;
            setToasts((current) => [...current, { id, message, kind }]);
            window.setTimeout(() => dismiss(id), 5000);
        },
        [dismiss],
    );

    const value = useMemo(() => ({ notify }), [notify]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        role="status"
                        className={cn(
                            'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-card backdrop-blur animate-fade-up',
                            kindStyles[toast.kind],
                        )}
                    >
                        {kindIcons[toast.kind]}
                        <p className="flex-1 leading-snug">{toast.message}</p>
                        <button
                            type="button"
                            onClick={() => dismiss(toast.id)}
                            className="rounded p-0.5 text-cream/60 transition hover:text-cream"
                            aria-label={t('toast.close')}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextValue {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used inside <ToastProvider>');
    return context;
}
