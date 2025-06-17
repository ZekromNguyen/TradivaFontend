import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; // Adjust path to your AuthProvider
import 'tailwindcss/tailwind.css';

const TourCard = ({ tour, onViewDetail }) => {
  const { isLoggedIn, logout } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  // Configurable success statuses (add any backend-specific statuses here)
  const successStatuses = ['success', 'completed', 'paid', 'confirmed'];

  const fetchPaymentHistory = async (useRefreshedToken = false, pageIndex = 1, allItems = []) => {
    const token = localStorage.getItem('accessToken');
    console.log('Fetching payment history with token:', token ? 'Present' : 'Missing', 'isLoggedIn:', isLoggedIn, 'tourId:', tour.id, 'pageIndex:', pageIndex);

    if (!isLoggedIn || !token) {
      setError('Vui lòng đăng nhập để xem lịch sử thanh toán');
      setPaymentStatus(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://tradivabe.felixtien.dev/api/Payment/getPaymentHistory?pageIndex=${pageIndex}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        if (response.status === 401 && !useRefreshedToken) {
          const newToken = await refreshToken();
          if (newToken) {
            console.log('Retrying with new token');
            return fetchPaymentHistory(true, pageIndex, allItems);
          }
          throw new Error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response data:', JSON.stringify(data, null, 2));

      if (!data?.paymentHistory?.items) {
        throw new Error('Invalid API response: missing paymentHistory.items');
      }

      const items = [...allItems, ...data.paymentHistory.items];
      console.log('Accumulated items:', items.length);

      const hasSuccess = items.some((payment) => {
        const matches = String(payment.tourId) === String(tour.id);
        console.log('Checking payment for tour', tour.id, ':', {
          tourId: payment.tourId,
          status: payment.status,
          transactionId: payment.transactionId,
          matches,
        });
        return matches && successStatuses.includes(payment.status.toLowerCase());
      });

      // Fetch next page if available
      if (data.paymentHistory.pageIndex < data.paymentHistory.totalPages) {
        return fetchPaymentHistory(useRefreshedToken, pageIndex + 1, items);
      }

      setPaymentStatus(hasSuccess);
      console.log('Payment status for tour', tour.id, ':', hasSuccess ? 'Has Success' : 'No Success');
    } catch (err) {
      console.error(`❌ Error fetching payment history (attempt ${retryCount + 1}):`, err);
      if (err.message.includes('401') || retryCount >= maxRetries) {
        setError(err.message.includes('401') ? 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.' : 'Không thể tải lịch sử thanh toán. Vui lòng thử lại sau.');
        setPaymentStatus(false);
        if (err.message.includes('401')) {
          logout();
          window.location.href = '/login';
        }
      } else {
        setRetryCount(retryCount + 1);
        setTimeout(() => fetchPaymentHistory(), 2000 * (retryCount + 1));
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.error('No refresh token available');
      return null;
    }

    try {
      const response = await fetch('https://tradivabe.felixtien.dev/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        console.log('New access token saved:', data.accessToken);
        return data.accessToken;
      }
      return null;
    } catch (err) {
      console.error('Error refreshing token:', err);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return null;
    }
  };

  useEffect(() => {
    console.log('Tour prop:', tour);
    if (tour?.id && isLoggedIn) {
      fetchPaymentHistory();
    } else if (!isLoggedIn) {
      setError('Vui lòng đăng nhập để xem lịch sử thanh toán');
      setPaymentStatus(false);
    }
  }, [tour?.id, isLoggedIn]);

  const getImageSrc = () => {
    if (imageError && fallbackError) {
      return `https://picsum.photos/seed/${tour.id || 'default'}/400/300`;
    }
    if (imageError) {
      return "/images/fallback.jpg";
    }
    if (tour.images && tour.images.length > 0 && tour.images[0].filePath) {
      return tour.images[0].filePath;
    }
    return "/images/fallback.jpg";
  };

  const handleImageError = (e) => {
    console.log(`❌ Image error for tour ${tour.id}:`, e.target.src);
    if (!imageError) {
      setImageError(true);
      e.target.src = "/images/fallback.jpg";
    } else if (!fallbackError) {
      setFallbackError(true);
      e.target.src = `https://picsum.photos/seed/${tour.id || 'default'}/400/300`;
    }
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return "Liên hệ";
    return `${price.toLocaleString("vi-VN")} VND`;
  };

  const handleViewDetail = () => {
    if (onViewDetail && typeof onViewDetail === 'function') {
      onViewDetail(tour.id);
    } else {
      console.warn('onViewDetail not provided, using default navigation');
      window.location.href = `/tour/${tour.id}`;
    }
  };

  if (!tour) {
    return (
      <div className="bg-gray-100 rounded-xl overflow-hidden shadow-md p-4">
        <div className="text-center text-gray-500">
          <p>Không có thông tin tour</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="relative group">
        <img
          src={getImageSrc()}
          alt={tour.title || 'Tour image'}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={handleImageError}
          onLoad={() => {
            if (imageError || fallbackError) {
              console.log(`✅ Image loaded successfully for tour ${tour.id}`);
            }
          }}
        />
        {imageError && fallbackError && (
          <div className="absolute inset-0 bg-gray-200/50 flex items-center justify-center">
            <div className="text-gray-400 text-sm">Đang tải ảnh...</div>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3
            className="font-semibold text-lg truncate pr-2 flex-1"
            title={tour.title || 'Không có tên tour'}
          >
            {tour.title || 'Không có tên tour'}
          </h3>
          <div className="flex items-center flex-shrink-0">
            <FaStar className="text-yellow-400 mr-1" size={14} />
            <span className="text-sm font-medium">
              {tour.rating !== undefined && tour.rating !== null ? tour.rating : 0}
            </span>
          </div>
        </div>

        <div className="text-gray-600 text-sm mb-3 line-clamp-2">
          {tour.description || "Không có mô tả cho tour này"}
        </div>

        {tour.location && (
          <div className="text-gray-500 text-xs mb-2 flex items-center">
            <span className="mr-1">📍</span>
            <span className="truncate">{tour.location}</span>
          </div>
        )}

        {tour.duration && (
          <div className="text-gray-500 text-xs mb-2 flex items-center">
            <span className="mr-1">⏰</span>
            <span>{tour.duration}</span>
          </div>
        )}

        {tour.numberOfGuests && (
          <div className="text-gray-500 text-xs mb-2 flex items-center">
            <span className="mr-1">👥</span>
            <span>{tour.numberOfGuests} khách</span>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-xs mb-2 flex items-center">
            <span className="mr-1">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-between items-center mt-4 gap-2">
          <span className="font-bold text-indigo-600 text-lg">
            {formatPrice(tour.pricePerPerson)}
          </span>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50"
              aria-label={`Xem chi tiết tour ${tour.title || 'này'}`}
              onClick={handleViewDetail}
              disabled={loading}
            >
              {loading ? 'Đang tải...' : 'Xem chi tiết'}
            </button>
            {paymentStatus && (
              <Link
                to={`/tracking/${tour.id}`}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                aria-label={`Theo dõi lịch trình tour ${tour.title || 'này'}`}
              >
                Theo dõi
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;