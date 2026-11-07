import { Disc3, Github } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

const FRONTEND_REPO = 'https://github.com/lubenkov/vinyl_store_frontend';

export function Footer() {
    const { t } = useI18n();

    return (
        <footer className="mt-20 border-t border-ink-800 bg-ink-950/60">
            <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-800 text-brass-400">
                        <Disc3 className="h-5 w-5" />
                    </span>
                    <p className="font-display text-lg text-cream">Vinyl Store</p>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
                    <a
                        href={FRONTEND_REPO}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 link-underline"
                    >
                        <Github className="h-4 w-4" />
                        {t('footer.github')}
                    </a>
                    <span className="text-muted/60">{t('footer.license')}</span>
                </div>
            </div>
        </footer>
    );
}
