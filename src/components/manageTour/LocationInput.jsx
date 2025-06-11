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
}) => {
    return (
        <div className="border p-3 mb-3 rounded">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h6>Địa điểm {index + 1}</h6>
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
                                    setNewTour((prev) => ({ ...prev, locations: newLocations }));
                                    fetchLocationSuggestions(e.target.value, "location", index);
                                }}
                                isInvalid={!!formErrors[`locationName${index} `]}
                            />
                            {suggestionsLoading && suggestionType === "location" && suggestionIndex === index && (
                                <Spinner
                                    animation="border"
                                    size="sm"
                                    className="position-absolute top-50 end-0 translate-middle-y me-2"
                                />
                            )}
                            <Form.Control.Feedback type="invalid">
                                {formErrors[`locationName${index} `]}
                            </Form.Control.Feedback>
                        </div>
                    </Form.Group>
                </div>
                <div className="col-md-6">
                    <Form.Group>
                        <Form.Label>Hình ảnh địa điểm * (JPG, PNG, GIF, max 5MB)</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/jpeg,image/png,image/gif"
                            multiple
                            onChange={(e) => {
                                const files = Array.from(e.target.files);
                                const validFiles = files.filter((file) => {
                                    const isValidType = ["image/jpeg", "image/png", "image/gif"].includes(file.type);
                                    const isValidSize = file.size <= 5 * 1024 * 1024;
                                    return isValidType && isValidSize;
                                });
                                const invalidFiles = files.filter((file) => !validFiles.includes(file));
                                if (invalidFiles.length > 0) {
                                    setUploadError(
                                        `Các file không hợp lệ: ${invalidFiles.map((f) => f.name).join(", ")} `
                                    );
                                } else {
                                    setUploadError(null);
                                }
                                const newLocations = [...newTour.locations];
                                newLocations[index].images = validFiles;
                                setNewTour((prev) => ({ ...prev, locations: newLocations }));
                            }}
                            isInvalid={!!formErrors[`locationImages${index} `]}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formErrors[`locationImages${index} `]}
                        </Form.Control.Feedback>
                        {uploadError && (
                            <div className="text-danger small mt-2">{uploadError}</div>
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
                                newLocations[index].description = e.target.value;
                                setNewTour((prev) => ({ ...prev, locations: newLocations }));
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
                            isInvalid={!!formErrors[`locationCoords${index} `]}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formErrors[`locationCoords${index} `]}
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
                            isInvalid={!!formErrors[`locationCoords${index} `]}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formErrors[`locationCoords${index} `]}
                        </Form.Control.Feedback>
                    </Form.Group>
                </div>
            </div>
        </div>
    );
};

export default LocationInput;
