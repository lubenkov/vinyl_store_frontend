import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
    primary:
        'bg-brass-500 text-ink-950 hover:bg-brass-400 focus-visible:ring-brass-400 shadow-glow',
    secondary:
        'border border-ink-600 bg-ink-800 text-cream hover:border-brass-500/60 hover:bg-ink-700 focus-visible:ring-brass-500/40',
    ghost:
        'text-cream/80 hover:bg-ink-800 hover:text-cream focus-visible:ring-ink-600',
    danger:
        'bg-red-500/90 text-white hover:bg-red-500 focus-visible:ring-red-400',
};

const sizes: Record<Size, string> = {
    sm: 'h-9 gap-1.5 px-3 text-sm',
    md: 'h-11 gap-2 px-4 text-sm',
    lg: 'h-12 gap-2 px-6 text-base',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
}

const baseClasses =
    'inline-flex items-center justify-center rounded-xl font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 disabled:cursor-not-allowed disabled:opacity-50';

export function buttonStyles(
    variant: Variant = 'primary',
    size: Size = 'md',
    className?: string,
): string {
    return cn(baseClasses, variants[variant], sizes[size], className);
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    { className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props },
    ref,
) {
    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={buttonStyles(variant, size, className)}
            {...props}
        >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
});
