import React from 'react';

/**
 * PriceBadge component for displaying price information
 */
const PriceBadge = ({ price = 0, currency = 'VND' }) => {
  if (!price) return null;
  
  // Format price with locale
  const formattedPrice = price.toLocaleString('vi-VN');
  
  return (
    <div className="flex items-center gap-1.5">
      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="font-medium">{formattedPrice} {currency}</span>
    </div>
  );
};

export default PriceBadge; 