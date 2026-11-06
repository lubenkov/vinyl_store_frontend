import { useI18n } from '@/context/I18nContext';
import { cn } from '@/lib/cn';
import type { Language } from '@/i18n/translations';

const OPTIONS: Array<{ value: Language; label: string }> = [
    { value: 'en', label: 'EN' },
    { value: 'ru', label: 'RU' },
];

export function LanguageSwitcher({ className }: { className?: string }) {
    const { language, setLanguage, t } = useI18n();

    return (
        <div
            role="group"
            aria-label={t('language.label')}
            className={cn(
                'inline-flex items-center rounded-full border border-ink-700 bg-ink-900/60 p-0.5',
                className,
            )}
        >
            {OPTIONS.map(({ value, label }) => (
                <button
                    key={value}
                    type="button"
                    onClick={() => setLanguage(value)}
                    aria-pressed={language === value}
                    title={value === 'en' ? t('language.en') : t('language.ru')}
                    className={cn(
                        'rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide transition',
                        language === value
                            ? 'bg-brass-500 text-ink-950'
                            : 'text-muted hover:text-cream',
                    )}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}
