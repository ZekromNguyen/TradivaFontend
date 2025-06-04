import React from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';

const FilterSection = ({
    filters,
    setFilters,
    fetchLocationSuggestions,
    locationSuggestions,
    suggestionsLoading,
    suggestionType,
    handleSelectSuggestion,
}) => {
    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="card shadow-sm mb-4" style={{ borderRadius: '0.75rem' }}>
            <div className="card-body p-4">
                <div className="row g-3">
                    <div className="col-md-3">
                        <div className="position-relative">
                            <i
                                className="fas fa-search position-absolute"
                                style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }}
                            ></i>
                            <Form.Control
                                type="text"
                                placeholder="Tìm kiếm tour..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="ps-5"
                            />
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="position-relative">
                            <Form.Control
                                type="text"
                                placeholder="Tìm địa điểm..."
                                value={filters.location === 'all' ? '' : filters.location}
                                onChange={(e) => {
                                    handleFilterChange('location', e.target.value);
                                    fetchLocationSuggestions(e.target.value, 'filter');
                                }}
                            />
                            {suggestionsLoading && suggestionType === 'filter' && (
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
                            onChange={(e) => handleFilterChange('type', e.target.value)}
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
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="active">Hoạt động</option>
                            <option value="pending">Chờ duyệt</option>
                            <option value="inactive">Tạm dừng</option>
                        </Form.Select>
                    </div>
                    <div className="col-md-2">
                        <Button variant="outline-secondary" className="w-100">
                            <i className="fas fa-filter me-2"></i> Lọc
                        </Button>
                    </div>
                </div>
            </div>
            {locationSuggestions.length > 0 && suggestionType === 'filter' && !suggestionsLoading && (
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
            )}
        </div>
    );
};

export default FilterSection;