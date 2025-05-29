import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './StatsCards.css';

const StatsCards = ({ stats }) => {
  return (
    <div className="stats-container" role="region" aria-label="Thống kê tổng quan">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        const isPositiveTrend = stat.trend?.direction === 'up';
        
        return (
          <div 
            key={stat.id}
            className={`stat-card ${stat.type}`}
            role="article"
            aria-labelledby={`stat-${stat.id}-title`}
            aria-describedby={`stat-${stat.id}-desc`}
            tabIndex="0"
          >
            <div className="stat-icon-container" aria-hidden="true">
              <IconComponent className="stat-icon" />
            </div>
            
            <div className="stat-content">
              <div className="stat-header">
                <h3 
                  id={`stat-${stat.id}-title`}
                  className="stat-title"
                >
                  {stat.title}
                </h3>
                
                {stat.trend && (
                  <div 
                    className={`stat-trend ${isPositiveTrend ? 'positive' : 'negative'}`}
                    aria-label={`Xu hướng: ${isPositiveTrend ? 'tăng' : 'giảm'} ${stat.trend.value}`}
                  >
                    {isPositiveTrend ? (
                      <FaArrowUp className="trend-icon" />
                    ) : (
                      <FaArrowDown className="trend-icon" />
                    )}
                    <span className="trend-value">{stat.trend.value}</span>
                  </div>
                )}
              </div>
              
              <div className="stat-main">
                <p 
                  id={`stat-${stat.id}-desc`}
                  className="stat-value"
                  aria-label={stat.ariaLabel}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;