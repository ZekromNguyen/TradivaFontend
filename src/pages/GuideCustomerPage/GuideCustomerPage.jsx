import React, { useEffect, useState } from "react";
import { fetchGuides } from "../../api/guideAPI";
import GuideFilterSidebar from "../../components/guideCustomer/guideFilterSidebar/GuideFilterSidebar";
import GuideGrid from "../../components/guideCustomer/guideGrid/GuideGrid";
import Pagination from "../../components/Pagination/Pagination";
import GuidePageHeader from "../../components/guideCustomer/header/GuidePageHeader";
import "./GuideCustomerPage.css";
import { useNavigate } from "react-router-dom";

// Add this inside the GuideCustomerPage component (after useState declarations)

const PAGE_SIZE = 9;
const BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80";

const defaultFilters = {
  search: "",
  minPrice: 0,
  maxPrice: 500,
  isVerified: "",
  isAvailable: "",
  major: "",
  languages: "",
};

const MIN_PRICE = 0;
const MAX_PRICE = 500;

const GuideCustomerPage = () => {
  const [guides, setGuides] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [formFilters, setFormFilters] = useState(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("id");
  const [isDescending, setIsDescending] = useState(true);
  const navigate = useNavigate();
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
        const data = await fetchGuides({
          pageNumber: page,
          pageSize: PAGE_SIZE,
          search: filters.search,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          isVerified: filters.isVerified,
          isAvailable: filters.isAvailable,
          major: filters.major,
          languages: filters.languages,
          sortBy: sortBy,
          isDescending: isDescending,
        });
        setGuides(data.items || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError("Không thể tải dữ liệu hướng dẫn viên. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [filters, page, sortBy, isDescending]);

  // Form handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMinInput = (e) => {
    let val = Math.max(
      MIN_PRICE,
      Math.min(Number(e.target.value), sliderMax - 10)
    );
    setSliderMin(val);
    setFormFilters((f) => ({ ...f, minPrice: val }));
  };

  const handleMaxInput = (e) => {
    let val = Math.min(
      MAX_PRICE,
      Math.max(Number(e.target.value), sliderMin + 10)
    );
    setSliderMax(val);
    setFormFilters((f) => ({ ...f, maxPrice: val }));
  };

  const handleSliderMin = (e) => {
    let val = Math.min(Number(e.target.value), sliderMax - 10);
    setSliderMin(val);
    setFormFilters((f) => ({ ...f, minPrice: val }));
  };

  const handleSliderMax = (e) => {
    let val = Math.max(Number(e.target.value), sliderMin + 10);
    setSliderMax(val);
    setFormFilters((f) => ({ ...f, maxPrice: val }));
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

  const handleViewDetail = (guideId) => {
    navigate(`/guide/${guideId}`); // Use navigate instead of window.location.href
  };
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setIsDescending(!isDescending);
    } else {
      setSortBy(newSortBy);
      setIsDescending(true);
    }
    setPage(1);
  };

  return (
    <section
      className="py-16 min-h-screen relative"
      style={{
        backgroundImage: `linear-gradient(rgba(30, 136, 229, 0.18), rgba(255,255,255,0.96)), url('${BACKGROUND_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: "20vh",
      }}
    >
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <GuidePageHeader
          onSortChange={handleSortChange}
          sortBy={sortBy}
          isDescending={isDescending}
        />

        <div className="flex flex-col md:flex-row gap-8">
          <GuideFilterSidebar
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
            <GuideGrid
              guides={guides}
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

export default GuideCustomerPage;
