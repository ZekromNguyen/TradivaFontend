import React, { useState } from 'react';
import CountdownTimer from '../../components/ui/CountdownTimer';
import Rating from '../../components/ui/Rating';

const BookingBox = ({ 
  tour, 
  guestCount, 
  onGuestChange, 
  onBookTour, 
  isLoading,
  averageRating,
  reviewCount
}) => {
  // Calculate total price based on per person price and guest count
  const totalPrice = (tour.pricePerPerson || 0) * guestCount;
  
  // Set offer end time to 24 hours from now for urgency
  const offerEndTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  // Calculate any discount
  const discount = 15; // 15% discount
  const discountedPrice = totalPrice * (1 - discount / 100);
  
  // Selected date state (placeholder for date picker functionality)
  const [selectedDate, setSelectedDate] = useState(
    tour.dateStart ? new Date(tour.dateStart) : new Date()
  );
  
  return (
    <div className="booking-box bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300">
      {/* Header with price */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">{tour.pricePerPerson?.toLocaleString("vi-VN")} đ</span>
          <span className="text-gray-500 text-sm">/người</span>
        </div>
        
        {/* Ratings display */}
        <div className="mt-2">
          <Rating value={averageRating} reviews={reviewCount} size="sm" />
        </div>
      </div>
      
      {/* Booking form */}
      <div className="p-6 flex-1">
        {/* Date selection (placeholder) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Chọn ngày</label>
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
            </svg>
            <span className="font-medium text-blue-800">
              {tour.dateStart 
                ? `${new Date(tour.dateStart).toLocaleDateString("vi-VN")} - ${new Date(tour.dateEnd).toLocaleDateString("vi-VN")}` 
                : "Liên hệ để biết lịch trình"}
            </span>
          </div>
        </div>
        
        {/* Guest count selector */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Số khách</label>
            <span className="text-xs text-gray-500">Tối đa {tour.numberOfGuests || 10} khách</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => onGuestChange({ target: { value: Math.max(1, guestCount - 1) } })}
                className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                aria-label="Giảm số khách"
                disabled={guestCount <= 1}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <div className="w-12 h-10 flex items-center justify-center font-semibold text-gray-800">
                {guestCount}
              </div>
              <button
                onClick={() => onGuestChange({ target: { value: Math.min(tour.numberOfGuests || 10, guestCount + 1) } })}
                className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                aria-label="Tăng số khách"
                disabled={guestCount >= (tour.numberOfGuests || 10)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Limited time offer */}
        <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center text-blue-700 mb-2">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Ưu đãi có hạn</span>
          </div>
          <div className="flex justify-between items-center text-sm text-blue-800">
            <span>Giảm {discount}% khi đặt trong:</span>
            <CountdownTimer endTime={offerEndTime} />
          </div>
        </div>
        
        {/* Price breakdown */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center text-gray-600">
            <span>{tour.pricePerPerson?.toLocaleString("vi-VN")} đ x {guestCount} khách</span>
            <span>{totalPrice.toLocaleString("vi-VN")} đ</span>
          </div>
          
          <div className="flex justify-between items-center text-green-600">
            <span>Giảm giá {discount}%</span>
            <span>-{(totalPrice - discountedPrice).toLocaleString("vi-VN")} đ</span>
          </div>
          
          <div className="pt-3 border-t border-gray-200 flex justify-between items-center font-semibold text-gray-900">
            <span>Tổng cộng</span>
            <span className="text-xl">{discountedPrice.toLocaleString("vi-VN")} đ</span>
          </div>
        </div>
      </div>
      
      {/* Social proof and action */}
      <div className="px-6 pb-6">
        {/* Social proof */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>10 người đã đặt tour này trong tuần qua</span>
        </div>
        
        {/* Book button */}
        <button
          onClick={onBookTour}
          disabled={isLoading}
          className="w-full h-14 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all relative overflow-hidden"
          aria-label="Đặt tour ngay"
        >
          {isLoading ? (
            <>
              <span className="opacity-0">Đặt tour ngay</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            </>
          ) : (
            <span>Đặt tour ngay</span>
          )}
          
          {/* Button shine effect */}
          <span className="absolute inset-0 overflow-hidden rounded-xl">
            <span className="absolute -translate-x-full top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-[-20deg] animate-shine"></span>
          </span>
        </button>
        
        {/* Safety message */}
        <div className="mt-4 text-center text-xs text-gray-500 flex items-center justify-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Miễn phí hủy trong vòng 24 giờ</span>
        </div>
      </div>
    </div>
  );
};

export default BookingBox; 