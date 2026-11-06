import { useEffect, useState } from 'react';
import { Disc3 } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { cn } from '@/lib/cn';
import type { Vinyl } from '@/types/api';

const PLACEHOLDER_IMAGE = /no image available/i;

function isUsableImage(image: string | null | undefined): image is string {
    if (!image) return false;
    const trimmed = image.trim();
    return Boolean(trimmed) && !PLACEHOLDER_IMAGE.test(trimmed);
}

interface VinylCoverProps {
    vinyl: Pick<Vinyl, 'name' | 'image'>;
    className?: string;
    imgClassName?: string;
    rounded?: boolean;
    eager?: boolean;
}

export function VinylCover({
    vinyl,
    className,
    imgClassName,
    rounded = true,
    eager = false,
}: VinylCoverProps) {
    const { t } = useI18n();
    const src = vinyl.image;
    const usable = isUsableImage(src);
    const [failed, setFailed] = useState(!usable);

    useEffect(() => {
        setFailed(!usable);
    }, [usable, src]);

    return (
        <div
            className={cn(
                'relative aspect-square overflow-hidden bg-ink-850',
                rounded && 'rounded-xl',
                className,
            )}
        >
            {!failed && usable ? (
                <img
                    src={src}
                    alt={t('common.coverAlt', { name: vinyl.name })}
                    loading={eager ? 'eager' : 'lazy'}
                    onError={() => setFailed(true)}
                    className={cn(
                        'h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]',
                        imgClassName,
                    )}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_15%,#2a2522,#0b0a09_70%)]">
                    <div className="relative aspect-square w-[76%] rounded-full border border-ink-700 bg-[repeating-radial-gradient(circle_at_center,#171513_0px,#171513_2px,#0e0d0c_3px,#0e0d0c_5px)] shadow-[0_20px_45px_-15px_rgba(0,0,0,0.95)]">
                        <div className="absolute inset-[34%] flex items-center justify-center rounded-full bg-gradient-to-br from-brass-400 to-brass-600 font-display text-2xl font-semibold text-ink-950">
                            {(vinyl.name?.[0] ?? 'V').toUpperCase()}
                        </div>
                        <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-950 ring-1 ring-ink-700" />
                        <div className="absolute inset-[6%] rounded-full border border-white/5" />
                        <div className="absolute inset-[18%] rounded-full border border-white/5" />
                    </div>
                    <Disc3 className="absolute bottom-3 right-3 h-4 w-4 text-brass-500/50" />
                </div>
            )}
        </div>
    );
}
