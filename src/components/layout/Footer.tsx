import { Link } from 'react-router-dom';
import { Disc3, Github } from 'lucide-react';

export function Footer() {
    return (
        <footer className="mt-20 border-t border-ink-800 bg-ink-950/60">
            <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-800 text-brass-400">
                        <Disc3 className="h-5 w-5" />
                    </span>
                    <div>
                        <p className="font-display text-lg text-cream">Vinyl Store</p>
                        <p className="mt-1 max-w-sm text-sm text-muted">
                            Фронтенд для REST API винилового магазина: каталог, отзывы,
                            покупки и админ-панель.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
                    <Link to="/" className="link-underline">
                        Каталог
                    </Link>
                    <a
                        href="https://github.com/lubenkov/vinyl_store"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 link-underline"
                    >
                        <Github className="h-4 w-4" />
                        Бэкенд на GitHub
                    </a>
                    <span className="text-muted/60">MIT License</span>
                </div>
            </div>
        </footer>
    );
}
