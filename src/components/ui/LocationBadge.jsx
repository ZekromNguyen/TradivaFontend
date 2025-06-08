import React from 'react';

/**
 * Location badge component that displays a location with an icon
 * @param {string} location - Location name to display
 * @param {string} className - Additional CSS classes
 */
const LocationBadge = ({ location, className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <svg 
        className="w-4 h-4 text-blue-500" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
        />
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
        />
      </svg>
      <span className="font-medium">{location || 'Không xác định'}</span>
    </div>
  );
};

export default LocationBadge; 