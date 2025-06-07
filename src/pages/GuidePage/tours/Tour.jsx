import React, { useState, useEffect, useRef, useCallback } from "react";
import { createTourApi, getTours, uploadFile } from "../../../api/tourApi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";

export default function ManageTourGuide() {
    const navigate = useNavigate();
    const [tours, setTours] = useState([]);
    const [filteredTours, setFilteredTours] = useState([]);
    const [tourId, setTourId] = useState(null);
    const [filters, setFilters] = useState({
        search: "",
        location: "all",
        type: "all",
        status: "all",
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTour, setNewTour] = useState({
        title: "",
        locationCity: "",
        duration: "",
        pricePerPerson: "",
        numberOfPeople: "",
        type: "",
        file: null, // Changed from "" to null for consistency
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
    const [formErrors, setFormErrors] = useState({});
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const [suggestionType, setSuggestionType] = useState(null);
    const [suggestionIndex, setSuggestionIndex] = useState(0);
    const suggestionTimeoutRef = useRef(null);

    // Moved imageFile state to proper location
    const [imageFile, setImageFile] = useState(null);

    const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME
        }/image/upload`;
    const CLOUDINARY_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

    // Reusable function to format tour data
    const formatTours = useCallback((tourData) => {
        if (!Array.isArray(tourData)) {
            console.warn("formatTours: tourData is not an array:", tourData);
            return [];
        }
        return tourData.map((tour) => ({
            id: tour.id,
            title: tour.title || "Không có chi tiết",
            duration: tour.duration || "N/A",
            dateStart: tour.dateStart
                ? new Date(tour.dateStart).toLocaleString("vi-VN")
                : "N/A",
            dateEnd: tour.dateEnd
                ? new Date(tour.dateEnd).toLocaleString("vi-VN")
                : "N/A",
            rating: tour.rating || 0,
            reviews: tour.numberRating || 0,
            verified: false,
            pricePerPerson: tour.pricePerPerson || 0,
            status: tour.status?.toLowerCase() || "pending",
            file: tour.images?.[0]?.filePath || "",
            image:
                tour.images?.[0]?.filePath ||
                "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop",
            location: tour.locationCity || "N/A",
            maxGuests: tour.numberOfGuests || tour.numberOfPeople || 0,
            type: tour.type || "N/A",
            tourLocations: tour.tourLocations || [],
        }));
    }, []);


    // Fetch tours with cleanup
    useEffect(() => {
        let isMounted = true;
        const fetchTours = async () => {
            try {
                setLoading(true);
                console.log("Fetching tours with params:", { sortBy: "Date", isDescending: true, pageNumber: 1, pageSize: 100 });
                const tourData = await getTours();
                console.log("Fetched tourData:", tourData);
                if (isMounted) {
                    const formattedTours = formatTours(tourData);
                    console.log("Formatted tours:", formattedTours);
                    setTours(formattedTours);
                    setFilteredTours(formattedTours);
                    setCurrentPage(1);
                    setLoading(false);
                }
            } catch (e) {
                console.error("getTours Error:", e);
                if (isMounted) {
                    setError(e.message || "Không thể tải danh sách tour");
                    setLoading(false);
                }
            }
        };
        fetchTours();
        return () => {
            isMounted = false;
        };
    }, [formatTours]); // Ensure formatTours is stable (it is, since it's wrapped in useCallback)
    // Filter tours
    useEffect(() => {
        const filtered = tours.filter((tour) => {
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

    // Fetch location suggestions with debouncing
    const fetchLocationSuggestions = useCallback(
        async (query, type, index = 0) => {
            if (!query || query.length < 3) {
                setLocationSuggestions([]);
                return;
            }

            if (suggestionTimeoutRef.current) {
                clearTimeout(suggestionTimeoutRef.current);
            }

            setSuggestionsLoading(true);

            suggestionTimeoutRef.current = setTimeout(async () => {
                try {
                    const response = await axios.get(
                        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                            query + ", Vietnam"
                        )}&format=json&addressdetails=1&countrycodes=vn&limit=5`,
                        {
                            headers: {
                                "User-Agent": "TourGuideApp/1.0 (contact@example.com)",
                            },
                        }
                    );

                    if (response.data) {
                        const suggestions = response.data.map((item) => ({
                            displayName: item.display_name,
                            name:
                                item.address.city ||
                                item.address.town ||
                                item.address.village ||
                                item.address.county ||
                                item.name,
                            lat: item.lat,
                            lon: item.lon,
                        }));

                        const uniqueSuggestions = suggestions.filter(
                            (suggestion, index, self) =>
                                index === self.findIndex((s) => s.name === suggestion.name)
                        );

                        setLocationSuggestions(uniqueSuggestions);
                        setSuggestionType(type);
                        setSuggestionIndex(index);
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy gợi ý địa điểm:", error);
                } finally {
                    setSuggestionsLoading(false);
                }
            }, 300);
        },
        []
    );

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (suggestionTimeoutRef.current) {
                clearTimeout(suggestionTimeoutRef.current);
            }
        };
    }, []);

    // Handle suggestion selection
    const handleSelectSuggestion = (suggestion) => {
        if (suggestionType === "filter") {
            handleFilterChange("location", suggestion.name);
        } else if (suggestionType === "city") {
            setNewTour((prev) => ({ ...prev, locationCity: suggestion.name }));
        } else if (suggestionType === "location") {
            const newLocations = [...newTour.locations];
            newLocations[suggestionIndex].name = suggestion.name;
            newLocations[suggestionIndex].latitude = suggestion.lat;
            newLocations[suggestionIndex].longitude = suggestion.lon;
            setNewTour((prev) => ({ ...prev, locations: newLocations }));
        }
        setLocationSuggestions([]);
    };

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
                throw new Error(`Không thể tải ảnh ${file.name} lên Cloudinary`);
            }
        }
        return uploadedUrls;
    };

    const fetchCoordinates = async (locationName, index) => {
        if (!locationName) return;

        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                    locationName + ", Vietnam"
                )}&format=json&limit=1`,
                {
                    headers: {
                        "User-Agent": "TourGuideApp/1.0 (contact@example.com)",
                    },
                }
            );

            if (response.data && response.data.length > 0) {
                const { lat, lon } = response.data[0];
                const newLocations = [...newTour.locations];
                newLocations[index].latitude = lat;
                newLocations[index].longitude = lon;
                setNewTour((prev) => ({ ...prev, locations: newLocations }));
                setUploadError(null);
            } else {
                setUploadError(`Không tìm thấy tọa độ cho: ${locationName}`);
            }
        } catch (error) {
            console.error("Lỗi API tọa độ:", error);
            setUploadError("Lỗi khi lấy tọa độ. Vui lòng thử lại.");
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!newTour.title) errors.title = "Tên tour là bắt buộc";
        if (!newTour.locationCity) errors.locationCity = "Thành phố là bắt buộc";
        if (!newTour.duration) errors.duration = "Thời gian là bắt buộc";
        if (!newTour.pricePerPerson) errors.pricePerPerson = "Giá là bắt buộc";
        if (!newTour.numberOfPeople)
            errors.numberOfPeople = "Số người tối đa là bắt buộc";
        if (!newTour.type) errors.type = "Loại hình tour là bắt buộc";
        if (!newTour.description) errors.description = "Mô tả tour là bắt buộc";
        if (!newTour.dateStart) errors.dateStart = "Ngày bắt đầu là bắt buộc";
        if (!newTour.dateEnd) errors.dateEnd = "Ngày kết thúc là bắt buộc";

        newTour.locations.forEach((loc, index) => {
            if (!loc.name)
                errors[`locationName${index}`] = `Tên địa điểm ${index + 1
                    } là bắt buộc`;
            if (loc.images.length === 0)
                errors[`locationImages${index}`] = `Hình ảnh địa điểm ${index + 1
                    } là bắt buộc`;
            if (!loc.latitude || !loc.longitude)
                errors[`locationCoords${index}`] = `Tọa độ địa điểm ${index + 1
                    } là bắt buộc`;
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Enhanced file change handler with validation
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setImageFile(null);
            setNewTour((prev) => ({ ...prev, file: null }));
            setUploadError(null);
            return;
        }

        // Validate file
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

        if (!allowedTypes.includes(file.type)) {
            setUploadError('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)');
            setImageFile(null);
            setNewTour((prev) => ({ ...prev, file: null }));
            return;
        }

        if (file.size > maxSize) {
            setUploadError(`File quá lớn. Kích thước tối đa: ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
            setImageFile(null);
            setNewTour((prev) => ({ ...prev, file: null }));
            return;
        }

        // Clear any previous errors
        setUploadError(null);

        // Update states
        setImageFile(file);
        setNewTour((prev) => ({ ...prev, file: file }));

        console.log('File selected:', {
            name: file.name,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            type: file.type
        });
    };

    // Updated tour creation with single API call
    const handleAddTour = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // Step 1: Upload location images to Cloudinary first
            const processedLocations = await Promise.all(
                newTour.locations.map(async (location) => {
                    let imageUrls = [];

                    if (location.images && location.images.length > 0) {
                        imageUrls = await uploadImagesToCloudinary(location.images);
                    }

                    const primaryImage = imageUrls[0] || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop";

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

            // Step 2: Create FormData for API
            const formData = new FormData();

            // Add basic tour fields
            formData.append('Title', newTour.title);
            formData.append('Description', newTour.description);
            formData.append('PricePerPerson', newTour.pricePerPerson.toString());
            formData.append('NumberOfPeople', newTour.numberOfPeople.toString());
            formData.append('DateStart', new Date(newTour.dateStart).toISOString());
            formData.append('DateEnd', new Date(newTour.dateEnd).toISOString());

            // Add file if exists
            if (imageFile) {
                formData.append('file', imageFile);
            }

            // Add locations as JSON string
            formData.append('Locations', JSON.stringify(processedLocations));

            // Debug FormData
            console.log('Sending tour data:');
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`${key}:`, { name: value.name, size: value.size, type: value.type });
                } else {
                    console.log(`${key}:`, value);
                }
            }

            // Step 3: Call API
            const response = await createTourApi(formData);
            console.log('Tour created successfully:', response);

            // Step 4: Refresh tour list
            const tourList = await getTours();
            const formattedTours = formatTours(tourList);
            setTours(formattedTours);
            setFilteredTours(formattedTours);
            setCurrentPage(1);

            // Step 5: Reset form and close modal
            setShowAddModal(false);
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
                file: null,
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
            setImageFile(null);

            alert("Thêm tour thành công!");
        } catch (error) {
            console.error("Create tour error:", error);

            // Enhanced error handling
            let errorMessage = "Vui lòng thử lại.";
            if (error.response) {
                errorMessage = error.response.data?.message || `Lỗi ${error.response.status}: ${error.response.statusText}`;
            } else if (error.request) {
                errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
            }

            alert(`Lỗi khi thêm tour: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTour = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tour này?")) {
            setLoading(true);
            try {
                // await deleteTourApi(id); // Replace with actual API call
                const tourData = await getTours();
                const formattedTours = formatTours(tourData);
                setTours(formattedTours);
                setFilteredTours(formattedTours);
                setCurrentPage(1);
                alert("Xóa tour thành công!");
            } catch (error) {
                console.error("deleteTourApi Error:", error);
                alert(`Lỗi khi xóa tour: ${error.message || "Vui lòng thử lại."}`);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleViewTour = (id) => {
        navigate(`/tourguide/manage/detail/${id}`);
    };

    const handleEditTour = (id) => {
        const tour = tours.find((t) => t.id === id);
        alert(`Chỉnh sửa tour: ${tour.title}`);
    };

    const indexOfLastTour = currentPage * toursPerPage;
    const indexOfFirstTour = indexOfLastTour - toursPerPage;
    const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour);
    const totalPages = Math.ceil(filteredTours.length / toursPerPage);

    const getPageNumbers = () => {
        const maxPagesToShow = 5;
        const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        return Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
        );
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
                    <div className="text-center">
                        <Spinner animation="border" />
                        <span className="ms-2">Đang tải...</span>
                    </div>
                )}
                {error && <Alert variant="danger">{error}</Alert>}

                <div className="row mb-4">
                    <div className="col-md-8">
                        <h1 className="h2 fw-bold text-dark mb-2">Quản lý Tour</h1>
                        <p className="text-muted mb-0">
                            Quản lý và theo dõi các tour du lịch
                        </p>
                    </div>
                    <div className="col-md-4 text-md-end">
                        <Button
                            variant="primary"
                            className="fw-semibold px-4 py-2"
                            onClick={() => setShowAddModal(true)}
                        >
                            <i className="fas fa-plus me-2"></i>
                            Thêm tour mới
                        </Button>
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
                                    <Form.Control
                                        type="text"
                                        placeholder="Tìm kiếm tour..."
                                        value={filters.search}
                                        onChange={(e) =>
                                            handleFilterChange("search", e.target.value)
                                        }
                                        className="ps-5"
                                    />
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="position-relative">
                                    <Form.Control
                                        type="text"
                                        placeholder="Tìm địa điểm..."
                                        value={filters.location === "all" ? "" : filters.location}
                                        onChange={(e) => {
                                            handleFilterChange("location", e.target.value);
                                            fetchLocationSuggestions(e.target.value, "filter");
                                        }}
                                    />
                                    {suggestionsLoading && suggestionType === "filter" && (
                                        <Spinner
                                            animation="border"
                                            size="sm"
                                            className="position-absolute top-50 end-0 translate-middle-y me-2"
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="col-md-2">
                                <Form.Select
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange("type", e.target.value)}
                                >
                                    <option value="all">Tất cả loại hình</option>
                                    <option value="Văn hóa">Văn hóa</option>
                                    <option value="Thiên nhiên">Thiên nhiên</option>
                                    <option value="Phiêu lưu">Phiêu lưu</option>
                                    <option value="Ẩm thực">Ẩm thực</option>
                                </Form.Select>
                            </div>
                            <div className="col-md-2">
                                <Form.Select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange("status", e.target.value)}
                                >
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="active">Hoạt động</option>
                                    <option value="pending">Chờ duyệt</option>
                                    <option value="inactive">Tạm dừng</option>
                                </Form.Select>
                            </div>
                            <div className="col-md-2">
                                <Button variant="outline-secondary" className="w-100">
                                    <i className="fas fa-filter me-2"></i>
                                    Lọc
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {locationSuggestions.length > 0 &&
                    suggestionType === "filter" &&
                    !suggestionsLoading && (
                        <div
                            className="card shadow-sm mb-4"
                            style={{ borderRadius: "0.75rem" }}
                        >
                            <div className="card-body p-2">
                                <div className="list-group">
                                    {locationSuggestions.map((suggestion, index) => (
                                        <Button
                                            key={index}
                                            variant="link"
                                            className="list-group-item list-group-item-action"
                                            onClick={() => handleSelectSuggestion(suggestion)}
                                        >
                                            <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                                            {suggestion.displayName}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

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
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => handleViewTour(tour.id)}
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </Button>
                                                <Button
                                                    variant="outline-success"
                                                    size="sm"
                                                    onClick={() => handleEditTour(tour.id)}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteTour(tour.id)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </Button>
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
                                    <Button
                                        variant="link"
                                        className="page-link"
                                        onClick={() =>
                                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                                        }
                                    >
                                        Trước
                                    </Button>
                                </li>
                                {getPageNumbers().map((page) => (
                                    <li
                                        key={page}
                                        className={`page-item ${currentPage === page ? "active" : ""
                                            }`}
                                    >
                                        <Button
                                            variant="link"
                                            className="page-link"
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </Button>
                                    </li>
                                ))}
                                <li
                                    className={`page-item ${currentPage === totalPages ? "disabled" : ""
                                        }`}
                                >
                                    <Button
                                        variant="link"
                                        className="page-link"
                                        onClick={() =>
                                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                        }
                                    >
                                        Sau
                                    </Button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <Modal
                    show={showAddModal}
                    onHide={() => {
                        setShowAddModal(false);
                        setLocationSuggestions([]);
                        setFormErrors({});
                        setImageFile(null); // Reset image file when closing modal
                    }}
                    size="lg"
                >
                    <Modal.Header
                        closeButton
                        className="text-white"
                        style={{ background: "linear-gradient(135deg, #007bff, #0056b3)" }}
                    >
                        <Modal.Title>
                            <i className="fas fa-plus me-2"></i>
                            Thêm tour mới
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <Form.Group>
                                        <Form.Label>Tên tour *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập tên tour..."
                                            value={newTour.title}
                                            onChange={(e) =>
                                                setNewTour((prev) => ({
                                                    ...prev,
                                                    title: e.target.value,
                                                }))
                                            }
                                            isInvalid={!!formErrors.title}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors.title}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group>
                                        <Form.Label>Thành phố *</Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type="text"
                                                placeholder="Nhập thành phố..."
                                                value={newTour.locationCity}
                                                onChange={(e) => {
                                                    setNewTour((prev) => ({
                                                        ...prev,
                                                        locationCity: e.target.value,
                                                    }));
                                                    fetchLocationSuggestions(e.target.value, "city");
                                                }}
                                                isInvalid={!!formErrors.locationCity}
                                            />
                                            {suggestionsLoading && suggestionType === "city" && (
                                                <Spinner
                                                    animation="border"
                                                    size="sm"
                                                    className="position-absolute top-50 end-0 translate-middle-y me-2"
                                                />
                                            )}
                                            <Form.Control.Feedback type="invalid">
                                                {formErrors.locationCity}
                                            </Form.Control.Feedback>
                                        </div>
                                    </Form.Group>
                                </div>
                                <div className="col-md-4">
                                    <Form.Group>
                                        <Form.Label>Thời gian *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="VD: 1 ngày"
                                            value={newTour.duration}
                                            onChange={(e) =>
                                                setNewTour((prev) => ({
                                                    ...prev,
                                                    duration: e.target.value,
                                                }))
                                            }
                                            isInvalid={!!formErrors.duration}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors.duration}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                                <div className="col-md-4">
                                    <Form.Group>
                                        <Form.Label>Giá (VNĐ) *</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="650000"
                                            value={newTour.pricePerPerson}
                                            onChange={(e) =>
                                                setNewTour((prev) => ({
                                                    ...prev,
                                                    pricePerPerson: e.target.value,
                                                }))
                                            }
                                            isInvalid={!!formErrors.pricePerPerson}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors.pricePerPerson}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                                <div className="col-md-4">
                                    <Form.Group>
                                        <Form.Label>Số người tối đa *</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="15"
                                            value={newTour.numberOfPeople}
                                            onChange={(e) =>
                                                setNewTour((prev) => ({
                                                    ...prev,
                                                    numberOfPeople: e.target.value,
                                                }))
                                            }
                                            isInvalid={!!formErrors.numberOfPeople}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors.numberOfPeople}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                                <div className="col-12">
                                    <Form.Group>
                                        <Form.Label>Loại hình tour *</Form.Label>
                                        <Form.Select
                                            value={newTour.type}
                                            onChange={(e) =>
                                                setNewTour((prev) => ({
                                                    ...prev,
                                                    type: e.target.value,
                                                }))
                                            }
                                            isInvalid={!!formErrors.type}
                                        >
                                            <option value="">Chọn loại hình</option>
                                            <option value="Văn hóa">Văn hóa</option>
                                            <option value="Thiên nhiên">Thiên nhiên</option>
                                            <option value="Phiêu lưu">Phiêu lưu</option>
                                            <option value="Ẩm thực">Ẩm thực</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors.type}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                                <div className="col-12">
                                    <Form.Group>
                                        <Form.Label>Mô tả tour *</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            placeholder="Nhập mô tả chi tiết về tour..."
                                            value={newTour.description}
                                            onChange={(e) =>
                                                setNewTour((prev) => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }))
                                            }
                                            isInvalid={!!formErrors.description}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors.description}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group>
                                        <Form.Label>Ngày bắt đầu *</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={newTour.dateStart}
                                            onChange={(e) =>
                                                setNewTour((prev) => ({
                                                    ...prev,
                                                    dateStart: e.target.value,
                                                }))
                                            }
                                            isInvalid={!!formErrors.dateStart}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors.dateStart}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group>
                                        <Form.Label>Ngày kết thúc *</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={newTour.dateEnd}
                                            onChange={(e) =>
                                                setNewTour((prev) => ({
                                                    ...prev,
                                                    dateEnd: e.target.value,
                                                }))
                                            }
                                            isInvalid={!!formErrors.dateEnd}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors.dateEnd}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>

                                {/* Fixed file upload section with error handling */}
                                <div className="col-12">
                                    <Form.Group>
                                        <Form.Label>Ảnh đại diện tour</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="mb-2"
                                        />
                                        {uploadError && (
                                            <div className="text-danger small mb-2">
                                                <i className="fas fa-exclamation-triangle me-1"></i>
                                                {uploadError}
                                            </div>
                                        )}
                                        {imageFile && !uploadError && (
                                            <div className="text-success small">
                                                <i className="fas fa-check-circle me-1"></i>
                                                Đã chọn: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                                            </div>
                                        )}
                                    </Form.Group>
                                </div>

                                <div className="col-12">
                                    <h5 className="mt-3">Địa điểm *</h5>
                                    {newTour.locations.map((location, index) => (
                                        <div key={index} className="border p-3 mb-3 rounded">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h6>Địa điểm {index + 1}</h6>
                                                {newTour.locations.length > 1 && (
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
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
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <Form.Group>
                                                        <Form.Label>Tên địa điểm *</Form.Label>
                                                        <div className="position-relative">
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Nhập địa điểm..."
                                                                value={location.name}
                                                                onChange={(e) => {
                                                                    const newLocations = [...newTour.locations];
                                                                    newLocations[index].name = e.target.value;
                                                                    setNewTour((prev) => ({
                                                                        ...prev,
                                                                        locations: newLocations,
                                                                    }));
                                                                    fetchLocationSuggestions(
                                                                        e.target.value,
                                                                        "location",
                                                                        index
                                                                    );
                                                                }}
                                                                isInvalid={!!formErrors[`locationName${index}`]}
                                                            />
                                                            {suggestionsLoading &&
                                                                suggestionType === "location" &&
                                                                suggestionIndex === index && (
                                                                    <Spinner
                                                                        animation="border"
                                                                        size="sm"
                                                                        className="position-absolute top-50 end-0 translate-middle-y me-2"
                                                                    />
                                                                )}
                                                            <Form.Control.Feedback type="invalid">
                                                                {formErrors[`locationName${index}`]}
                                                            </Form.Control.Feedback>
                                                        </div>
                                                    </Form.Group>
                                                </div>
                                                <div className="col-md-6">
                                                    <Form.Group>
                                                        <Form.Label>
                                                            Hình ảnh địa điểm * (JPG, PNG, GIF, max 5MB)
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="file"
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
                                                                const invalidFiles = files.filter(
                                                                    (file) => !validFiles.includes(file)
                                                                );
                                                                if (invalidFiles.length > 0) {
                                                                    setUploadError(
                                                                        `Các file không hợp lệ: ${invalidFiles
                                                                            .map((f) => f.name)
                                                                            .join(", ")}`
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
                                                            isInvalid={!!formErrors[`locationImages${index}`]}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {formErrors[`locationImages${index}`]}
                                                        </Form.Control.Feedback>
                                                        {uploadError && (
                                                            <div className="text-danger small mt-2">
                                                                {uploadError}
                                                            </div>
                                                        )}
                                                    </Form.Group>
                                                </div>
                                                <div className="col-12">
                                                    <Form.Group>
                                                        <Form.Label>Mô tả địa điểm</Form.Label>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={3}
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
                                                        />
                                                    </Form.Group>
                                                </div>
                                                <div className="col-md-6">
                                                    <Form.Group>
                                                        <Form.Label>Kinh độ (Tự động điền)</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            step="any"
                                                            placeholder="Tọa độ kinh độ"
                                                            value={location.longitude}
                                                            readOnly
                                                            isInvalid={!!formErrors[`locationCoords${index}`]}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {formErrors[`locationCoords${index}`]}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </div>
                                                <div className="col-md-6">
                                                    <Form.Group>
                                                        <Form.Label>Vĩ độ (Tự động điền)</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            step="any"
                                                            placeholder="Tọa độ vĩ độ"
                                                            value={location.latitude}
                                                            readOnly
                                                            isInvalid={!!formErrors[`locationCoords${index}`]}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {formErrors[`locationCoords${index}`]}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline-primary"
                                        className="mt-2"
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
                                    </Button>
                                </div>
                            </div>
                        </Form>

                        {locationSuggestions.length > 0 && !suggestionsLoading && (
                            <div className="mt-3">
                                <div className="card shadow-sm">
                                    <div className="card-header bg-light py-2">
                                        <h6 className="mb-0">Gợi ý địa điểm</h6>
                                    </div>
                                    <div className="card-body p-0">
                                        <div className="list-group">
                                            {locationSuggestions.map((suggestion, index) => (
                                                <Button
                                                    key={index}
                                                    variant="link"
                                                    className="list-group-item list-group-item-action"
                                                    onClick={() => handleSelectSuggestion(suggestion)}
                                                >
                                                    <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                                                    {suggestion.displayName}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowAddModal(false);
                                setLocationSuggestions([]);
                                setFormErrors({});
                                setImageFile(null);
                            }}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleAddTour}
                            disabled={loading}
                        >
                            {loading ? <Spinner animation="border" size="sm" /> : "Thêm tour"}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}