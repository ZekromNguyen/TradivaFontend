import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Sidebar.css';

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/guide', icon: 'bi-house-door', label: 'Tổng quan' },
    { path: '/guide/tours', icon: 'bi-briefcase', label: 'Quản lý Tour' },
    { path: '/guide/support', icon: 'bi-robot', label: 'AI hỗ trợ' },
    { path: '/guide/chat', icon: 'bi-chat-dots', label: 'Chat với khách' },
    { path: '/guide/payments', icon: 'bi-wallet2', label: 'Thanh toán' },
    { path: '/guide/feedback', icon: 'bi-star', label: 'Đánh giá' }
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <div className="brand-logo">
          <div className="logo-icon">
            <i className="bi bi-compass"></i>
          </div>
          <h4 className="brand-name">TRADIVA</h4>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <div className="nav-content">
                  <i className={`bi ${item.icon} nav-icon`}></i>
                  <span className="nav-text">{item.label}</span>
                </div>
                {isActive(item.path) && <div className="active-indicator"></div>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            <i className="bi bi-person-circle"></i>
          </div>
          <div className="user-details">
            <span className="user-name">Tour Guide</span>
            <span className="user-status">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}