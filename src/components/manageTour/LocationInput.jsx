import React from "react";
import { Form, Button, Spinner } from "react-bootstrap";

const LocationInput = ({
    index,
    location,
    newTour,
    setNewTour,
    formErrors,
    uploadError,
    setUploadError,
    fetchLocationSuggestions,
    suggestionsLoading,
    suggestionType,
    suggestionIndex,
    handleSelectSuggestion,
    canDelete,
    isEditMode = false // Thêm prop này
}) => {
    const handleLocationChange = (field, value) => {
        const newLocations = [...newTour.locations];
        newLocations[index][field] = value;
        setNewTour((prev) => ({ ...prev, locations: newLocations }));
    };

    const handleLocationImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) {
            setUploadError(null);
            return;
        }

        const validFiles = files.filter((file) => {
            const isValidType = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/jpg"].includes(file.type);
            const isValidSize = file.size <= 10 * 1024 * 1024; // Increase to 10MB
            return isValidType && isValidSize;
        });

        const invalidFiles = files.filter((file) => !validFiles.includes(file));
        
        if (invalidFiles.length > 0) {
            const invalidFileNames = invalidFiles.map(f => f.name).join(", ");
            setUploadError(`Các file không hợp lệ: ${invalidFileNames}. Chỉ chấp nhận JPG, PNG, GIF, WebP và kích thước tối đa 10MB.`);
        } else {
            setUploadError(null);
        }

        handleLocationChange("images", validFiles);
    };

    return (
        <div className="border p-3 mb-3 rounded">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h6>
                    <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                    Địa điểm {index + 1}
                </h6>
                {canDelete && (
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                            setNewTour((prev) => ({
                                ...prev,
                                locations: prev.locations.filter((_, i) => i !== index),
                            }));
                        }}
                    >
                        <i className="fas fa-trash"></i> Xóa
                    </Button>
                )}
            </div>
            
            <div className="row g-3">
                {/* Location Name */}
                <div className="col-md-6">
                    <Form.Group>
                        <Form.Label>Tên địa điểm *</Form.Label>
                        <div className="position-relative">
                            <Form.Control
                                type="text"
                                placeholder="Nhập địa điểm..."
                                value={location.name}
                                onChange={(e) => {
                                    handleLocationChange("name", e.target.value);
                                    fetchLocationSuggestions(e.target.value, "location", index);
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

                {/* Location Images */}
                <div className="col-md-6">
                    <Form.Group>
                        <Form.Label>
                            Hình ảnh địa điểm {!isEditMode && "*"} (JPG, PNG, GIF, WebP, max 10MB)
                        </Form.Label>
                        
                        {/* Show existing image in edit mode */}
                        {isEditMode && location.existingImage && (
                            <div className="mb-2">
                                <div className="d-flex align-items-center">
                                    <img 
                                        src={location.existingImage} 
                                        alt="Ảnh hiện tại"
                                        style={{ 
                                            width: '80px', 
                                            height: '50px', 
                                            objectFit: 'cover',
                                            borderRadius: '4px',
                                            border: '1px solid #dee2e6'
                                        }}
                                    />
                                    <div className="ms-2">
                                        <small className="text-muted d-block">Ảnh hiện tại</small>
                                        <small className="text-info">Chọn file mới để thay đổi</small>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Form.Control
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            multiple
                            onChange={handleLocationImagesChange}
                            isInvalid={!!formErrors[`locationImages${index}`]}
                        />
                        
                        <Form.Control.Feedback type="invalid">
                            {formErrors[`locationImages${index}`]}
                        </Form.Control.Feedback>
                        
                        {uploadError && (
                            <div className="text-danger small mt-2">
                                <i className="fas fa-exclamation-triangle me-1"></i>
                                {uploadError}
                            </div>
                        )}

                        {/* Show selected files info */}
                        {location.images && location.images.length > 0 && (
                            <div className="mt-2">
                                <small className="text-success d-block">
                                    <i className="fas fa-check-circle me-1"></i>
                                    Đã chọn {location.images.length} file:
                                </small>
                                <div className="small text-muted">
                                    {Array.from(location.images).map((file, fileIndex) => (
                                        <div key={fileIndex}>
                                            • {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Form.Group>
                </div>

                {/* Location Description */}
                <div className="col-12">
                    <Form.Group>
                        <Form.Label>Mô tả địa điểm</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Nhập mô tả chi tiết về địa điểm..."
                            value={location.description}
                            onChange={(e) => handleLocationChange("description", e.target.value)}
                        />
                    </Form.Group>
                </div>

                {/* Calendar Dates - Thêm datetime fields cho location */}
                <div className="col-md-6">
                    <Form.Group>
                        <Form.Label>Thời gian bắt đầu tại địa điểm</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={location.calendarStart || ""}
                            onChange={(e) => handleLocationChange("calendarStart", e.target.value)}
                        />
                        <Form.Text className="text-muted">
                            Thời gian bắt đầu hoạt động tại địa điểm này
                        </Form.Text>
                    </Form.Group>
                </div>

                <div className="col-md-6">
                    <Form.Group>
                        <Form.Label>Thời gian kết thúc tại địa điểm</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={location.calendarEnd || ""}
                            onChange={(e) => handleLocationChange("calendarEnd", e.target.value)}
                        />
                        <Form.Text className="text-muted">
                            Thời gian kết thúc hoạt động tại địa điểm này
                        </Form.Text>
                    </Form.Group>
                </div>

                {/* Coordinates */}
                <div className="col-md-6">
                    <Form.Group>
                        <Form.Label>Kinh độ (Longitude) *</Form.Label>
                        <Form.Control
                            type="number"
                            step="any"
                            placeholder="Tọa độ kinh độ (tự động điền khi chọn gợi ý)"
                            value={location.longitude}
                            onChange={(e) => handleLocationChange("longitude", e.target.value)}
                            isInvalid={!!formErrors[`locationCoords${index}`]}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formErrors[`locationCoords${index}`]}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                            Sẽ tự động điền khi chọn từ gợi ý địa điểm
                        </Form.Text>
                    </Form.Group>
                </div>

                <div className="col-md-6">
                    <Form.Group>
                        <Form.Label>Vĩ độ (Latitude) *</Form.Label>
                        <Form.Control
                            type="number"
                            step="any"
                            placeholder="Tọa độ vĩ độ (tự động điền khi chọn gợi ý)"
                            value={location.latitude}
                            onChange={(e) => handleLocationChange("latitude", e.target.value)}
                            isInvalid={!!formErrors[`locationCoords${index}`]}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formErrors[`locationCoords${index}`]}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                            Sẽ tự động điền khi chọn từ gợi ý địa điểm
                        </Form.Text>
                    </Form.Group>
                </div>
            </div>
        </div>
    );
};

export default LocationInput;