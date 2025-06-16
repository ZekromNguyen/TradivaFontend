import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Layout
import MainLayout from '../layouts/MainLayout';

// Component thường
import ForgotPassword from '../components/auth/ForgotPassword/ForgotPassword';
import TourguideDashboard from '../components/guide/Dashboard/Dashboard';

// Lazy load pages
const HomePage = lazy(() => import('../pages/HomePage/HomePage'));
const AuthPage = lazy(() => import('../pages/AuthPage/AuthPage'));
const GuidePage = lazy(() => import('../pages/GuidePage/GuidePage'));
const PaymentPage = lazy(() => import('../pages/Payment/PaymentPage'));
const TourAdmin = lazy(() => import('../pages/GuidePage/GuidePage'));
const TourDetailPage = lazy(() => import('../pages/TourDetailPage/TourDetailPage'));
const ExplorePage = lazy(() => import('../pages/ExplorePage/ExplorePage'));
const Tour = lazy(() => import('../pages/GuidePage/tours/Tour'));
const TourDetailManage = lazy(() => import('../pages/GuidePage/detail/TourDetailManage'));

// Component loading
const Loading = () => (
  <div className="flex items-center justify-center h-screen">Đang tải...</div>
);

// Router cấu hình
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
      {
        path: '/tour/:id',
        element: (
          <Suspense fallback={<Loading />}>
            <TourDetailPage />
          </Suspense>
        ),
      },
      {
        path: '/explore',
        element: (
          <Suspense fallback={<Loading />}>
            <ExplorePage />
          </Suspense>
        ),
      },
    ],
  },
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
        element: (
          <Suspense fallback={<Loading />}>
            <TourguideDashboard />
          </Suspense>
        ),
      },
      {
        path: 'payments',
        element: <div className="payment-management-component">Quản lý thanh toán</div>,
      },
      {
        path: 'tours',
        element: (
          <Suspense fallback={<Loading />}>
            <Tour />
          </Suspense>
        ),
      },
      {
        path: 'detail/:id', // ➕ Đường dẫn mới
        element: (
          <Suspense fallback={<Loading />}>
            <TourDetailManage />
          </Suspense>
        ),
      },
      {
        path: 'support',
        element: <div className="support-management-component">Hỗ trợ</div>,
      },
      {
        path: 'violations',
        element: <div className="violations-management-component">Vi phạm</div>,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
