import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { formatDate, formatDateTime, formatPrice } from '@/lib/format';
import {
    getStoredLanguage,
    setCurrentLanguage,
    storeLanguage,
    translate,
    type Language,
    type TranslationKey,
    type TranslationParams,
} from '@/i18n/translations';

interface I18nContextValue {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: TranslationKey, params?: TranslationParams) => string;
    formatPrice: (value: number | string | null | undefined) => string;
    formatDate: (value: string | null | undefined) => string;
    formatDateTime: (value: string | null | undefined) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => getStoredLanguage());

    const setLanguage = useCallback((next: Language) => {
        setLanguageState(next);
        storeLanguage(next);
    }, []);

    useEffect(() => {
        setCurrentLanguage(language);
        document.documentElement.lang = language;
        document.title = translate(language, 'meta.title');
        const meta = document.querySelector('meta[name="description"]');
        if (meta) {
            meta.setAttribute('content', translate(language, 'meta.description'));
        }
    }, [language]);

    const value = useMemo<I18nContextValue>(
        () => ({
            language,
            setLanguage,
            t: (key, params) => translate(language, key, params),
            formatPrice: (value) => formatPrice(value, language),
            formatDate: (value) => formatDate(value, language),
            formatDateTime: (value) => formatDateTime(value, language),
        }),
        [language, setLanguage],
    );

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
    const context = useContext(I18nContext);
    if (!context) throw new Error('useI18n must be used inside <I18nProvider>');
    return context;
}
