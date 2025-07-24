import React from "react";

const GuidePageHeader = ({ onSortChange, sortBy, isDescending }) => {
  const sortOptions = [
    { value: "id", label: "Mặc định" },
    { value: "name", label: "Tên" },
    { value: "pricePerHour", label: "Giá theo giờ" },
    { value: "experience", label: "Kinh nghiệm" }
  ];

  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Khám Phá Hướng Dẫn Viên
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        Tìm kiếm hướng dẫn viên du lịch chuyên nghiệp cho chuyến đi của bạn
      </p>
      
      <div className="flex justify-center items-center gap-4 mb-8">
        <label className="text-sm font-medium text-gray-700">Sắp xếp theo:</label>
        <select
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          onClick={() => onSortChange(sortBy)}
          className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {isDescending ? "↓" : "↑"}
        </button>
      </div>
    </div>
  );
};

export default GuidePageHeader;