import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from '../layouts/MainLayout';
import ForgotPassword from '../components/auth/ForgotPassword/ForgotPassword'; // Import ForgotPassword directly

// Lazy load components
const HomePage = lazy(() => import('../pages/HomePage/HomePage'));
const AuthPage = lazy(() => import('../pages/AuthPage/AuthPage'));
const GuidePage = lazy(() => import('../pages/GuidePage/GuidePage'));

// Loading component
const Loading = () => <div className="flex items-center justify-center h-screen">Đang tải...</div>;

// Tạo router với các routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<Loading />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: '/login',
        element: (
          <Suspense fallback={<Loading />}>
            <AuthPage />
          </Suspense>
        ),
      },
      {
        path: '/register',
        element: (
          <Suspense fallback={<Loading />}>
            <AuthPage initialMode="register" />
          </Suspense>
        ),
      },
      {
        path: '/forgot-password',
        element: (
          <Suspense fallback={<Loading />}>
            <ForgotPassword />
          </Suspense>
        ),
      },
    ],
  },
  // Guide page - standalone layout without MainLayout with nested routes
  {
    path: '/guide',
    element: (
      <Suspense fallback={<Loading />}>
        <GuidePage />
      </Suspense>
    ),
    children: [
      {
        path: '',
        element: <div className="payment-dashboard-default"></div>,
      },
      {
        path: 'payments',
        element: <div className="payment-management-component"></div>,
      },
      {
        path: 'tours',
        element: <div className="tour-management-component"></div>,
      },
      {
        path: 'support',
        element: <div className="support-management-component"></div>,
      },
      {
        path: 'violations',
        element: <div className="violations-management-component"></div>,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;