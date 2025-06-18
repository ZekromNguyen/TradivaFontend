import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Đăng xuất thành công!');
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: 'bi-speedometer2',
      path: '/admin',
      badge: null,
    },
    {
      title: 'Quản lý người dùng',
      icon: 'bi-people',
      path: '/admin/users',
      badge: null,
    },
    {
      title: 'Yêu cầu rút tiền',
      icon: 'bi-cash-stack',
      path: '/admin/withdrawals',
      badge: { count: 5, type: 'warning' }, // Số yêu cầu chờ duyệt
    },
    {
      title: 'Quản lý tour',
      icon: 'bi-map',
      path: '/admin/tours',
      badge: null,
    },
    {
      title: 'Báo cáo',
      icon: 'bi-graph-up',
      path: '/admin/reports',
      badge: { count: 2, type: 'info' },
    },
    {
      title: 'Cài đặt',
      icon: 'bi-gear',
      path: '/admin/settings',
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !isCollapsed && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsCollapsed(true)}
        />
      )}
      
      <div className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''}`}>
        <div className="sidebar-header">
          <div className="header-content">
            {!isCollapsed && <h3>Admin Panel</h3>}
            <button 
              className="toggle-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label="Toggle sidebar"
            >
              <i className={`bi bi-${isCollapsed ? 'list' : 'x-lg'}`}></i>
            </button>
          </div>
        </div>
        
        <div className="sidebar-user">
          <div className="user-avatar">
            <i className="bi bi-person-circle"></i>
          </div>
          {!isCollapsed && (
            <div className="user-info">
              <span className="user-name">{user?.username || 'Admin User'}</span>
              <span className="user-role">{user?.role || 'Admin'}</span>
            </div>
          )}
        </div>
        
        <ul className="sidebar-menu">
          {menuItems.map((item, index) => {
            const isActive = item.path === '/admin' 
              ? location.pathname === '/admin'
              : location.pathname.startsWith(item.path);
              
            return (
              <li key={index} className={isActive ? 'active' : ''}>
                <Link
                  to={item.path}
                  className="menu-item"
                  title={isCollapsed ? item.title : ''}
                  onClick={() => isMobile && setIsCollapsed(true)}
                >
                  <div className="menu-icon">
                    <i className={`bi ${item.icon}`}></i>
                    {item.badge && (
                      <span className={`menu-badge badge-${item.badge.type}`}>
                        {item.badge.count}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <>
                      <span className="menu-text">{item.title}</span>
                      {item.badge && (
                        <span className={`menu-badge badge-${item.badge.type}`}>
                          {item.badge.count}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
        
        <div className="sidebar-footer">
          <button 
            onClick={handleLogout}
            className="logout-btn"
            title={isCollapsed ? 'Đăng xuất' : ''}
          >
            <i className="bi bi-box-arrow-right"></i>
            {!isCollapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 