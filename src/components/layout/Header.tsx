import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Disc3, LogOut, Menu, ShieldCheck, UserRound, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/cn';
import { initials } from '@/lib/format';
import { Button, buttonStyles } from '@/components/ui/Button';

function navLinkClass({ isActive }: { isActive: boolean }): string {
    return cn(
        'rounded-lg px-3 py-2 text-sm transition',
        isActive ? 'bg-ink-800 text-cream' : 'text-muted hover:bg-ink-800/60 hover:text-cream',
    );
}

export function Header() {
    const { user, loading, isAdmin, signOut } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    const handleSignOut = () => {
        signOut();
        navigate('/');
    };

    const authBlock = user ? (
        <div className="flex items-center gap-2">
            {isAdmin && (
                <Link to="/admin" className={buttonStyles('ghost', 'sm')}>
                    <ShieldCheck className="h-4 w-4" />
                    Админка
                </Link>
            )}
            <Link
                to="/profile"
                className="flex items-center gap-2 rounded-xl border border-ink-700 px-2 py-1.5 transition hover:border-brass-500/50"
            >
                {user.avatar ? (
                    <img
                        src={user.avatar}
                        alt=""
                        className="h-7 w-7 rounded-full object-cover"
                    />
                ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brass-500 text-xs font-semibold text-ink-950">
                        {initials(user.firstName, user.lastName)}
                    </span>
                )}
                <span className="max-w-28 truncate text-sm text-cream">{user.firstName}</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut} aria-label="Выйти">
                <LogOut className="h-4 w-4" />
            </Button>
        </div>
    ) : (
        <div className="flex items-center gap-2">
            <Link to="/login" className={buttonStyles('ghost', 'sm')}>
                Войти
            </Link>
            <Link to="/register" className={buttonStyles('primary', 'sm')}>
                Регистрация
            </Link>
        </div>
    );

    return (
        <header className="sticky top-0 z-40 border-b border-ink-800/80 bg-ink-950/85 backdrop-blur">
            <div className="container-page flex h-16 items-center justify-between gap-4">
                <Link to="/" className="flex items-center gap-2.5" aria-label="На главную">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brass-400 to-brass-600 text-ink-950">
                        <Disc3 className="h-5 w-5" />
                    </span>
                    <span className="leading-none">
                        <span className="block font-display text-lg font-semibold tracking-wide text-cream">
                            Vinyl Store
                        </span>
                        <span className="mt-1 block text-[10px] uppercase tracking-[0.22em] text-muted">
                            виниловая лавка
                        </span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-1 md:flex">
                    <NavLink to="/" end className={navLinkClass}>
                        Каталог
                    </NavLink>
                    {user && (
                        <NavLink to="/profile" className={navLinkClass}>
                            Профиль
                        </NavLink>
                    )}
                    {isAdmin && (
                        <NavLink to="/admin" className={navLinkClass}>
                            Управление
                        </NavLink>
                    )}
                </nav>

                <div className="hidden items-center md:flex">
                    {loading ? (
                        <div className="h-9 w-40 animate-pulse rounded-xl bg-ink-800" />
                    ) : (
                        authBlock
                    )}
                </div>

                <button
                    type="button"
                    className="rounded-lg border border-ink-700 p-2 text-muted transition hover:text-cream md:hidden"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-expanded={menuOpen}
                    aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
                >
                    {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {menuOpen && (
                <div className="border-t border-ink-800 bg-ink-950/95 px-4 py-4 md:hidden">
                    <nav className="flex flex-col gap-1">
                        <NavLink to="/" end className={navLinkClass}>
                            Каталог
                        </NavLink>
                        {user && (
                            <NavLink to="/profile" className={navLinkClass}>
                                <span className="inline-flex items-center gap-2">
                                    <UserRound className="h-4 w-4" />
                                    Профиль
                                </span>
                            </NavLink>
                        )}
                        {isAdmin && (
                            <NavLink to="/admin" className={navLinkClass}>
                                <span className="inline-flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4" />
                                    Управление
                                </span>
                            </NavLink>
                        )}
                    </nav>
                    <div className="mt-4 border-t border-ink-800 pt-4">
                        {loading ? (
                            <div className="h-9 w-full animate-pulse rounded-xl bg-ink-800" />
                        ) : user ? (
                            <div className="flex items-center justify-between gap-3">
                                <Link to="/profile" className="text-sm text-cream">
                                    {user.firstName} {user.lastName}
                                </Link>
                                <Button variant="secondary" size="sm" onClick={handleSignOut}>
                                    <LogOut className="h-4 w-4" />
                                    Выйти
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link
                                    to="/login"
                                    className={buttonStyles('secondary', 'sm', 'w-full')}
                                >
                                    Войти
                                </Link>
                                <Link
                                    to="/register"
                                    className={buttonStyles('primary', 'sm', 'w-full')}
                                >
                                    Регистрация
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
