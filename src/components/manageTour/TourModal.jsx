import React from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import LocationInput from "./LocationInput";

const TourModal = ({
  show,
  onHide,
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
  handleAddTour,
  handleUpdateTour,
  loading,
  isEditMode = false,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header
        closeButton
        className="text-white"
        style={{ background: "linear-gradient(135deg, #007bff, #0056b3)" }}
      >
        <Modal.Title>
          <i className={`fas ${isEditMode ? "fa-edit" : "fa-plus"} me-2`}></i>
          {isEditMode ? "Chỉnh sửa tour" : "Thêm tour mới"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="row g-3">
            {/* Basic Tour Information */}
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

            {/* Tour Details */}
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

            {/* Date Fields - Updated to use datetime-local */}
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Ngày giờ bắt đầu *</Form.Label>
                <Form.Control
                  type="datetime-local"
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
                <Form.Label>Ngày giờ kết thúc *</Form.Label>
                <Form.Control
                  type="datetime-local"
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
            </div>

            {/* Image Upload Section */}
            <div className="col-12">
              <Form.Group>
                <Form.Label>Ảnh đại diện tour</Form.Label>

                {/* Show existing image in edit mode */}
                {isEditMode && newTour.existingImage && (
                  <div className="mb-3">
                    <div className="d-flex align-items-center">
                      <img
                        src={newTour.existingImage}
                        alt="Ảnh hiện tại"
                        style={{
                          width: "100px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                      <div className="ms-3">
                        <small className="text-muted">Ảnh hiện tại</small>
                        <div>
                          <small className="text-info">
                            Chọn file mới để thay đổi ảnh đại diện
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
                    Đã chọn: {imageFile.name} (
                    {(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </Form.Group>
            </div>

            {/* Locations Section */}
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
                  isEditMode={isEditMode}
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
                        existingImage: "",
                        latitude: "",
                        longitude: "",
                        calendarStart: "",
                        calendarEnd: "",
                      },
                    ],
                  }));
                }}
              >
                <i className="fas fa-plus"></i> Thêm địa điểm
              </Button>
            </div>

            {/* Location Suggestions */}
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
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={isEditMode ? handleUpdateTour : handleAddTour}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              {isEditMode ? "Đang cập nhật..." : "Đang thêm..."}
            </>
          ) : (
            <>
              <i
                className={`fas ${isEditMode ? "fa-save" : "fa-plus"} me-1`}
              ></i>
              {isEditMode ? "Cập nhật tour" : "Thêm tour"}
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default TourModal;
