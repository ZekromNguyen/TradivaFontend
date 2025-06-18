import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MobileNav.css';

const MobileNav = () => {
  const location = useLocation();
  
  const navItems = [
    {
      title: 'Dashboard',
      icon: 'bi-speedometer2',
      path: '/admin',
    },
    {
      title: 'Rút tiền',
      icon: 'bi-cash-stack',
      path: '/admin/withdrawals',
      badge: 5,
    },
    {
      title: 'Tours',
      icon: 'bi-map',
      path: '/admin/tours',
    },
    {
      title: 'Menu',
      icon: 'bi-grid',
      path: '#',
      isMenu: true,
    },
  ];

  const handleMenuClick = () => {
    // Trigger mobile menu
    const event = new CustomEvent('toggle-mobile-menu');
    window.dispatchEvent(event);
  };

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item, index) => {
        const isActive = item.path === location.pathname || 
          (item.path !== '/admin' && location.pathname.startsWith(item.path));
        
        if (item.isMenu) {
          return (
            <button
              key={index}
              className="nav-item"
              onClick={handleMenuClick}
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.title}</span>
            </button>
          );
        }
        
        return (
          <Link
            key={index}
            to={item.path}
            className={`nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="nav-icon-wrapper">
              <i className={`bi ${item.icon}`}></i>
              {item.badge && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </div>
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav; 