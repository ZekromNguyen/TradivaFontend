import React, { useState, useEffect } from "react";
import { createTourApi, getTourGuide, uploadFile } from "../../../api/tourAPI"; // Adjust path
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ManageTourGuide() {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    location: "all",
    type: "all",
    status: "all",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [idTour, setIdTour] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTour, setNewTour] = useState({
    title: "",
    locationCity: "",
    duration: "",
    pricePerPerson: "",
    numberOfPeople: "",
    type: "",
    description: "",
    dateStart: "",
    dateEnd: "",
    locations: [
      {
        name: "",
        description: "",
        images: [],
        latitude: "",
        longitude: "",
      },
    ],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [toursPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${
    import.meta.env.VITE_CLOUD_NAME
  }/image/upload`;
  const CLOUDINARY_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const tourData = await getTourGuide();
        console.log("getTourGuide Response:", tourData);
        const formattedTours = tourData.map((tour) => ({
          id: tour.id,
          title: tour.title || "Không có chi tiết",
          duration: tour.duration || "N/A",
          dateStart: tour.dateStart
            ? new Date(tour.dateStart).toLocaleString("vi-VN")
            : "N/A",
          dateEnd: tour.dateEnd
            ? new Date(tour.dateEnd).toLocaleString("vi-VN")
            : "N/A",
          rating: tour.ratings?.length
            ? tour.ratings.reduce((sum, r) => sum + r.score, 0) /
              tour.ratings.length
            : 0,
          reviews: tour.ratings?.length || 0,
          verified: false,
          pricePerPerson: tour.pricePerPerson || 0,
          status: tour.status || "pending",
          image:
            tour.images?.[0] ||
            tour.tourLocations?.[0]?.location?.image ||
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop",
          location: tour.tourLocations?.[0]?.location?.city || "N/A",
          maxGuests: tour.numberOfGuests || 0,
          type: tour.type || "N/A",
          tourLocations: tour.tourLocations || [],
        }));
        setTours(formattedTours);
        setFilteredTours(formattedTours);
        setCurrentPage(1);
        setLoading(false);
      } catch (e) {
        console.error("getTourGuide Error:", e);
        setError(e.message || "Không thể tải danh sách tour");
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  useEffect(() => {
    let filtered = tours.filter((tour) => {
      return (
        tour.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        (filters.location === "all" || tour.location === filters.location) &&
        (filters.type === "all" || tour.type === filters.type) &&
        (filters.status === "all" || tour.status === filters.status)
      );
    });
    setFilteredTours(filtered);
    setCurrentPage(1);
  }, [filters, tours]);

  const formatPrice = (pricePerPerson) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(pricePerPerson);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: "bg-success", label: "Hoạt động" },
      pending: { class: "bg-warning", label: "Chờ duyệt" },
      inactive: { class: "bg-secondary", label: "Tạm dừng" },
    };
    const config = statusConfig[status] || statusConfig.inactive;
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const uploadImagesToCloudinary = async (files) => {
    const uploadedUrls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_PRESET);

      try {
        const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedUrls.push(response.data.secure_url);
      } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Không thể tải ảnh lên Cloudinary");
      }
    }
    return uploadedUrls;
  };

  const handleAddTour = async () => {
    const missingFields = [];
    if (!newTour.title) missingFields.push("Tên tour");
    if (!newTour.locationCity) missingFields.push("Thành phố");
    if (!newTour.duration) missingFields.push("Thời gian");
    if (!newTour.pricePerPerson) missingFields.push("Giá");
    if (!newTour.numberOfPeople) missingFields.push("Số người tối đa");
    if (!newTour.type) missingFields.push("Loại hình tour");
    if (!newTour.description) missingFields.push("Mô tả tour");
    if (!newTour.dateStart) missingFields.push("Ngày bắt đầu");
    if (!newTour.dateEnd) missingFields.push("Ngày kết thúc");
    newTour.locations.forEach((loc, index) => {
      if (!loc.name) missingFields.push(`Tên địa điểm ${index + 1}`);
      if (loc.images.length === 0)
        missingFields.push(`Hình ảnh địa điểm ${index + 1}`);
    });

    if (missingFields.length > 0) {
      alert(
        `Vui lòng điền đầy đủ các thông tin bắt buộc: ${missingFields.join(
          ", "
        )}`
      );
      return;
    }

    try {
      const locations = await Promise.all(
        newTour.locations.map(async (location) => {
          const imageUrls = await uploadImagesToCloudinary(location.images);
          const primaryImage =
            imageUrls[0] ||
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop";
          return {
            name: location.name,
            city: newTour.locationCity,
            description: location.description || "",
            image: primaryImage,
            calendarStart: new Date(newTour.dateStart).toISOString(),
            calendarEnd: new Date(newTour.dateEnd).toISOString(),
            latitude: parseFloat(location.latitude) || 0,
            longitude: parseFloat(location.longitude) || 0,
          };
        })
      );

      const tourData = {
        title: newTour.title,
        description: newTour.description,
        pricePerPerson: parseInt(newTour.pricePerPerson) || 0,
        numberOfPeople: parseInt(newTour.numberOfPeople) || 0,
        dateStart: new Date(newTour.dateStart).toISOString(),
        dateEnd: new Date(newTour.dateEnd).toISOString(),
        duration: newTour.duration,
        type: newTour.type,
        images: locations.map((loc) => loc.image),
        locations,
      };

      const response = await createTourApi(tourData);
      console.log("createTourApi Response:", response);
      setIdTour(response);
      const tourList = await getTourGuide();
      const formattedTours = tourList.map((tour) => ({
        id: tour.id,
        title: tour.title || "Không có chi tiết",
        duration: tour.duration || "N/A",
        dateStart: tour.dateStart
          ? new Date(tour.dateStart).toLocaleString("vi-VN")
          : "N/A",
        dateEnd: tour.dateEnd
          ? new Date(tour.dateEnd).toLocaleString("vi-VN")
          : "N/A",
        rating: tour.ratings?.length
          ? tour.ratings.reduce((sum, r) => sum + r.score, 0) /
            tour.ratings.length
          : 0,
        reviews: tour.ratings?.length || 0,
        verified: false,
        pricePerPerson: tour.pricePerPerson || 0,
        status: tour.status || "pending",
        image:
          tour.images?.[0] ||
          tour.tourLocations?.[0]?.location?.image ||
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop",
        location: tour.tourLocations?.[0]?.location?.city || "N/A",
        maxGuests: tour.numberOfPeople || 0,
        type: tour.type || "N/A",
        tourLocations: tour.tourLocations || [],
      }));
      setTours(formattedTours);
      setFilteredTours(formattedTours);
      setCurrentPage(1);

    //   setShowAddModal(false);
      setNewTour({
        title: "",
        locationCity: "",
        duration: "",
        pricePerPerson: "",
        numberOfPeople: "",
        type: "",
        description: "",
        dateStart: "",
        dateEnd: "",
        locations: [
          {
            name: "",
            description: "",
            images: [],
            latitude: "",
            longitude: "",
          },
        ],
      });
      alert("Thêm tour thành công!");
    } catch (error) {
      console.error("createTourApi Error:", error);
      alert(`Lỗi khi thêm tour: ${error.message || "Vui lòng thử lại."}`);
    }
  };

  const handleDeleteTour = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tour này?")) {
      try {
        // await deleteTourApi(id); // Uncomment if you have a delete API
        const tourData = await getTourGuide();
        const formattedTours = tourData.map((tour) => ({
          id: tour.id,
          title: tour.title || "Không có chi tiết",
          duration: tour.duration || "N/A",
          dateStart: tour.dateStart
            ? new Date(tour.dateStart).toLocaleString("vi-VN")
            : "N/A",
          dateEnd: tour.dateEnd
            ? new Date(tour.dateEnd).toLocaleString("vi-VN")
            : "N/A",
          rating: tour.ratings?.length
            ? tour.ratings.reduce((sum, r) => sum + r.score, 0) /
              tour.ratings.length
            : 0,
          reviews: tour.ratings?.length || 0,
          verified: false,
          pricePerPerson: tour.pricePerPerson || 0,
          status: tour.status || "pending",
          image:
            tour.images?.[0] ||
            tour.tourLocations?.[0]?.location?.image ||
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop",
          location: tour.tourLocations?.[0]?.location?.city || "N/A",
          maxGuests: tour.numberOfPeople || 0,
          type: tour.type || "N/A",
          tourLocations: tour.tourLocations || [],
        }));
        setTours(formattedTours);
        setFilteredTours(formattedTours);
        setCurrentPage(1);
        alert("Xóa tour thành công!");
      } catch (error) {
        console.error("deleteTourApi Error:", error);
        alert(`Lỗi khi xóa tour: ${error.message || "Vui lòng thử lại."}`);
      }
    }
  };

  const handleViewTour = (id) => {
    navigate(`/tourguide/manage/detail/${id}`); // Điều hướng đến trang chi tiết
  };

  const handleEditTour = (id) => {
    const tour = tours.find((t) => t.id === id);
    alert(`Chỉnh sửa tour: ${tour.title}`);
  };

  const indexOfLastTour = currentPage * toursPerPage;
  const indexOfFirstTour = indexOfLastTour - toursPerPage;
  const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour);
  const totalPages = Math.ceil(filteredTours.length / toursPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };
  const handleChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected)); // để xem trước ảnh
  };

  const handleUpload = async (tourId) => {
    if (!file) return alert("Chọn file ảnh trước");

    const formData = new FormData();
    formData.append("TourId", tourId);
    formData.append("GuideProfileId", ""); // Nếu không có GuideProfileId thì để trống
    formData.append("ReportId", "");
    formData.append("FileName", file.name);
    formData.append("FileType", file.type);
    formData.append("URL", "");
    formData.append("File", file); // file là đối tượng File (từ input type="file")
    try {
      const res = await uploadFile(formData);
      alert("Tải ảnh thành công!");
      setShowAddModal(false);
      setFile(null);
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tải ảnh");
    }
  };
  return (
    <>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        rel="stylesheet"
      />
      <div
        className="container-fluid py-4"
        style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
      >
        {loading && (
          <div className="text-center">Đang tải danh sách tour...</div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row mb-4">
          <div className="col-md-8">
            <h1 className="h2 fw-bold text-dark mb-2">Quản lý Tour</h1>
            <p className="text-muted mb-0">
              Quản lý và theo dõi các tour du lịch
            </p>
          </div>
          <div className="col-md-4 text-md-end">
            <button
              className="btn btn-primary fw-semibold px-4 py-2"
              onClick={() => setShowAddModal(true)}
              style={{
                background: "linear-gradient(135deg, #007bff, #0056b3)",
                border: "none",
                borderRadius: "0.5rem",
              }}
            >
              <i className="fas fa-plus me-2"></i>
              Thêm tour mới
            </button>
          </div>
        </div>

        <div
          className="card shadow-sm mb-4"
          style={{ borderRadius: "0.75rem" }}
        >
          <div className="card-body p-4">
            <div className="row g-3">
              <div className="col-md-3">
                <div className="position-relative">
                  <i
                    className="fas fa-search position-absolute"
                    style={{
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#6c757d",
                    }}
                  ></i>
                  <input
                    type="text"
                    className="form-control ps-5"
                    placeholder="Tìm kiếm tour..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                >
                  <option value="all">Tất cả địa điểm</option>
                  <option value="Hội An">Hội An</option>
                  <option value="Hạ Long">Hạ Long</option>
                  <option value="Sapa">Sapa</option>
                  <option value="TP.HCM">TP.HCM</option>
                </select>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                >
                  <option value="all">Tất cả loại hình</option>
                  <option value="Văn hóa">Văn hóa</option>
                  <option value="Thiên nhiên">Thiên nhiên</option>
                  <option value="Phiêu lưu">Phiêu lưu</option>
                  <option value="Ẩm thực">Ẩm thực</option>
                </select>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="inactive">Tạm dừng</option>
                </select>
              </div>
              <div className="col-md-2">
                <button className="btn btn-outline-secondary w-100">
                  <i className="fas fa-filter me-2"></i>
                  Lọc
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm" style={{ borderRadius: "0.75rem" }}>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="fw-semibold py-3">Tour</th>
                  <th className="fw-semibold py-3">Thông tin</th>
                  <th className="fw-semibold py-3">Đánh giá</th>
                  <th className="fw-semibold py-3">Giá</th>
                  <th className="fw-semibold py-3">Trạng thái</th>
                  <th className="fw-semibold py-3 text-end">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentTours.map((tour) => (
                  <tr key={tour.id}>
                    <td className="py-3">
                      <div className="d-flex align-items-center">
                        <img
                          src={tour.image}
                          alt={tour.title}
                          className="me-3"
                          style={{
                            width: "64px",
                            height: "48px",
                            objectFit: "cover",
                            borderRadius: "0.5rem",
                          }}
                        />
                        <div>
                          <div className="fw-semibold text-dark mb-1">
                            {tour.title}
                            {tour.verified && (
                              <i className="fas fa-check-circle text-primary ms-2"></i>
                            )}
                          </div>
                          <div className="text-muted small d-flex align-items-center">
                            <i className="fas fa-map-marker-alt me-1"></i>
                            {tour.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="small text-dark mb-1">
                        <i className="fas fa-clock me-1"></i>
                        {tour.duration}
                      </div>
                      <div className="small text-muted mb-1">
                        <i className="fas fa-calendar-alt me-1"></i>
                        Bắt đầu: {tour.dateStart}
                      </div>
                      <div className="small text-muted mb-1">
                        <i className="fas fa-calendar-alt me-1"></i>
                        Kết thúc: {tour.dateEnd}
                      </div>
                      <div className="small text-muted mb-1">
                        <i className="fas fa-users me-1"></i>
                        Tối đa {tour.maxGuests} người
                      </div>
                      <div className="small text-muted mb-1">
                        <i className="fas fa-map-marker-alt me-1"></i>
                        Địa điểm:{" "}
                        {tour.tourLocations
                          ?.map((loc) => loc.location?.name)
                          .join(", ") || "N/A"}
                      </div>
                      <div className="small text-muted">{tour.type}</div>
                    </td>
                    <td className="py-3">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-star text-warning me-1"></i>
                        <span className="fw-semibold me-1">{tour.rating}</span>
                        <span className="text-muted small">
                          ({tour.reviews})
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="fw-semibold text-success">
                        {formatPrice(tour.pricePerPerson)}
                      </div>
                    </td>
                    <td className="py-3">{getStatusBadge(tour.status)}</td>
                    <td className="py-3 text-end">
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleViewTour(tour.id)}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() => handleEditTour(tour.id)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteTour(tour.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className="card shadow-sm mt-4"
          style={{ borderRadius: "0.75rem" }}
        >
          <div className="card-body d-flex justify-content-between align-items-center">
            <div className="text-muted">
              Hiển thị <span className="fw-bold">{indexOfFirstTour + 1}</span>{" "}
              đến{" "}
              <span className="fw-bold">
                {Math.min(indexOfLastTour, filteredTours.length)}
              </span>{" "}
              của <span className="fw-bold">{filteredTours.length}</span> kết
              quả
            </div>
            <nav>
              <ul className="pagination mb-0">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button className="page-link" onClick={handlePrevPage}>
                    Trước
                  </button>
                </li>
                {getPageNumbers().map((page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button className="page-link" onClick={handleNextPage}>
                    Sau
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {showAddModal && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div
                  className="modal-header text-white"
                  style={{
                    background: "linear-gradient(135deg, #007bff, #0056b3)",
                    borderRadius: "0.5rem 0.5rem 0 0",
                  }}
                >
                  <h5 className="modal-title">
                    <i className="fas fa-plus me-2"></i>
                    Thêm tour mới
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Tên tour *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập tên tour..."
                        value={newTour.title}
                        onChange={(e) =>
                          setNewTour((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Thành phố *</label>
                      <select
                        className="form-select"
                        value={newTour.locationCity}
                        onChange={(e) =>
                          setNewTour((prev) => ({
                            ...prev,
                            locationCity: e.target.value,
                          }))
                        }
                      >
                        <option value="">Chọn thành phố</option>
                        <option value="Hội An">Hội An</option>
                        <option value="Hạ Long">Hạ Long</option>
                        <option value="Sapa">Sapa</option>
                        <option value="TP.HCM">TP.HCM</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Thời gian *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="VD: 1 ngày"
                        value={newTour.duration}
                        onChange={(e) =>
                          setNewTour((prev) => ({
                            ...prev,
                            duration: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Giá (VNĐ) *</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="650000"
                        value={newTour.pricePerPerson}
                        onChange={(e) =>
                          setNewTour((prev) => ({
                            ...prev,
                            pricePerPerson: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Số người tối đa *</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="15"
                        value={newTour.numberOfGuests}
                        onChange={(e) =>
                          setNewTour((prev) => ({
                            ...prev,
                            numberOfPeople: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Loại hình tour *</label>
                      <select
                        className="form-select"
                        value={newTour.type}
                        onChange={(e) =>
                          setNewTour((prev) => ({
                            ...prev,
                            type: e.target.value,
                          }))
                        }
                      >
                        <option value="">Chọn loại hình</option>
                        <option value="Văn hóa">Văn hóa</option>
                        <option value="Thiên nhiên">Thiên nhiên</option>
                        <option value="Phiêu lưu">Phiêu lưu</option>
                        <option value="Ẩm thực">Ẩm thực</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Mô tả tour *</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Nhập mô tả chi tiết về tour..."
                        value={newTour.description}
                        onChange={(e) =>
                          setNewTour((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                      ></textarea>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Ngày bắt đầu *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={newTour.dateStart}
                        onChange={(e) =>
                          setNewTour((prev) => ({
                            ...prev,
                            dateStart: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Ngày kết thúc *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={newTour.dateEnd}
                        onChange={(e) =>
                          setNewTour((prev) => ({
                            ...prev,
                            dateEnd: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="col-12">
                      <h5 className="mt-3">Địa điểm *</h5>
                      {newTour.locations.map((location, index) => (
                        <div key={index} className="border p-3 mb-3 rounded">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6>Địa điểm {index + 1}</h6>
                            {newTour.locations.length > 1 && (
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => {
                                  setNewTour((prev) => ({
                                    ...prev,
                                    locations: prev.locations.filter(
                                      (_, i) => i !== index
                                    ),
                                  }));
                                }}
                              >
                                <i className="fas fa-trash"></i> Xóa
                              </button>
                            )}
                          </div>
                          <div className="row g-3">
                            <div className="col-md-6">
                              <label className="form-label">
                                Tên địa điểm *
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập tên địa điểm..."
                                value={location.name}
                                onChange={(e) => {
                                  const newLocations = [...newTour.locations];
                                  newLocations[index].name = e.target.value;
                                  setNewTour((prev) => ({
                                    ...prev,
                                    locations: newLocations,
                                  }));
                                }}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">
                                Hình ảnh địa điểm * (JPG, PNG, GIF, max 5MB)
                              </label>
                              <input
                                type="file"
                                className="form-control"
                                accept="image/jpeg,image/png,image/gif"
                                multiple
                                onChange={(e) => {
                                  const files = Array.from(e.target.files);
                                  const validFiles = files.filter((file) => {
                                    const isValidType = [
                                      "image/jpeg",
                                      "image/png",
                                      "image/gif",
                                    ].includes(file.type);
                                    const isValidSize =
                                      file.size <= 5 * 1024 * 1024;
                                    return isValidType && isValidSize;
                                  });
                                  if (validFiles.length !== files.length) {
                                    setUploadError(
                                      "Chỉ chấp nhận file JPG, PNG, GIF dưới 5MB"
                                    );
                                  } else {
                                    setUploadError(null);
                                  }
                                  const newLocations = [...newTour.locations];
                                  newLocations[index].images = validFiles;
                                  setNewTour((prev) => ({
                                    ...prev,
                                    locations: newLocations,
                                  }));
                                }}
                              />
                              {uploadError && (
                                <div className="text-danger small mt-2">
                                  {uploadError}
                                </div>
                              )}
                            </div>
                            <div className="col-12">
                              <label className="form-label">
                                Mô tả địa điểm
                              </label>
                              <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Nhập mô tả chi tiết về địa điểm..."
                                value={location.description}
                                onChange={(e) => {
                                  const newLocations = [...newTour.locations];
                                  newLocations[index].description =
                                    e.target.value;
                                  setNewTour((prev) => ({
                                    ...prev,
                                    locations: newLocations,
                                  }));
                                }}
                              ></textarea>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Kinh độ</label>
                              <input
                                type="number"
                                step="any"
                                className="form-control"
                                placeholder="VD: 105.8412"
                                value={location.longitude}
                                onChange={(e) => {
                                  const newLocations = [...newTour.locations];
                                  newLocations[index].longitude =
                                    e.target.value;
                                  setNewTour((prev) => ({
                                    ...prev,
                                    locations: newLocations,
                                  }));
                                }}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Vĩ độ</label>
                              <input
                                type="number"
                                step="any"
                                className="form-control"
                                placeholder="VD: 21.0285"
                                value={location.latitude}
                                onChange={(e) => {
                                  const newLocations = [...newTour.locations];
                                  newLocations[index].latitude = e.target.value;
                                  setNewTour((prev) => ({
                                    ...prev,
                                    locations: newLocations,
                                  }));
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        className="btn btn-outline-primary mt-2"
                        onClick={() => {
                          setNewTour((prev) => ({
                            ...prev,
                            locations: [
                              ...prev.locations,
                              {
                                name: "",
                                description: "",
                                images: [],
                                latitude: "",
                                longitude: "",
                              },
                            ],
                          }));
                        }}
                      >
                        <i className="fas fa-plus"></i> Thêm địa điểm
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2 p-4 bg-white rounded-lg shadow-md w-fit">
                  <label className="text-sm font-medium text-gray-700">
                    Chọn ảnh:
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      className="mt-1 block text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </label>

                  {preview && (
                    <img
                      src={preview}
                      alt="preview"
                      className="w-32 h-32 object-cover rounded-md border mt-2"
                    />
                  )}
                    Tạo tour rồi tải ảnh lên
                  <button
                    onClick={() => handleUpload(idTour)}
                    className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-all"
                  >
                    Tải lên
                  </button>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddTour}
                  >
                    Thêm tour
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
