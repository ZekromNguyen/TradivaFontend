import React from 'react';

/**
 * Enhanced Rating component for displaying star ratings
 * @param {number} value - Rating value from 0 to 5
 * @param {number} reviews - Number of reviews
 * @param {string} size - Size of stars ('sm', 'md', 'lg')
 * @param {boolean} interactive - Whether the rating is interactive
 * @param {function} onChange - Callback when rating changes (only used when interactive)
 */
const Rating = ({ 
  value = 0, 
  reviews = 0, 
  size = 'md', 
  interactive = false,
  onChange = () => {}
}) => {
  // Round value to nearest 0.5
  const ratingValue = reviews > 0 ? Math.round(value * 2) / 2 : 0;
  
  // Determine star size based on prop
  const starSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  }[size] || 'w-4 h-4';
  
  // Determine text size based on prop
  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }[size] || 'text-sm';
  
  // Handle star hover and click for interactive mode
  const handleStarClick = (index) => {
    if (interactive) {
      onChange(index + 1);
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          // Full star
          if (i < Math.floor(ratingValue)) {
            return (
              <span 
                key={i} 
                className={`inline-block text-yellow-400 ${interactive ? 'cursor-pointer transform transition-transform hover:scale-110' : ''}`}
                onClick={() => handleStarClick(i)}
                aria-label={`${i + 1} stars`}
              >
                <svg className={`${starSize} fill-current`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
            );
          }
          // Half star
          else if (i < ratingValue) {
            return (
              <span 
                key={i} 
                className={`inline-block text-yellow-400 relative ${interactive ? 'cursor-pointer transform transition-transform hover:scale-110' : ''}`}
                onClick={() => handleStarClick(i)}
                aria-label={`${i + 0.5} stars`}
              >
                {/* Gray background star */}
                <svg className={`${starSize} fill-current text-gray-300`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {/* Half yellow star */}
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <svg className={`${starSize} fill-current`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </span>
            );
          }
          // Empty star
          else {
            return (
              <span 
                key={i} 
                className={`inline-block text-gray-300 ${interactive ? 'cursor-pointer transform transition-transform hover:scale-110 hover:text-yellow-200' : ''}`}
                onClick={() => handleStarClick(i)}
                aria-label={`${i + 1} stars`}
              >
                <svg className={`${starSize} fill-current`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
            );
          }
        })}
      </div>
      
      <div className={`font-medium ${textSize}`}>
        {reviews > 0 ? (
          <>
            <span className="text-blue-600">{ratingValue.toFixed(1)}</span>
            <span className="text-gray-400 ml-1">({reviews})</span>
          </>
        ) : interactive ? (
          <span className="text-gray-400">Chọn đánh giá</span>
        ) : (
          <span className="text-gray-400">Chưa có đánh giá</span>
        )}
      </div>
    </div>
  );
};

export default Rating; 