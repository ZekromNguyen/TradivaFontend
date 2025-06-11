import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Spinner, Alert, Card, Button, Row, Col, ListGroup, Image, Carousel } from "react-bootstrap";
import { getTourDetail } from "../../../api/tourAPI";
import './TourDetailManage.css';

export default function TourDetailManage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch tour details using API function
    useEffect(() => {
        const fetchTourDetails = async () => {
            try {
                setLoading(true);
                const tourData = await getTourDetail(id);
                setTour(tourData);
                setLoading(false);
            } catch (e) {
                setError(e.message || "Không thể tải chi tiết tour");
                setLoading(false);
            }
        };
        fetchTourDetails();
    }, [id]);

    // Handle back navigation
    const handleBack = () => {
        navigate("/guide/tours");
    };

    // Format date for display
    const formatDate = (dateString) => {
        return dateString
            ? new Date(dateString).toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
            : "N/A";
    };

    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <span className="ms-2 fs-5">Đang tải...</span>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger" className="shadow-sm">
                    {error}
                </Alert>
                <Button variant="outline-secondary" onClick={handleBack} className="mt-3">
                    <i className="fas fa-arrow-left me-2"></i>Quay lại
                </Button>
            </Container>
        );
    }

    if (!tour) {
        return (
            <Container className="py-5">
                <Alert variant="warning" className="shadow-sm">
                    Không tìm thấy tour.
                </Alert>
                <Button variant="outline-secondary" onClick={handleBack} className="mt-3">
                    <i className="fas fa-arrow-left me-2"></i>Quay lại
                </Button>
            </Container>
        );
    }

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
            <Container fluid className="tour-detail-container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="tour-title">Chi tiết Tour: {tour.title}</h2>
                    <Button variant="outline-primary" className="back-button" onClick={handleBack}>
                        <i className="fas fa-arrow-left me-2"></i>Quay lại
                    </Button>
                </div>

                <Card className="tour-card mb-4">
                    <Card.Body>
                        <h4 className="section-header">Thông tin cơ bản</h4>
                        <Row>
                            <Col md={6}>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <strong>Tên Tour:</strong> {tour.title}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Ngày Bắt Đầu:</strong> {formatDate(tour.dateStart)}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Ngày Kết Thúc:</strong> {formatDate(tour.dateEnd)}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Số Khách Tối Đa:</strong> {tour.numberOfGuests || "N/A"}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                            <Col md={6}>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <strong>Giá Mỗi Người:</strong> {tour.pricePerPerson?.toLocaleString("vi-VN")} VND
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Mô Tả:</strong> {tour.description || "N/A"}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Trạng Thái:</strong> {tour.status || "Chưa xác định"}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <Card className="tour-card mb-4">
                    <Card.Body>
                        <h4 className="section-header">Hình ảnh</h4>
                        {tour.files?.length > 0 ? (
                            <Carousel indicators={tour.files.length > 1} controls={tour.files.length > 1}>
                                {tour.files.map((file) => (
                                    <Carousel.Item key={file.id}>
                                        <Image
                                            src={file.filePath}
                                            alt={file.fileName}
                                            className="carousel-img d-block w-100"
                                            fluid
                                        />
                                        <Carousel.Caption>
                                            <h5 className="bg-dark bg-opacity-50 p-2 rounded">{file.fileName}</h5>
                                        </Carousel.Caption>
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        ) : (
                            <p className="text-muted">Không có hình ảnh nào.</p>
                        )}
                    </Card.Body>
                </Card>

                <Card className="tour-card mb-4">
                    <Card.Body>
                        <h4 className="section-header">Địa điểm</h4>
                        {tour.tourLocations?.length > 0 ? (
                            <Row>
                                {tour.tourLocations.map((tl) => (
                                    <Col md={6} key={tl.id} className="mb-3">
                                        <ListGroup.Item>
                                            <strong>{tl.location.name}</strong> ({tl.location.city || "N/A"})<br />
                                            <span>
                                                <strong>Mô tả:</strong> {tl.location.description || "N/A"}
                                            </span>
                                            <br />
                                            <span>
                                                <strong>Tọa độ:</strong> ({tl.location.latitude}, {tl.location.longitude})
                                            </span>
                                            <br />
                                            <span>
                                                <strong>Thời gian:</strong> {formatDate(tl.location.dateStart)} -{" "}
                                                {formatDate(tl.location.dateEnd)}
                                            </span>
                                        </ListGroup.Item>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <p className="text-muted">Không có địa điểm nào được liên kết.</p>
                        )}
                    </Card.Body>
                </Card>

                <Card className="tour-card">
                    <Card.Body>
                        <h4 className="section-header">Đánh giá</h4>
                        {tour.ratings?.length > 0 ? (
                            <ListGroup variant="flush">
                                {tour.ratings.map((rating) => (
                                    <ListGroup.Item key={rating.id}>
                                        <div className="d-flex align-items-center">
                                            <span className="star-rating me-2">
                                                {[...Array(rating.ratingStar)].map((_, i) => (
                                                    <i key={i} className="fas fa-star"></i>
                                                ))}
                                            </span>
                                            <span>{rating.comment || "Không có bình luận"}</span>
                                        </div>
                                        <small className="text-muted">
                                            Đánh giá vào: {formatDate(rating.createdAt)}
                                        </small>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        ) : (
                            <p className="text-muted">Không có đánh giá nào.</p>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}