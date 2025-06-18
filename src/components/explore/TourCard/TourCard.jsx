import React, { useState, useEffect, useCallback } from "react";
import { FaStar, FaCheckCircle, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./TourCard.css";

const TourCard = ({ tour, onViewDetail }) => {
  const { isLoggedIn, logout } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;
  const pageSize = 10;
  const successStatuses = ["success", "completed", "paid", "confirmed"];

  const fetchPaymentStatus = useCallback(
    async (useRefreshedToken = false, pageIndex = 1) => {
      if (!isLoggedIn || !localStorage.getItem("accessToken")) {
        setError("Vui lòng đăng nhập để kiểm tra trạng thái thanh toán");
        setPaymentStatus(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `https://tradivabe.felixtien.dev/api/Payment/getPaymentHistory?IsDescending=true&PageNumber=${pageIndex}&PageSize=${pageSize}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Accept: "*/*",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401 && !useRefreshedToken && retryCount < maxRetries) {
            const newToken = await refreshToken();
            if (newToken) {
              return fetchPaymentStatus(true, pageIndex);
            }
            throw new Error("Phiên đăng nhập không hợp lệ.");
          }
          throw new Error(`Lỗi khi kiểm tra trạng thái thanh toán: ${response.status}`);
        }

        const data = await response.json();
        if (!data?.paymentHistory?.items) {
          throw new Error("Dữ liệu thanh toán không hợp lệ");
        }

        const hasSuccess = data.paymentHistory.items.some(
          (payment) =>
            String(payment.tourId) === String(tour.id) &&
            successStatuses.includes(payment.status.toLowerCase())
        );

        if (hasSuccess) {
          setPaymentStatus(true);
          setLoading(false);
          return;
        }

        if (data.paymentHistory.pageIndex < data.paymentHistory.totalPages) {
          return fetchPaymentStatus(useRefreshedToken, pageIndex + 1);
        }

        setPaymentStatus(false);
      } catch (err) {
        if (retryCount >= maxRetries || err.message.includes("401")) {
          setError(
            err.message.includes("401")
              ? "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại."
              : "Không thể kiểm tra trạng thái thanh toán."
          );
          setPaymentStatus(null);
          if (err.message.includes("401")) {
            logout();
            window.location.href = `/login?redirect=/tour/${tour.id}`;
          }
        } else {
          setRetryCount((prev) => prev + 1);
          setTimeout(() => fetchPaymentStatus(useRefreshedToken, pageIndex), 2000 * (retryCount + 1));
        }
      } finally {
        setLoading(false);
      }
    },
    [tour?.id, isLoggedIn, retryCount, logout]
  );

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    try {
      const response = await fetch("https://tradivabe.felixtien.dev/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) throw new Error("Không thể làm mới token");
      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        return data.accessToken;
      }
      return null;
    } catch (err) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      return null;
    }
  };

  useEffect(() => {
    if (tour?.id && isLoggedIn) {
      fetchPaymentStatus();
    } else if (!isLoggedIn) {
      setError("Vui lòng đăng nhập để kiểm tra trạng thái.");
      setPaymentStatus(null);
    }
  }, [tour?.id, isLoggedIn, fetchPaymentStatus]);

  const getImageSrc = () => {
    if (imageError && fallbackError) return `https://picsum.photos/seed/${tour.id || "danang"}/400/300`;
    if (imageError) return "/images/fallback.jpg";
    return tour.images?.length > 0 && tour.images[0]?.filePath ? tour.images[0].filePath : "/images/fallback.jpg";
  };

  const handleImageError = (e) => {
    if (!imageError) {
      setImageError(true);
      e.target.src = "/images/fallback.jpg";
    } else if (!fallbackError) {
      setFallbackError(true);
      e.target.src = `https://picsum.photos/seed/${tour.id || "danang"}/400/300`;
    }
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return "Liên hệ";
    return `${price.toLocaleString("vi-VN")} VND`;
  };

  const handleViewDetail = () => {
    if (onViewDetail && typeof onViewDetail === "function") {
      onViewDetail(tour.id);
    } else {
      window.location.href = `/tour/${tour.id}`;
    }
  };

  if (!tour || !tour.id) {
    return (
      <div className="destination-card p-6 animate-in fade-in duration-300">
        <div className="text-center text-gray-600 font-medium">
          Không có thông tin tour
        </div>
      </div>
    );
  }

  return (
    <div
      className={`destination-card ${loading ? "loading" : ""} ${error ? "error" : ""} max-w-md mx-auto`}
    >
      <div className="img-zoom-container relative overflow-hidden">
        <img
          src={getImageSrc()}
          alt={tour.title || "Hình ảnh tour"}
          className="img-zoom w-full h-full object-cover"
          loading="lazy"
          onError={handleImageError}
          onLoad={() => setLoading(false)}
        />
        {!loading && <div className="gradient-overlay"></div>}
        {imageError && fallbackError && (
          <div className="absolute inset-0 bg-gray-200/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <h3
            className="font-bold text-xl text-gray-900 truncate pr-4 flex-1"
            title={tour.title || "Không có tên tour"}
          >
            {tour.title || "Không có tên tour"}
          </h3>
          {paymentStatus !== null && (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${paymentStatus ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}
            >
              {paymentStatus ? (
                <>
                  <FaCheckCircle className="mr-1.5" size={12} />
                  Đã thanh toán
                </>
              ) : (
                <>
                  <FaClock className="mr-1.5" size={12} />
                  Chưa thanh toán
                </>
              )}
            </span>
          )}
        </div>

        <div className="flex items-center mb-3">
          {Array.from({ length: Math.floor(tour.rating ?? 0) }).map((_, index) => (
            <FaStar key={`star-${tour.id}-${index}`} className="text-yellow-400 mr-1" size={16} />
          ))}
          <span className="text-sm font-medium text-gray-600">{tour.rating ?? 0}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {tour.description || "Không có mô tả cho tour này"}
        </p>

        <div className="space-y-3 mb-4">
          {tour.location && (
            <div className="text-gray-600 text-sm flex items-center">
              <span className="mr-2 text-base">📍</span>
              <span className="font-medium truncate">{tour.location}</span>
            </div>
          )}
          {tour.duration && (
            <div className="text-gray-600 text-sm flex items-center">
              <span className="mr-2 text-base">⏰</span>
              <span className="font-medium">{tour.duration}</span>
            </div>
          )}
          {tour.numberOfGuests && (
            <div className="text-gray-600 text-sm flex items-center">
              <span className="mr-2 text-base">👥</span>
              <span className="font-medium">{tour.numberOfGuests} khách</span>
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-600 text-sm mb-3 flex items-center bg-red-100 p-2 rounded-lg animate-in fade-in duration-200">
            <span className="mr-2">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-between items-center mt-4 gap-2">
          <span className="font-bold text-lg text-primary">{formatPrice(tour.pricePerPerson)}</span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Xem chi tiết tour ${tour.title || "này"}`}
              onClick={handleViewDetail}
              disabled={loading}
            >
              {loading ? "Đang tải..." : "Xem chi tiết"}
            </button>
            {paymentStatus && (
              <Link
                to={`/tracking/${tour.id}`}
                className="px-3 py-1 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg text-sm font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-300"
                aria-label={`Theo dõi lịch trình tour ${tour.title || "này"}`}
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