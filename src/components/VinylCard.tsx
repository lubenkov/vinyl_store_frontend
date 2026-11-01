import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { VinylCover } from '@/components/VinylCover';
import { Stars } from '@/components/ui/Stars';
import { averageScore, formatPrice, pluralize } from '@/lib/format';
import type { Vinyl } from '@/types/api';

export function VinylCard({ vinyl }: { vinyl: Vinyl }) {
    const score = averageScore(vinyl.reviews);
    const reviewCount = vinyl.reviews?.length ?? 0;

    return (
        <Link
            to={`/vinyls/${vinyl.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/70 transition duration-300 hover:-translate-y-1 hover:border-brass-500/50 hover:shadow-glow"
        >
            <VinylCover vinyl={vinyl} rounded={false} />
            <div className="flex flex-1 flex-col p-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                    {vinyl.author || 'Неизвестный исполнитель'}
                </p>
                <h3 className="mt-1 line-clamp-2 font-display text-lg leading-snug text-cream">
                    {vinyl.name}
                </h3>

                <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                    <span className="text-base font-semibold text-brass-400">
                        {formatPrice(vinyl.price)}
                    </span>
                    {score !== null ? (
                        <span className="flex items-center gap-1.5">
                            <Stars value={score} size={12} />
                            <span className="text-xs text-muted">{score.toFixed(1)}</span>
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-xs text-muted/70">
                            <MessageSquare className="h-3.5 w-3.5" />
                            {reviewCount === 0
                                ? 'без отзывов'
                                : `${reviewCount} ${pluralize(reviewCount, ['отзыв', 'отзыва', 'отзывов'])}`}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
