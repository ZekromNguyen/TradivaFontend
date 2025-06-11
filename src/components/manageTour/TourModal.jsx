import React from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import LocationInput from "./LocationInput";

const TourModal = ({
    show,
    onHide,
    title,
    newTour,
    setNewTour,
    formErrors,
    uploadError,
    setUploadError,
    handleFileChange,
    imageFile,
    fetchLocationSuggestions,
    locationSuggestions,
    suggestionsLoading,
    suggestionType,
    suggestionIndex,
    handleSelectSuggestion,
    handleSubmit,
    loading,
    submitButtonText,
    editingTour,
}) => {
    return (
        <Modal show={show} onHide={onHide} size="lg" aria-labelledby="tour-modal-title">
            <Modal.Header
                closeButton
                className="text-white"
                style={{ background: "linear-gradient(135deg, #007bff, #0056b3)" }}
            >
                <Modal.Title id="tour-modal-title">
                    <i className={editingTour ? "fas fa-edit me-2" : "fas fa-plus me-2"} aria-hidden="true"></i>
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {Object.keys(formErrors).length > 0 && (
                    <Alert variant="danger">
                        <strong>Vui lòng kiểm tra lại:</strong>
                        <ul>
                            {Object.entries(formErrors).map(([key, value]) => (
                                <li key={key}>{value}</li>
                            ))}
                        </ul>
                    </Alert>
                )}
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
                                        setNewTour((prev) => ({ ...prev, title: e.target.value }))
                                    }
                                    isInvalid={!!formErrors.title}
                                    aria-describedby="title-error"
                                />
                                <Form.Control.Feedback id="title-error" type="invalid">{formErrors.title}</Form.Control.Feedback>
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
                                            setNewTour((prev) => ({ ...prev, locationCity: e.target.value }));
                                            fetchLocationSuggestions(e.target.value, "city");
                                        }}
                                        isInvalid={!!formErrors.locationCity}
                                        aria-describedby="locationCity-error"
                                    />
                                    {suggestionsLoading && suggestionType === "city" && (
                                        <Spinner
                                            animation="border"
                                            size="sm"
                                            className="position-absolute top-50 end-0 translate-middle-y me-2"
                                            aria-label="Đang tải gợi ý thành phố"
                                        />
                                    )}
                                    <Form.Control.Feedback id="locationCity-error" type="invalid">{formErrors.locationCity}</Form.Control.Feedback>
                                </div>
                            </Form.Group>
                        </div>
                        <div className="col-md-4">
                            <Form.Group>
                                <Form.Label>Thời gian</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="VD: 1 ngày"
                                    value={newTour.duration}
                                    onChange={(e) =>
                                        setNewTour((prev) => ({ ...prev, duration: e.target.value }))
                                    }
                                    isInvalid={!!formErrors.duration}
                                    aria-describedby="duration-error"
                                />
                                <Form.Control.Feedback id="duration-error" type="invalid">{formErrors.duration}</Form.Control.Feedback>
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
                                        setNewTour((prev) => ({ ...prev, pricePerPerson: e.target.value }))
                                    }
                                    isInvalid={!!formErrors.pricePerPerson}
                                    aria-describedby="pricePerPerson-error"
                                />
                                <Form.Control.Feedback id="pricePerPerson-error" type="invalid">{formErrors.pricePerPerson}</Form.Control.Feedback>
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
                                        setNewTour((prev) => ({ ...prev, numberOfPeople: e.target.value }))
                                    }
                                    isInvalid={!!formErrors.numberOfGuest}
                                    aria-describedby="numberOfGuest-error"
                                />
                                <Form.Control.Feedback id="numberOfGuest-error" type="invalid">{formErrors.numberOfGuest}</Form.Control.Feedback>
                            </Form.Group>
                        </div>
                        <div className="col-12">
                            <Form.Group>
                                <Form.Label>Loại hình tour *</Form.Label>
                                <Form.Select
                                    value={newTour.type}
                                    onChange={(e) =>
                                        setNewTour((prev) => ({ ...prev, type: e.target.value }))
                                    }
                                    isInvalid={!!formErrors.type}
                                    aria-describedby="type-error"
                                >
                                    <option value="">Chọn loại hình</option>
                                    <option value="Văn hóa">Văn hóa</option>
                                    <option value="Thiên nhiên">Thiên nhiên</option>
                                    <option value="Phiêu lưu">Phiêu lưu</option>
                                    <option value="Ẩm thực">Ẩm thực</option>
                                </Form.Select>
                                <Form.Control.Feedback id="type-error" type="invalid">{formErrors.type}</Form.Control.Feedback>
                            </Form.Group>
                        </div>
                        <div className="col-12">
                            <Form.Group>
                                <Form.Label>Mô tả tour</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Nhập mô tả chi tiết về tour..."
                                    value={newTour.description}
                                    onChange={(e) =>
                                        setNewTour((prev) => ({ ...prev, description: e.target.value }))
                                    }
                                    isInvalid={!!formErrors.description}
                                    aria-describedby="description-error"
                                />
                                <Form.Control.Feedback id="description-error" type="invalid">{formErrors.description}</Form.Control.Feedback>
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group>
                                <Form.Label>Ngày bắt đầu *</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={newTour.dateStart}
                                    onChange={(e) =>
                                        setNewTour((prev) => ({ ...prev, dateStart: e.target.value }))
                                    }
                                    isInvalid={!!formErrors.dateStart}
                                    aria-describedby="dateStart-error"
                                />
                                <Form.Control.Feedback id="dateStart-error" type="invalid">{formErrors.dateStart}</Form.Control.Feedback>
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group>
                                <Form.Label>Ngày kết thúc *</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={newTour.dateEnd}
                                    onChange={(e) =>
                                        setNewTour((prev) => ({ ...prev, dateEnd: e.target.value }))
                                    }
                                    isInvalid={!!formErrors.dateEnd}
                                    aria-describedby="dateEnd-error"
                                />
                                <Form.Control.Feedback id="dateEnd-error" type="invalid">{formErrors.dateEnd}</Form.Control.Feedback>
                            </Form.Group>
                        </div>
                        <div className="col-12">
                            <Form.Group>
                                <Form.Label>Ảnh đại diện tour {editingTour ? "(Tùy chọn)" : "*"}</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="mb-2"
                                    aria-describedby="file-error"
                                />
                                {uploadError && (
                                    <div className="text-danger small mb-2">
                                        <i className="fas fa-exclamation-triangle me-1" aria-hidden="true"></i>
                                        {uploadError}
                                    </div>
                                )}
                                {imageFile && !uploadError && (
                                    <div className="text-success small">
                                        <i className="fas fa-check-circle me-1" aria-hidden="true"></i>
                                        Đã chọn: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                                    </div>
                                )}
                                {editingTour && newTour.file === null && (
                                    <div className="text-info small">
                                        <i className="fas fa-info-circle me-1" aria-hidden="true"></i>
                                        Giữ ảnh hiện tại nếu không chọn ảnh mới
                                    </div>
                                )}
                            </Form.Group>
                        </div>
                        <div className="col-12">
                            <h5 className="mt-3">Địa điểm *</h5>
                            {newTour.locations.map((location, index) => (
                                <LocationInput
                                    key={index}
                                    index={index}
                                    location={location}
                                    newTour={newTour}
                                    setNewTour={setNewTour}
                                    formErrors={formErrors}
                                    uploadError={uploadError}
                                    setUploadError={setUploadError}
                                    fetchLocationSuggestions={fetchLocationSuggestions}
                                    locationSuggestions={locationSuggestions}
                                    suggestionsLoading={suggestionsLoading}
                                    suggestionType={suggestionType}
                                    suggestionIndex={suggestionIndex}
                                    handleSelectSuggestion={handleSelectSuggestion}
                                    canDelete={newTour.locations.length > 1}
                                />
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
                                aria-label="Thêm địa điểm mới"
                            >
                                <i className="fas fa-plus" aria-hidden="true"></i> Thêm địa điểm
                            </Button>
                        </div>
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
                                                    aria-label={`Chọn địa điểm ${suggestion.displayName}`}
                                                >
                                                    <i className="fas fa-map-marker-alt me-2 text-primary" aria-hidden="true"></i>
                                                    {suggestion.displayName}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={onHide}
                    disabled={loading}
                    aria-label="Hủy bỏ"
                >
                    Hủy
                </Button>
                <Button
                    variant="primary"
                    onClick={() => {
                        console.log("Submit button clicked, mode:", editingTour ? "edit" : "add", "newTour:", newTour);
                        handleSubmit();
                    }}
                    disabled={loading}
                    aria-label={submitButtonText}
                >
                    {loading ? <Spinner animation="border" size="sm" aria-label="Đang xử lý" /> : submitButtonText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TourModal;