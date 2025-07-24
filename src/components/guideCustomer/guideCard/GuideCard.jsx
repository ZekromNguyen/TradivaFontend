import React from "react";

const GuideCard = ({ guide, onViewDetail }) => {
  const {
    id,
    name,
    userName,
    email,
    phone,
    avatar,
    experience,
    certifications,
    languages,
    pricePerHour,
    isVerified,
    isAvailable,
    major,
    totalTours
  } = guide;

  const displayName = name || userName || email;
  const defaultAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <div className="relative">
        <img
          src={avatar || defaultAvatar}
          alt={displayName}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          {isVerified && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              ✓ Đã xác minh
            </span>
          )}
          {isAvailable && (
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Có sẵn
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {displayName}
          </h3>
          {pricePerHour && (
            <span className="text-lg font-bold text-blue-600">
              ${pricePerHour}/h
            </span>
          )}
        </div>

        {major && (
          <p className="text-sm text-blue-600 font-medium mb-2">{major}</p>
        )}

        {experience && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            <strong>Kinh nghiệm:</strong> {experience}
          </p>
        )}

        {languages && (
          <p className="text-sm text-gray-600 mb-2">
            <strong>Ngôn ngữ:</strong> {languages}
          </p>
        )}

        {certifications && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            <strong>Chứng chỉ:</strong> {certifications}
          </p>
        )}

        <div className="flex gap-4 text-xs text-gray-500 mb-4">
          {phone && <span>📞 {phone}</span>}
          <span>🎯 {totalTours || 0} tours</span>
        </div>

        <button
          onClick={onViewDetail}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};
export default GuideCard;
