import React from 'react';
import './Dashboard.css'
export default function TourguideDashboard() {
  const statsCards = [
    {
      title: 'Tổng số tour',
      value: '248',
      icon: 'bi-briefcase-fill',
      color: 'primary'
    },
    {
      title: 'Chờ duyệt',
      value: '12',
      icon: 'bi-clock-fill',
      color: 'warning'
    },
    {
      title: 'Khách hàng này',
      value: '1,842',
      icon: 'bi-people-fill',
      color: 'success'
    },
    {
      title: 'Đánh giá',
      value: '4.8',
      icon: 'bi-star-fill',
      color: 'info'
    }
  ];

  const upcomingTours = [
    {
      id: 1,
      name: 'Tour Sapa 3 ngày 2 đêm',
      date: '20/03/2025 - 22/03/2025',
      participants: '12 khách',
      status: 'confirmed',
      icon: 'bi-mountain',
      color: 'primary'
    },
    {
      id: 2,
      name: 'Tour Phú Quốc 4 ngày 3 đêm',
      date: '25/03/2025 - 28/03/2025',
      participants: '8 khách',
      status: 'confirmed',
      icon: 'bi-sunset-fill',
      color: 'warning'
    },
    {
      id: 3,
      name: 'Tour Hội An 2 ngày 1 đêm',
      date: '30/03/2025 - 31/03/2025',
      participants: '15 khách',
      status: 'confirmed',
      icon: 'bi-building',
      color: 'info'
    }
  ];

  const notifications = [
    {
      id: 1,
      title: 'Tin nhắn mới từ Nguyễn Văn A',
      time: '2 phút trước',
      type: 'message',
      icon: 'bi-chat-dots-fill',
      color: 'primary'
    },
    {
      id: 2,
      title: 'Tour Sapa đã được xác nhận',
      time: '1 giờ trước',
      type: 'success',
      icon: 'bi-check-circle-fill',
      color: 'success'
    },
    {
      id: 3,
      title: 'Đánh giá mới từ Tour Hạ Long',
      time: '3 giờ trước',
      type: 'review',
      icon: 'bi-star-fill',
      color: 'warning'
    }
  ];

  return (
    <div className="container-fluid px-0">
      {/* Header */}
      <div className="mb-5">
        <div className="d-flex align-items-center mb-3">
          <h4 className="display-8 fw-bold text-dark mb-0 me-3">
            Chào mừng bạn đến trang hướng dẫn viên!
          </h4>
          <span className="fs-2">👋</span>
        </div>
        <p className="text-muted mb-0">
          Hôm nay là {new Date().toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {statsCards.map((card, index) => (
          <div key={index} className="col-xl-3 col-lg-4 col-md-6">
            <div className={`card border-0 shadow-sm h-100 card-hover`}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <p className="text-muted small fw-medium mb-1">{card.title}</p>
                    <h3 className={`fw-bold mb-0 text-${card.color}`}>{card.value}</h3>
                  </div>
                  <div className={`bg-${card.color} bg-opacity-10 rounded-3 p-3`}>
                    <i className={`bi ${card.icon} fs-3 text-${card.color}`}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Upcoming Tours */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-4 pb-0">
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="fw-bold mb-0">Tour sắp tới</h4>
                <button className="btn btn-link text-primary fw-medium p-0">
                  Xem tất cả
                </button>
              </div>
            </div>
            <div className="card-body pt-3">
              <div className="row g-3">
                {upcomingTours.map((tour) => (
                  <div key={tour.id} className="col-12">
                    <div className="bg-light rounded-3 p-3 tour-item-hover">
                      <div className="d-flex align-items-center">
                        <div className={`bg-${tour.color} bg-opacity-10 rounded-3 p-2 me-3`}>
                          <i className={`bi ${tour.icon} fs-4 text-${tour.color}`}></i>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="fw-semibold mb-1">{tour.name}</h6>
                          <small className="text-muted">{tour.date}</small>
                        </div>
                        <div className="text-end">
                          <span className="badge bg-success rounded-pill">
                            {tour.participants}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-4">
                <button className="btn btn-outline-secondary rounded-pill px-4">
                  Xem lịch sắp hạng
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-4 pb-0">
              <h4 className="fw-bold mb-0">Thông báo</h4>
            </div>
            <div className="card-body pt-3">
              <div className="d-flex flex-column gap-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className="d-flex align-items-start notification-hover p-2 rounded-2">
                    <div className={`bg-${notification.color} bg-opacity-10 rounded-2 p-2 me-3`}>
                      <i className={`bi ${notification.icon} text-${notification.color}`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <p className="small fw-medium mb-1 lh-sm">
                        {notification.title}
                      </p>
                      <small className="text-muted">{notification.time}</small>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-4">
                <button className="btn btn-link text-primary fw-medium p-0">
                  Xem tất cả thông báo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 pt-4 pb-0">
              <h4 className="fw-bold mb-0">Thao tác nhanh</h4>
            </div>
            <div className="card-body pt-3">
              <div className="row g-3">
                <div className="col-lg-3 col-md-6">
                  <button className="btn btn-light w-100 p-4 text-center quick-action-hover">
                    <div className="bg-primary bg-opacity-10 rounded-3 p-3 mx-auto mb-3" style={{ width: 'fit-content' }}>
                      <i className="bi bi-plus-circle-fill fs-3 text-primary"></i>
                    </div>
                    <span className="fw-medium">Tạo tour mới</span>
                  </button>
                </div>
                <div className="col-lg-3 col-md-6">
                  <button className="btn btn-light w-100 p-4 text-center quick-action-hover">
                    <div className="bg-success bg-opacity-10 rounded-3 p-3 mx-auto mb-3" style={{ width: 'fit-content' }}>
                      <i className="bi bi-chat-heart-fill fs-3 text-success"></i>
                    </div>
                    <span className="fw-medium">Chat khách hàng</span>
                  </button>
                </div>
                <div className="col-lg-3 col-md-6">
                  <button className="btn btn-light w-100 p-4 text-center quick-action-hover">
                    <div className="bg-warning bg-opacity-10 rounded-3 p-3 mx-auto mb-3" style={{ width: 'fit-content' }}>
                      <i className="bi bi-bar-chart-fill fs-3 text-warning"></i>
                    </div>
                    <span className="fw-medium">Xem báo cáo</span>
                  </button>
                </div>
                <div className="col-lg-3 col-md-6">
                  <button className="btn btn-light w-100 p-4 text-center quick-action-hover">
                    <div className="bg-info bg-opacity-10 rounded-3 p-3 mx-auto mb-3" style={{ width: 'fit-content' }}>
                      <i className="bi bi-gear-fill fs-3 text-info"></i>
                    </div>
                    <span className="fw-medium">Cài đặt</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}