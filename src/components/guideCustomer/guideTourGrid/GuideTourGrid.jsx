import React from "react";

const GuideTourGrid = ({ tours, onTourDetail }) => {
  if (!tours || tours.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Chưa có tour nào
          </h3>
          <p className="text-gray-600">
            Hướng dẫn viên này chưa tạo tour nào.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour) => (
        <TourCardInGuide
          key={tour.id}
          tour={tour}
          onTourDetail={() => onTourDetail(tour.id)}
        />
      ))}
    </div>
  );
};

const TourCardInGuide = ({ tour, onTourDetail }) => {
  const {
    id,
    title,
    rating,
    pricePerPerson,
    numberRating,
    description,
    numberOfGuests,
    dateStart,
    dateEnd,
    duration,
    location,
    status,
    images
  } = tour;

  const defaultImage = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80";
  const mainImage = images && images.length > 0 ? images[0].filePath : defaultImage;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={mainImage}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>
        {rating > 0 && (
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded flex items-center">
            <span className="text-yellow-400 mr-1">★</span>
            <span>{rating.toFixed(1)} ({numberRating})</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{title}</h3>
        </div>

        {location && (
          <p className="text-sm text-blue-600 mb-2 flex items-center">
            <span className="mr-1">📍</span>
            {location}
          </p>
        )}

        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
          {dateStart && (
            <div>
              <strong>Bắt đầu:</strong> {formatDate(dateStart)}
            </div>
          )}
          {dateEnd && (
            <div>
              <strong>Kết thúc:</strong> {formatDate(dateEnd)}
            </div>
          )}
          {duration && (
            <div>
              <strong>Thời gian:</strong> {duration}
            </div>
          )}
          {numberOfGuests && (
            <div>
              <strong>Số khách:</strong> {numberOfGuests}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-blue-600">
            {formatPrice(pricePerPerson)}/người
          </div>
          <button
            onClick={onTourDetail}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideTourGrid;