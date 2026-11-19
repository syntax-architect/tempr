import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './components/ui/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { RequireAuth } from './components/auth/RequireAuth';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ScrollToTop } from './components/common/ScrollToTop';
import { DevFpsOverlay } from './components/effects/DevFpsOverlay';

// Route-Level Lazy Loading (Suspense code-splitting keeps initial JS bundle tiny)
const MarketingPage = lazy(() => import('./pages/MarketingPage'));
const AppShellPage = lazy(() => import('./pages/AppShellPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const VerifyPage = lazy(() => import('./pages/VerifyPage'));
const SharePage = lazy(() => import('./pages/SharePage'));
const SupplierRequestPage = lazy(() => import('./pages/SupplierRequestPage'));
const DesignSystemPage = lazy(() => import('./pages/DesignSystemPage'));

// Stale-while-revalidate Query Client with offline awareness and retry backoff
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Accessible Route Loading Skeleton
const RouteFallback: React.FC = () => (
  <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-6 text-slate-400">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      <span className="text-xs font-mono tracking-wider text-slate-300">LOADING HEATLEDGER...</span>
    </div>
  </div>
);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              {/* WCAG 2.2 AA Skip Link */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-slate-950 focus:font-bold focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white"
              >
                Skip to content
              </a>
              {/* Global ARIA live region for screen readers */}
              <div id="aria-status-region" role="status" aria-live="polite" className="sr-only" />
              <ScrollToTop />
              <DevFpsOverlay />
              <ErrorBoundary>
                <Suspense fallback={<RouteFallback />}>
                  <Routes>
                    {/* Public Marketing & Educational Routes */}
                    <Route path="/" element={<MarketingPage />} />
                    <Route path="/pricing" element={<MarketingPage />} />
                    <Route path="/sample" element={<MarketingPage />} />

                    {/* Authentication Gate */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<LoginPage />} />

                    {/* Authenticated Factory QA & Exporter Dashboard Routes */}
                    <Route
                      path="/app"
                      element={
                        <RequireAuth>
                          <AppShellPage />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/app/shipments"
                      element={
                        <RequireAuth>
                          <AppShellPage />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/app/shipments/:id"
                      element={
                        <RequireAuth>
                          <AppShellPage />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/app/certificates"
                      element={
                        <RequireAuth>
                          <AppShellPage />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/app/certificates/:id/review"
                      element={
                        <RequireAuth>
                          <AppShellPage />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/app/sign-off"
                      element={
                        <RequireAuth>
                          <AppShellPage />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/app/heats"
                      element={
                        <RequireAuth>
                          <AppShellPage />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/app/heats/:id"
                      element={
                        <RequireAuth>
                          <AppShellPage />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/app/cbam"
                      element={
                        <RequireAuth>
                          <AppShellPage />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/app/dossiers"
                      element={
                        <RequireAuth>
                          <AppShellPage />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/app/suppliers"
                      element={
                        <RequireAuth>
                          <AppShellPage />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/app/reports"
                      element={
                        <RequireAuth>
                          <AppShellPage />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/app/settings"
                      element={
                        <RequireAuth>
                          <AppShellPage />
                        </RequireAuth>
                      }
                    />

                    {/* Public Verification, Buyer & Supplier Portals */}
                    <Route path="/verify" element={<VerifyPage />} />
                    <Route path="/verify/:code" element={<VerifyPage />} />
                    <Route path="/share/:token" element={<SharePage />} />
                    <Route path="/supplier-request/:token" element={<SupplierRequestPage />} />

                    {/* Dev Design System & Token Contrast Inspector */}
                    <Route path="/design" element={<DesignSystemPage />} />

                    {/* Fallback Catch-All */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
