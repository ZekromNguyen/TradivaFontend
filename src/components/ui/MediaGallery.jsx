import React, { useState, useEffect, useCallback } from 'react';

/**
 * MediaGallery component for displaying immersive tour media
 */
const MediaGallery = ({ images = [], videos = [], panoramas = [], layout = 'grid', features = {} }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState(null);
  
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
  
  // Handle mouse movement to show/hide controls
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    
    // Clear any existing timeout
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    
    // Set a new timeout to hide controls after 3 seconds of inactivity
    const timeout = setTimeout(() => {
      if (!isDragging && zoomLevel === 1) {
        setShowControls(false);
      }
    }, 3000);
    
    setControlsTimeout(timeout);
  }, [controlsTimeout, isDragging, zoomLevel]);
  
  // Function to force close any overlays or menus that might be open
  const forceCloseOverlays = () => {
    // Close any dropdowns, overlays or similar elements
    document.querySelectorAll('.dropdown-menu, .overlay, .modal, .popup')
      .forEach(el => {
        if (el.style.display !== 'none') {
          el.style.display = 'none';
        }
      });
      
    // Reduce z-index of any potential overlapping elements
    document.querySelectorAll('[style*="z-index"]').forEach(el => {
      if (el.style.zIndex > 100 && !el.closest('.media-gallery-modal')) {
        el.dataset.originalZIndex = el.style.zIndex;
        el.style.zIndex = '0';
      }
    });
  };
  
  const openGallery = (index) => {
    setActiveIndex(index);
    setShowFullGallery(true);
    setIsLoading(true);
    document.body.style.overflow = 'hidden'; // Prevent body scrolling
    resetZoom(); // Reset zoom when opening gallery
    
    // Force close any overlays that might be open
    forceCloseOverlays();
    
    // Hide all headers
    const headers = document.querySelectorAll('header, .header, [class*="header"], nav, .navbar, [class*="navbar"]');
    headers.forEach(header => {
      if (header) {
        header.style.display = 'none';
        header.style.visibility = 'hidden';
        header.style.opacity = '0';
        header.style.pointerEvents = 'none';
        header.style.position = 'absolute';
        header.style.zIndex = '-1';
        
        // Add extra CSS to ensure hiding
        header.setAttribute('data-gallery-open', 'true');
      }
    });
    
    // Apply !important styles through a class
    if (!document.getElementById('gallery-header-styles')) {
      document.head.insertAdjacentHTML('beforeend', `
        <style id="gallery-header-styles">
          [data-gallery-open="true"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            position: absolute !important;
            z-index: -999 !important;
          }
        </style>
      `);
    }
    
    // Also hide any other fixed elements that might be visible
    document.querySelectorAll('.fixed, .sticky, [style*="position: fixed"], [style*="position:fixed"], [style*="position: sticky"], [style*="position:sticky"]').forEach(el => {
      if (el.closest('.media-gallery-modal')) return; // Skip our own gallery elements
      el.dataset.originalDisplay = el.style.display;
      el.dataset.originalVisibility = el.style.visibility;
      el.dataset.originalZIndex = el.style.zIndex;
      el.style.display = 'none';
      el.style.visibility = 'hidden';
      el.style.zIndex = '-1';
    });

    // Preload the image to detect when it's ready
    if (allMedia[index].type === 'image') {
      const img = new Image();
      img.onload = () => setIsLoading(false);
      img.onerror = () => setIsLoading(false);
      img.src = allMedia[index].src;
    } else {
      // For non-image media, just set loading to false after a short delay
      setTimeout(() => setIsLoading(false), 500);
    }
  };
  
  const resetZoom = () => {
    setZoomLevel(1);
    setDragOffset({ x: 0, y: 0 });
  };
  
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 5));
  };
  
  const zoomOut = () => {
    setZoomLevel(prev => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) setDragOffset({ x: 0, y: 0 }); // Reset position when zoom is 1
      return newZoom;
    });
  };
  
  const closeGallery = () => {
    // Add fade-out animation class
    const modal = document.querySelector('.media-gallery-modal');
    if (modal) {
      modal.style.opacity = '0';
      modal.style.transition = 'opacity 0.3s ease';
      
      // Wait for animation to complete before fully closing
      setTimeout(() => {
        setShowFullGallery(false);
        document.body.style.overflow = 'auto'; // Restore body scrolling
      }, 300);
    } else {
      setShowFullGallery(false);
      document.body.style.overflow = 'auto'; // Restore body scrolling
    }
    
    resetZoom(); // Reset zoom when closing gallery
    
    // Restore all headers
    const headers = document.querySelectorAll('[data-gallery-open="true"]');
    headers.forEach(header => {
      if (header) {
        header.removeAttribute('data-gallery-open');
        header.style.display = '';
        header.style.visibility = '';
        header.style.opacity = '';
        header.style.pointerEvents = '';
        header.style.position = '';
        header.style.zIndex = '';
      }
    });
    
    // Remove the temporary style tag
    const tempStyle = document.getElementById('gallery-header-styles');
    if (tempStyle) tempStyle.remove();
    
    // Restore original z-index values to any elements we modified
    document.querySelectorAll('[data-original-z-index]').forEach(el => {
      el.style.zIndex = el.dataset.originalZIndex;
      delete el.dataset.originalZIndex;
    });
    
    // Restore other fixed elements
    document.querySelectorAll('[data-original-display], [data-original-visibility]').forEach(el => {
      if (el.dataset.originalDisplay) {
        el.style.display = el.dataset.originalDisplay;
        delete el.dataset.originalDisplay;
      }
      if (el.dataset.originalVisibility) {
        el.style.visibility = el.dataset.originalVisibility;
        delete el.dataset.originalVisibility;
      }
      if (el.dataset.originalZIndex) {
        el.style.zIndex = el.dataset.originalZIndex;
        delete el.dataset.originalZIndex;
      }
    });
    
    // Clear any control timeouts
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
  };
  
  const navigateGallery = (direction) => {
    let newIndex = activeIndex + direction;
    if (newIndex < 0) newIndex = allMedia.length - 1;
    if (newIndex >= allMedia.length) newIndex = 0;
    
    setIsLoading(true);
    setActiveIndex(newIndex);
    resetZoom(); // Reset zoom when changing images
    
    // Preload the image to detect when it's ready
    if (allMedia[newIndex].type === 'image') {
      const img = new Image();
      img.onload = () => setIsLoading(false);
      img.onerror = () => setIsLoading(false);
      img.src = allMedia[newIndex].src;
    } else {
      // For non-image media, just set loading to false after a short delay
      setTimeout(() => setIsLoading(false), 500);
    }
    
    // Show controls briefly when changing images
    setShowControls(true);
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    
    const timeout = setTimeout(() => {
      if (!isDragging && zoomLevel === 1) {
        setShowControls(false);
      }
    }, 3000);
    
    setControlsTimeout(timeout);
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
        
        // Restore header visibility
        const header = document.querySelector('header');
        if (header) {
          header.removeAttribute('data-gallery-open');
          header.style.display = 'flex';
          header.style.visibility = 'visible';
          header.style.opacity = '1';
          header.style.pointerEvents = 'auto';
          header.style.position = 'fixed';
          header.style.zIndex = '50';
          
          // Remove the temporary style tag
          const tempStyle = document.getElementById('gallery-header-styles');
          if (tempStyle) tempStyle.remove();
        }
        
        // Restore original z-index values to any elements we modified
        document.querySelectorAll('[data-original-z-index]').forEach(el => {
          el.style.zIndex = el.dataset.originalZIndex;
          delete el.dataset.originalZIndex;
        });
        
        // Restore other fixed elements
        document.querySelectorAll('[data-original-display], [data-original-visibility]').forEach(el => {
          if (el.dataset.originalDisplay) {
            el.style.display = el.dataset.originalDisplay;
            delete el.dataset.originalDisplay;
          }
          if (el.dataset.originalVisibility) {
            el.style.visibility = el.dataset.originalVisibility;
            delete el.dataset.originalVisibility;
          }
          if (el.dataset.originalZIndex) {
            el.style.zIndex = el.dataset.originalZIndex;
            delete el.dataset.originalZIndex;
          }
        });
        
        // Clear any control timeouts
        if (controlsTimeout) {
          clearTimeout(controlsTimeout);
        }
      }
    };
  }, [showFullGallery, controlsTimeout]);
  
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
  
  // Handle mouse/touch events for dragging zoomed images
  const handleMouseDown = useCallback((e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ 
        x: e.clientX || (e.touches && e.touches[0].clientX) || 0, 
        y: e.clientY || (e.touches && e.touches[0].clientY) || 0 
      });
    }
  }, [zoomLevel]);

  const handleImageDrag = useCallback((e) => {
    if (isDragging && zoomLevel > 1) {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      
      setDragOffset(prev => ({
        x: prev.x + (clientX - dragStart.x),
        y: prev.y + (clientY - dragStart.y)
      }));
      
      setDragStart({
        x: clientX,
        y: clientY
      });
    }
  }, [isDragging, dragStart, zoomLevel]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add event listeners for drag functionality and control visibility
  useEffect(() => {
    if (showFullGallery) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mousemove', handleImageDrag);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleImageDrag);
      window.addEventListener('touchend', handleMouseUp);
      
      // Initial show of controls
      setShowControls(true);
      
      // Set initial timeout to hide controls
      const timeout = setTimeout(() => {
        if (!isDragging && zoomLevel === 1) {
          setShowControls(false);
        }
      }, 3000);
      
      setControlsTimeout(timeout);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousemove', handleImageDrag);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleImageDrag);
        window.removeEventListener('touchend', handleMouseUp);
        
        if (controlsTimeout) {
          clearTimeout(controlsTimeout);
        }
      };
    }
  }, [showFullGallery, handleMouseMove, handleImageDrag, handleMouseUp, controlsTimeout, isDragging, zoomLevel]);
  
  // Handle wheel events for zooming
  const handleWheel = useCallback((e) => {
    if (showFullGallery) {
      e.preventDefault();
      if (e.deltaY < 0) {
        zoomIn();
      } else {
        zoomOut();
      }
    }
  }, [showFullGallery]);
  
  // Add event listener to prevent scrolling with wheel when gallery is open
  useEffect(() => {
    const preventScroll = (e) => {
      if (showFullGallery) {
        e.preventDefault();
        return false;
      }
    };
    
    if (showFullGallery) {
      // Add the event listener
      document.addEventListener('wheel', preventScroll, { passive: false });
    }
    
    return () => {
      // Clean up
      document.removeEventListener('wheel', preventScroll);
    };
  }, [showFullGallery]);
  
  return (
    <>
      <div className="media-gallery-container">
        <div className="media-gallery-grid grid-cols-1 md:grid-cols-12 gap-2 aspect-[16/9] md:aspect-[21/9]">
          <div 
            className="media-gallery-item md:col-span-8 relative rounded-l-xl overflow-hidden"
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
            <div className="media-gallery-item-overlay">
              <div className="media-gallery-zoom-btn">
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
                className="media-gallery-item relative rounded-lg overflow-hidden"
                onClick={() => openGallery(index + 1)}
              >
                {media.type === 'video' ? (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <div className="media-gallery-video-indicator">
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
        <div 
          className="media-gallery-modal"
          onMouseMove={handleMouseMove}
          onTouchStart={handleMouseMove}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgba(0, 0, 0, 0.98)',
          }}
        >
          {/* Header with title */}
          <div className="media-gallery-modal-header">
            <h3 className="media-gallery-modal-title">Hình ảnh tour</h3>
            <div className="media-gallery-counter">
              {activeIndex + 1} / {allMedia.length}
            </div>
          </div>
          
          {/* Fixed position close button that stays visible even when scrolling */}
          <button 
            onClick={closeGallery}
            className="media-gallery-close-btn"
            aria-label="Close gallery"
            style={{
              position: 'fixed',
              top: '16px',
              right: '16px',
              zIndex: 10001,
              backgroundColor: 'white',
              color: '#333',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Background overlay for click-to-close */}
          <div 
            className="absolute inset-0 z-[999]" 
            onClick={closeGallery}
          ></div>
          
          <div className="media-gallery-content" style={{
            flex: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1000
          }}>
            {allMedia[activeIndex].type === 'video' ? (
              <video 
                src={allMedia[activeIndex].src} 
                className="max-w-full max-h-full object-contain"
                controls
                autoPlay
              />
            ) : (
              <div
                className={`media-gallery-image-container ${zoomLevel > 1 ? 'cursor-grab' : 'cursor-zoom-in'} ${isDragging ? 'cursor-grabbing' : ''}`}
                onWheel={handleWheel}
                style={{
                  position: 'relative'
                }}
              >
                {isLoading && (
                  <div className="media-gallery-loader" style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 10
                  }}>
                    <div className="media-gallery-spinner" style={{
                      width: '40px',
                      height: '40px',
                      border: '3px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '50%',
                      borderTopColor: 'white',
                      animation: 'spin 1s ease-in-out infinite'
                    }}></div>
                  </div>
                )}
                <img 
                  src={imageErrors[activeIndex] ? getFallbackImage() : allMedia[activeIndex].type === 'image' ? allMedia[activeIndex].src : allMedia[activeIndex].thumbnail || ''}
                  alt={`Tour view ${activeIndex + 1}`} 
                  className="media-gallery-image"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                    transformOrigin: 'center center',
                    maxWidth: '90vw',
                    maxHeight: '80vh',
                    objectFit: 'contain'
                  }}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleMouseDown}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (zoomLevel === 1) zoomIn();
                  }}
                  onLoad={() => setIsLoading(false)}
                  onError={(e) => {
                    e.target.src = getFallbackImage();
                    setIsLoading(false);
                  }}
                />
              </div>
            )}
          </div>
          
          {/* Zoom controls */}
          <div className="media-gallery-zoom-controls" style={{
            position: 'absolute',
            bottom: '80px',
            right: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '24px',
            padding: '8px',
            zIndex: 10000
          }}>
            <button 
              onClick={zoomIn}
              disabled={zoomLevel >= 5}
              className="media-gallery-zoom-btn"
              aria-label="Zoom in"
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button 
              onClick={zoomOut}
              disabled={zoomLevel <= 1}
              className="media-gallery-zoom-btn"
              aria-label="Zoom out"
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
              </svg>
            </button>
            <button 
              onClick={resetZoom}
              disabled={zoomLevel === 1 && dragOffset.x === 0 && dragOffset.y === 0}
              className="media-gallery-zoom-btn"
              aria-label="Reset zoom"
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          
          <button 
            onClick={() => navigateGallery(-1)}
            className="media-gallery-nav-btn media-gallery-nav-prev"
            aria-label="Previous image"
            style={{
              position: 'absolute',
              top: '50%',
              left: '16px',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10000
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={() => navigateGallery(1)}
            className="media-gallery-nav-btn media-gallery-nav-next"
            aria-label="Next image"
            style={{
              position: 'absolute',
              top: '50%',
              right: '16px',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10000
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <div className="media-gallery-modal-footer" style={{
            padding: '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            zIndex: 10000,
            position: 'relative'
          }}>
            <div className="media-gallery-thumbnails" style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '8px'
            }}>
              {allMedia.map((media, index) => (
                <div 
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`media-gallery-thumbnail ${activeIndex === index ? 'active' : ''}`}
                  style={{
                    width: '60px',
                    height: '60px',
                    flexShrink: 0,
                    borderRadius: '6px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    opacity: activeIndex === index ? 1 : 0.7,
                    border: activeIndex === index ? '2px solid #1a73e8' : '2px solid transparent',
                    transition: 'opacity 0.2s ease, transform 0.2s ease, border-color 0.2s ease'
                  }}
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