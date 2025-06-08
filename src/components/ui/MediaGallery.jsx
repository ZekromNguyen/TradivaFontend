import React, { useState, useEffect } from 'react';

/**
 * MediaGallery component for displaying immersive tour media
 */
const MediaGallery = ({ images = [], videos = [], panoramas = [], layout = 'grid', features = {} }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFullGallery, setShowFullGallery] = useState(false);
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
  
  const openGallery = (index) => {
    setActiveIndex(index);
    setShowFullGallery(true);
    document.body.style.overflow = 'hidden'; // Prevent body scrolling
    
    // Hide the header when gallery is open
    const header = document.querySelector('header');
    if (header) {
      header.style.display = 'none'; // Completely hide the header
    }
  };
  
  const closeGallery = () => {
    setShowFullGallery(false);
    document.body.style.overflow = 'auto'; // Restore body scrolling
    
    // Restore header visibility
    const header = document.querySelector('header');
    if (header) {
      header.style.display = 'flex'; // Restore header display
    }
  };
  
  const navigateGallery = (direction) => {
    let newIndex = activeIndex + direction;
    if (newIndex < 0) newIndex = allMedia.length - 1;
    if (newIndex >= allMedia.length) newIndex = 0;
    setActiveIndex(newIndex);
  };
  
  // Handle escape key to close gallery
  useEffect(() => {
    if (!showFullGallery) return;
    
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        closeGallery();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showFullGallery]);
  
  // Cleanup effect to restore header if component unmounts while gallery is open
  useEffect(() => {
    return () => {
      if (showFullGallery) {
        document.body.style.overflow = 'auto';
        const header = document.querySelector('header');
        if (header) {
          header.style.display = 'flex';
        }
      }
    };
  }, [showFullGallery]);
  
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
    <>
      <div className="relative w-full overflow-hidden rounded-xl bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 aspect-[16/9] md:aspect-[21/9]">
          <div 
            className="md:col-span-8 relative rounded-l-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => openGallery(0)}
          >
            {allMedia[0].type === 'video' ? (
              <div className="w-full h-full bg-black flex items-center justify-center">
                <video 
                  src={allMedia[0].src} 
                  poster={images[0] || ''} 
                  className="w-full h-full object-cover"
                  controls
                />
              </div>
            ) : (
              <img 
                src={imageErrors[0] ? getFallbackImage() : allMedia[0].type === 'image' ? allMedia[0].src : allMedia[0].thumbnail || ''}
                alt={allMedia[0].alt}
                className="w-full h-full object-cover"
                onError={() => handleImageError(0)}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-white bg-black/30 rounded-full p-3 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="hidden md:grid md:col-span-4 grid-cols-2 grid-rows-2 gap-2">
            {allMedia.slice(1, 5).map((media, index) => (
              <div 
                key={index} 
                className="relative rounded-lg overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => openGallery(index + 1)}
              >
                {media.type === 'video' ? (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/30 rounded-full p-2 backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <video 
                      src={media.src} 
                      className="w-full h-full object-cover opacity-90"
                    />
                  </div>
                ) : (
                  <img 
                    src={imageErrors[index + 1] ? getFallbackImage() : media.type === 'image' ? media.src : media.thumbnail || ''}
                    alt={`Tour image ${index + 2}`} 
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(index + 1)}
                  />
                )}
                
                {index === 3 && allMedia.length > 5 && (
                  <div 
                    className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      openGallery(0);
                    }}
                  >
                    <span>+{allMedia.length - 5} more</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <button 
          className="md:hidden absolute bottom-4 right-4 bg-white/90 text-gray-900 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm shadow-lg flex items-center space-x-1"
          onClick={() => openGallery(0)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Xem tất cả ảnh</span>
        </button>
      </div>
      
      {showFullGallery && (
        <div className="fixed inset-0 z-[1000] bg-black/95 flex flex-col" style={{ height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0 }}>
          {/* Header with title */}
          <div className="p-4 flex justify-between items-center">
            <h3 className="text-white text-lg font-medium">Hình ảnh tour</h3>
          </div>
          
          {/* Fixed position close button that stays visible even when scrolling */}
          <button 
            onClick={closeGallery}
            className="fixed top-6 right-6 z-[1001] bg-white hover:bg-white text-gray-800 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
            aria-label="Close gallery"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Background overlay for click-to-close */}
          <div 
            className="absolute inset-0 z-[999]" 
            onClick={closeGallery}
          ></div>
          
          <div className="flex-1 flex items-center justify-center p-4 z-[1000] relative">
            {allMedia[activeIndex].type === 'video' ? (
              <video 
                src={allMedia[activeIndex].src} 
                className="max-w-full max-h-full object-contain"
                controls
                autoPlay
              />
            ) : (
              <img 
                src={imageErrors[activeIndex] ? getFallbackImage() : allMedia[activeIndex].type === 'image' ? allMedia[activeIndex].src : allMedia[activeIndex].thumbnail || ''}
                alt={`Tour view ${activeIndex + 1}`} 
                className="max-w-full max-h-full object-contain"
                onError={(e) => {e.target.src = getFallbackImage()}}
              />
            )}
          </div>
          
          <button 
            onClick={() => navigateGallery(-1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 text-white backdrop-blur-sm transition-colors z-[1000]"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={() => navigateGallery(1)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 text-white backdrop-blur-sm transition-colors z-[1000]"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <div className="p-4 z-[1000] relative">
            <div className="flex space-x-2 overflow-x-auto hide-scrollbar px-2 pb-2">
              {allMedia.map((media, index) => (
                <div 
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors cursor-pointer ${activeIndex === index ? 'border-blue-500' : 'border-transparent'}`}
                >
                  {media.type === 'video' ? (
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="absolute inset-0 bg-black/30"></div>
                      <video 
                        src={media.src} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <img 
                      src={imageErrors[index] ? getFallbackImage() : media.type === 'image' ? media.src : media.thumbnail || ''}
                      alt={`Thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {e.target.src = getFallbackImage()}}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MediaGallery;