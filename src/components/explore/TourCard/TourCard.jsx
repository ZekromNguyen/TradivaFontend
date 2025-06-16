import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import "./TourCard.css";

const TourCard = ({ tour, onViewDetail }) => {
  const [imageError, setImageError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  const getImageSrc = () => {
    // Nếu cả 2 đều lỗi, dùng placeholder online
    if (imageError && fallbackError) {
      return `https://picsum.photos/seed/${tour.id || 'default'}/400/300`;
    }
    
    // Nếu ảnh gốc lỗi, dùng fallback local
    if (imageError) {
      return "/images/fallback.jpg";
    }
    
    // Ưu tiên ảnh từ API
    if (tour.images && tour.images.length > 0 && tour.images[0].filePath) {
      return tour.images[0].filePath;
    }
    
    // Fallback mặc định
    return "/images/fallback.jpg";
  };

  const handleImageError = (e) => {
    console.log(`❌ Image error for tour ${tour.id}:`, e.target.src);
    
    if (!imageError) {
      // Lần đầu lỗi - thử fallback local
      setImageError(true);
      e.target.src = "/images/fallback.jpg";
    } else if (!fallbackError) {
      // Fallback local cũng lỗi - dùng online placeholder
      setFallbackError(true);
      e.target.src = `https://picsum.photos/seed/${tour.id || 'default'}/400/300`;
    }
    // Nếu cả 2 đều lỗi, không làm gì thêm (tránh infinite loop)
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return "Liên hệ";
    return `${price.toLocaleString("vi-VN")} VND`;
  };

  const handleViewDetail = () => {
    if (onViewDetail && typeof onViewDetail === 'function') {
      onViewDetail(tour.id);
    } else {
      // Fallback navigation
      console.warn('onViewDetail not provided, using default navigation');
      window.location.href = `/tour/${tour.id}`;
    }
  };

  // Defensive programming - check if tour exists
  if (!tour) {
    return (
      <div className="destination-card bg-gray-100 rounded-lg overflow-hidden shadow-md p-4">
        <div className="text-center text-gray-500">
          <p>Không có thông tin tour</p>
        </div>
      </div>
    );
  }

  return (
    <div className="destination-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="img-zoom-container relative">
        <img
          src={getImageSrc()}
          alt={tour.title || 'Tour image'}
          className="w-full h-48 object-cover img-zoom"
          loading="lazy"
          onError={handleImageError}
          onLoad={() => {
            // Reset error states khi ảnh load thành công
            if (imageError || fallbackError) {
              console.log(`✅ Image loaded successfully for tour ${tour.id}`);
            }
          }}
        />
        
        {/* Loading overlay - optional */}
        {imageError && fallbackError && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-sm">Đang tải ảnh...</div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 
            className="font-semibold text-lg truncate pr-2 flex-1" 
            title={tour.title || 'Không có tên tour'}
          >
            {tour.title || 'Không có tên tour'}
          </h3>
          <div className="flex items-center flex-shrink-0">
            <FaStar className="text-yellow-400 mr-1" size={14} />
            <span className="text-sm font-medium">
              {tour.rating !== undefined && tour.rating !== null ? tour.rating : 0}
            </span>
          </div>
        </div>
        
        <div className="text-gray-500 text-sm mb-3 line-clamp-2">
          {tour.description || "Không có mô tả cho tour này"}
        </div>
        
        {tour.location && (
          <div className="text-gray-400 text-xs mb-2 flex items-center">
            <span className="mr-1">📍</span>
            <span className="truncate">{tour.location}</span>
          </div>
        )}
        
        {/* Additional info - optional */}
        {tour.duration && (
          <div className="text-gray-400 text-xs mb-2 flex items-center">
            <span className="mr-1">⏰</span>
            <span>{tour.duration}</span>
          </div>
        )}
        
        {tour.numberOfGuests && (
          <div className="text-gray-400 text-xs mb-2 flex items-center">
            <span className="mr-1">👥</span>
            <span>{tour.numberOfGuests} khách</span>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-primary text-lg">
            {formatPrice(tour.pricePerPerson)}
          </span>
          <button
            className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            aria-label={`Xem chi tiết tour ${tour.title || 'này'}`}
            onClick={handleViewDetail}
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourCard;