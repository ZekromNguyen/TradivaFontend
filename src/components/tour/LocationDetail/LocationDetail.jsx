import React from 'react';

const getGoogleMapsLink = (lat, lng) =>
  `https://www.google.com/maps?q=${lat},${lng}`;

function LocationDetail({ location }) {
  if (!location) {
    return (
      <div className="flex items-center justify-center h-72 bg-gray-50 rounded-xl text-gray-500 italic text-xl font-medium py-6">
        Chọn một địa điểm để xem chi tiết
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6 p-6">
        {/* Image */}
        <div className="relative w-full md:w-96 h-60 rounded-lg overflow-hidden">
          <img
            src={location.image}
            alt={location.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-br-lg">
            {location.city}
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 space-y-4">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{location.name}</h2>
          <p className="text-gray-600 text-base leading-relaxed max-w-prose">{location.description}</p>

          <div className="flex items-center gap-3 text-gray-800">
            <span className="text-indigo-500">📅</span>
            <span className="font-semibold">Ngày đến:</span>
            <span className="text-gray-700">
              {location.dateStart
                ? new Date(location.dateStart).toLocaleString("vi-VN")
                : "Chưa cập nhật"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-gray-800">
            <span className="text-indigo-500">📅</span>
            <span className="font-semibold">Ngày rời:</span>
            <span className="text-gray-700">
              {location.dateEnd
                ? new Date(location.dateEnd).toLocaleString("vi-VN")
                : "Chưa cập nhật"}
            </span>
          </div>
        </div>
      </div>

      {/* Map Section */}
      {(location.latitude !== 0 || location.longitude !== 0) && (
        <div className="mt-6 p-6 bg-gray-50">
          <div className="relative rounded-xl overflow-hidden border border-gray-100 shadow-inner">
            <iframe
              title="Bản đồ địa điểm"
              width="100%"
              height="350"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&hl=vi&z=14&output=embed`}
            ></iframe>
          </div>
          <div className="mt-3 text-right">
            <a
              href={getGoogleMapsLink(location.latitude, location.longitude)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors hover:underline"
            >
              Xem trên Google Maps
              <span className="ml-1">↗</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocationDetail;