import type { ReactNode } from 'react';
import { Disc3 } from 'lucide-react';

export function AuthShell({
    title,
    subtitle,
    children,
    footer,
}: {
    title: string;
    subtitle: string;
    children: ReactNode;
    footer: ReactNode;
}) {
    return (
        <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
            <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-ink-700 bg-ink-900/60 shadow-card md:grid-cols-[1fr_1.1fr]">
                <div className="relative hidden overflow-hidden border-r border-ink-800 bg-[radial-gradient(circle_at_30%_20%,#231f1b,#0b0a09_70%)] p-10 md:flex md:flex-col md:justify-between">
                    <div className="relative z-10">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brass-400 to-brass-600 text-ink-950">
                            <Disc3 className="h-5 w-5" />
                        </span>
                        <p className="mt-6 font-display text-3xl leading-tight text-cream">
                            Музыка звучит лучше, когда она ваша.
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-muted">
                            Войдите, чтобы оставлять отзывы, оформлять заказы и следить за
                            историей покупок.
                        </p>
                    </div>
                    <div className="relative z-10 mt-10 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted">
                        <span className="h-px flex-1 bg-ink-700" />
                        vinyl store
                    </div>
                    <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 animate-spin-slow rounded-full border border-ink-700 bg-[repeating-radial-gradient(circle_at_center,#151312_0px,#151312_2px,#0b0a09_3px,#0b0a09_6px)] opacity-80">
                        <div className="absolute inset-[40%] rounded-full bg-brass-500/80" />
                    </div>
                </div>

                <div className="p-6 sm:p-10">
                    <h1 className="font-display text-3xl text-cream">{title}</h1>
                    <p className="mt-2 text-sm text-muted">{subtitle}</p>
                    <div className="mt-8">{children}</div>
                    <div className="mt-6 border-t border-ink-800 pt-5 text-sm text-muted">
                        {footer}
                    </div>
                </div>
            </div>
        </div>
    );
}
