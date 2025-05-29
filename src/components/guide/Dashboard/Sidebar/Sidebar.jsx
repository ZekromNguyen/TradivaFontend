import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaChartBar, 
  FaClipboardCheck, 
  FaFileInvoiceDollar, 
  FaQuestionCircle, 
  FaExclamationTriangle, 
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaBars
} from 'react-icons/fa';
import './Sidebar.css';
import './sidebar-reset.css';

const Sidebar = ({ collapsed = false, onToggle }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Close mobile sidebar when location changes
    setIsMobileOpen(false);
    
    // Add a class to the body to ensure proper styling
    document.body.classList.add('tradiva-body');
    
    // Add event listener for window resize to close mobile sidebar on larger screens
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.body.classList.remove('tradiva-body');
      window.removeEventListener('resize', handleResize);
    };
  }, [location, isMobileOpen]);

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Duyệt & Xếp Hạng HDV',
      icon: FaChartBar,
      path: '/guide',
      description: 'Xem và quản lý xếp hạng hướng dẫn viên'
    },
    {
      id: 'tours',
      label: 'Duyệt & Quản Lý Tour',
      icon: FaClipboardCheck,
      path: '/guide/tours',
      description: 'Quản lý các tours du lịch'
    },
    {
      id: 'payments',
      label: 'Xem & Duyệt Thanh Toán',
      icon: FaFileInvoiceDollar,
      path: '/guide/payments',
      description: 'Quản lý thanh toán cho hướng dẫn viên'
    },
    {
      id: 'support',
      label: 'Trực Page & Hỗ Trợ',
      icon: FaQuestionCircle,
      path: '/guide/support',
      description: 'Hỗ trợ và giải đáp thắc mắc'
    },
    {
      id: 'violations',
      label: 'Xử Lý Vi Phạm',
      icon: FaExclamationTriangle,
      path: '/guide/violations',
      description: 'Xử lý các vi phạm của hướng dẫn viên'
    }
  ];

  const isActiveRoute = (path) => {
    if (path === '/guide') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Define base colors for reuse
  const colors = {
    primary: '#3b82f6',
    primaryLight: '#eff6ff',
    textPrimary: '#111827',
    textSecondary: '#4b5563',
    danger: '#ef4444',
    dangerLight: '#fee2e2',
    white: '#ffffff',
    surface: '#f3f4f6'
  };

  const textStyles = {
    color: colors.textSecondary,
    fontFamily: 'Inter, system-ui, sans-serif'
  };

  return (
    <>
      {/* Mobile Menu Toggle - Only shown on small screens */}
      <button 
        className="mobile-toggle" 
        onClick={toggleMobileSidebar}
        aria-label="Mở menu chính"
        aria-expanded={isMobileOpen}
        type="button"
        style={{ color: colors.textSecondary }}
      >
        <FaBars style={{ color: 'currentColor' }} />
      </button>
      
      {/* Mobile Overlay - Only shown on small screens */}
      <div 
        className={`mobile-overlay ${isMobileOpen ? 'active' : ''}`}
        onClick={toggleMobileSidebar}
        aria-hidden="true"
      />
      
      {/* Sidebar */}
      <aside 
        className={`sidebar tradiva-sidebar ${collapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}
        aria-label="Menu chính"
        style={{ backgroundColor: colors.white }}
      >
        <div className="sidebar-header" style={{ borderBottom: '1px solid #e5e7eb' }}>
          <div className="logo-container">
            <div 
              className="logo-icon" 
              style={{ 
                color: colors.white, 
                backgroundColor: colors.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              T
            </div>
            <h1 
              className="logo-text" 
              style={{ 
                color: colors.primary, 
                fontSize: '1.125rem',
                fontWeight: 700
              }}
            >
              TRADIVA
            </h1>
          </div>
          
          <button 
            className="toggle-sidebar-btn"
            onClick={onToggle}
            aria-label={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
            type="button"
            style={{ 
              color: colors.textSecondary,
              backgroundColor: colors.surface,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '30px',
              height: '30px',
              borderRadius: '0.375rem',
              border: 'none'
            }}
          >
            {collapsed ? (
              <FaChevronRight style={{ color: colors.textSecondary }} />
            ) : (
              <FaChevronLeft style={{ color: colors.textSecondary }} />
            )}
          </button>
        </div>

        <nav className="sidebar-nav" style={{ padding: '1rem 0' }}>
          <ul className="nav-menu" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = isActiveRoute(item.path);
              const linkColor = isActive ? colors.primary : colors.textSecondary;
              const bgColor = isActive ? colors.primaryLight : 'transparent';

              return (
                <li key={item.id} className="nav-item" style={{ padding: '0 0.5rem' }}>
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    data-tooltip={item.label}
                    aria-current={isActive ? 'page' : undefined}
                    style={{ 
                      color: linkColor,
                      backgroundColor: bgColor,
                      fontWeight: isActive ? 600 : 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      textDecoration: 'none',
                      height: '40px'
                    }}
                  >
                    <div 
                      className="nav-icon-container"
                      style={{
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <IconComponent 
                        className="nav-icon" 
                        aria-hidden="true" 
                        style={{ 
                          color: linkColor,
                          width: '18px',
                          height: '18px'
                        }}
                      />
                    </div>
                    <span 
                      className="nav-text" 
                      style={{ 
                        color: linkColor,
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        flex: 1
                      }}
                    >
                      {item.label}
                    </span>
                    {!collapsed && <span className="active-indicator" aria-hidden="true" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer" style={{ borderTop: '1px solid #e5e7eb', padding: '1rem', marginTop: 'auto' }}>
          <Link
            to="/logout"
            className="logout-link"
            data-tooltip="Đăng xuất"
            style={{ 
              color: colors.danger, 
              backgroundColor: colors.dangerLight,
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontWeight: 500,
              height: '40px'
            }}
          >
            <div className="nav-icon-container" style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaSignOutAlt 
                className="logout-icon" 
                aria-hidden="true" 
                style={{ 
                  color: colors.danger,
                  width: '18px',
                  height: '18px'
                }}
              />
            </div>
            <span 
              className="logout-text"
              style={{ 
                color: colors.danger,
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                flex: 1
              }}
            >
              Đăng xuất
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;