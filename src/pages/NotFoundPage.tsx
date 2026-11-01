import { Link } from 'react-router-dom';
import { Disc3 } from 'lucide-react';
import { buttonStyles } from '@/components/ui/Button';

export function NotFoundPage() {
    return (
        <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
            <Disc3 className="h-12 w-12 text-brass-500/80" />
            <p className="mt-6 font-display text-6xl text-cream">404</p>
            <h1 className="mt-2 font-display text-2xl text-cream">Иголка соскочила</h1>
            <p className="mt-3 max-w-md text-sm text-muted">
                Такой страницы нет. Вернитесь в каталог и выберите пластинку по вкусу.
            </p>
            <Link to="/" className={buttonStyles('primary', 'md', 'mt-6')}>
                В каталог
            </Link>
        </div>
    );
}
