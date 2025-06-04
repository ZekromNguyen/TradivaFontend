import React, { useState } from 'react';

/**
 * MediaGallery component for displaying immersive tour media
 */
const MediaGallery = ({ images = [], videos = [], panoramas = [], layout = 'grid', features = {} }) => {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  
  // Handle image error
  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };
  
  // Ensure all images are valid strings
  const validImages = Array.isArray(images) ? 
    images.filter(img => typeof img === 'string' && img.trim() !== '') : [];
  
  // Combine all media into one array
  const allMedia = [
    ...validImages.map(img => ({ type: 'image', src: img, alt: 'Tour image' })),
    ...videos.map(video => ({ type: 'video', src: video.src, thumbnail: video.thumbnail, alt: video.title || 'Tour video' })),
    ...panoramas.map(pano => ({ type: 'panorama', src: pano.src, thumbnail: pano.thumbnail, alt: pano.title || 'Tour panorama' }))
  ];
  
  // If no media provided, don't render
  if (allMedia.length === 0) return null;
  
  // Limit to maximum 8 items for mosaic layout
  const displayMedia = layout === 'mosaic' ? allMedia.slice(0, 8) : allMedia;
  
  const openLightbox = (index) => {
    if (features.lightbox) {
      setSelectedMediaIndex(index);
    }
  };
  
  // Mosaic layout classes based on index
  const getMosaicClasses = (index) => {
    if (index === 0) return "col-span-2 row-span-2";
    if (index === 1) return "col-span-1 row-span-1";
    if (index === 2) return "col-span-1 row-span-1";
    return "";
  };
  
  // Get fallback image URL
  const getFallbackImage = () => {
    return "https://via.placeholder.com/400x300?text=Image+Not+Available";
  };
  
  return (
    <div className="py-8">
      <div className={layout === 'mosaic' 
        ? "grid grid-cols-4 gap-2 h-[500px]" 
        : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
      }>
        {displayMedia.map((media, index) => (
          <div 
            key={index}
            className={`relative overflow-hidden rounded-lg ${layout === 'mosaic' ? getMosaicClasses(index) : ''}`}
            onClick={() => openLightbox(index)}
          >
            <img 
              src={imageErrors[index] ? getFallbackImage() : media.type === 'image' ? media.src : media.thumbnail || ''}
              alt={media.alt}
              className="w-full h-full object-cover"
              onError={() => handleImageError(index)}
            />
            {media.type !== 'image' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 rounded-full p-3">
                  {media.type === 'video' ? (
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Show count badge if there are more media than displayed */}
      {layout === 'mosaic' && allMedia.length > 8 && (
        <div className="flex justify-end mt-2">
          <div className="bg-gray-800/80 text-white px-4 py-2 rounded-full text-sm">
            +{allMedia.length - 8} more
          </div>
        </div>
      )}
      
      {/* Lightbox - simple implementation */}
      {features.lightbox && selectedMediaIndex !== null && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center" onClick={() => setSelectedMediaIndex(null)}>
          <div className="max-w-4xl max-h-full p-4">
            <img 
              src={allMedia[selectedMediaIndex].src}
              alt={allMedia[selectedMediaIndex].alt}
              className="max-h-[80vh] max-w-full object-contain"
              onError={(e) => {e.target.src = getFallbackImage()}}
            />
          </div>
          <button 
            className="absolute top-4 right-4 bg-white/20 p-2 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMediaIndex(null);
            }}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaGallery; 