import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminPage.css';

const AdminPage = () => {
  const { user, isLoggedIn } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Kiểm tra quyền admin
  const isAdmin = user?.role === 'Admin' || user?.roleName === 'Admin';

  useEffect(() => {
    // Thêm class admin-layout cho body khi vào trang admin
    document.body.classList.add('admin-layout');
    
    // Handle responsive behavior
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => {
      document.body.classList.remove('admin-layout');
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Nếu chưa đăng nhập, chuyển về trang login
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu không phải admin, chuyển về trang chủ
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Get current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path.includes('withdrawals')) return 'Yêu cầu rút tiền';
    if (path.includes('users')) return 'Quản lý người dùng';
    if (path.includes('tours')) return 'Quản lý tour';
    if (path.includes('reports')) return 'Báo cáo';
    if (path.includes('settings')) return 'Cài đặt';
    return 'Admin Panel';
  };

  return (
    <div className="admin-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`admin-content ${isCollapsed ? 'expanded' : ''}`}>
        <div className="admin-header">
          <div className="header-left">
            {isMobile && (
              <button 
                className="mobile-menu-btn"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <i className="bi bi-list"></i>
              </button>
            )}
            <div className="page-title">
              <h1>{getPageTitle()}</h1>
              <nav className="breadcrumb">
                <span>Admin</span>
                {location.pathname !== '/admin' && (
                  <>
                    <i className="bi bi-chevron-right"></i>
                    <span>{getPageTitle()}</span>
                  </>
                )}
              </nav>
            </div>
          </div>
          <div className="header-right">
            <button className="header-btn notification-btn">
              <i className="bi bi-bell"></i>
              <span className="notification-badge">3</span>
            </button>
            <button className="header-btn">
              <i className="bi bi-gear"></i>
            </button>
            <div className="admin-user-info">
              <div className="user-details">
                <span className="user-name">{user?.userName || 'Admin'}</span>
                <span className="user-role">Administrator</span>
              </div>
              <div className="user-avatar">
                <i className="bi bi-person-circle"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 