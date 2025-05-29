import React from 'react';
import { FaEllipsisV, FaUsers, FaCalendarAlt } from 'react-icons/fa';
import './UpcomingTours.css';

const UpcomingTours = ({ tours }) => {
  const getGuestStatusClass = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'full';
    if (percentage >= 70) return 'high';
    if (percentage >= 40) return 'medium';
    return 'low';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDaysUntilTour = (startDate) => {
    const today = new Date();
    const tourDate = new Date(startDate);
    const diffTime = tourDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="upcoming-tours-container">
      <header className="tours-header">
        <div className="header-content">
          <h2 id="tours-heading" className="section-title">
            <FaCalendarAlt className="section-icon" aria-hidden="true" />
            Tour sắp tới
          </h2>
          <span className="tour-count" aria-label={`${tours.length} tours sắp tới`}>
            {tours.length} tours
          </span>
        </div>
        <a 
          href="#" 
          className="view-all-link"
          aria-label="Xem tất cả tours sắp tới"
        >
          Xem tất cả
        </a>
      </header>
      
      <div className="tours-list" role="list">
        {tours.map((tour) => {
          const guestStatus = getGuestStatusClass(tour.guests.current, tour.guests.max);
          const daysUntil = getDaysUntilTour(tour.startDate);
          
          return (
            <article 
              key={tour.id} 
              className={`tour-item priority-${tour.priority}`}
              role="listitem"
              aria-labelledby={`tour-${tour.id}-name`}
              aria-describedby={`tour-${tour.id}-details`}
            >
              <div className="tour-content">
                <div className="tour-info">
                  <div className="tour-icon" aria-hidden="true">
                    <span className="emoji-icon" role="img" aria-label="Tour icon">
                      {tour.icon}
                    </span>
                  </div>
                  
                  <div className="tour-details">
                    <h3 
                      id={`tour-${tour.id}-name`}
                      className="tour-name"
                    >
                      {tour.name}
                    </h3>
                    
                    <div 
                      id={`tour-${tour.id}-details`}
                      className="tour-meta"
                    >
                      <time 
                        className="tour-dates"
                        dateTime={`${tour.startDate}/${tour.endDate}`}
                      >
                        {tour.displayDates}
                      </time>
                      
                      {daysUntil <= 7 && daysUntil > 0 && (
                        <span className="tour-urgency">
                          {daysUntil === 1 ? 'Ngày mai' : `${daysUntil} ngày nữa`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="tour-status">
                  <div 
                    className={`guest-count ${guestStatus}`}
                    aria-label={`${tour.guests.current} khách trên tổng số ${tour.guests.max} khách`}
                  >
                    <FaUsers className="guest-icon" aria-hidden="true" />
                    <span className="guest-numbers">
                      {tour.guests.current}/{tour.guests.max}
                    </span>
                  </div>
                  
                  <button 
                    className="tour-menu-btn"
                    aria-label={`Mở menu cho ${tour.name}`}
                    aria-expanded="false"
                  >
                    <FaEllipsisV />
                  </button>
                </div>
              </div>
              
              {tour.status === 'full' && (
                <div className="tour-badge full-badge" aria-label="Tour đã đầy">
                  Đã đầy
                </div>
              )}
            </article>
          );
        })}
      </div>
      
      <footer className="tours-footer">
        <button 
          className="view-schedule-btn"
          aria-label="Xem bảng xếp hạng chi tiết"
        >
          Xem bảng xếp hạng
        </button>
      </footer>
    </div>
  );
};

export default UpcomingTours;