import React, { useState, useEffect, useCallback } from 'react';

const ImageCarousel = ({ images, autoPlayInterval = 5000, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [loadedImages, setLoadedImages] = useState([]);
  const [isError, setIsError] = useState({});

  // Set initial index when it changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Handle image loading
  useEffect(() => {
    if (!images || !images.length) return;
    
    // Reset loaded state when images change
    setLoadedImages([]);
    setIsError({});
  }, [images]);

  const handleImageLoad = (index) => {
    setLoadedImages(prev => [...prev, index]);
  };

  const handleImageError = (index) => {
    console.error(`Failed to load image at index ${index}:`, images[index]);
    setIsError(prev => ({...prev, [index]: true}));
  };

  const goToNext = useCallback(() => {
    if (isTransitioning || !images || images.length <= 1) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match this with the CSS transition duration
  }, [images, isTransitioning]);

  const goToPrevious = useCallback(() => {
    if (isTransitioning || !images || images.length <= 1) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match this with the CSS transition duration
  }, [images, isTransitioning]);

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlayInterval || images?.length <= 1) return;
    
    const interval = setInterval(() => {
      goToNext();
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [goToNext, autoPlayInterval, images]);

  // Touch events for mobile swiping
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe left
      goToNext();
    }
    if (touchStart - touchEnd < -100) {
      // Swipe right
      goToPrevious();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Ensure we have valid images
  const validImages = Array.isArray(images) ? images.filter(img => img) : [];

  if (!validImages || validImages.length === 0) {
    return (
      <div className="w-full h-[70vh] bg-gray-200 rounded-2xl flex items-center justify-center">
        <p className="text-gray-500">Không có hình ảnh</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[70vh] overflow-hidden rounded-2xl group">
      {/* Main image display */}
      <div 
        className="w-full h-full flex transition-transform duration-500 ease-in-out"
        style={{ 
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {validImages.map((image, index) => (
          <div key={index} className="min-w-full h-full flex-shrink-0">
            <img
              src={typeof image === 'object' && image.url ? image.url : image}
              alt={typeof image === 'object' && image.alt ? image.alt : `Tour image ${index + 1}`}
              className="w-full h-full object-cover"
              onLoad={() => handleImageLoad(index)}
              onError={() => handleImageError(index)}
            />
          </div>
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"></div>

      {/* Navigation buttons - only if more than one image */}
      {validImages.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-12 h-12 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-12 h-12 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators - only if more than one image */}
      {validImages.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
          {validImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "bg-white w-8" 
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image counter - only if more than one image */}
      {validImages.length > 1 && (
        <div className="absolute top-6 right-6 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
          {currentIndex + 1} / {validImages.length}
        </div>
      )}

      {/* Thumbnail preview (visible on larger screens) */}
      {validImages.length > 1 && (
        <div className="hidden md:flex absolute bottom-20 left-0 right-0 justify-center gap-2 px-8">
          <div className="flex gap-2 p-2 bg-black/30 backdrop-blur-sm rounded-xl overflow-x-auto max-w-full">
            {validImages.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                  index === currentIndex ? "border-white scale-110 z-10" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img 
                  src={typeof image === 'object' && image.url ? image.url : image} 
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {e.target.src = "https://via.placeholder.com/100?text=Image"}}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel; 