import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MobileNav.css';

const GuideMobileNav = () => {
  const location = useLocation();
  
  const navItems = [
    {
      title: 'Tổng quan',
      icon: 'bi-house',
      path: '/guide',
    },
    {
      title: 'Tours',
      icon: 'bi-map',
      path: '/guide/tours',
    },
    {
      title: 'Rút tiền',
      icon: 'bi-cash-stack',
      path: '/guide/withdraw',
    },
    {
      title: 'Lịch sử',
      icon: 'bi-clock-history',
      path: '/guide/payments',
    },
  ];

  const isActive = (path) => {
    if (path === '/guide') {
      return location.pathname === '/guide';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="guide-mobile-nav">
      {navItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
        >
          <i className={`bi ${item.icon}`}></i>
          <span>{item.title}</span>
        </Link>
      ))}
    </nav>
  );
};

export default GuideMobileNav; 