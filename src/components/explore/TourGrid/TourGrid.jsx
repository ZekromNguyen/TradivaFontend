import React from "react";
import TourCard from "../TourCard/TourCard";

const TourGrid = ({ tours, isLoading, error, onViewDetail, onRetry, onClearFilters }) => {
  const handleViewDetail = (tourId) => {
    if (onViewDetail) {
      onViewDetail(tourId);
    } else {
      // Default behavior
      window.location.href = `/tour/${tourId}`;
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-500">
        <p>{error}</p>
        <button 
          onClick={onRetry} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="text-center py-16">
        <p>Không có tour nào phù hợp với tiêu chí tìm kiếm.</p>
        <button 
          onClick={onClearFilters}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Xóa bộ lọc
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour) => (
        <TourCard
          key={tour.id}
          tour={tour}
          onViewDetail={handleViewDetail}
        />
      ))}
    </div>
  );
};

export default TourGrid;