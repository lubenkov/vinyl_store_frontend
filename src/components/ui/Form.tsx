import {
    forwardRef,
    type InputHTMLAttributes,
    type ReactNode,
    type SelectHTMLAttributes,
    type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/lib/cn';

const controlClasses =
    'w-full rounded-xl border border-ink-600 bg-ink-900 px-3.5 py-2.5 text-sm text-cream placeholder:text-muted/50 transition focus:border-brass-500 focus:outline-none focus:ring-2 focus:ring-brass-500/20 disabled:cursor-not-allowed disabled:opacity-50';

interface FieldProps {
    label: string;
    htmlFor?: string;
    hint?: string;
    error?: string;
    className?: string;
    children: ReactNode;
}

export function Field({ label, htmlFor, hint, error, className, children }: FieldProps) {
    return (
        <div className={cn('space-y-1.5', className)}>
            <label htmlFor={htmlFor} className="block text-xs font-medium uppercase tracking-wider text-muted">
                {label}
            </label>
            {children}
            {error ? (
                <p className="text-xs text-red-400">{error}</p>
            ) : hint ? (
                <p className="text-xs text-muted/80">{hint}</p>
            ) : null}
        </div>
    );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    function Input({ className, ...props }, ref) {
        return <input ref={ref} className={cn(controlClasses, className)} {...props} />;
    },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
    function Textarea({ className, ...props }, ref) {
        return <textarea ref={ref} className={cn(controlClasses, 'min-h-28 resize-y', className)} {...props} />;
    },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
    function Select({ className, children, ...props }, ref) {
        return (
            <select ref={ref} className={cn(controlClasses, 'appearance-none pr-9', className)} {...props}>
                {children}
            </select>
        );
    },
);
