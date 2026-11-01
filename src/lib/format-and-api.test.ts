import { describe, expect, it } from 'vitest';
import { ApiError } from './api';
import { averageScore, formatPrice, pluralize } from './format';

describe('formatPrice', () => {
    it('formats a number', () => expect(formatPrice(19.99)).toBe('$19.99'));
    it('formats a numeric string', () => expect(formatPrice('5')).toBe('$5.00'));
    it('returns an em dash for invalid input', () => expect(formatPrice('abc')).toBe('—'));
});

describe('pluralize', () => {
    const forms: [string, string, string] = ['пластинка', 'пластинки', 'пластинок'];
    it('singular', () => expect(pluralize(1, forms)).toBe('пластинка'));
    it('few', () => expect(pluralize(2, forms)).toBe('пластинки'));
    it('many', () => expect(pluralize(10, forms)).toBe('пластинок'));
});

describe('averageScore', () => {
    it('null for empty list', () =>
        expect(averageScore(null)).toBeNull());
    it('computes the average', () =>
        expect(averageScore([{ score: 4 }, { score: 6 }] as never)).toBe(5));
});

describe('ApiError', () => {
    it('carries status and message', () => {
        const error = new ApiError('boom', 404);
        expect(error.status).toBe(404);
        expect(error.message).toBe('boom');
        expect(error.name).toBe('ApiError');
    });
});