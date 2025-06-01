function TourInfo({ tour, guestCount, handleGuestChange }) {
  return (
    <div className="mb-8 flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <div className="mb-2 text-gray-700">
          <span className="font-semibold text-blue-600">Mô tả: </span>
          {tour.description || "Chưa có mô tả."}
        </div>
        <div className="mb-2 text-gray-700">
          <span className="font-semibold text-blue-600">Ngày đi: </span>
          {tour.dateStart
            ? new Date(tour.dateStart).toLocaleString("vi-VN")
            : "Chưa cập nhật"}
        </div>
        <div className="mb-2 text-gray-700">
          <span className="font-semibold text-blue-600">Ngày về: </span>
          {tour.dateEnd
            ? new Date(tour.dateEnd).toLocaleString("vi-VN")
            : "Chưa cập nhật"}
        </div>
        <div className="mb-2 text-gray-700">
          <span className="font-semibold text-blue-600">Giá mỗi người: </span>
          <span className="text-primary font-bold text-xl">
            {tour.pricePerPerson?.toLocaleString("vi-VN")} VND
          </span>
        </div>
        <div className="mb-2 text-gray-700 flex items-center gap-2">
          <span className="font-semibold text-blue-600">Số khách: </span>
          <input
            type="number"
            min={1}
            max={tour.numberOfGuests || 99}
            value={guestCount}
            onChange={handleGuestChange}
            className="w-20 px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            style={{ fontWeight: 600 }}
          />
          <span className="text-gray-500 text-sm">
            / {tour.numberOfGuests || "?"} khách tối đa
          </span>
        </div>
      </div>
      {tour.tourLocations &&
        tour.tourLocations[0] &&
        tour.tourLocations[0].location && (
          <img
            src={tour.tourLocations[0].location.image}
            alt={tour.tourLocations[0].location.name}
            className="w-full md:w-80 h-56 object-cover rounded-xl border border-blue-200 shadow"
          />
        )}
    </div>
  );
};

export default TourInfo;