import React from "react";

const GuideFilterSidebar = ({
  formFilters,
  sliderMin,
  sliderMax,
  minPrice,
  maxPrice,
  onFormChange,
  onMinInput,
  onMaxInput,
  onSliderMin,
  onSliderMax,
  onSearch
}) => {
  const majors = [
    "Cultural Tours",
    "Adventure Tours", 
    "Historical Tours",
    "Nature Tours",
    "Food Tours",
    "City Tours"
  ];

  const languages = [
    "Vietnamese",
    "English", 
    "Chinese",
    "Japanese",
    "Korean",
    "French"
  ];

  return (
    <aside className="w-full md:w-80 bg-white rounded-lg shadow-lg p-6 h-fit">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Bộ lọc</h3>
      
      <form onSubmit={onSearch} className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tìm kiếm
          </label>
          <input
            type="text"
            name="search"
            value={formFilters.search}
            onChange={onFormChange}
            placeholder="Tên hướng dẫn viên..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giá theo giờ (USD)
          </label>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="number"
                value={sliderMin}
                onChange={onMinInput}
                min={minPrice}
                max={maxPrice}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                placeholder="Từ"
              />
              <span className="text-gray-500 self-center">-</span>
              <input
                type="number"
                value={sliderMax}
                onChange={onMaxInput}
                min={minPrice}
                max={maxPrice}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                placeholder="Đến"
              />
            </div>
            <div className="dual-range-slider">
              <div className="slider-track"></div>
              <div 
                className="slider-range"
                style={{
                  left: `${((sliderMin - minPrice) / (maxPrice - minPrice)) * 100}%`,
                  width: `${((sliderMax - sliderMin) / (maxPrice - minPrice)) * 100}%`
                }}
              ></div>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={sliderMin}
                onChange={onSliderMin}
                className="slider-input slider-input-min"
              />
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={sliderMax}
                onChange={onSliderMax}
                className="slider-input slider-input-max"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>${minPrice}</span>
              <span>${maxPrice}</span>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái xác minh
          </label>
          <select
            name="isVerified"
            value={formFilters.isVerified}
            onChange={onFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            <option value="true">Đã xác minh</option>
            <option value="false">Chưa xác minh</option>
          </select>
        </div>

        {/* Verification Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái xác minh
          </label>
          <select
            name="isVerified"
            value={formFilters.isVerified}
            onChange={onFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            <option value="true">Đã xác minh</option>
            <option value="false">Chưa xác minh</option>
          </select>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tình trạng
          </label>
          <select
            name="isAvailable"
            value={formFilters.isAvailable}
            onChange={onFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            <option value="true">Có sẵn</option>
            <option value="false">Bận</option>
          </select>
        </div>

        {/* Major */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chuyên môn
          </label>
          <select
            name="major"
            value={formFilters.major}
            onChange={onFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            {majors.map(major => (
              <option key={major} value={major}>{major}</option>
            ))}
          </select>
        </div>

        {/* Languages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngôn ngữ
          </label>
          <select
            name="languages"
            value={formFilters.languages}
            onChange={onFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            {languages.map(language => (
              <option key={language} value={language}>{language}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Tìm kiếm
        </button>
      </form>
    </aside>
  );
};

export default GuideFilterSidebar;