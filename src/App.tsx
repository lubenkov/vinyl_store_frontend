import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CatalogPage } from '@/pages/CatalogPage';
import { VinylDetailPage } from '@/pages/VinylDetailPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { AdminVinylsPage } from '@/pages/admin/AdminVinylsPage';
import { AdminDiscogsPage } from '@/pages/admin/AdminDiscogsPage';
import { AdminTelegramPage } from '@/pages/admin/AdminTelegramPage';
import { AdminLogsPage } from '@/pages/admin/AdminLogsPage';

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }, [pathname]);

    return null;
}

export function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<CatalogPage />} />
                    <Route path="vinyls/:id" element={<VinylDetailPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route
                        path="profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="admin"
                        element={
                            <ProtectedRoute role="admin">
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="vinyls" replace />} />
                        <Route path="vinyls" element={<AdminVinylsPage />} />
                        <Route path="discogs" element={<AdminDiscogsPage />} />
                        <Route path="telegram" element={<AdminTelegramPage />} />
                        <Route path="logs" element={<AdminLogsPage />} />
                    </Route>
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
