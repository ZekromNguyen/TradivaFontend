
const getGoogleMapsLink = (lat, lng) =>
  `https://www.google.com/maps?q=${lat},${lng}`;
function LocationDetail({ location }) {
  if (!location)
    return <div className="text-gray-500 italic">Chọn một địa điểm để xem chi tiết</div>;
  return (
    <div className="p-6 rounded-xl bg-blue-50 border border-blue-200 shadow-lg animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <img
          src={location.image}
          alt={location.name}
          className="w-full md:w-56 h-40 object-cover rounded-lg border border-blue-300 shadow"
        />
        <div className="flex-1">
          <h5 className="text-2xl font-bold text-blue-700 mb-2">{location.name}</h5>
          <div className="text-blue-500 text-base mb-1">
            <span className="inline-block mr-1">📍</span>
            {location.city}
          </div>
          <div className="text-gray-700 mb-2">{location.description}</div>
          <div className="text-gray-600 text-sm mb-1">
            <span className="font-semibold">Ngày đến: </span>
            {location.dateStart
              ? new Date(location.dateStart).toLocaleString("vi-VN")
              : "Chưa cập nhật"}
          </div>
          <div className="text-gray-600 text-sm mb-1">
            <span className="font-semibold">Ngày rời: </span>
            {location.dateEnd
              ? new Date(location.dateEnd).toLocaleString("vi-VN")
              : "Chưa cập nhật"}
          </div>
          {(location.latitude !== 0 || location.longitude !== 0) && (
            <div className="my-3">
              <iframe
                title="Bản đồ địa điểm"
                width="100%"
                height="220"
                style={{ border: 0, borderRadius: 12 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&hl=vi&z=14&output=embed`}
              ></iframe>
              <div className="text-xs mt-1">
                <a
                  href={getGoogleMapsLink(location.latitude, location.longitude)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Xem trên Google Maps
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LocationDetail;