import React from "react";
import { Button, Table } from "react-bootstrap";

const TourTable = ({
    tours,
    currentPage,
    toursPerPage,
    setCurrentPage,
    handleViewTour,
    handleEditTour,
    handleDeleteTour,
}) => {
    const formatPrice = (pricePerPerson) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(pricePerPerson);

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { class: "bg-success", label: "Hoạt động" },
            pending: { class: "bg-warning", label: "Chờ duyệt" },
            inactive: { class: "bg-secondary", label: "Tạm dừng" },
        };
        const config = statusConfig[status] || statusConfig.inactive;
        return <span className={`badge ${config.class}`}>{config.label}</span>;
    };

    const indexOfLastTour = currentPage * toursPerPage;
    const indexOfFirstTour = indexOfLastTour - toursPerPage;
    const currentTours = tours.slice(indexOfFirstTour, indexOfLastTour);
    const totalPages = Math.ceil(tours.length / toursPerPage);

    const getPageNumbers = () => {
        const maxPagesToShow = 5;
        const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    return (
        <>
            <div className="card shadow-sm" style={{ borderRadius: "0.75rem" }}>
                <div className="table-responsive">
                    <Table hover className="mb-0">
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
                                            Địa điểm: {tour.tourLocations?.map((loc) => loc.location?.name).join(", ") || "N/A"}
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
                                        <div className="fw-semibold text-success">{formatPrice(tour.pricePerPerson)}</div>
                                    </td>
                                    <td className="py-3">{getStatusBadge(tour.status)}</td>
                                    <td className="py-3 text-end">
                                        <div className="btn-group" role="group">
                                            <Button variant="outline-primary" size="sm" onClick={() => handleViewTour(tour.id)}>
                                                <i className="fas fa-eye"></i>
                                            </Button>
                                            <Button variant="outline-success" size="sm" onClick={() => handleEditTour(tour.id)}>
                                                <i className="fas fa-edit"></i>
                                            </Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteTour(tour.id)}>
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>

            <div className="card shadow-sm mt-4" style={{ borderRadius: "0.75rem" }}>
                <div className="card-body d-flex justify-content-between align-items-center">
                    <div className="text-muted">
                        Hiển thị <span className="fw-bold">{indexOfFirstTour + 1}</span> đến{" "}
                        <span className="fw-bold">{Math.min(indexOfLastTour, tours.length)}</span> của{" "}
                        <span className="fw-bold">{tours.length}</span> kết quả
                    </div>
                    <nav>
                        <ul className="pagination mb-0">
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <Button
                                    variant="link"
                                    className="page-link"
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                >
                                    Trước
                                </Button>
                            </li>
                            {getPageNumbers().map((page) => (
                                <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                                    <Button variant="link" className="page-link" onClick={() => setCurrentPage(page)}>
                                        {page}
                                    </Button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <Button
                                    variant="link"
                                    className="page-link"
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                >
                                    Sau
                                </Button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default TourTable;
