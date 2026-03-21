import { createBrowserRouter, Navigate, Outlet, useParams } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from '../components/ErrorBoundary';
import SearchDialog from '../components/SearchDialog';
import { useSearchStore } from '../store/useSearchStore';
import LanguageProvider from '../i18n/LanguageProvider';

// Lazy load pages for code splitting
const LandingPage = lazy(() => import('../pages/LandingPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ReaderPage = lazy(() => import('../pages/ReaderPage'));
const BadgeCollectionPage = lazy(() => import('../pages/BadgeCollectionPage'));
const ArticlesPage = lazy(() => import('../pages/ArticlesPage'));

// Loading component
const PageLoader = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        <p className="mt-4 text-slate-400">{t('common.loading')}</p>
      </div>
    </div>
  );
};

// Wrapper component for Suspense + ErrorBoundary
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<PageLoader />}>
    <ErrorBoundary>{children}</ErrorBoundary>
  </Suspense>
);

// Root layout with global overlays (SearchDialog needs router context)
const RootLayout = () => {
  const openSearch = useSearchStore((s) => s.openSearch);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSearch]);

  return (
    <>
      <Outlet />
      <SearchDialog />
    </>
  );
};

/**
 * Detects browser language and returns the default lang prefix.
 */
function detectLang() {
  const browserLang = navigator.language || 'en';
  return browserLang.startsWith('zh') ? 'zh' : 'en';
}

/** Root redirect: / -> /:lang based on browser language */
const RootRedirect = () => <Navigate to={`/${detectLang()}`} replace />;

/**
 * Backwards-compatibility redirect component.
 * Redirects old paths (e.g. /dashboard) to /zh/dashboard.
 */
const LegacyRedirect = ({ to }) => {
  const params = useParams();
  // Replace :param placeholders with actual values
  let path = to;
  if (params.moduleId) path = path.replace(':moduleId', params.moduleId);
  if (params.lessonId) path = path.replace(':lessonId', params.lessonId);
  return <Navigate to={path} replace />;
};

/**
 * 应用路由配置
 * 使用React Router v6的createBrowserRouter
 * /:lang prefix enables i18n routing with LanguageProvider
 */
export const router = createBrowserRouter(
  [
    // Root redirect
    {
      path: '/',
      element: <RootRedirect />,
    },
    // Backwards-compat redirects (must be before /:lang to avoid matching)
    {
      path: '/dashboard',
      element: <LegacyRedirect to="/zh/dashboard" />,
    },
    {
      path: '/badges',
      element: <LegacyRedirect to="/zh/badges" />,
    },
    {
      path: '/learn/:moduleId/:lessonId',
      element: <LegacyRedirect to="/zh/learn/:moduleId/:lessonId" />,
    },
    // Main i18n routes
    {
      path: '/:lang',
      element: (
        <LanguageProvider>
          <RootLayout />
        </LanguageProvider>
      ),
      children: [
        {
          index: true,
          element: (
            <SuspenseWrapper>
              <LandingPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'dashboard',
          element: (
            <SuspenseWrapper>
              <DashboardPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'learn/:moduleId/:lessonId',
          element: (
            <SuspenseWrapper>
              <ReaderPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'badges',
          element: (
            <SuspenseWrapper>
              <BadgeCollectionPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'articles',
          element: (
            <SuspenseWrapper>
              <ArticlesPage />
            </SuspenseWrapper>
          ),
        },
        {
          path: '*',
          element: <Navigate to="/" replace />,
        },
      ],
    },
  ],
  {
    basename: '/Get-Started-with-Web3',
  }
);

export default router;
