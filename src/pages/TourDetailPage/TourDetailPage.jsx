import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ImageCarousel from "../../components/ui/ImageCarousel";
import TourGallery from "../../components/ui/TourGallery";
import "./TourDetailPage.css";
import TourInfo from "../../components/tour/TourInfo/TourInfo";
import LocationList from "../../components/tour/LocationList/LocationList";
import LocationDetail from "../../components/tour/LocationDetail/LocationDetail";
import CountdownTimer from "../../components/ui/CountdownTimer";
import MediaHero from "../../components/ui/MediaHero";
import TourBadges from "../../components/ui/TourBadges";
import Rating from "../../components/ui/Rating";
import LocationBadge from "../../components/ui/LocationBadge";
import PriceBadge from "../../components/ui/PriceBadge";
import MediaGallery from "../../components/ui/MediaGallery";
import MobileBookingBar from "../../components/tour/MobileBookingBar";

// Enhanced Hero Section Component
const TourHero = ({ tour, averageRating, reviewCount }) => {
  // Get images from tour.files array 
  const allImages = tour.files
    ?.filter(file => file && file.filePath && (file.fileType === 'jpg' || file.fileType === 'jpeg' || file.fileType === 'png' || file.fileType?.includes('image')))
    .map(file => file.filePath) || [];
  
  // If no images available, use a placeholder
  if (allImages.length === 0) {
    allImages.push("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80");
  }
  
  // Calculate tour duration
  const duration = tour.dateStart && tour.dateEnd 
    ? Math.ceil((new Date(tour.dateEnd) - new Date(tour.dateStart)) / (1000 * 60 * 60 * 24)) 
    : 3;
  
  return (
    <div className="tour-hero">
      {/* Premium image carousel */}
      <ImageCarousel 
        images={allImages}
        transitionEffect="crossfade"
        autoplaySpeed={5000}
        showThumbnails={false}
        lazyLoad="progressive"
      />
      
      {/* Hero content */}
      <div className="tour-hero-content">
        <div className="container mx-auto">
          <div className="tour-badges">
            <span className="tour-badge tour-badge-primary">
              {duration} ngày
            </span>
            {tour.tourLocations && tour.tourLocations.length > 0 && (
              <span className="tour-badge tour-badge-secondary">
                {tour.tourLocations.length} địa điểm
              </span>
            )}
          </div>
          
          <h1 className="tour-title">{tour.title}</h1>
          
          <div className="flex items-center gap-6 flex-wrap text-white/90">
            <Rating 
              value={averageRating} 
              reviews={reviewCount} 
              size="md"
            />
            {tour.tourLocations && tour.tourLocations.length > 0 && (
              <LocationBadge location={tour.tourLocations[0]?.location?.city || "Vietnam"} />
            )}
            <PriceBadge price={tour.pricePerPerson} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced BookingPanel Component
const BookingPanel = ({ tour, guestCount, onGuestChange, onBookTour, isLoading }) => {
  const totalPrice = (tour.pricePerPerson || 0) * guestCount;
  const offerEndTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
  
  return (
    <div className="booking-panel">
      <div className="booking-panel-header">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Giá tour</span>
          <div className="price-display">{tour.pricePerPerson?.toLocaleString("vi-VN")} ₫</div>
        </div>
        <div className="price-per-person text-right">mỗi người</div>
        </div>
        
      <div className="booking-panel-body">
        {/* Guest selector */}
        <div>
          <label className="text-gray-700 font-medium mb-2 block">Số khách</label>
          <div className="guest-selector">
            <button
              onClick={() => onGuestChange({ target: { value: Math.max(1, guestCount - 1) } })}
              className="guest-button"
              aria-label="Giảm số khách"
            >
              −
            </button>
            <div className="guest-count">{guestCount}</div>
            <button
              onClick={() => onGuestChange({ target: { value: Math.min(tour.numberOfGuests || 99, guestCount + 1) } })}
              className="guest-button"
              aria-label="Tăng số khách"
            >
              +
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-1">Tối đa {tour.numberOfGuests || 10} khách</div>
        </div>
        
        {/* Date display */}
        <div className="p-3 bg-blue-50 rounded-lg my-4">
          <div className="flex items-center gap-2 text-blue-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
            </svg>
            <span className="font-medium">
              {tour.dateStart 
                ? `Từ ${new Date(tour.dateStart).toLocaleDateString("vi-VN")}` 
                : "Chưa cập nhật"}
              {tour.dateEnd 
                ? ` đến ${new Date(tour.dateEnd).toLocaleDateString("vi-VN")}` 
                : ""}
            </span>
          </div>
        </div>
        
        {/* Offer notification */}
        <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
          <div className="flex items-center text-blue-700 mb-2">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Ưu đãi có hạn</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Giảm 15% khi đặt trong:</span>
            <CountdownTimer endTime={offerEndTime} />
          </div>
        </div>
        
        {/* Social proof */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>10 người đã đặt tour này trong tuần qua</span>
        </div>
      </div>
      
      {/* Call to action */}
      <div className="booking-panel-footer">
        <div className="flex justify-between mb-4">
          <span className="text-base font-medium">Tổng cộng</span>
          <span className="price-display">{totalPrice.toLocaleString("vi-VN")} ₫</span>
        </div>
        <button
          onClick={onBookTour}
          disabled={isLoading}
          className="booking-cta"
          aria-label="Đặt tour ngay"
        >
          {isLoading ? (
            <>
              <span className="opacity-0">Đặt tour ngay</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            </>
          ) : (
            <span>Đặt tour ngay</span>
          )}
        </button>
        <div className="text-xs text-center mt-4 text-gray-500">Miễn phí hủy trong vòng 24 giờ</div>
      </div>
    </div>
  );
};

// Tour Info Component
const TourOverview = ({ tour }) => {
  return (
    <div className="tour-section">
      <h2 className="tour-section-title">Tổng quan tour</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Ngày khởi hành</div>
              <div className="text-gray-600">
                {tour.dateStart
                  ? new Date(tour.dateStart).toLocaleString("vi-VN", {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : "Chưa cập nhật"}
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Ngày kết thúc</div>
              <div className="text-gray-600">
                {tour.dateEnd
                  ? new Date(tour.dateEnd).toLocaleString("vi-VN", {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : "Chưa cập nhật"}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Số lượng khách</div>
              <div className="text-gray-600">Tối đa {tour.numberOfGuests || "?"} khách</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Địa điểm</div>
              <div className="text-gray-600">{tour.tourLocations?.length || 0} địa điểm</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Mô tả tour</h3>
        <p className="tour-description">
          {tour.description || "Chưa có mô tả chi tiết cho tour này."}
        </p>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Điểm nổi bật</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Trải nghiệm văn hóa độc đáo tại các điểm tham quan</span>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Đội ngũ hướng dẫn viên chuyên nghiệp, thông thạo địa phương</span>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Bao gồm các bữa ăn chính với ẩm thực đặc sắc địa phương</span>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Phương tiện di chuyển tiện nghi và an toàn</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

// Sample placeholder tab components
const ItineraryTab = ({ tour }) => (
  <div className="tour-section">
    <h2 className="tour-section-title">Lịch trình chi tiết</h2>
    
    <div className="space-y-8 mt-6">
      <div className="relative pl-8 pb-8 border-l-2 border-blue-100">
        <div className="absolute top-0 left-0 w-6 h-6 -translate-x-3 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">1</span>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Ngày 1: Khởi hành</h3>
          <p className="text-gray-700">
            Tập trung tại điểm hẹn, làm thủ tục khởi hành. Hướng dẫn viên đón và đưa đoàn đến điểm tham quan đầu tiên.
            Buổi trưa dùng bữa tại nhà hàng địa phương và tiếp tục hành trình trong buổi chiều.
            Buổi tối, đoàn check-in khách sạn và tự do khám phá địa phương.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Bữa sáng</span>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Bữa trưa</span>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Bữa tối</span>
          </div>
        </div>
      </div>
      
      <div className="relative pl-8 pb-8 border-l-2 border-blue-100">
        <div className="absolute top-0 left-0 w-6 h-6 -translate-x-3 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">2</span>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Ngày 2: Khám phá</h3>
          <p className="text-gray-700">
            Sau bữa sáng tại khách sạn, đoàn di chuyển đến các điểm tham quan chính của tour.
            Trải nghiệm văn hóa địa phương và thưởng thức ẩm thực đặc sắc. 
            Buổi chiều tiếp tục hành trình và có thời gian tự do mua sắm.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Bữa sáng</span>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Bữa trưa</span>
          </div>
        </div>
      </div>
      
      <div className="relative pl-8">
        <div className="absolute top-0 left-0 w-6 h-6 -translate-x-3 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">3</span>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Ngày 3: Kết thúc hành trình</h3>
          <p className="text-gray-700">
            Buổi sáng tự do tham quan hoặc nghỉ ngơi tại khách sạn. Làm thủ tục trả phòng.
            Đoàn di chuyển về điểm xuất phát, kết thúc chương trình tour. Hướng dẫn viên chia tay và hẹn gặp lại quý khách trong những hành trình tiếp theo.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Bữa sáng</span>
          </div>
        </div>
      </div>
    </div>
    
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
      <div className="flex items-start">
        <svg className="w-6 h-6 text-yellow-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div>
          <h4 className="font-semibold text-lg mb-1">Lưu ý</h4>
          <p className="text-sm text-gray-700">
            Lịch trình có thể thay đổi tùy theo điều kiện thời tiết và tình hình thực tế nhưng vẫn đảm bảo đầy đủ các điểm tham quan. Tour guide sẽ thông báo cụ thể cho quý khách mỗi ngày.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const LocationsTab = ({ tour, selectedLocation, onSelectLocation }) => (
  <div className="tour-section">
    <h2 className="tour-section-title">Địa điểm trong tour</h2>
    
    {tour.tourLocations && tour.tourLocations.length > 0 ? (
      <>
        <div className="location-list">
          {tour.tourLocations.map((tourLocation, index) => {
            const location = tourLocation.location;
            if (!location) return null;
            
            const isActive = selectedLocation && selectedLocation.id === location.id;
            
            return (
              <div 
                key={location.id || index}
                className={`location-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelectLocation(location)}
              >
                <div className="location-image">
                  <img 
                    src={location.image || "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=400&q=80"} 
                    alt={location.name} 
                  />
                </div>
                <div className="location-info">
                  <div className="location-name">{location.name}</div>
                  <div className="location-city">{location.city}</div>
                </div>
              </div>
            );
          })}
        </div>
        
        {selectedLocation && (
          <div className="location-detail">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedLocation.name}</h3>
                  <div className="text-gray-600">{selectedLocation.city}</div>
                </div>
              </div>
              
              {selectedLocation.image && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={selectedLocation.image} 
                    alt={selectedLocation.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
              
              <div className="text-gray-700 mt-4">
                <p>{selectedLocation.description || "Chưa có mô tả chi tiết cho địa điểm này."}</p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold mb-2">Thời gian tham quan</h4>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {selectedLocation.dateStart ? (
                    <span>
                      Từ {new Date(selectedLocation.dateStart).toLocaleDateString("vi-VN")}
                      {selectedLocation.dateEnd ? ` đến ${new Date(selectedLocation.dateEnd).toLocaleDateString("vi-VN")}` : ""}
                    </span>
                  ) : (
                    <span>Chưa có thông tin</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    ) : (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có địa điểm</h3>
        <p className="text-gray-600">Thông tin địa điểm đang được cập nhật.</p>
      </div>
    )}
  </div>
);

// Rating Form Component
const RatingForm = ({ tourId, onRatingSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để đánh giá tour");
      navigate("/login");
      return;
    }
    
    if (!comment.trim()) {
      setError("Vui lòng nhập nội dung đánh giá");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError("");
      
      // Actual API call to create rating
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      const response = await fetch("https://tradivabe.felixtien.dev/api/Rating/createRatingTour", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          tourId: Number(tourId),
          fromUserId: user?.id || 0,
          ratingStar: rating,
          comment: comment,
          createdAt: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Có lỗi khi gửi đánh giá");
      }
      
      // Add the new rating to the list
      onRatingSubmitted({
        userName: user?.username || "Bạn",
        rating: rating,
        content: comment,
        createdAt: new Date().toISOString(),
      });
      
      // Reset form
      setComment("");
      setRating(5);
      
    } catch (err) {
      console.error("Error submitting rating:", err);
      setError(err.message || "Có lỗi khi gửi đánh giá");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">Đánh giá tour</h3>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Xếp hạng của bạn</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button 
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className="text-2xl focus:outline-none"
              >
                <span className={star <= rating ? "text-yellow-400" : "text-gray-300"}>
                  ★
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 mb-2">
            Nội dung đánh giá
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px]"
            placeholder="Chia sẻ trải nghiệm của bạn về tour này..."
          />
          <div className="text-xs text-gray-500 mt-1">Tối thiểu 10 ký tự</div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 float-right"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </form>
    </div>
  );
};

const ReviewsTab = ({ reviews = [], tourId, onAddReview }) => {
  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  
  return (
    <div>
      <RatingForm tourId={tourId} onRatingSubmitted={onAddReview} />
      
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-bold mb-4">Đánh giá từ khách hàng</h3>
        
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review, idx) => (
              <div key={idx} className="border-b pb-4 mb-4 last:border-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-medium">{review.userName}</span>
                  {review.userName !== "testuser"}
                  {review.createdAt && (
                    <span className="text-gray-500 text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="text-gray-700">{review.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <p className="text-gray-500">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const FAQTab = ({ faqs = [] }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="tour-section">
      <h2 className="tour-section-title">Câu hỏi thường gặp</h2>
      
      <div className="space-y-4 mt-6">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300"
          >
            <button
              className="flex items-center justify-between w-full p-4 text-left bg-white hover:bg-gray-50 transition-colors"
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
            >
              <span className="font-medium text-gray-900">{faq.question}</span>
              <svg 
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openIndex === index ? 'transform rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {faqs.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có câu hỏi</h3>
          <p className="text-gray-600">Thông tin FAQ đang được cập nhật.</p>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Bạn có câu hỏi khác?</h3>
            <p className="text-sm text-blue-800">
              Nếu bạn không tìm thấy câu trả lời cho thắc mắc của mình, vui lòng liên hệ với chúng tôi qua hotline <span className="font-medium">1900 1234</span> hoặc email <span className="font-medium">support@tradiva.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const TourDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Tổng quan');
  const [showMobileBooking, setShowMobileBooking] = useState(false);
  // Reviews state - initialized empty
  const [reviews, setReviews] = useState([]);
  // Sample FAQs data
  const [faqs] = useState([
    { question: 'Tôi có thể hủy tour không?', answer: 'Bạn có thể hủy tour trong vòng 24 giờ sau khi đặt mà không mất phí.' },
    { question: 'Tour có bao gồm bữa ăn không?', answer: 'Các bữa ăn chính đều được bao gồm trong giá tour.' },
    { question: 'Tôi nên mang theo những gì?', answer: 'Bạn nên mang theo quần áo phù hợp với thời tiết, kem chống nắng, và các vật dụng cá nhân.' }
  ]);
  
  // Track scroll for sticky header effect
  const tabsRef = useRef(null);
  const [tabsScrolled, setTabsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current) {
        const tabsTop = tabsRef.current.getBoundingClientRect().top;
        setTabsScrolled(tabsTop <= 60); // Adjust based on your header height
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Add class to body to ensure proper header visibility
    document.body.classList.add('tour-page-active');
    
    if (!id) return;
    const fetchTour = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://tradivabe.felixtien.dev/api/Tour/${id}`
        );
        if (!res.ok) throw new Error("Không thể tải dữ liệu tour");
        const data = await res.json();
        
        // Make sure the files array is properly structured
        if (!data.files) {
          data.files = [];
        }
        
        // Set the tour data
        setTour(data);
        
        // Set first location if available
        setSelectedLocation(data.tourLocations?.[0]?.location || null);
        
        // Set ratings from tour data
        if (data.ratings && Array.isArray(data.ratings)) {
          const formattedRatings = data.ratings.map(item => ({
            userName: item.fromUser?.username || "Khách hàng",
            rating: item.ratingStar || 5,
            content: item.comment || "",
            createdAt: item.createdAt || new Date().toISOString()
          }));
          
          setReviews(formattedRatings);
        }
      } catch (err) {
        console.error("Error fetching tour:", err);
        setError(err.message || "Đã xảy ra lỗi");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTour();
    
    return () => {
      // Clean up body class when component unmounts
      document.body.classList.remove('tour-page-active');
    };
  }, [id]);

  // Function to add a new review
  const handleAddReview = (newReview) => {
    setReviews(prevReviews => [newReview, ...prevReviews]);
  };

  const handleGuestChange = (e) => {
    const value = Math.max(1, Math.min(Number(e.target.value), tour?.numberOfGuests || 99));
    setGuestCount(value);
  };

  const { user, isLoggedIn } = useAuth();

  const handleBookTour = async () => {
    if(!isLoggedIn) {
      alert("Bạn cần đăng nhập để đặt tour.");
      navigate("/login");
      return;
    }
    
    if (!tour) return;
    
    setBookingLoading(true);
    try {
      const amount = (tour.pricePerPerson || 0) * guestCount;
      
      // Lấy accessToken từ localStorage hoặc context
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        navigate("/login");
        return;
      }
      
      // Lấy thông tin user từ context
      const buyerName = user?.username || "";
      const buyerEmail = user?.email || "";
      const buyerPhone = user?.phone || "";
      
      const res = await fetch("https://tradivabe.felixtien.dev/api/Payment/createPayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": accessToken ? `Bearer ${accessToken}` : undefined,
          "accept": "*/*"
        },
        body: JSON.stringify({
          tourId: tour.id,
          tourName: tour.title,
          method: "online",
          amount,
          orderCode: 0,
          description: `Tour ${tour.title}`.substring(0, 25),
          buyerName,
          buyerEmail,
          buyerPhone,
          buyerAddress: "",
          numberGuest: guestCount,
          cancelUrl: window.location.href,
          returnUrl: window.location.href,
        }),
      });
      
      // Kiểm tra response status trước khi parse JSON
      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", res.status, errorText);
        
        if (res.status === 401) {
          throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else {
          try {
            // Thử parse lỗi dưới dạng JSON
            const errorJson = JSON.parse(errorText);
            if (errorJson.error) {
              throw new Error(errorJson.error);
            }
          } catch (e) {
            // Nếu có lỗi parse hoặc không có trường error
            if (e.message !== "Unexpected token '<'") {
              throw e;
            }
          }
          throw new Error("Không thể tạo thanh toán. Vui lòng thử lại sau.");
        }
      }
      
      // Parse JSON chỉ khi response OK
      const data = await res.json();
      
      if (data?.paymentResult?.checkoutUrl) {
        window.location.href = data.paymentResult.checkoutUrl;
      } else {
        console.error("Missing checkout URL in response:", data);
        alert("Không tạo được thanh toán. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert(`Có lỗi khi đặt tour: ${err.message || "Không xác định"}`);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải thông tin tour...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!tour) return null;

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <section className="tour-detail-page">
      {/* Hero Section */}
      <TourHero 
        tour={tour} 
        averageRating={averageRating} 
        reviewCount={reviews.length} 
      />
      
      {/* Content Tabs */}
      <div 
        ref={tabsRef} 
        className={`tour-tabs ${tabsScrolled ? 'scrolled' : ''}`}
      >
        <div className="container mx-auto">
          <nav className="flex overflow-x-auto hide-scrollbar">
            {['Tổng quan', 'Lịch trình', 'Địa điểm', 'Đánh giá', 'FAQ'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                className={`tour-tab-button ${activeTab === tab ? 'active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="tour-content container mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content area - 70% */}
          <div className="lg:w-[70%]">
            <div className="tour-main-content">
            {activeTab === 'Tổng quan' && <TourOverview tour={tour} />}
            {activeTab === 'Lịch trình' && <ItineraryTab tour={tour} />}
            {activeTab === 'Địa điểm' && <LocationsTab tour={tour} selectedLocation={selectedLocation} onSelectLocation={setSelectedLocation} />}
              {activeTab === 'Đánh giá' && <ReviewsTab reviews={reviews} tourId={id} onAddReview={handleAddReview} />}
            {activeTab === 'FAQ' && <FAQTab faqs={faqs} />}
            </div>
            
            {/* Media Gallery - Only show on Overview tab */}
            {activeTab === 'Tổng quan' && (
              <div className="media-gallery">
                <h2 className="tour-section-title">Hình ảnh</h2>
              <MediaGallery 
                  images={tour.files
                    ?.filter(file => file && file.filePath && (file.fileType === 'jpg' || file.fileType === 'jpeg' || file.fileType === 'png' || file.fileType?.includes('image')))
                    .map(file => file.filePath) || []}
                videos={[]}
                panoramas={[]}
                layout="mosaic"
                features={{
                  lightbox: true,
                  zoom: true,
                  categories: true
                }}
              />
              </div>
            )}
          </div>
          
          {/* Booking panel - 30% */}
          <div className="lg:w-[30%]">
            <BookingPanel 
              tour={tour}
              guestCount={guestCount}
              onGuestChange={handleGuestChange}
              onBookTour={handleBookTour}
              isLoading={bookingLoading}
            />
          </div>
        </div>
      </div>
      
      {/* Mobile bottom action bar */}
      <MobileBookingBar 
        price={tour.pricePerPerson}
        onBookTour={() => setShowMobileBooking(true)}
        isLoading={bookingLoading}
      />
      
      {/* Mobile booking sheet */}
      {showMobileBooking && (
        <div className="mobile-sheet">
          <div className="mobile-sheet-content">
            <div className="mobile-sheet-header">
              <h3 className="text-xl font-bold">Đặt tour</h3>
              <button 
                onClick={() => setShowMobileBooking(false)}
                className="mobile-sheet-close"
                aria-label="Đóng"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="text-lg font-bold">{tour.title}</div>
                <div className="text-gray-500">
                  {tour.dateStart ? new Date(tour.dateStart).toLocaleDateString() : "Chưa có ngày"}
                </div>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Giá mỗi người</span>
                <span className="font-medium">{tour.pricePerPerson?.toLocaleString("vi-VN")} ₫</span>
              </div>

              <div className="py-3 border-b border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Số khách</span>
                  <div className="guest-selector">
                    <button
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="guest-button"
                    >
                      −
                    </button>
                    <span className="guest-count">{guestCount}</span>
                    <button
                      onClick={() => setGuestCount(Math.min(tour.numberOfGuests || 10, guestCount + 1))}
                      className="guest-button"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500">Tối đa {tour.numberOfGuests || 10} khách</div>
              </div>

              <div className="py-4 border-b border-gray-100">
                <div className="flex justify-between text-lg">
                  <span className="font-medium">Tổng cộng</span>
                  <span className="font-bold text-blue-700">
                    {(tour.pricePerPerson * guestCount).toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleBookTour}
                  className="booking-cta"
                >
                  {bookingLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Đang xử lý...</span>
                    </div>
                  ) : (
                    "Xác nhận đặt tour"
                  )}
                </button>
                <div className="text-center text-xs text-gray-500 mt-2">
                  Miễn phí hủy trong vòng 24 giờ
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TourDetailPage;