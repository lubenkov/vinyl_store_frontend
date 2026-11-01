import { useRef } from 'react';
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
    const refs = useRef<(HTMLButtonElement | null)[]>([]);

    return (
        <div
            className={cn('inline-flex items-center gap-0.5', className)}
            role={interactive ? 'radiogroup' : undefined}
            aria-label={label ?? (interactive ? 'Оценка' : `Оценка: ${value.toFixed(1)} из 5`)}
        >
            {[1, 2, 3, 4, 5].map((star, index) => {
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
                        ref={(el) => (refs.current[index] = el)}
                        type="button"
                        role="radio"
                        aria-checked={value === star}
                        aria-label={`${star} из 5`}
                        tabIndex={star === Math.max(1, Math.round(value || 1)) ? 0 : -1}
                        onClick={() => onChange?.(star)}
                        onKeyDown={(event) => {
                            if (!onChange) return;
                            let next = value;
                            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                                next = Math.min(5, Math.max(1, (value || 0) + 1));
                            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                                next = Math.max(1, (value || 2) - 1);
                            } else {
                                return;
                            }
                            event.preventDefault();
                            if (next !== value) {
                                onChange(next);
                                window.setTimeout(() => refs.current[next - 1]?.focus(), 0);
                            }
                        }}
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
