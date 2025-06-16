import React, { useEffect, useState } from "react";
import { fetchTours } from "../../api/tourAPI";
import FilterSidebar from "../../components/explore/FilterSidebar/FilterSidebar";
import TourGrid from "../../components/explore/TourGrid/TourGrid";
import Pagination from "../../components/Pagination/Pagination";
import PageHeader from "../../components/explore/PageHeader/PageHeader";
import "./ExplorePage.css";

const PAGE_SIZE = 9;
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
  const [filters, setFilters] = useState(defaultFilters);
  const [formFilters, setFormFilters] = useState(defaultFilters);
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

  // Fetch data when filters or page changes
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
  }, [filters, page]);

  // Form handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setFilters({ ...formFilters });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const handleRetry = () => {
    setError("");
    setFilters({ ...filters }); // Trigger re-fetch
  };

  const handleClearFilters = () => {
    setFormFilters(defaultFilters);
    setFilters(defaultFilters);
    setPage(1);
  };

  const handleViewDetail = (tourId) => {
    window.location.href = `/tour/${tourId}`;
  };

  return (
    <section
      className="py-16 min-h-screen relative"
      style={{
        backgroundImage: `linear-gradient(rgba(30, 136, 229, 0.18), rgba(255,255,255,0.96)), url('${BACKGROUND_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: "20vh"
      }}
    >
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <PageHeader />
        
        <div className="flex flex-col md:flex-row gap-8">
          <FilterSidebar
            formFilters={formFilters}
            sliderMin={sliderMin}
            sliderMax={sliderMax}
            minPrice={MIN_PRICE}
            maxPrice={MAX_PRICE}
            onFormChange={handleFormChange}
            onMinInput={handleMinInput}
            onMaxInput={handleMaxInput}
            onSliderMin={handleSliderMin}
            onSliderMax={handleSliderMax}
            onSearch={handleSearch}
          />

          <main className="flex-1">
            <TourGrid
              tours={tours}
              isLoading={isLoading}
              error={error}
              onViewDetail={handleViewDetail}
              onRetry={handleRetry}
              onClearFilters={handleClearFilters}
            />

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </main>
        </div>
      </div>
    </section>
  );
};

export default ExplorePage;