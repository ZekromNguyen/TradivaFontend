import React from "react";
import GuideCard from "../guideCard/GuideCard";
// import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";

const GuideGrid = ({ guides, isLoading, error, onViewDetail, onRetry, onClearFilters }) => {
  // if (isLoading) {
  //   return (
  //     // <div className="flex justify-center items-center h-64">
  //     //   <LoadingSpinner />
  //     // </div>
  //   );
  // }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={onRetry}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!guides || guides.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Không tìm thấy hướng dẫn viên
          </h3>
          <p className="text-gray-600 mb-4">
            Thử điều chỉnh bộ lọc để tìm thêm hướng dẫn viên phù hợp
          </p>
          <button
            onClick={onClearFilters}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {guides.map((guide) => (
        <GuideCard
          key={guide.id}
          guide={guide}
          onViewDetail={() => onViewDetail(guide.id)}
        />
      ))}
    </div>
  );
};

export default GuideGrid;