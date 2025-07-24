import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchGuideById } from "../../api/guideAPI";
import GuideTourGrid from "../../components/guideCustomer/guideTourGrid/GuideTourGrid";
import "./GuideDetailPage.css";
import GuidePageHeader from "../../components/guideCustomer/header/GuidePageHeader";

const GuideDetailPage = () => {
  const { guideId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [guide, setGuide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Manual URL parsing as fallback
  const urlParts = location.pathname.split("/");
  const manualGuideId = urlParts[urlParts.length - 1];
  // Use manual ID if useParams fails
  const actualGuideId = guideId || manualGuideId;

  useEffect(() => {
    const getGuideDetail = async () => {
      // Use actualGuideId instead of guideId
      if (!actualGuideId || actualGuideId === "undefined") {
        setError("Không tìm thấy ID hướng dẫn viên trong URL");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const data = await fetchGuideById(actualGuideId);
        setGuide(data);
      } catch (err) {
        setError(`Không thể tải thông tin hướng dẫn viên: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    getGuideDetail();
  }, [guideId, actualGuideId]);

  const handleBackToList = () => {
    window.location.href = "/guides";
  };

  const handleTourDetail = (tourId) => {
    window.location.href = `/tour/${tourId}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="guide-page">
        <div className="min-h-screen flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              Đang tải thông tin hướng dẫn viên...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="guide-page">
        <div className="min-h-screen flex justify-center items-center">
          <div className="text-center bg-red-50 border border-red-200 rounded-lg p-8 max-w-lg">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Lỗi tải dữ liệu
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleBackToList}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No guide found
  if (!guide) {
    return (
      <div className="guide-page">
        <div className="min-h-screen flex justify-center items-center">
          <div className="text-center bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Không tìm thấy dữ liệu
            </h3>
            <p className="text-gray-600 mb-4">
              Không tìm thấy hướng dẫn viên với ID: {actualGuideId}
            </p>
            <button
              onClick={handleBackToList}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayName =
    guide.name || guide.userName || guide.email || "Không có tên";
  const defaultAvatar =
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80";
  const BACKGROUND_IMAGE =
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80";
  return (
    <section
      className="py-16 min-h-screen relative"
      style={{
        backgroundImage: `linear-gradient(rgba(30, 136, 229, 0.18), rgba(255,255,255,0.96)), url('${BACKGROUND_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: "20vh",
      }}
    >
      <div className="guide-page">
        {/* <GuidePageHeader/> */}
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back Button */}
          <button
            onClick={handleBackToList}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors bg-transparent border-none outline-none focus:outline-none active:outline-none"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Quay lại danh sách hướng dẫn viên
          </button>

          {/* Guide Profile Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="md:flex">
              <div className="md:w-1/3 relative">
                <img
                  src={guide.avatar || defaultAvatar}
                  alt={displayName}
                  className="w-full h-64 md:h-full object-cover"
                  onError={(e) => {
                    e.target.src = defaultAvatar;
                  }}
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {guide.isVerified && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      ✓ Đã xác minh
                    </span>
                  )}
                  {guide.isAvailable && (
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Có sẵn
                    </span>
                  )}
                </div>
              </div>

              <div className="md:w-2/3 p-6">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-800">
                    {displayName}
                  </h1>
                  {guide.pricePerHour && (
                    <div className="text-right">
                      <span className="text-3xl font-bold text-blue-600">
                        ${guide.pricePerHour}
                      </span>
                      <span className="text-gray-600 text-lg">/giờ</span>
                    </div>
                  )}
                </div>

                {guide.major && (
                  <p className="text-lg text-blue-600 font-semibold mb-4">
                    {guide.major}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {guide.email && (
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium mr-2">
                        📧 Email:
                      </span>
                      <span className="text-gray-800">{guide.email}</span>
                    </div>
                  )}
                  {guide.phone && (
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium mr-2">
                        📞 Điện thoại:
                      </span>
                      <span className="text-gray-800">{guide.phone}</span>
                    </div>
                  )}
                  {guide.languages && (
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium mr-2">
                        🌐 Ngôn ngữ:
                      </span>
                      <span className="text-gray-800">{guide.languages}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <span className="text-gray-600 font-medium mr-2">
                      🎯 Tổng số tour:
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {guide.totalTours || 0}
                    </span>
                  </div>
                </div>

                {guide.experience && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Kinh nghiệm
                    </h3>
                    <p className="text-gray-600">{guide.experience}</p>
                  </div>
                )}

                {guide.certifications && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Chứng chỉ
                    </h3>
                    <p className="text-gray-600">{guide.certifications}</p>
                  </div>
                )}

                {guide.sampleTours && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Tour mẫu
                    </h3>
                    <p className="text-gray-600">{guide.sampleTours}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tours Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Các tour của {displayName} ({guide.totalTours || 0})
            </h2>
            <GuideTourGrid
              tours={guide.tours || []}
              onTourDetail={handleTourDetail}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuideDetailPage;
