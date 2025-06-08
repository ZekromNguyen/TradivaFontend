import React, { useState, useEffect } from 'react';
import ImageCarousel from './ImageCarousel';

const TourGallery = ({ tour }) => {
  const [allImages, setAllImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStartIndex, setModalStartIndex] = useState(0);

  useEffect(() => {
    if (!tour || !tour.tourLocations) return;

    // Extract all images from tour locations
    const images = tour.tourLocations
      .filter(tl => tl && tl.location && tl.location.image)
      .map(tl => tl.location.image);

    // Add main tour image if it exists and is not already included
    const mainImage = tour.image;
    if (mainImage && !images.includes(mainImage)) {
      images.unshift(mainImage);
    }

    setAllImages(images);
  }, [tour]);

  // Add event listener for escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isModalOpen]);

  const openModal = (index) => {
    setModalStartIndex(index);
    setIsModalOpen(true);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Restore body scrolling
    document.body.style.overflow = 'auto';
  };

  if (!allImages || allImages.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Hình ảnh tour</h2>
        <div className="bg-gray-100 rounded-xl p-12 flex items-center justify-center">
          <p className="text-gray-500">Chưa có hình ảnh cho tour này</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Hình ảnh tour</h2>
        
        {/* Gallery grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allImages.map((image, index) => (
            <div 
              key={index} 
              className={`relative rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                index === 0 ? 'col-span-2 row-span-2' : ''
              }`}
              onClick={() => openModal(index)}
            >
              <img 
                src={image} 
                alt={`Tour image ${index + 1}`}
                className="w-full h-full object-cover aspect-square"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-full p-3">
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* View all button */}
        <div className="mt-6 text-center">
          <button 
            onClick={() => openModal(0)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Xem tất cả hình ảnh
          </button>
        </div>
      </div>

      {/* Full screen modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center">
          {/* Close button */}
          <button 
            onClick={closeModal}
            className="absolute top-4 right-4 z-[10000] bg-white/80 hover:bg-white text-gray-800 w-12 h-12 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-colors"
            aria-label="Close gallery"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Background overlay for click-to-close */}
          <div 
            className="absolute inset-0 z-[9998]" 
            onClick={closeModal}
          ></div>

          {/* Carousel in modal */}
          <div className="w-full h-full p-4 md:p-8 z-[9999] relative">
            <ImageCarousel 
              images={allImages} 
              autoPlayInterval={0} // Disable autoplay in modal
              initialIndex={modalStartIndex}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TourGallery; 