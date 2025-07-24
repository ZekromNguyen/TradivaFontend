import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";

// Layout
import MainLayout from "../layouts/MainLayout";

// Component thường
import ForgotPassword from '../components/auth/ForgotPassword/ForgotPassword';
import TourguideDashboard from '../components/guide/Dashboard/Dashboard';
import Chatbot from '../pages/GuidePage/chatbot/Chatbot';
import WithdrawRequest from '../components/guide/WithdrawRequest/WithdrawRequest';
import PaymentHistory from '../components/guide/PaymentHistory/PaymentHistory';

// Admin components
import AdminDashboard from '../components/admin/Dashboard/Dashboard';
import WithdrawalRequests from '../components/admin/WithdrawalRequests/WithdrawalRequests';
import TrackingPage from '../pages/tracking/Tracking';
import GuideCustomerPage from "../pages/GuideCustomerPage/GuideCustomerPage";
import GuideDetailPage from "../pages/guideDetailPage/GuideDetailPage";

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
const AdminPage = lazy(() => import('../pages/AdminPage/AdminPage'));
const TourHistory = lazy(() => import('../pages/History/History'));
const RegisterPage = lazy(() => import('../pages/registerGuide/RegisterGuide'));


// Component loading
const Loading = () => (
  <div className="flex items-center justify-center h-screen">Đang tải...</div>
);

// Router cấu hình
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<Loading />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<Loading />}>
            <AuthPage />
          </Suspense>
        ),
      },
      {
        path: "/register",
        element: (
          <Suspense fallback={<Loading />}>
            <AuthPage initialMode="register" />
          </Suspense>
        ),
      },
      {
        path: "/registerGuide",
        element: (
          <Suspense fallback={<Loading />}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <Suspense fallback={<Loading />}>
            <ForgotPassword />
          </Suspense>
        ),
      },
      {
        path: "/tour/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <TourDetailPage />
          </Suspense>
        ),
      },
      {
        path: "/explore",
        element: (
          <Suspense fallback={<Loading />}>
            <ExplorePage />
          </Suspense>
        ),
      },
      {
        path: "/guides",
        element: (
          <Suspense fallback={<Loading />}>
            <GuideCustomerPage />
          </Suspense>
        ),
      },
      {
        path: "/guide/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <GuideDetailPage />
          </Suspense>
        ),
      },
      {
        path: "/history",
        element: (
          <Suspense fallback={<Loading />}>
            <TourHistory />
          </Suspense>
        ),
      },
      {
        path: "/tracking/:id", // New route for tracking
        element: (
          <Suspense fallback={<Loading />}>
            <TrackingPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/guide",
    element: (
      <Suspense fallback={<Loading />}>
        <GuidePage />
      </Suspense>
    ),
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<Loading />}>
            <TourguideDashboard />
          </Suspense>
        ),
      },
      {
        path: 'payments',
        element: <PaymentHistory />,
      },
      {
        path: 'withdraw',
        element: <WithdrawRequest />,
      },
      {
        path: "tours",
        element: (
          <Suspense fallback={<Loading />}>
            <Tour />
          </Suspense>
        ),
      },
      {
        path: "detail/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <TourDetailManage />
          </Suspense>
        ),
      },
      {
        path: "support",
        element: (
          <Suspense fallback={<Loading />}>
            <Chatbot />
          </Suspense>
        ),
      },
      {
        path: "violations",
        element: <div className="violations-management-component">Vi phạm</div>,
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <Suspense fallback={<Loading />}>
        <AdminPage />
      </Suspense>
    ),
    children: [
      {
        path: '',
        element: <AdminDashboard />,
      },
      {
        path: 'withdrawals',
        element: <WithdrawalRequests />,
      },
      {
        path: 'users',
        element: <div className="admin-users">Quản lý người dùng</div>,
      },
      {
        path: 'tours',
        element: <div className="admin-tours">Quản lý tour</div>,
      },
      {
        path: 'reports',
        element: <div className="admin-reports">Báo cáo</div>,
      },
      {
        path: 'settings',
        element: <div className="admin-settings">Cài đặt</div>,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;