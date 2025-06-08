import React, { useState, useEffect, useRef, useCallback } from "react";
import { createTourApi, getTours, uploadFile, getTourById } from "../../../api/tourApi"; // Adjust path as needed
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";

export default function ManageTourGuide() {
    const navigate = useNavigate();
    const [tours, setTours] = useState([]);
    const [filteredTours, setFilteredTours] = useState([]);
    const [tourDetails, setTourDetails] = useState(null);
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
        file: null,
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const [suggestionType, setSuggestionType] = useState(null);
    const [suggestionIndex, setSuggestionIndex] = useState(0);
    const [imageFile, setImageFile] = useState(null);
    const suggestionTimeoutRef = useRef(null);

    const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`;
    const CLOUDINARY_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

    // Format tours for display
    const formatTours = useCallback((tourData) => {
        const formatSingleTour = (tour) => ({
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
            description: tour.description || "N/A",
        });

        if (!Array.isArray(tourData)) {
            return [formatSingleTour(tourData)];
        }
        return tourData.map(formatSingleTour);
    }, []);

    // Fetch all tours
    useEffect(() => {
        let isMounted = true;
        const fetchTours = async () => {
            try {
                setLoading(true);
                const tourData = await getTours();
                if (isMounted) {
                    const formattedTours = formatTours(tourData);
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
    }, [formatTours]);

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

    // Fetch location suggestions
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

    // Clean up timeout
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
                errors[`locationName${index}`] = `Tên địa điểm ${index + 1} là bắt buộc`;
            if (loc.images.length === 0)
                errors[`locationImages${index}`] = `Hình ảnh địa điểm ${index + 1} là bắt buộc`;
            if (!loc.latitude || !loc.longitude)
                errors[`locationCoords${index}`] = `Tọa độ địa điểm ${index + 1} là bắt buộc`;
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setImageFile(null);
            setNewTour((prev) => ({ ...prev, file: null }));
            setUploadError(null);
            return;
        }

        const maxSize = 10 * 1024 * 1024;
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            setUploadError("Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)");
            setImageFile(null);
            setNewTour((prev) => ({ ...prev, file: null }));
            return;
        }

        if (file.size > maxSize) {
            setUploadError(
                `File quá lớn. Kích thước tối đa: ${(maxSize / 1024 / 1024).toFixed(0)}MB`
            );
            setImageFile(null);
            setNewTour((prev) => ({ ...prev, file: null }));
            return;
        }

        setUploadError(null);
        setImageFile(file);
        setNewTour((prev) => ({ ...prev, file }));
    };

    const handleLocationImageChange = (e, index) => {
        const files = Array.from(e.target.files);
        const newLocations = [...newTour.locations];
        newLocations[index].images = files;
        setNewTour((prev) => ({ ...prev, locations: newLocations }));
    };

    const addLocation = () => {
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
    };

    const removeLocation = (index) => {
        setNewTour((prev) => ({
            ...prev,
            locations: prev.locations.filter((_, i) => i !== index),
        }));
    };

    const handleAddTour = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const processedLocations = await Promise.all(
                newTour.locations.map(async (location) => {
                    let imageUrls = [];
                    if (location.images && location.images.length > 0) {
                        imageUrls = await uploadImagesToCloudinary(location.images);
                    }

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

            const formData = new FormData();
            formData.append("Title", newTour.title);
            formData.append("Description", newTour.description);
            formData.append("PricePerPerson", newTour.pricePerPerson.toString());
            formData.append("NumberOfPeople", newTour.numberOfPeople.toString());
            formData.append("DateStart", new Date(newTour.dateStart).toISOString());
            formData.append("DateEnd", new Date(newTour.dateEnd).toISOString());
            formData.append("Type", newTour.type);
            formData.append("Duration", newTour.duration);
            formData.append("LocationCity", newTour.locationCity);

            if (imageFile) {
                formData.append("file", imageFile);
            }

            formData.append("Locations", JSON.stringify(processedLocations));

            console.log("Sending tour data:");
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`${key}:`, { name: value.name, size: value.size, type: value.type });
                } else {
                    console.log(`${key}:`, value);
                }
            }

            const response = await createTourApi(formData);
            console.log("Tour created successfully:", response);

            const tourList = await getTours();
            const formattedTours = formatTours(tourList);
            setTours(formattedTours);
            setFilteredTours(formattedTours);
            setCurrentPage(1);

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
            let errorMessage = "Vui lòng thử lại.";
            if (error.response) {
                errorMessage =
                    error.response.data?.message ||
                    `Lỗi ${error.response.status}: ${error.response.statusText}`;
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
                await axios.delete(`https://tradivabe.felixtien.dev/api/Tour/${id}`);
                const tourData = await getTours();
                const formattedTours = formatTours(tourData);
                setTours(formattedTours);
                setFilteredTours(formattedTours);
                setCurrentPage(1);
                if (tourDetails && tourDetails.id === id) {
                    setTourDetails(null);
                }
                alert("Xóa tour thành công!");
            } catch (error) {
                console.error("deleteTourApi Error:", error);
                alert(`Lỗi khi xóa tour: ${error.message || "Vui lòng thử lại."}`);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleViewTour = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const tourData = await getTourById(id);
            const formattedTour = formatTours(tourData)[0];
            setTourDetails(formattedTour);
            setLoading(false);
        } catch (error) {
            console.error(`Error fetching tour details for ID ${id}:`, error);
            setError(error.message || "Không thể tải chi tiết tour");
            setLoading(false);
        }
        // Optional: Navigate to a detail page if preferred
        // navigate(`/tourguide/manage/detail/${id}`);
    };

    const handleEditTour = (id) => {
        const tour = tours.find((t) => t.id === id);
        alert(`Chỉnh sửa tour: ${tour.title}`);
        // Implement edit functionality here if needed
    };

    const handleCloseDetails = () => {
        setTourDetails(null);
        setError(null);
    };

    const indexOfLastTour = currentPage * toursPerPage;
    const indexOfFirstTour = indexOfLastTour - toursPerPage;
    const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour);
    const totalPages = Math.ceil(filteredTours.length / toursPerPage);

    const getPageNumbers = () => {
        const maxPagesToShow = 5;
        const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
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

                {/* Display Tour Details */}
                {tourDetails && (
                    <div className="card shadow-sm mb-4" style={{ borderRadius: "0.75rem" }}>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h3>Chi tiết Tour ID: {tourDetails.id}</h3>
                                <Button variant="outline-secondary" size="sm" onClick={handleCloseDetails}>
                                    <i className="fas fa-times"></i> Đóng
                                </Button>
                            </div>
                            <p>
                                <strong>Tên Tour:</strong> {tourDetails.title}
                            </p>
                            <p>
                                <strong>Mô tả:</strong> {tourDetails.description}
                            </p>
                            <p>
                                <strong>Giá mỗi người:</strong> {formatPrice(tourDetails.pricePerPerson)}
                            </p>
                            <p>
                                <strong>Số người tối đa:</strong> {tourDetails.maxGuests}
                            </p>
                            <p>
                                <strong>Ngày bắt đầu:</strong> {tourDetails.dateStart}
                            </p>
                            <p>
                                <strong>Ngày kết thúc:</strong> {tourDetails.dateEnd}
                            </p>
                            <p>
                                <strong>Trạng thái:</strong> {getStatusBadge(tourDetails.status)}
                            </p>
                            <p>
                                <strong>Loại hình:</strong> {tourDetails.type}
                            </p>
                            <h4>Địa điểm:</h4>
                            {tourDetails.tourLocations && tourDetails.tourLocations.length > 0 ? (
                                <ul>
                                    {tourDetails.tourLocations.map((location, index) => (
                                        <li key={index}>
                                            <strong>{location.location?.name || location.name || "N/A"}</strong>
                                            {location.description && <p>Mô tả: {location.description}</p>}
                                            {(location.latitude || location.longitude) && (
                                                <p>
                                                    Tọa độ: {location.latitude || "N/A"}, {location.longitude || "N/A"}
                                                </p>
                                            )}
                                            {location.image && (
                                                <img
                                                    src={location.image}
                                                    alt={location.location?.name || location.name || "Location"}
                                                    style={{
                                                        width: "100px",
                                                        height: "75px",
                                                        objectFit: "cover",
                                                        borderRadius: "0.5rem",
                                                    }}
                                                />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Không có địa điểm nào được liên kết.</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="row mb-4">
                    <div className="col-md-8">
                        <h1 className="h2 fw-bold text-dark mb-2">Quản lý Tour</h1>
                        <p className="text-muted mb-0">Quản lý và theo dõi các tour du lịch</p>
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

                <div className="card shadow-sm mb-4" style={{ borderRadius: "0.75rem" }}>
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
                                        onChange={(e) => handleFilterChange("search", e.target.value)}
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
                        <div className="card shadow-sm mb-4" style={{ borderRadius: "0.75rem" }}>
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
                                                    ?.map((loc) => loc.location?.name || loc.name || "N/A")
                                                    .join(", ") || "N/A"}
                                            </div>
                                            <div className="small text-muted">{tour.type}</div>
                                        </td>
                                        <td className="py-3">
                                            <div className="d-flex align-items-center">
                                                <i className="fas fa-star text-warning me-1"></i>
                                                <span className="fw-semibold me-1">{tour.rating}</span>
                                                <span className="text-muted small">({tour.reviews})</span>
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
                                                    className="me-1"
                                                    onClick={() => handleViewTour(tour.id)}
                                                    title="Xem chi tiết"
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </Button>
                                                <Button
                                                    variant="outline-warning"
                                                    size="sm"
                                                    className="me-1"
                                                    onClick={() => handleEditTour(tour.id)}
                                                    title="Chỉnh sửa"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteTour(tour.id)}
                                                    title="Xóa"
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
                    <div className="card-footer d-flex justify-content-between align-items-center py-3">
                        <div className="text-muted small">
                            Hiển thị {indexOfFirstTour + 1} -{" "}
                            {Math.min(indexOfLastTour, filteredTours.length)} của {filteredTours.length}{" "}
                            tour
                        </div>
                        <nav>
                            <ul className="pagination mb-0">
                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <Button
                                        variant="link"
                                        className="page-link"
                                        onClick={() => setCurrentPage((prev) => prev - 1)}
                                    >
                                        Trước
                                    </Button>
                                </li>
                                {getPageNumbers().map((page) => (
                                    <li
                                        key={page}
                                        className={`page-item ${currentPage === page ? "active" : ""}`}
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
                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                    <Button
                                        variant="link"
                                        className="page-link"
                                        onClick={() => setCurrentPage((prev) => prev + 1)}
                                    >
                                        Sau
                                    </Button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Add Tour Modal */}
                <Modal
                    show={showAddModal}
                    onHide={() => {
                        setShowAddModal(false);
                        setFormErrors({});
                        setUploadError(null);
                    }}
                    size="lg"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Thêm Tour Mới</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {uploadError && <Alert variant="danger">{uploadError}</Alert>}
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Tên Tour</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newTour.title}
                                    onChange={(e) =>
                                        setNewTour((prev) => ({ ...prev, title: e.target.value }))
                                    }
                                    isInvalid={!!formErrors.title}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formErrors.title}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Thành phố</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newTour.locationCity}
                                    onChange={(e) => {
                                        setNewTour((prev) => ({ ...prev, locationCity: e.target.value }));
                                        fetchLocationSuggestions(e.target.value, "city");
                                    }}
                                    isInvalid={!!formErrors.locationCity}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formErrors.locationCity}
                                </Form.Control.Feedback>
                                {locationSuggestions.length > 0 &&
                                    suggestionType === "city" &&
                                    !suggestionsLoading && (
                                        <div className="list-group mt-1">
                                            {locationSuggestions.map((suggestion, index) => (
                                                <Button
                                                    key={index}
                                                    variant="link"
                                                    className="list-group-item list-group-item-action"
                                                    onClick={() => handleSelectSuggestion(suggestion)}
                                                >
                                                    {suggestion.displayName}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Thời gian (ngày)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={newTour.duration}
                                    onChange={(e) =>
                                        setNewTour((prev) => ({ ...prev, duration: e.target.value }))
                                    }
                                    isInvalid={!!formErrors.duration}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formErrors.duration}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Giá mỗi người (VND)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={newTour.pricePerPerson}
                                    onChange={(e) =>
                                        setNewTour((prev) => ({ ...prev, pricePerPerson: e.target.value }))
                                    }
                                    isInvalid={!!formErrors.pricePerPerson}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formErrors.pricePerPerson}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Số người tối đa</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={newTour.numberOfPeople}
                                    onChange={(e) =>
                                        setNewTour((prev) => ({ ...prev, numberOfPeople: e.target.value }))
                                    }
                                    isInvalid={!!formErrors.numberOfPeople}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formErrors.numberOfPeople}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Loại hình tour</Form.Label>
                                <Form.Select
                                    value={newTour.type}
                                    onChange={(e) =>
                                        setNewTour((prev) => ({ ...prev, type: e.target.value }))
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

                            <Form.Group className="mb-3">
                                <Form.Label>Mô tả</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={newTour.description}
                                    onChange={(e) =>
                                        setNewTour((prev) => ({ ...prev, description: e.target.value }))
                                    }
                                    isInvalid={!!formErrors.description}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formErrors.description}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Ngày bắt đầu</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={newTour.dateStart}
                                    onChange={(e) =>
                                        setNewTour((prev) => ({ ...prev, dateStart: e.target.value }))
                                    }
                                    isInvalid={!!formErrors.dateStart}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formErrors.dateStart}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Ngày kết thúc</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={newTour.dateEnd}
                                    onChange={(e) =>
                                        setNewTour((prev) => ({ ...prev, dateEnd: e.target.value }))
                                    }
                                    isInvalid={!!formErrors.dateEnd}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formErrors.dateEnd}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Hình ảnh chính</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    isInvalid={!!uploadError}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {uploadError}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <h5 className="mt-4">Địa điểm</h5>
                            {newTour.locations.map((location, index) => (
                                <div key={index} className="border p-3 mb-3 rounded">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tên địa điểm</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={location.name}
                                            onChange={(e) => {
                                                const newLocations = [...newTour.locations];
                                                newLocations[index].name = e.target.value;
                                                setNewTour((prev) => ({ ...prev, locations: newLocations }));
                                                fetchLocationSuggestions(e.target.value, "location", index);
                                                fetchCoordinates(e.target.value, index);
                                            }}
                                            isInvalid={!!formErrors[`locationName${index}`]}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors[`locationName${index}`]}
                                        </Form.Control.Feedback>
                                        {locationSuggestions.length > 0 &&
                                            suggestionType === "location" &&
                                            suggestionIndex === index &&
                                            !suggestionsLoading && (
                                                <div className="list-group mt-1">
                                                    {locationSuggestions.map((suggestion, idx) => (
                                                        <Button
                                                            key={idx}
                                                            variant="link"
                                                            className="list-group-item list-group-item-action"
                                                            onClick={() => handleSelectSuggestion(suggestion)}
                                                        >
                                                            {suggestion.displayName}
                                                        </Button>
                                                    ))}
                                                </div>
                                            )}
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Mô tả địa điểm</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            value={location.description}
                                            onChange={(e) => {
                                                const newLocations = [...newTour.locations];
                                                newLocations[index].description = e.target.value;
                                                setNewTour((prev) => ({ ...prev, locations: newLocations }));
                                            }}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Hình ảnh địa điểm</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => handleLocationImageChange(e, index)}
                                            isInvalid={!!formErrors[`locationImages${index}`]}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formErrors[`locationImages${index}`]}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Tọa độ</Form.Label>
                                        <div className="row">
                                            <div className="col">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Vĩ độ"
                                                    value={location.latitude}
                                                    onChange={(e) => {
                                                        const newLocations = [...newTour.locations];
                                                        newLocations[index].latitude = e.target.value;
                                                        setNewTour((prev) => ({ ...prev, locations: newLocations }));
                                                    }}
                                                    isInvalid={!!formErrors[`locationCoords${index}`]}
                                                />
                                            </div>
                                            <div className="col">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Kinh độ"
                                                    value={location.longitude}
                                                    onChange={(e) => {
                                                        const newLocations = [...newTour.locations];
                                                        newLocations[index].longitude = e.target.value;
                                                        setNewTour((prev) => ({ ...prev, locations: newLocations }));
                                                    }}
                                                    isInvalid={!!formErrors[`locationCoords${index}`]}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formErrors[`locationCoords${index}`]}
                                                </Form.Control.Feedback>
                                            </div>
                                        </div>
                                    </Form.Group>

                                    {newTour.locations.length > 1 && (
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => removeLocation(index)}
                                        >
                                            Xóa địa điểm
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button variant="outline-primary" onClick={addLocation}>
                                Thêm địa điểm
                            </Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowAddModal(false);
                                setFormErrors({});
                                setUploadError(null);
                            }}
                        >
                            Hủy
                        </Button>
                        <Button variant="primary" onClick={handleAddTour} disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" /> Đang thêm...
                                </>
                            ) : (
                                "Thêm tour"
                            )}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}