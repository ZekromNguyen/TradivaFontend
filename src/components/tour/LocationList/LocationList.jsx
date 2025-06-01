function LocationList({ tourLocations, selectedLocation, onSelect }) {
  return (
    <div className="md:w-1/3 w-full">
      <h4 className="font-semibold text-lg mb-4 text-blue-600 flex items-center gap-2">
        <svg width="22" height="22" fill="currentColor" className="inline-block text-blue-400">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
        </svg>
        Địa điểm trong tour
      </h4>
      <div className="flex flex-col gap-4">
        {tourLocations && tourLocations.length > 0 ? (
          tourLocations.map((tl, idx) =>
            tl && tl.location ? (
              <button
                key={tl.id || idx}
                type="button"
                onClick={() => onSelect(tl.location)}
                className={`flex items-center gap-3 bg-blue-50 hover:bg-blue-200 transition rounded-xl p-2 shadow-sm text-left border-2 w-full ${
                  selectedLocation && selectedLocation.id === tl.location.id
                    ? "border-blue-500 ring-2 ring-blue-300"
                    : "border-transparent"
                }`}
              >
                <img
                  src={tl.location.image}
                  alt={tl.location.name}
                  className="w-14 h-14 object-cover rounded-lg border border-blue-200 shadow"
                />
                <div>
                  <div className="font-semibold text-blue-700 text-base">{tl.location.name}</div>
                  <div className="text-blue-500 text-xs">{tl.location.city}</div>
                </div>
              </button>
            ) : null
          )
        ) : (
          <div>Chưa có địa điểm nào.</div>
        )}
      </div>
    </div>
  );
}

export default LocationList;