import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';

interface StarsProps {
    value: number;
    size?: number;
    onChange?: (value: number) => void;
    className?: string;
    label?: string;
}

export function Stars({ value, size = 16, onChange, className, label }: StarsProps) {
    const rounded = Math.round(value);
    const interactive = Boolean(onChange);

    return (
        <div
            className={cn('inline-flex items-center gap-0.5', className)}
            role={interactive ? 'radiogroup' : undefined}
            aria-label={label ?? (interactive ? 'Оценка' : `Оценка: ${value.toFixed(1)} из 5`)}
        >
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = rounded >= star;
                const icon = (
                    <Star
                        style={{ width: size, height: size }}
                        className={cn('transition', filled ? 'text-brass-400' : 'text-ink-600')}
                        fill={filled ? 'currentColor' : 'none'}
                        strokeWidth={1.5}
                    />
                );

                if (!interactive) return <span key={star}>{icon}</span>;

                return (
                    <button
                        key={star}
                        type="button"
                        role="radio"
                        aria-checked={value === star}
                        aria-label={`${star} из 5`}
                        onClick={() => onChange?.(star)}
                        className="rounded p-0.5 transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-500/50"
                    >
                        {icon}
                    </button>
                );
            })}
            {interactive && value > 0 && <span className="ml-2 text-sm text-muted">{value} / 5</span>}
        </div>
    );
}
