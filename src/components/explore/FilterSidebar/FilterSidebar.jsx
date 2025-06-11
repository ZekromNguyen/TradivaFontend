import React from "react";
import { FaSearch } from "react-icons/fa";

const FilterSidebar = ({
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
  return (
    <aside className="md:w-1/4 w-full bg-white rounded-xl shadow p-6 mb-6 md:mb-0">
      <form onSubmit={onSearch}>
        {/* Search Input */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Tìm kiếm</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="search"
              value={formFilters.search}
              onChange={onFormChange}
              placeholder="Tên tour, địa điểm..."
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Khoảng giá (VND)</label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={minPrice}
                max={sliderMax - 1000}
                value={sliderMin}
                onChange={onMinInput}
                className="w-1/2 border px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span>-</span>
              <input
                type="number"
                min={sliderMin + 1000}
                max={maxPrice}
                value={sliderMax}
                onChange={onMaxInput}
                className="w-1/2 border px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="range"
                min={minPrice}
                max={sliderMax - 1000}
                value={sliderMin}
                onChange={onSliderMin}
                className="w-full"
                step={1000}
              />
              <input
                type="range"
                min={sliderMin + 1000}
                max={maxPrice}
                value={sliderMax}
                onChange={onSliderMax}
                className="w-full"
                step={1000}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{sliderMin.toLocaleString("vi-VN")} đ</span>
              <span>{sliderMax.toLocaleString("vi-VN")} đ</span>
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Đánh giá tối thiểu</label>
          <select
            name="rating"
            value={formFilters.rating}
            onChange={onFormChange}
            className="w-full border px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            <option value="1">1 sao</option>
            <option value="2">2 sao</option>
            <option value="3">3 sao</option>
            <option value="4">4 sao</option>
            <option value="5">5 sao</option>
          </select>
        </div>
      </form>
    </aside>
  );
};

export default FilterSidebar;
