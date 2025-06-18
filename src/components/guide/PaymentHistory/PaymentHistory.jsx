import React, { useState, useEffect } from 'react';
import './PaymentHistory.css';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMyWithdrawRequests } from '../../../api/withdrawAPI';

const PaymentHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchMyRequests();
  }, [pageIndex]);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const response = await getMyWithdrawRequests(pageIndex, pageSize);
      
      if (response.data) {
        setRequests(response.data.items || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalItems(response.data.totalItems || 0);
      }
    } catch (error) {
      toast.error(error.message || 'Không thể tải danh sách yêu cầu rút tiền');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Pending': 'status-pending',
      'Approved': 'status-approved',
      'Rejected': 'status-rejected',
      'Processing': 'status-processing'
    };
    return statusClasses[status] || 'status-default';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      'Pending': 'Chờ duyệt',
      'Approved': 'Đã duyệt',
      'Rejected': 'Đã từ chối',
      'Processing': 'Đang xử lý'
    };
    return statusTexts[status] || status;
  };

  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return '';
    const length = accountNumber.length;
    if (length <= 4) return accountNumber;
    const visibleDigits = 4;
    const masked = '*'.repeat(length - visibleDigits);
    return masked + accountNumber.slice(-visibleDigits);
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status.toLowerCase() === filter.toLowerCase();
  });

  if (loading) {
    return (
      <div className="payment-history-container">
        <div className="loading-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-history-container">
      {/* Header */}
      <div className="history-header">
        <div>
          <h1>Lịch sử rút tiền</h1>
          <p>Theo dõi các yêu cầu rút tiền của bạn</p>
        </div>
        <div className="header-actions">
          <button className="btn-refresh" onClick={fetchMyRequests}>
            <i className="bi bi-arrow-clockwise"></i>
            Làm mới
          </button>
          <Link to="/guide/withdraw" className="new-request-btn">
            <i className="bi bi-plus-circle"></i>
            Tạo yêu cầu mới
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Tất cả ({requests.length})
        </button>
        <button
          className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Chờ duyệt ({requests.filter(r => r.status === 'Pending').length})
        </button>
        <button
          className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Đã duyệt ({requests.filter(r => r.status === 'Approved').length})
        </button>
        <button
          className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Từ chối ({requests.filter(r => r.status === 'Rejected').length})
        </button>
      </div>

      {/* Request List */}
      <div className="request-list">
        {filteredRequests.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-inbox"></i>
            <p>Không có yêu cầu nào</p>
          </div>
        ) : (
          filteredRequests.map(request => (
            <div key={request.id} className="request-card">
              <div className="card-header">
                <div className="request-info">
                  <span className="request-id">#{request.id}</span>
                  <span className={`status-badge ${getStatusBadge(request.status)}`}>
                    {getStatusText(request.status)}
                  </span>
                </div>
                <div className="request-amount">
                  {formatCurrency(request.netAmount)}
                </div>
              </div>

              <div className="card-body">
                <div className="detail-row">
                  <span className="detail-label">Ngân hàng:</span>
                  <span className="detail-value">
                    {request.bankName} - {maskAccountNumber(request.bankAccountNumber)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Tên TK:</span>
                  <span className="detail-value">{request.bankAccountName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Ngày yêu cầu:</span>
                  <span className="detail-value">{formatDate(request.requestDate)}</span>
                </div>
                                {request.processedDate && (
                  <div className="detail-row">
                    <span className="detail-label">Ngày xử lý:</span>
                    <span className="detail-value">{formatDate(request.processedDate)}</span>
                  </div>
                )}
                {request.adminNote && (
                  <div className="admin-note">
                    <i className="bi bi-chat-left-text"></i>
                    <span>Ghi chú: {request.adminNote}</span>
                  </div>
                )}
                {request.rejectReason && (
                  <div className="reject-reason">
                    <i className="bi bi-exclamation-circle"></i>
                    <span>{request.rejectReason}</span>
                  </div>
                )}
              </div>

              <div className="card-footer">
                <div className="fee-info">
                  <span>Số tiền yêu cầu: {formatCurrency(request.requestAmount)}</span>
                  <span className="fee">Phí: {formatCurrency(request.commissionAmount)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="btn-page"
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={pageIndex === 1}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <span className="page-info">
            Trang {pageIndex} / {totalPages}
          </span>
          <button
            className="btn-page"
            onClick={() => setPageIndex(pageIndex + 1)}
            disabled={pageIndex === totalPages}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory; 