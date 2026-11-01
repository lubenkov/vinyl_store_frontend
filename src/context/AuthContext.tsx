import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import {
    UNAUTHORIZED_EVENT,
    api,
    clearToken,
    getToken,
    setToken,
} from '@/lib/api';
import type { User } from '@/types/api';

interface AuthContextValue {
    user: User | null;
    token: string | null;
    loading: boolean;
    isAdmin: boolean;
    signIn: (accessToken: string) => void;
    signOut: () => void;
    refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setTokenState] = useState<string | null>(() => getToken());
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(() => Boolean(getToken()));

    useEffect(() => {
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        let cancelled = false;
        setLoading(true);

        api.users
            .profile(controller.signal)
            .then((profile) => {
                if (!cancelled) setUser(profile);
            })
            .catch((error: unknown) => {
                if (cancelled) return;
                if (error instanceof DOMException && error.name === 'AbortError') return;
                clearToken();
                setTokenState(null);
                setUser(null);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [token]);

    useEffect(() => {
        const handleUnauthorized = () => {
            clearToken();
            setTokenState(null);
            setUser(null);
        };
        window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
        return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    }, []);

    const signIn = useCallback((accessToken: string) => {
        setToken(accessToken);
        setTokenState(accessToken);
    }, []);

    const signOut = useCallback(() => {
        clearToken();
        setTokenState(null);
        setUser(null);
    }, []);

    const refresh = useCallback(async () => {
        try {
            const profile = await api.users.profile();
            setUser(profile);
        } catch {
            /* the 401 handler clears the session */
        }
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            token,
            loading,
            isAdmin: user?.role === 'admin',
            signIn,
            signOut,
            refresh,
        }),
        [user, token, loading, signIn, signOut, refresh],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
    return context;
}
