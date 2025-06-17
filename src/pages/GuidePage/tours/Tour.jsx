import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  createTourApi,
  deleteTourApi,
  getTourById,
  getTours,
  updateTourApi,
  uploadFile,
} from "../../../api/tourAPI";
import axios from "axios";
import { Container, Spinner, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TourFilter from "../../../components/manageTour/TourFilter";
import TourTable from "../../../components/manageTour/TourTable";
import TourModal from "../../../components/manageTour/TourModal";

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
    existingImage: "", // Thêm field này
    locations: [
      {
        name: "",
        description: "",
        images: [],
        existingImage: "", // Thêm field này
        latitude: "",
        longitude: "",
        calendarStart: "", // Thêm field này
        calendarEnd: "", // Thêm field này
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
  const [editingTour, setEditingTour] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME
    }/image/upload`;
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
        maxGuests: tour.numberOfGuests || 0,
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
    if (!newTour.title) errors.title = "Tên tour là bắt buộc";
    if (!newTour.locationCity) errors.locationCity = "Thành phố là bắt buộc";
    if (!newTour.duration) errors.duration = "Thời gian là bắt buộc";
    if (!newTour.pricePerPerson) errors.pricePerPerson = "Giá là bắt buộc";
    if (!newTour.numberOfPeople)
      errors.numberOfPeople = "Số người tối đa là bắt buộc";
    if (!newTour.type) errors.type = "Loại hình tour là bắt buộc";
    if (!newTour.description) errors.description = "Mô tả tour là bắt buộc";
    if (!newTour.dateStart) errors.dateStart = "Ngày giờ bắt đầu là bắt buộc";
    if (!newTour.dateEnd) errors.dateEnd = "Ngày giờ kết thúc là bắt buộc";

    // Validate date logic
    if (newTour.dateStart && newTour.dateEnd) {
      const startDate = new Date(newTour.dateStart);
      const endDate = new Date(newTour.dateEnd);
      if (startDate >= endDate) {
        errors.dateEnd = "Ngày kết thúc phải sau ngày bắt đầu";
      }
    }

    newTour.locations.forEach((loc, index) => {
      if (!loc.name) {
        errors[`locationName${index}`] = `Tên địa điểm ${index + 1
          } là bắt buộc`;
      }

      // For new tours, require images. For edit mode, check if has existing image OR new images
      if (!editingTour) {
        // Add mode
        if (!loc.images || loc.images.length === 0) {
          errors[`locationImages${index}`] = `Hình ảnh địa điểm ${index + 1
            } là bắt buộc`;
        }
      } else {
        // Edit mode
        // In edit mode, must have either existing image or new images
        if (!loc.existingImage && (!loc.images || loc.images.length === 0)) {
          errors[`locationImages${index}`] = `Hình ảnh địa điểm ${index + 1
            } là bắt buộc`;
        }
      }

      if (!loc.latitude || !loc.longitude) {
        errors[`locationCoords${index}`] = `Tọa độ địa điểm ${index + 1
          } là bắt buộc`;
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
        `File quá lớn. Kích thước tối đa: ${maxSize / 1024 / 1024}MB`
      );
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
        existingImage: "",
        locations: [
          {
            name: "",
            description: "",
            images: [],
            existingImage: "",
            latitude: "",
            longitude: "",
            calendarStart: "",
            calendarEnd: "",
          },
        ],
      });
      setImageFile(null);
      setFormErrors({});
      setUploadError(null);
      alert("Thêm tour thành công!");
    } catch (error) {
      let errorMessage = "Vui lòng thử lại.";
      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Lỗi ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage =
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
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
        await deleteTourApi(id); // Uncomment when API is available
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

  // 1. Thay thế function formatTourForEdit trong ManageTourGuide.jsx:

  const formatTourForEdit = (tourData) => {
    // Helper function to convert date to datetime-local format
    const formatDateForInput = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      // Format to YYYY-MM-DDTHH:mm for datetime-local input
      return date.toISOString().slice(0, 16);
    };

    return {
      id: tourData.id,
      title: tourData.title || "",
      locationCity:
        tourData.locationCity ||
        tourData.tourLocations?.[0]?.location?.city ||
        "",
      duration: tourData.duration || "",
      pricePerPerson: tourData.pricePerPerson?.toString() || "",
      numberOfPeople:
        (tourData.numberOfPeople || tourData.numberOfGuests)?.toString() || "",
      type: tourData.type || "",
      file: null, // Will be set if user uploads new image
      description: tourData.description || "",
      // Convert dates to proper format for datetime-local inputs
      dateStart: formatDateForInput(tourData.dateStart),
      dateEnd: formatDateForInput(tourData.dateEnd),
      // Store existing main image URL - check files array first, then fallback
      existingImage:
        tourData.files?.[0]?.url ||
        tourData.images?.[0]?.filePath ||
        tourData.image ||
        "",
      locations: tourData.tourLocations?.map((tl) => ({
        id: tl.location?.id || tl.id,
        name: tl.location?.name || tl.name || "",
        description: tl.location?.description || tl.description || "",
        images: [], // Empty for new uploads, will show existing images separately
        existingImage: tl.location?.image || "", // Store single existing image URL
        latitude: (tl.location?.latitude || tl.latitude)?.toString() || "",
        longitude: (tl.location?.longitude || tl.longitude)?.toString() || "",
        calendarStart: formatDateForInput(
          tl.location?.dateStart || tl.dateStart
        ),
        calendarEnd: formatDateForInput(tl.location?.dateEnd || tl.dateEnd),
        city: tl.location?.city || tl.city || "",
        image: tl.location?.image || tl.image || "",
      })) || [
          {
            id: 0,
            name: "",
            description: "",
            images: [],
            existingImage: "",
            latitude: "",
            longitude: "",
            calendarStart: "",
            calendarEnd: "",
            city: "",
            image: "",
          },
        ],
    };
  };

  // Cập nhật handleEditTour function
  const handleEditTour = async (id) => {
    try {
      setLoading(true);
      const tourData = await getTourById(id);
      const formattedTour = formatTourForEdit(tourData);
      setEditingTour(formattedTour);
      setNewTour(formattedTour);
      setShowEditModal(true);
    } catch (error) {
      alert(
        `Lỗi khi tải thông tin tour: ${error.message || "Vui lòng thử lại."}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý update tour
  const handleUpdateTour = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Process locations data for API with Cloudinary upload
      const processedLocations = await Promise.all(
        newTour.locations.map(async (location) => {
          let imageUrl = location.existingImage; // Start with existing image

          // If new images are uploaded, upload to Cloudinary and use the first one
          if (location.images && location.images.length > 0) {
            try {
              const imageUrls = await uploadImagesToCloudinary(location.images);
              imageUrl = imageUrls[0]; // Use first uploaded image as primary
            } catch (error) {
              console.error(`Lỗi upload ảnh cho địa điểm ${location.name}:`, error);
              // Keep existing image if upload fails
              imageUrl = location.existingImage || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop";
            }
          }

          // Fallback to default image if no existing and no new images
          if (!imageUrl) {
            imageUrl = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop";
          }

          return {
            id: location.id || 0,
            name: location.name,
            city: location.city || newTour.locationCity,
            description: location.description || "",
            image: imageUrl, // Use uploaded or existing image URL
            calendarStart: location.calendarStart ?
              new Date(location.calendarStart).toISOString() :
              new Date(newTour.dateStart).toISOString(),
            calendarEnd: location.calendarEnd ?
              new Date(location.calendarEnd).toISOString() :
              new Date(newTour.dateEnd).toISOString(),
            latitude: parseFloat(location.latitude) || 0,
            longitude: parseFloat(location.longitude) || 0,
          };
        })
      );

      const updateData = {
        id: editingTour.id,
        title: newTour.title,
        description: newTour.description,
        price: parseFloat(newTour.pricePerPerson),
        numberOfPeople: parseInt(newTour.numberOfPeople),
        dateStart: new Date(newTour.dateStart).toISOString(),
        dateEnd: new Date(newTour.dateEnd).toISOString(),
        status: "Active",
        locations: processedLocations,
      };

      await updateTourApi(updateData);

      // Refresh tour list
      const tourList = await getTours();
      const formattedTours = formatTours(tourList);
      setTours(formattedTours);
      setFilteredTours(formattedTours);
      setCurrentPage(1);

      // Reset form
      setShowEditModal(false);
      setEditingTour(null);
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
        existingImage: "",
        locations: [
          {
            name: "",
            description: "",
            images: [],
            existingImage: "",
            latitude: "",
            longitude: "",
            calendarStart: "",
            calendarEnd: "",
            city: "",
            image: "",
          },
        ],
      });
      setImageFile(null);
      setFormErrors({});
      setUploadError(null);

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
      <Container
        fluid
        className="py-4"
        style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
      >
        {loading && (
          <div className="text-center">
            <Spinner animation="border" />
            <span className="ms-2">Đang tải...</span>
          </div>
        )}
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="d-flex justify-content-end mb-3">
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <i className="fas fa-plus me-2"></i>
            Thêm Tour
          </Button>
        </div>
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

        <TourModal
          show={showAddModal}
          onHide={() => {
            setShowAddModal(false);
            setLocationSuggestions([]);
            setFormErrors({});
            setImageFile(null);
          }}
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
          handleAddTour={handleAddTour}
          loading={loading}
          isEditMode={false} // Add this
        />

        <TourModal
          show={showEditModal}
          onHide={() => {
            setShowEditModal(false);
            setEditingTour(null);
            setLocationSuggestions([]);
            setFormErrors({});
            setImageFile(null);
            // Reset newTour về trạng thái ban đầu
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
              existingImage: "",
              locations: [
                {
                  name: "",
                  description: "",
                  image: "",
                  existingImage: "",
                  latitude: "",
                  longitude: "",
                  calendarStart: "",
                  calendarEnd: "",
                },
              ],
            });
          }}
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
          handleUpdateTour={handleUpdateTour}
          loading={loading}
          isEditMode={true} // Add this
        />
      </Container>
    </>
  );
}