import React from 'react';

/**
 * TourBadges component for displaying tour categories and duration
 */
const TourBadges = ({ categories = [], duration }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      {categories && categories.length > 0 ? (
        categories.map((category, index) => (
          <span 
            key={index} 
            className="bg-blue-500/80 text-white px-2 py-1 rounded-md text-sm font-medium"
          >
            {category}
          </span>
        ))
      ) : null}
      
      {duration && (
        <span className="bg-green-500/80 text-white px-2 py-1 rounded-md text-sm">
          {duration} {duration === 1 ? 'ngày' : 'ngày'}
        </span>
      )}
    </div>
  );
};

export default TourBadges; 