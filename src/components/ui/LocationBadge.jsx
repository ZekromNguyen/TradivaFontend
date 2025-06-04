import React from 'react';

/**
 * LocationBadge component for displaying location information
 */
const LocationBadge = ({ location }) => {
  if (!location) return null;
  
  // Try to extract location info from different possible formats
  const locationName = typeof location === 'string' ? location : location.name || location.city || '';
  
  if (!locationName) return null;
  
  return (
    <div className="flex items-center gap-1.5">
      <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
      <span>{locationName}</span>
    </div>
  );
};

export default LocationBadge; 