import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load pages for code splitting
const LandingPage = lazy(() => import('../pages/LandingPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ReaderPage = lazy(() => import('../pages/ReaderPage'));
const BadgeCollectionPage = lazy(() => import('../pages/BadgeCollectionPage'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      <p className="mt-4 text-slate-400">加载中...</p>
    </div>
  </div>
);

// Wrapper component for Suspense
const SuspenseWrapper = ({ children }) => <Suspense fallback={<PageLoader />}>{children}</Suspense>;

/**
 * 应用路由配置
 * 使用React Router v6的createBrowserRouter
 */
export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <SuspenseWrapper>
          <LandingPage />
        </SuspenseWrapper>
      ),
    },
    {
      path: '/dashboard',
      element: (
        <SuspenseWrapper>
          <DashboardPage />
        </SuspenseWrapper>
      ),
    },
    {
      path: '/learn/:moduleId/:lessonId',
      element: (
        <SuspenseWrapper>
          <ReaderPage />
        </SuspenseWrapper>
      ),
    },
    {
      path: '/badges',
      element: (
        <SuspenseWrapper>
          <BadgeCollectionPage />
        </SuspenseWrapper>
      ),
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ],
  {
    basename: '/Get-Started-with-Web3',
  }
);

export default router;
