import React from 'react';

const MobileBookingBar = ({ price, discountedPrice, onBookTour, isLoading }) => {
  return (
    <div className="mobile-booking-bar fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg py-3 px-4 z-50 md:hidden">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex flex-col">
          {discountedPrice && discountedPrice < price ? (
            <>
              <span className="text-gray-500 text-sm line-through">{price?.toLocaleString('vi-VN')} đ</span>
              <span className="text-blue-600 font-bold text-xl">{discountedPrice?.toLocaleString('vi-VN')} đ</span>
            </>
          ) : (
            <span className="text-blue-600 font-bold text-xl">{price?.toLocaleString('vi-VN')} đ</span>
          )}
          <span className="text-gray-500 text-xs">/người</span>
        </div>
        
        <button
          onClick={onBookTour}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-blue-600/20 transition-all relative overflow-hidden"
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
      </div>
    </div>
  );
};

export default MobileBookingBar; 