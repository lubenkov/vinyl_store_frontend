import type { Review } from '@/types/api';
import type { Language } from '@/i18n/translations';

const priceFormatters: Record<Language, Intl.NumberFormat> = {
    en: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }),
    ru: new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'USD',
    }),
};

const locales: Record<Language, string> = {
    en: 'en-US',
    ru: 'ru-RU',
};

const dateFormatters: Record<Language, Intl.DateTimeFormat> = {
    en: new Intl.DateTimeFormat(locales.en, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }),
    ru: new Intl.DateTimeFormat(locales.ru, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }),
};

const dateTimeFormatters: Record<Language, Intl.DateTimeFormat> = {
    en: new Intl.DateTimeFormat(locales.en, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }),
    ru: new Intl.DateTimeFormat(locales.ru, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }),
};

export function formatPrice(
    value: number | string | null | undefined,
    language: Language = 'en',
): string {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return '—';
    return priceFormatters[language].format(amount);
}

// Hide seeded demo descriptions until a real description is added.
const DESCRIPTION_PLACEHOLDER = /^Description for Vinyl \d+\.$/i;

export function cleanDescription(value: string | null | undefined): string {
    const text = value?.trim();
    if (!text || DESCRIPTION_PLACEHOLDER.test(text)) return '';
    return text;
}

export function formatDate(
    value: string | null | undefined,
    language: Language = 'en',
): string {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return dateFormatters[language].format(date);
}

export function formatDateTime(
    value: string | null | undefined,
    language: Language = 'en',
): string {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return dateTimeFormatters[language].format(date);
}

export function initials(firstName?: string | null, lastName?: string | null): string {
    const letters = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
    return letters || 'V';
}

export function averageScore(reviews?: Review[] | null): number | null {
    if (!reviews || reviews.length === 0) return null;
    const total = reviews.reduce((sum, review) => sum + Number(review.score), 0);
    return total / reviews.length;
}

export function pluralize(count: number, forms: [string, string, string]): string {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return forms[0];
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
    return forms[2];
}
