import React, { useEffect, useState } from "react";
import { FaStar, FaSearch } from "react-icons/fa";
import { fetchTours } from "../../api/tourApi"; // Adjust the import path as necessary
import "./ExplorePage.css"; // Assuming you have a CSS file for styles
// import "./ExplorePage.css";

const PAGE_SIZE = 8;
const BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80";

const defaultFilters = {
  minPrice: 0,
  maxPrice: 50000000,
  rating: "",
  search: "",
};

const MIN_PRICE = 0;
const MAX_PRICE = 10000000;

const ExplorePage = () => {
  const [tours, setTours] = useState([]);
  const [filters, setFilters] = useState(defaultFilters); // filter thực tế dùng để fetch
  const [formFilters, setFormFilters] = useState(defaultFilters); // filter trên form
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // slider state
  const [sliderMin, setSliderMin] = useState(MIN_PRICE);
  const [sliderMax, setSliderMax] = useState(MAX_PRICE);

  useEffect(() => {
    setSliderMin(formFilters.minPrice);
    setSliderMax(formFilters.maxPrice);
  }, [formFilters.minPrice, formFilters.maxPrice]);

  // Chỉ fetch khi filters hoặc page thay đổi
useEffect(() => {
  const getData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchTours({
        pageNumber: page,
        pageSize: PAGE_SIZE,
        search: filters.search,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        rating: filters.rating
      });
      setTours(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };
  getData();
  // eslint-disable-next-line
}, [filters, page]);

  // Xử lý thay đổi trên form (KHÔNG fetch ngay)
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý nhập số trực tiếp
  const handleMinInput = (e) => {
    let val = Math.max(MIN_PRICE, Math.min(Number(e.target.value), sliderMax - 1000));
    setSliderMin(val);
    setFormFilters(f => ({ ...f, minPrice: val }));
  };
  const handleMaxInput = (e) => {
    let val = Math.min(MAX_PRICE, Math.max(Number(e.target.value), sliderMin + 1000));
    setSliderMax(val);
    setFormFilters(f => ({ ...f, maxPrice: val }));
  };
  // Xử lý slider
  const handleSliderMin = (e) => {
    let val = Math.min(Number(e.target.value), sliderMax - 1000);
    setSliderMin(val);
    setFormFilters(f => ({ ...f, minPrice: val }));
  };
  const handleSliderMax = (e) => {
    let val = Math.max(Number(e.target.value), sliderMin + 1000);
    setSliderMax(val);
    setFormFilters(f => ({ ...f, maxPrice: val }));
  };

  // Khi nhấn nút tìm kiếm mới set filters thực tế => fetch
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setFilters({ ...formFilters });
  };

  // Xử lý phân trang
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <section
      className="py-16 min-h-screen relative"
      style={{
        backgroundImage: `linear-gradient(rgba(30, 136, 229, 0.18), rgba(255,255,255,0.96)), url('${BACKGROUND_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <h2 className="text-3xl font-bold text-center mb-4">Khám phá Tour Du Lịch</h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Tìm kiếm và lọc các tour du lịch phù hợp với bạn tại TRADIVA
        </p>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Bộ lọc bên trái */}
          <aside className="md:w-1/4 w-full bg-white rounded-xl shadow p-6 mb-6 md:mb-0">
            <form onSubmit={handleSearch}>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Tìm kiếm</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    name="search"
                    value={formFilters.search}
                    onChange={handleFormChange}
                    placeholder="Tên tour, địa điểm..."
                    className="w-full border px-3 py-2 rounded focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                  >
                    <FaSearch />
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Khoảng giá (VND)</label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={MIN_PRICE}
                      max={sliderMax - 1000}
                      value={sliderMin}
                      onChange={handleMinInput}
                      className="w-1/2 border px-2 py-1 rounded"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      min={sliderMin + 1000}
                      max={MAX_PRICE}
                      value={sliderMax}
                      onChange={handleMaxInput}
                      className="w-1/2 border px-2 py-1 rounded"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="range"
                      min={MIN_PRICE}
                      max={sliderMax - 1000}
                      value={sliderMin}
                      onChange={handleSliderMin}
                      className="w-full"
                      step={1000}
                    />
                    <input
                      type="range"
                      min={sliderMin + 1000}
                      max={MAX_PRICE}
                      value={sliderMax}
                      onChange={handleSliderMax}
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
              <div className="mb-4">
                <label className="block font-semibold mb-2">Đánh giá tối thiểu</label>
                <select
                  name="rating"
                  value={formFilters.rating}
                  onChange={handleFormChange}
                  className="w-full border px-2 py-1 rounded"
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
          {/* Danh sách tour */}
          <main className="flex-1">
            {isLoading ? (
              <div className="text-center py-16">Đang tải...</div>
            ) : error ? (
              <div className="text-center py-16 text-red-500">{error}</div>
            ) : tours.length === 0 ? (
              <div className="text-center py-16">Không có tour nào phù hợp.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map((tour) => (
                  <div
                    key={tour.id}
                    className="destination-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
                  >
                    <div className="img-zoom-container">
                      <img
                        src={
                          tour.images && tour.images.length > 0
                            ? tour.images[0].filePath
                            : "/images/fallback.jpg"
                        }
                        alt={tour.title}
                        className="w-full h-48 object-cover img-zoom"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg">{tour.title}</h3>
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{tour.rating ?? 0}</span>
                        </div>
                      </div>
                      <div className="text-gray-500 text-sm mb-3 line-clamp-2">
                        {tour.description}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-primary">
                          {tour.pricePerPerson?.toLocaleString("vi-VN")} VND
                        </span>
                        <button
                          className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary-dark transition"
                          aria-label={`Xem chi tiết tour ${tour.title}`}
                          onClick={() => window.location.href = `/tour/${tour.id}`}
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Phân trang */}
            <div className="flex justify-center mt-8 gap-2">
              <button
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                Trước
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  className={`px-3 py-1 rounded ${
                    page === idx + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                Sau
              </button>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default ExplorePage;