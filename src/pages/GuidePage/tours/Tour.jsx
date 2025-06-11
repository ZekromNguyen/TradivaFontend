import React, { useState, useEffect, useRef, useCallback } from "react";
import { createTourApi, getTours, uploadFile, updateTourApi } from "../../../api/tourAPI";
import axios from "axios";
import { Container, Spinner, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TourFilter from "../../../components/manageTour/TourFilter";
import TourTable from "../../../components/manageTour/TourTable";
import TourModal from "../../../components/manageTour/TourModal";
import LocationInput from "../../../components/manageTour/LocationInput";

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
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
  const [loading, setLoading] = useState(true);
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

  // Reset form function
  const resetForm = () => {
    setNewTour({
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
    setImageFile(null);
    setFormErrors({});
    setUploadError(null);
    setLocationSuggestions([]);
  };

  // Format dates for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
  };

  const formatTours = useCallback(
    (tourData) => {
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
        image:
          tour.images?.[0]?.filePath ||
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop",
        location: tour.locationCity || "N/A",
        maxGuests: tour.numberOfGuest || 0,
        type: tour.type || "N/A",
        tourLocations: tour.tourLocations || [],
        // Store original data for editing
        originalData: tour,
      }));
    },
    []
  );

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

  useEffect(() => {
    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, []);

  const handleSelectSuggestion = (suggestion) => {
    if (suggestionType === "filter") {
      setFilters((prev) => ({ ...prev, location: suggestion.name }));
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
        setUploadError(`Không thể tải ảnh ${file.name} lên Cloudinary`);
        throw error;
      }
    }
    return uploadedUrls;
  };

  const validateForm = () => {
    const errors = {};

    // Luôn kiểm tra những trường cơ bản (dù là tạo mới hay cập nhật)
    if (!newTour.title) errors.title = "Tên tour là bắt buộc";
    if (!newTour.locationCity) errors.locationCity = "Thành phố là bắt buộc";

    // Kiểm tra thêm các trường khác nếu đang tạo mới tour
    if (!editingTour) {
      if (!newTour.duration) errors.duration = "Thời gian là bắt buộc";
      if (!newTour.pricePerPerson) errors.pricePerPerson = "Giá là bắt buộc";
      if (!newTour.numberOfPeople) errors.numberOfGuest = "Số người tối đa là bắt buộc";
      if (!newTour.type) errors.type = "Loại hình tour là bắt buộc";
      if (!newTour.description) errors.description = "Mô tả tour là bắt buộc";
      if (!newTour.dateStart) errors.dateStart = "Ngày bắt đầu là bắt buộc";
      if (!newTour.dateEnd) errors.dateEnd = "Ngày kết thúc là bắt buộc";
    }

    // Validate danh sách địa điểm
    newTour.locations.forEach((loc, index) => {
      if (!loc.name) {
        errors[`locationName${index}`] = `Tên địa điểm ${index + 1} là bắt buộc`;
      }

      // Nếu đang tạo mới thì hình ảnh là bắt buộc
      if (!editingTour && loc.images.length === 0) {
        errors[`locationImages${index}`] = `Hình ảnh địa điểm ${index + 1} là bắt buộc`;
      }

      // Luôn kiểm tra tọa độ
      if (!loc.latitude || !loc.longitude) {
        errors[`locationCoords${index}`] = `Tọa độ địa điểm ${index + 1} là bắt buộc`;
      }
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
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setUploadError("Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)");
      setImageFile(null);
      setNewTour((prev) => ({ ...prev, file: null }));
      return;
    }

    if (file.size > maxSize) {
      setUploadError(`File quá lớn. Kích thước tối đa: ${maxSize / 1024 / 1024}MB`);
      setImageFile(null);
      setNewTour((prev) => ({ ...prev, file: null }));
      return;
    }

    setUploadError(null);
    setImageFile(file);
    setNewTour((prev) => ({ ...prev, file }));
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
      if (imageFile) {
        formData.append("file", imageFile);
      }
      formData.append("Locations", JSON.stringify(processedLocations));

      const response = await createTourApi(formData);
      const tourList = await getTours();
      const formattedTours = formatTours(tourList);
      setTours(formattedTours);
      setFilteredTours(formattedTours);
      setCurrentPage(1);
      setShowAddModal(false);
      resetForm();
      alert("Thêm tour thành công!");
    } catch (error) {
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

  const handleUpdateTour = async () => {
    if (!validateForm() || !editingTour) {
      return;
    }

    setLoading(true);
    try {
      const processedLocations = await Promise.all(
        newTour.locations.map(async (location) => {
          let imageUrls = [];

          // If new images are provided, upload them
          if (location.images && location.images.length > 0) {
            imageUrls = await uploadImagesToCloudinary(location.images);
          }

          // Use new image if uploaded, otherwise keep existing image
          const primaryImage = imageUrls[0] || location.existingImage ||
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop";

          return {
            id: location.id || undefined, // Include ID if updating existing location
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
      formData.append("Id", editingTour.id.toString());
      formData.append("Title", newTour.title);
      formData.append("Description", newTour.description);
      formData.append("PricePerPerson", newTour.pricePerPerson.toString());
      formData.append("NumberOfPeople", newTour.numberOfPeople.toString());
      formData.append("DateStart", new Date(newTour.dateStart).toISOString());
      formData.append("DateEnd", new Date(newTour.dateEnd).toISOString());

      // Only append new image if one was selected
      if (imageFile) {
        formData.append("file", imageFile);
      }

      formData.append("Locations", JSON.stringify(processedLocations));

      await updateTourApi(editingTour.id, formData);

      // Refresh tour list
      const tourList = await getTours();
      const formattedTours = formatTours(tourList);
      setTours(formattedTours);
      setFilteredTours(formattedTours);
      setCurrentPage(1);

      // Close modal and reset
      setShowEditModal(false);
      setEditingTour(null);
      resetForm();

      alert("Cập nhật tour thành công!");
    } catch (error) {
      let errorMessage = "Vui lòng thử lại.";
      if (error.response) {
        errorMessage = error.response.data?.message || `Lỗi ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
      }
      alert(`Lỗi khi cập nhật tour: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTour = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tour này?")) {
      setLoading(true);
      try {
        // await deleteTourApi(id); // Uncomment when API is available
        const tourData = await getTours();
        const formattedTours = formatTours(tourData);
        setTours(formattedTours);
        setFilteredTours(formattedTours);
        setCurrentPage(1);
        alert("Xóa tour thành công!");
      } catch (error) {
        alert(`Lỗi khi xóa tour: ${error.message || "Vui lòng thử lại."}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewTour = (id) => {
    navigate(`/guide/detail/${id}`);
  };

  const handleEditTour = (id) => {
    const tour = tours.find((t) => t.id === id);
    if (!tour) {
      alert("Không tìm thấy tour để chỉnh sửa");
      return;
    }

    setEditingTour(tour);

    // Populate form with existing tour data
    const originalData = tour.originalData || tour;

    setNewTour({
      title: originalData.title || "",
      locationCity: originalData.locationCity || tour.location || "",
      duration: originalData.duration || "",
      pricePerPerson: originalData.pricePerPerson?.toString() || "",
      numberOfPeople: originalData.numberOfPeople?.toString() || originalData.numberOfGuest?.toString() || "",
      type: originalData.type || "",
      file: null, // Don't pre-populate file
      description: originalData.description || "",
      dateStart: formatDateForInput(originalData.dateStart),
      dateEnd: formatDateForInput(originalData.dateEnd),
      locations: originalData.tourLocations?.map(loc => ({
        id: loc.id,
        name: loc.name || "",
        description: loc.description || "",
        images: [], // Don't pre-populate images array
        existingImage: loc.image, // Store existing image URL
        latitude: loc.latitude?.toString() || "",
        longitude: loc.longitude?.toString() || "",
      })) || [
          {
            name: "",
            description: "",
            images: [],
            latitude: "",
            longitude: "",
          },
        ],
    });

    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingTour(null);
    resetForm();
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
      <Container fluid className="py-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        {/* Add Tour Button */}
        <div className="d-flex justify-content-end mb-4">
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            className="d-flex align-items-center"
          >
            <i className="fas fa-plus me-2"></i> Thêm Tour
          </Button>
        </div>

        {loading && (
          <div className="text-center">
            <Spinner animation="border" />
            <span className="ms-2">Đang tải...</span>
          </div>
        )}
        {error && <Alert variant="danger">{error}</Alert>}

        <TourFilter
          filters={filters}
          setFilters={setFilters}
          fetchLocationSuggestions={fetchLocationSuggestions}
          locationSuggestions={locationSuggestions}
          suggestionsLoading={suggestionsLoading}
          suggestionType={suggestionType}
          handleSelectSuggestion={handleSelectSuggestion}
        />

        <TourTable
          tours={filteredTours}
          currentPage={currentPage}
          toursPerPage={toursPerPage}
          setCurrentPage={setCurrentPage}
          handleViewTour={handleViewTour}
          handleEditTour={handleEditTour}
          handleDeleteTour={handleDeleteTour}
        />

        {/* Add Tour Modal */}
        <TourModal
          show={showAddModal}
          onHide={() => {
            setShowAddModal(false);
            resetForm();
          }}
          title="Thêm Tour Mới"
          newTour={newTour}
          setNewTour={setNewTour}
          formErrors={formErrors}
          uploadError={uploadError}
          setUploadError={setUploadError}
          handleFileChange={handleFileChange}
          imageFile={imageFile}
          fetchLocationSuggestions={fetchLocationSuggestions}
          locationSuggestions={locationSuggestions}
          suggestionsLoading={suggestionsLoading}
          suggestionType={suggestionType}
          suggestionIndex={suggestionIndex}
          handleSelectSuggestion={handleSelectSuggestion}
          handleSubmit={handleAddTour}
          loading={loading}
          submitButtonText="Thêm Tour"
        />

        {/* Edit Tour Modal */}
        <TourModal
          show={showEditModal}
          onHide={handleCloseEditModal}
          title="Chỉnh Sửa Tour"
          newTour={newTour}
          setNewTour={setNewTour}
          formErrors={formErrors}
          uploadError={uploadError}
          setUploadError={setUploadError}
          handleFileChange={handleFileChange}
          imageFile={imageFile}
          fetchLocationSuggestions={fetchLocationSuggestions}
          locationSuggestions={locationSuggestions}
          suggestionsLoading={suggestionsLoading}
          suggestionType={suggestionType}
          suggestionIndex={suggestionIndex}
          handleSelectSuggestion={handleSelectSuggestion}
          handleSubmit={handleUpdateTour}
          loading={loading}
          submitButtonText="Cập Nhật Tour"
          editingTour={editingTour}
        />
      </Container>
    </>
  );
}