import type {
    AuthResponse,
    CreateReviewInput,
    CreateVinylInput,
    DiscogsVinyl,
    HealthResponse,
    LogEntry,
    LoginInput,
    Purchase,
    RegisterInput,
    Review,
    SendVinylInput,
    UpdateProfileInput,
    UpdateVinylInput,
    User,
    Vinyl,
    VinylPage,
} from '@/types/api';

const TOKEN_KEY = 'vinyl_store_token';
export const UNAUTHORIZED_EVENT = 'vinyl:unauthorized';

const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '') || '/api';

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export function getToken(): string | null {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
}

export function setToken(token: string): void {
    try {
        localStorage.setItem(TOKEN_KEY, token);
    } catch {
        /* storage may be unavailable (private mode) */
    }
}

export function clearToken(): void {
    try {
        localStorage.removeItem(TOKEN_KEY);
    } catch {
        /* ignore */
    }
}

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
    signal?: AbortSignal;
}

function extractMessage(data: unknown): string | null {
    if (!data || typeof data !== 'object') return null;
    const message = (data as { message?: unknown }).message;
    if (Array.isArray(message)) return message.join('. ');
    if (typeof message === 'string' && message.trim()) return message;
    return null;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, signal } = options;
    const token = getToken();
    const headers: Record<string, string> = { Accept: 'application/json' };

    if (token) headers.Authorization = `Bearer ${token}`;
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    let response: Response;
    try {
        response = await fetch(`${API_BASE}${path}`, {
            method,
            headers,
            signal,
            body: body === undefined ? undefined : JSON.stringify(body),
        });
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') throw error;
        throw new ApiError('Не удалось связаться с сервером. Проверьте, запущен ли бэкенд.', 0);
    }

    if (response.status === 204) return undefined as T;

    const text = await response.text();
    let data: unknown = null;
    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
    }

    if (!response.ok) {
        if (response.status === 401 && token) {
            window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
        }
        const fallback =
            response.status === 401
                ? 'Требуется авторизация'
                : `Ошибка запроса (${response.status})`;
        throw new ApiError(extractMessage(data) ?? fallback, response.status);
    }

    return data as T;
}

type QueryValue = string | number | undefined | null | false;

function toQuery(params: Record<string, QueryValue>): string {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '' || value === false) return;
        search.set(key, String(value));
    });
    const query = search.toString();
    return query ? `?${query}` : '';
}

export interface VinylListParams {
    limit?: number;
    offset?: number;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
    searchBy?: string;
    searchTerm?: string;
}

export const api = {
    auth: {
        register: (input: RegisterInput) =>
            request<AuthResponse>('/auth/register', { method: 'POST', body: input }),
        login: (input: LoginInput) =>
            request<AuthResponse>('/auth/login', { method: 'POST', body: input }),
    },
    users: {
        profile: (signal?: AbortSignal) => request<User>('/users/profile', { signal }),
        update: (input: UpdateProfileInput) =>
            request<User>('/users/profile', { method: 'PUT', body: input }),
        remove: () => request<void>('/users/profile', { method: 'DELETE' }),
    },
    vinyls: {
        list: (params: VinylListParams = {}) =>
            request<VinylPage>(
                `/vinyls${toQuery({
                    limit: params.limit,
                    offset: params.offset,
                    sortBy: params.sortBy,
                    order: params.order,
                    searchBy: params.searchBy,
                    searchTerm: params.searchTerm,
                })}`,
            ),
        get: (id: number, signal?: AbortSignal) =>
            request<Vinyl>(`/vinyls/${id}`, { signal }),
        create: (input: CreateVinylInput) =>
            request<Vinyl>('/vinyls', { method: 'POST', body: input }),
        update: (id: number, input: UpdateVinylInput) =>
            request<Vinyl>(`/vinyls/${id}`, { method: 'PUT', body: input }),
        remove: (id: number) => request<void>(`/vinyls/${id}`, { method: 'DELETE' }),
        reviews: (id: number, page: number, limit: number, signal?: AbortSignal) =>
            request<Review[]>(`/vinyls/${id}/reviews${toQuery({ page, limit })}`, {
                signal,
            }),
        addReview: (id: number, input: CreateReviewInput) =>
            request<Review>(`/vinyls/${id}/reviews`, { method: 'POST', body: input }),
    },
    reviews: {
        remove: (id: number) => request<void>(`/reviews/${id}`, { method: 'DELETE' }),
    },
    purchases: {
        create: (vinylId: number, currency: string) =>
            request<Purchase>('/purchases', {
                method: 'POST',
                body: { vinylId, currency },
            }),
    },
    discogs: {
        get: (id: number, signal?: AbortSignal) =>
            request<DiscogsVinyl>(`/discogs/vinyls/${id}`, { signal }),
        scores: (id: number, signal?: AbortSignal) =>
            request<DiscogsVinyl>(`/discogs/vinyls/${id}/scores`, { signal }),
        import: (id: number) =>
            request<Vinyl>(`/discogs/vinyls/${id}`, { method: 'POST' }),
    },
    telegram: {
        sendVinyl: (input: SendVinylInput) =>
            request<unknown>('/telegram/sendVinyl', { method: 'POST', body: input }),
    },
    logs: {
        list: (signal?: AbortSignal) => request<LogEntry[]>('/logs', { signal }),
    },
    health: (signal?: AbortSignal) => request<HealthResponse>('/health', { signal }),
};
