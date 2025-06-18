import React, { useState, useEffect } from 'react';
import './WithdrawalRequests.css';
import { getWithdrawRequests, processWithdrawRequest } from '../../../api/withdrawAPI';
import { toast } from 'react-toastify';

const WithdrawalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchWithdrawRequests();
  }, [pageIndex]);

  const fetchWithdrawRequests = async () => {
    try {
      setLoading(true);
      const response = await getWithdrawRequests(pageIndex, pageSize);
      if (response.data) {
        setRequests(response.data.items || []);
        setTotalPages(response.data.totalPages || 1);
      }
          } catch (error) {
        if (error.message.includes('401')) {
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      } else {
        toast.error('Không thể tải danh sách yêu cầu rút tiền');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setShowApproveModal(true);
    setAdminNote('');
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
    setRejectReason('');
  };

  const confirmApprove = async () => {
    try {
      await processWithdrawRequest(selectedRequest.id, 'Approve', adminNote, '');
      toast.success('Đã duyệt yêu cầu rút tiền');
      setShowApproveModal(false);
      setAdminNote('');
      fetchWithdrawRequests();
    } catch (error) {
      toast.error(error.message || 'Không thể duyệt yêu cầu');
    }
  };

  const confirmReject = async () => {
    try {
      await processWithdrawRequest(selectedRequest.id, 'Reject', '', rejectReason);
      toast.success('Đã từ chối yêu cầu rút tiền');
      setShowRejectModal(false);
      setRejectReason('');
      fetchWithdrawRequests();
    } catch (error) {
      toast.error(error.message || 'Không thể từ chối yêu cầu');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Pending': 'badge-warning',
      'Approved': 'badge-success',
      'Rejected': 'badge-danger',
      'Processing': 'badge-info'
    };
    return statusClasses[status] || 'badge-secondary';
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

  if (loading) {
    return <div className="loading-container">Đang tải...</div>;
  }

  return (
    <div className="withdrawal-requests">
      <div className="page-header">
        <h2>Yêu cầu rút tiền</h2>
        <div className="header-actions">
          <button className="btn btn-refresh" onClick={fetchWithdrawRequests}>
            <i className="bi bi-arrow-clockwise"></i> Làm mới
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="withdrawal-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Người dùng</th>
              <th>Ngân hàng</th>
              <th>Số tài khoản</th>
              <th>Chủ tài khoản</th>
              <th>Số tiền yêu cầu</th>
              <th>Phí</th>
              <th>Số tiền nhận</th>
              <th>Trạng thái</th>
              <th>Ngày yêu cầu</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>#{request.id}</td>
                <td>{request.userName || 'N/A'}</td>
                <td>{request.bankName}</td>
                <td>{request.bankAccountNumber}</td>
                <td>{request.bankAccountName}</td>
                <td>{formatCurrency(request.requestAmount)}</td>
                <td>{formatCurrency(request.commissionAmount)}</td>
                <td className="net-amount">{formatCurrency(request.netAmount)}</td>
                <td>
                  <span className={`badge ${getStatusBadge(request.status)}`}>
                    {getStatusText(request.status)}
                  </span>
                </td>
                <td>{formatDate(request.requestDate)}</td>
                <td className="action-buttons">
                  {request.status === 'Pending' && (
                    <>
                      <button
                        className="btn btn-approve"
                        onClick={() => handleApprove(request)}
                        title="Duyệt"
                      >
                        <i className="bi bi-check-circle"></i>
                      </button>
                      <button
                        className="btn btn-reject"
                        onClick={() => handleReject(request)}
                        title="Từ chối"
                      >
                        <i className="bi bi-x-circle"></i>
                      </button>
                    </>
                  )}
                  {request.status !== 'Pending' && (
                    <span className="processed-info">
                      {request.processedDate && (
                        <small>Xử lý: {formatDate(request.processedDate)}</small>
                      )}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        <button
          className="btn btn-page"
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={pageIndex === 1}
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        <span className="page-info">
          Trang {pageIndex} / {totalPages}
        </span>
        <button
          className="btn btn-page"
          onClick={() => setPageIndex(pageIndex + 1)}
          disabled={pageIndex === totalPages}
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="modal-overlay" onClick={() => setShowApproveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Xác nhận duyệt yêu cầu</h3>
            <div className="modal-body">
              <p>Bạn đang duyệt yêu cầu rút tiền:</p>
              <div className="request-info">
                <p><strong>ID:</strong> #{selectedRequest.id}</p>
                <p><strong>Số tiền:</strong> {formatCurrency(selectedRequest.netAmount)}</p>
                <p><strong>Ngân hàng:</strong> {selectedRequest.bankName}</p>
                <p><strong>STK:</strong> {selectedRequest.bankAccountNumber}</p>
              </div>
              <div className="form-group">
                <label>Ghi chú (tùy chọn):</label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows="3"
                  placeholder="Nhập ghi chú..."
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={() => setShowApproveModal(false)}>
                Hủy
              </button>
              <button className="btn btn-confirm" onClick={confirmApprove}>
                Xác nhận duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Từ chối yêu cầu rút tiền</h3>
            <div className="modal-body">
              <p>Bạn đang từ chối yêu cầu rút tiền:</p>
              <div className="request-info">
                <p><strong>ID:</strong> #{selectedRequest.id}</p>
                <p><strong>Số tiền:</strong> {formatCurrency(selectedRequest.netAmount)}</p>
              </div>
              <div className="form-group">
                <label>Lý do từ chối <span className="required">*</span>:</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows="4"
                  placeholder="Nhập lý do từ chối..."
                  required
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={() => setShowRejectModal(false)}>
                Hủy
              </button>
              <button 
                className="btn btn-confirm btn-danger" 
                onClick={confirmReject}
                disabled={!rejectReason.trim()}
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalRequests; 