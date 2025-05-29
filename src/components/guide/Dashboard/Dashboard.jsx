import React, { useState, useEffect, useMemo } from 'react';
import { FaSearch, FaChevronDown, FaEllipsisV, FaCheck, FaTimes, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import { Outlet } from 'react-router-dom';
import './Dashboard.css';
import Sidebar from './Sidebar/Sidebar';
import '../../../styles/sidebar-overrides.css';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả trạng thái');
  const [selectedPeriod, setSelectedPeriod] = useState('Tháng này');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    // Add a class to the body for global styling
    document.body.classList.add('guide-dashboard-active');
    document.body.classList.add('tradiva-body');
    
    return () => {
      clearTimeout(timer);
      document.body.classList.remove('guide-dashboard-active');
      document.body.classList.remove('tradiva-body');
    };
  }, []);
  
  // Payment statistics data
  const paymentStats = useMemo(() => [
    { 
      id: 'total-paid',
      title: "Đã Thanh Toán (Tháng)",
      value: "đ125,000,000",
      description: "Tổng số tiền đã thanh toán trong tháng này",
      icon: "success"
    },
    { 
      id: 'pending-approval',
      title: "Chờ Duyệt",
      value: "đ45,000,000", 
      description: "Tổng số tiền đang chờ duyệt",
      icon: "warning"
    },
    { 
      id: 'total-guides',
      title: "HDV Đã Nhận",
      value: "48", 
      description: "Số lượng hướng dẫn viên đã nhận thanh toán",
      icon: "info"
    }
  ], []);
  
  // Guide payment list data
  const guidePayments = useMemo(() => [
    {
      id: 'TG-1234',
      name: "Nguyễn Văn A",
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      amount: 4600000,
      tours: 3,
      status: "Chờ duyệt"
    },
    {
      id: 'TG-1235',
      name: "Trần Thị B",
      avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
      amount: 3800000,
      tours: 2,
      status: "Đã thanh toán"
    },
    {
      id: 'TG-1236',
      name: "Lê Văn C",
      avatarUrl: "https://randomuser.me/api/portraits/men/59.jpg",
      amount: 4500000,
      tours: 2,
      status: "Tranh chấp"
    }
  ], []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };
  
  const getStatusClass = (status) => {
    switch(status) {
      case 'Chờ duyệt': return 'pending';
      case 'Đã thanh toán': return 'paid';
      case 'Tranh chấp': return 'dispute';
      default: return 'pending';
    }
  };
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  return (
    <div 
      className={`dashboard-container tradiva-dashboard ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}
      style={{ backgroundColor: '#f9fafb' }}
    >
      <Sidebar 
        collapsed={isSidebarCollapsed} 
        onToggle={toggleSidebar} 
      />
      
      <main 
        className="dashboard-main"
        style={{ 
          marginLeft: isSidebarCollapsed ? '70px' : '240px', 
          width: isSidebarCollapsed ? 'calc(100% - 70px)' : 'calc(100% - 240px)',
          transition: 'margin-left 0.2s, width 0.2s',
          backgroundColor: '#f9fafb',
          minHeight: '100vh',
          padding: '2rem',
          zIndex: 10
        }}
      >
        <div className="payment-dashboard-content">
          <div className="payment-header">
            <h1>Quản Lý Thanh Toán HDV</h1>
            <button className="create-payment-btn">
              <FaPlus />
              <span>Tạo Thanh Toán Mới</span>
            </button>
          </div>
          
          {/* Stats Cards */}
          <div className="payment-stats-container">
            <div className="payment-stat-card">
              <div className="stat-header">
                <h3>Đã Thanh Toán (Tháng)</h3>
                <div className="info-icon">i</div>
              </div>
              <div className="stat-value">đ125,000,000</div>
            </div>
            
            <div className="payment-stat-card">
              <div className="stat-header">
                <h3>Chờ Duyệt</h3>
                <div className="info-icon">i</div>
              </div>
              <div className="stat-value">đ45,000,000</div>
            </div>
            
            <div className="payment-stat-card">
              <div className="stat-header">
                <h3>HDV Đã Nhận</h3>
                <div className="info-icon">i</div>
              </div>
              <div className="stat-value">48</div>
            </div>
          </div>
          
          {/* Filters */}
          <div className="payment-filters">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Tìm theo tên HDV hoặc ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-dropdowns">
              <div className="filter-dropdown">
                <button onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}>
                  <span>{selectedStatus}</span>
                  <FaChevronDown />
                </button>
              </div>
              
              <div className="filter-dropdown">
                <button onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}>
                  <span>{selectedPeriod}</span>
                  <FaChevronDown />
                </button>
              </div>
            </div>
          </div>
          
          {/* Payment List */}
          <div className="payment-list">
            <h2>Danh Sách Thanh Toán</h2>
            
            <div className="payment-table">
              {guidePayments.map(payment => (
                <div key={payment.id} className="payment-row">
                  <div className="payment-guide">
                    <img src={payment.avatarUrl} alt={payment.name} className="guide-avatar" />
                    <div className="guide-info">
                      <div className="guide-name">{payment.name}</div>
                      <div className="guide-id">ID: {payment.id}</div>
                    </div>
                  </div>
                  
                  <div className="payment-amount">
                    <div className="amount-value">đ{formatCurrency(payment.amount)}</div>
                    <div className="tours-count">{payment.tours} tours</div>
                  </div>
                  
                  <div className={`payment-status ${getStatusClass(payment.status)}`}>
                    {payment.status}
                  </div>
                  
                  <div className="payment-actions">
                    <button className="action-btn">
                      <FaEllipsisV />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;