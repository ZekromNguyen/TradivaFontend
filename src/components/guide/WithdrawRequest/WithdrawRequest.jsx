import React, { useState, useEffect } from 'react';
import './WithdrawRequest.css';
import { createWithdrawRequest, getMyBankAccount } from '../../../api/withdrawAPI';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const WithdrawRequest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [balance, setBalance] = useState(0);
  const [accountInfo, setAccountInfo] = useState(null);
  const [formData, setFormData] = useState({
    requestAmount: '',
    bankName: '',
    bankAccountNumber: '',
    bankAccountName: ''
  });
  const [errors, setErrors] = useState({});

  // Popular banks in Vietnam
  const popularBanks = [
    { code: 'VCB', name: 'Vietcombank' },
    { code: 'TCB', name: 'Techcombank' },
    { code: 'MB', name: 'MB Bank' },
    { code: 'VIB', name: 'VIB' },
    { code: 'ACB', name: 'ACB' },
    { code: 'BIDV', name: 'BIDV' },
    { code: 'SHB', name: 'SHB' },
    { code: 'VPB', name: 'VPBank' },
    { code: 'TPB', name: 'TPBank' },
    { code: 'STB', name: 'Sacombank' }
  ];

  // Quick amount buttons
  const quickAmounts = [50000, 100000, 500000, 1000000];

  // Fetch bank account info on mount
  useEffect(() => {
    fetchBankAccount();
  }, []);

  const fetchBankAccount = async () => {
    try {
      setLoadingAccount(true);
      const response = await getMyBankAccount();
      
      if (response.data) {
        setAccountInfo(response.data);
        setBalance(response.data.balance);
      }
    } catch (error) {
      toast.error('Không thể tải thông tin ví');
    } finally {
      setLoadingAccount(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatInputCurrency = (value) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    // Format with thousand separators
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'requestAmount') {
      // Handle currency formatting
      const numericValue = value.replace(/\D/g, '');
      setFormData({
        ...formData,
        [name]: numericValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleQuickAmount = (amount) => {
    setFormData({
      ...formData,
      requestAmount: amount.toString()
    });
    if (errors.requestAmount) {
      setErrors({
        ...errors,
        requestAmount: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate amount
    const amount = parseInt(formData.requestAmount);
    if (!formData.requestAmount) {
      newErrors.requestAmount = 'Vui lòng nhập số tiền';
    } else if (amount > balance) {
      newErrors.requestAmount = 'Số tiền vượt quá số dư khả dụng';
    }

    // Validate bank name
    if (!formData.bankName) {
      newErrors.bankName = 'Vui lòng chọn ngân hàng';
    }

    // Validate account number
    if (!formData.bankAccountNumber) {
      newErrors.bankAccountNumber = 'Vui lòng nhập số tài khoản';
    } else if (!/^\d{8,20}$/.test(formData.bankAccountNumber)) {
      newErrors.bankAccountNumber = 'Số tài khoản phải từ 8-20 chữ số';
    }

    // Validate account name
    if (!formData.bankAccountName) {
      newErrors.bankAccountName = 'Vui lòng nhập tên chủ tài khoản';
    } else if (formData.bankAccountName.length < 3) {
      newErrors.bankAccountName = 'Tên chủ tài khoản phải ít nhất 3 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        ...formData,
        requestAmount: parseInt(formData.requestAmount)
      };

      await createWithdrawRequest(requestData);
      toast.success('Yêu cầu rút tiền đã được gửi thành công!');
      
      // Reset form
      setFormData({
        requestAmount: '',
        bankName: '',
        bankAccountNumber: '',
        bankAccountName: ''
      });

      // Navigate to payment history or dashboard
      setTimeout(() => {
        navigate('/guide/payments');
      }, 2000);

    } catch (error) {
      toast.error(error.message || 'Không thể gửi yêu cầu rút tiền');
    } finally {
      setLoading(false);
    }
  };

  const calculateFee = () => {
    const amount = parseInt(formData.requestAmount) || 0;
    const commissionRate = accountInfo?.commissionRate || 10; // Default 10% if not loaded
    return amount * (commissionRate / 100);
  };

  const calculateNetAmount = () => {
    const amount = parseInt(formData.requestAmount) || 0;
    return amount - calculateFee();
  };

  return (
    <div className="withdraw-request-container">
      {/* Header Section */}
      <div className="withdraw-header">
        <div className="header-content">
          <h1>Yêu cầu rút tiền</h1>
          <p>Rút tiền từ ví của bạn về tài khoản ngân hàng</p>
        </div>
        <div className="balance-card">
          {loadingAccount ? (
            <div className="loading-balance">
              <div className="spinner-small"></div>
              <span>Đang tải...</span>
            </div>
          ) : (
            <>
              <div className="balance-main">
                <span className="balance-label">Số dư khả dụng</span>
                <span className="balance-amount">{formatCurrency(balance)}</span>
              </div>
              {accountInfo && (
                <div className="balance-details">
                  <div className="detail-item">
                    <span className="detail-label">Tổng thu nhập:</span>
                    <span className="detail-value">{formatCurrency(accountInfo.totalEarned)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Tỷ lệ hoa hồng:</span>
                    <span className="detail-value">{accountInfo.commissionRate}%</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="withdraw-form">
        {/* Amount Input */}
        <div className="form-section">
          <label className="form-label">
            Số tiền muốn rút <span className="required">*</span>
          </label>
          <div className="amount-input-wrapper">
            <input
              type="text"
              name="requestAmount"
              value={formatInputCurrency(formData.requestAmount)}
              onChange={handleInputChange}
              className={`form-input amount-input ${errors.requestAmount ? 'error' : ''}`}
              placeholder="0"
              inputMode="numeric"
            />
            <span className="currency-label">VND</span>
          </div>
          {errors.requestAmount && (
            <span className="error-message">{errors.requestAmount}</span>
          )}

          {/* Quick Amount Buttons */}
          <div className="quick-amounts">
            {quickAmounts.map(amount => (
              <button
                key={amount}
                type="button"
                className="quick-amount-btn"
                onClick={() => handleQuickAmount(amount)}
              >
                {formatCurrency(amount).replace('₫', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Bank Selection */}
        <div className="form-section">
          <label className="form-label">
            Ngân hàng <span className="required">*</span>
          </label>
          <select
            name="bankName"
            value={formData.bankName}
            onChange={handleInputChange}
            className={`form-input ${errors.bankName ? 'error' : ''}`}
          >
            <option value="">Chọn ngân hàng</option>
            {popularBanks.map(bank => (
              <option key={bank.code} value={bank.code}>
                {bank.name} ({bank.code})
              </option>
            ))}
          </select>
          {errors.bankName && (
            <span className="error-message">{errors.bankName}</span>
          )}
        </div>

        {/* Account Number */}
        <div className="form-section">
          <label className="form-label">
            Số tài khoản <span className="required">*</span>
          </label>
          <input
            type="text"
            name="bankAccountNumber"
            value={formData.bankAccountNumber}
            onChange={handleInputChange}
            className={`form-input ${errors.bankAccountNumber ? 'error' : ''}`}
            placeholder="Nhập số tài khoản"
            inputMode="numeric"
          />
          {errors.bankAccountNumber && (
            <span className="error-message">{errors.bankAccountNumber}</span>
          )}
        </div>

        {/* Account Name */}
        <div className="form-section">
          <label className="form-label">
            Tên chủ tài khoản <span className="required">*</span>
          </label>
          <input
            type="text"
            name="bankAccountName"
            value={formData.bankAccountName}
            onChange={handleInputChange}
            className={`form-input ${errors.bankAccountName ? 'error' : ''}`}
            placeholder="Nhập tên chủ tài khoản"
            style={{ textTransform: 'uppercase' }}
          />
          <span className="input-hint">Vui lòng nhập chính xác tên trên tài khoản ngân hàng</span>
          {errors.bankAccountName && (
            <span className="error-message">{errors.bankAccountName}</span>
          )}
        </div>

        {/* Fee Information */}
        {formData.requestAmount && (
          <div className="fee-summary">
            <div className="fee-row">
              <span>Số tiền yêu cầu:</span>
              <span>{formatCurrency(parseInt(formData.requestAmount))}</span>
            </div>
            <div className="fee-row">
              <span>Phí giao dịch ({accountInfo?.commissionRate || 10}%):</span>
              <span className="fee-amount">-{formatCurrency(calculateFee())}</span>
            </div>
            <div className="fee-row total">
              <span>Số tiền nhận được:</span>
              <span className="net-amount">{formatCurrency(calculateNetAmount())}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={`submit-btn ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Đang xử lý...
            </>
          ) : (
            <>
              <i className="bi bi-send"></i>
              Gửi yêu cầu rút tiền
            </>
          )}
        </button>

        {/* Info Box */}
        <div className="info-box">
          <i className="bi bi-info-circle"></i>
          <div>
            <p><strong>Lưu ý:</strong></p>
            <ul>
              <li>Yêu cầu rút tiền sẽ được xử lý trong vòng 1-2 ngày làm việc</li>
              <li>Phí giao dịch là 1% số tiền rút</li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WithdrawRequest; 