import { describe, expect, it } from 'vitest';
import { translate } from './translations';

describe('translations', () => {
    it('defaults to English copy', () => {
        expect(translate('en', 'nav.catalog')).toBe('Catalog');
        expect(translate('en', 'login.title')).toBe('Sign in');
    });

    it('returns Russian copy', () => {
        expect(translate('ru', 'nav.catalog')).toBe('Каталог');
        expect(translate('ru', 'login.title')).toBe('Вход');
    });

    it('pluralizes English review counts', () => {
        expect(translate('en', 'common.reviewsCount', { count: 1 })).toBe('1 review');
        expect(translate('en', 'common.reviewsCount', { count: 2 })).toBe('2 reviews');
    });

    it('pluralizes Russian review counts', () => {
        expect(translate('ru', 'common.reviewsCount', { count: 1 })).toBe('1 отзыв');
        expect(translate('ru', 'common.reviewsCount', { count: 2 })).toBe('2 отзыва');
        expect(translate('ru', 'common.reviewsCount', { count: 5 })).toBe('5 отзывов');
    });

    it('interpolates parameters', () => {
        expect(translate('en', 'vinyl.user', { id: 42 })).toBe('User #42');
        expect(translate('ru', 'vinyl.user', { id: 42 })).toBe('Пользователь #42');
    });
});
