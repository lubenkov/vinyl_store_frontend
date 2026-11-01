import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
};

const FOCUSABLE =
    'a[href], button:not([disabled]), textarea, input:not([type="hidden"]), select, [tabindex]:not([tabindex="-1"])';

export function Modal({ open, onClose, title, description, children, footer, size = 'md' }: ModalProps) {
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        const previous = document.activeElement as HTMLElement | null;

        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
                return;
            }
            if (event.key !== 'Tab') return;
            const panel = panelRef.current;
            if (!panel) return;
            const nodes = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
                (node) => node.tabIndex !== -1,
            );
            if (nodes.length === 0) return;
            const first = nodes[0];
            const last = nodes[nodes.length - 1];
            if (event.shiftKey) {
                if (document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                }
            } else if (document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKey);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        window.setTimeout(() => {
            const panel = panelRef.current;
            if (!panel) return;
            const nodes = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
            if (nodes.length > 0) nodes[0].focus();
            else panel.focus();
        }, 0);

        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = previousOverflow;
            previous?.focus?.();
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                tabIndex={-1}
                className={cn(
                    'relative z-10 w-full overflow-hidden rounded-t-2xl border border-ink-700 bg-ink-900 shadow-card animate-fade-up focus:outline-none sm:rounded-2xl',
                    sizes[size],
                )}
            >
                <div className="flex items-start justify-between gap-4 border-b border-ink-800 px-5 py-4">
                    <div>
                        <h2 id="modal-title" className="font-display text-xl text-cream">
                            {title}
                        </h2>
                        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-muted transition hover:bg-ink-800 hover:text-cream"
                        aria-label="Закрыть"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
                {footer && <div className="border-t border-ink-800 px-5 py-4">{footer}</div>}
            </div>
        </div>
    );
}