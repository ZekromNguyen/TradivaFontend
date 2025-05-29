import React, { useState } from 'react';
import { FaBell, FaCheckCircle, FaStar, FaComment, FaExclamationTriangle } from 'react-icons/fa';
import './Notifications.css';

const Notifications = ({ notifications }) => {
  const [filter, setFilter] = useState('all'); // all, unread, high
  
  // Enhanced icon mapping
  const getNotificationIcon = (type, priority) => {
    const iconProps = {
      className: `notification-icon ${type}`,
      'aria-hidden': true
    };
    
    switch (type) {
      case 'message':
        return <FaComment {...iconProps} />;
      case 'confirmation':
        return <FaCheckCircle {...iconProps} />;
      case 'review':
        return <FaStar {...iconProps} />;
      default:
        return priority === 'high' ? 
          <FaExclamationTriangle {...iconProps} /> : 
          <FaBell {...iconProps} />;
    }
  };

  const getPriorityClass = (priority) => {
    return priority === 'high' ? 'high-priority' : 'normal-priority';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'high') return notification.priority === 'high';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="notifications-container">
      <header className="notifications-header">
        <div className="header-content">
          <h2 id="notifications-heading" className="notifications-title">
            <FaBell className="title-icon" aria-hidden="true" />
            Thông báo
          </h2>
          {unreadCount > 0 && (
            <span 
              className="unread-badge"
              aria-label={`${unreadCount} thông báo chưa đọc`}
            >
              {unreadCount}
            </span>
          )}
        </div>
        
        <div className="filter-tabs" role="tablist" aria-label="Lọc thông báo">
          <button
            role="tab"
            aria-selected={filter === 'all'}
            aria-controls="notifications-panel"
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tất cả
          </button>
          <button
            role="tab"
            aria-selected={filter === 'unread'}
            aria-controls="notifications-panel"
            className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Chưa đọc
          </button>
          <button
            role="tab"
            aria-selected={filter === 'high'}
            aria-controls="notifications-panel"
            className={`filter-tab ${filter === 'high' ? 'active' : ''}`}
            onClick={() => setFilter('high')}
          >
            Quan trọng
          </button>
        </div>
      </header>
      
      <div 
        id="notifications-panel"
        className="notifications-list"
        role="tabpanel"
        aria-labelledby="notifications-heading"
      >
        {filteredNotifications.length === 0 ? (
          <div className="empty-state" role="status">
            <FaBell className="empty-icon" aria-hidden="true" />
            <p className="empty-message">
              {filter === 'all' ? 'Không có thông báo nào' :
               filter === 'unread' ? 'Không có thông báo chưa đọc' :
               'Không có thông báo quan trọng'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <article 
              key={notification.id}
              className={`notification-item ${getPriorityClass(notification.priority)} ${
                notification.isRead ? 'read' : 'unread'
              }`}
              role="article"
              aria-labelledby={`notification-${notification.id}-title`}
              aria-describedby={`notification-${notification.id}-content`}
              tabIndex="0"
            >
              <div className="notification-icon-container">
                {getNotificationIcon(notification.type, notification.priority)}
              </div>
              
              <div className="notification-content">
                <div className="notification-header">
                  <h3 
                    id={`notification-${notification.id}-title`}
                    className="notification-title"
                  >
                    {notification.title}
                  </h3>
                  {!notification.isRead && (
                    <span className="unread-indicator" aria-label="Chưa đọc"></span>
                  )}
                </div>
                
                <p 
                  id={`notification-${notification.id}-content`}
                  className="notification-text"
                >
                  {notification.content}
                </p>
                
                <time 
                  className="notification-time"
                  dateTime={notification.timestamp?.toISOString()}
                  title={notification.timestamp?.toLocaleString('vi-VN')}
                >
                  {formatTimeAgo(notification.timestamp)}
                </time>
              </div>
            </article>
          ))
        )}
      </div>
      
      {filteredNotifications.length > 0 && (
        <footer className="notifications-footer">
          <button 
            className="mark-all-read-btn"
            aria-label="Đánh dấu tất cả là đã đọc"
          >
            Đánh dấu đã đọc tất cả
          </button>
        </footer>
      )}
    </div>
  );
};

export default Notifications;