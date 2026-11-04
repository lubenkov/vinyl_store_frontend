export const OAUTH_STATE_KEY = 'vinyl_store_oauth_state';

export function createOAuthState(): string {
    const cryptoApi = globalThis.crypto;

    if (typeof cryptoApi?.randomUUID === 'function') {
        return cryptoApi.randomUUID();
    }

    if (typeof cryptoApi?.getRandomValues === 'function') {
        const bytes = new Uint8Array(16);
        cryptoApi.getRandomValues(bytes);
        return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
    }

    throw new Error('Secure random source is unavailable');
}
