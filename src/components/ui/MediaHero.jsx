import React from 'react';
import ImageCarousel from './ImageCarousel';

/**
 * MediaHero component for displaying immersive tour media
 */
const MediaHero = ({ media, type, effect }) => {
  // Fix potential null/undefined issues
  const mediaArray = Array.isArray(media) ? media : [];
  const placeholderImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80";
  
  // Filter out any invalid URLs
  const validImages = mediaArray.filter(img => typeof img === 'string' && img.trim() !== '');
  
  // Use valid media if available, otherwise use placeholder
  const images = validImages.length > 0 ? validImages : [placeholderImage];
  
  return (
    <div className="relative w-full h-full">
      <ImageCarousel 
        images={images}
        autoPlayInterval={6000}
      />
      
      {effect === "parallax" && (
        <div className="absolute inset-0 bg-black/20 backdrop-filter"></div>
      )}
    </div>
  );
};

export default MediaHero; 