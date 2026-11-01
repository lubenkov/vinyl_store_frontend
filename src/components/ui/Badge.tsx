import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'neutral' | 'brass' | 'green' | 'red' | 'blue';

const tones: Record<Tone, string> = {
    neutral: 'border-ink-600 bg-ink-800 text-muted',
    brass: 'border-brass-500/30 bg-brass-500/10 text-brass-300',
    green: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    red: 'border-red-500/30 bg-red-500/10 text-red-300',
    blue: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
};

export function Badge({
    children,
    tone = 'neutral',
    className,
}: {
    children: ReactNode;
    tone?: Tone;
    className?: string;
}) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
                tones[tone],
                className,
            )}
        >
            {children}
        </span>
    );
}
