import { NavLink, Outlet } from 'react-router-dom';
import { Disc3, Download, ScrollText, Send } from 'lucide-react';
import { cn } from '@/lib/cn';

const TABS = [
    { to: '/admin/vinyls', label: 'Пластинки', icon: Disc3 },
    { to: '/admin/discogs', label: 'Импорт из Discogs', icon: Download },
    { to: '/admin/telegram', label: 'Telegram', icon: Send },
    { to: '/admin/logs', label: 'Журнал действий', icon: ScrollText },
];

export function AdminLayout() {
    return (
        <div className="container-page py-8">
            <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.24em] text-brass-400">
                    Администрирование
                </p>
                <h1 className="font-display text-3xl text-cream sm:text-4xl">
                    Управление магазином
                </h1>
                <p className="max-w-2xl text-sm text-muted">
                    Каталог, импорт релизов, уведомления и журнал действий. Все изменения
                    пишутся в лог на стороне API.
                </p>
            </div>

            <div className="mt-6 overflow-x-auto">
                <nav className="flex min-w-max gap-1 rounded-xl border border-ink-700 bg-ink-900/60 p-1">
                    {TABS.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                cn(
                                    'inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm transition',
                                    isActive
                                        ? 'bg-brass-500 font-medium text-ink-950'
                                        : 'text-muted hover:bg-ink-800 hover:text-cream',
                                )
                            }
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="mt-8">
                <Outlet />
            </div>
        </div>
    );
}
