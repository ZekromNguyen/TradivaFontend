import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Tracking.css"; // Custom CSS for styling

const TrackingPage = () => {
    const { id: tourId } = useParams();
    const [locations, setLocations] = useState([]);
    const [trackingLogs, setTrackingLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customerCoords, setCustomerCoords] = useState({ latitude: null, longitude: null, address: null }); // Include address

    // Fetch tour data including locations
    useEffect(() => {
        const fetchTourData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("accessToken");
                const response = await fetch(`https://tradivabe.felixtien.dev/api/Tour/${tourId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        Accept: "*/*",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch tour data");
                }

                const tourData = await response.json();
                if (tourData && tourData.tourLocations) {
                    setLocations(tourData.tourLocations.map((tl) => tl.location));
                } else {
                    setLocations([]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTourData();
    }, [tourId]);

    // Fetch tracking logs with periodic refresh
    useEffect(() => {
        const fetchTrackingLogs = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("accessToken");
                const response = await fetch(
                    `https://tradivabe.felixtien.dev/api/TrackingLogs/GetTrackingLogs?tourId=${tourId}&PageNumber=1&PageSize=10&SortBy=timestamp&IsDescending=true`,
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
                    throw new Error("Failed to fetch tracking logs");
                }

                const data = await response.json();
                setTrackingLogs(data.items || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTrackingLogs();
        const interval = setInterval(fetchTrackingLogs, 60000); // Refresh every minute
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [tourId]);

    // Determine status dynamically based on current time, proximity, and address
    const getStatus = (date, latitude, longitude, locationName, locationCity) => {
        const logTime = new Date(date);
        const currentTime = new Date("2025-06-18T23:24:00+07:00"); // 11:24 PM +07
        const timeDiff = (currentTime - logTime) / (1000 * 60); // Difference in minutes

        // Check proximity (within 5 km using Haversine formula approximation)
        const R = 6371e3; // Earth's radius in meters
        const φ1 = (customerCoords.latitude * Math.PI) / 180;
        const φ2 = (latitude * Math.PI) / 180;
        const Δφ = ((latitude - customerCoords.latitude) * Math.PI) / 180;
        const Δλ = ((longitude - customerCoords.longitude) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in meters

        // Address comparison (simplified match with location name or city)
        const isAddressMatch =
            customerCoords.address &&
            (customerCoords.address.toLowerCase().includes(locationName.toLowerCase()) ||
                customerCoords.address.toLowerCase().includes(locationCity.toLowerCase()));

        if (customerCoords.latitude && customerCoords.longitude && distance <= 5000 && isAddressMatch) {
            return "arrived"; // Within 5 km and address matches
        } else if (customerCoords.latitude && customerCoords.longitude && distance <= 5000) {
            return "arrived"; // Within 5 km, address match optional
        }

        // 15-minute threshold for "Đúng giờ" if no proximity or address match
        return timeDiff > 15 ? "delayed" : "on time";
    };

    // Map tracking logs and customer location to determine status
    const getLocationStatus = (location) => {
        const matchingLog = trackingLogs.find(
            (log) => log.latitude === location.latitude && log.longitude === location.longitude
        );
        if (matchingLog) {
            return getStatus(
                matchingLog.timestamp,
                location.latitude,
                location.longitude,
                location.name,
                location.city
            );
        }
        return getStatus(location.dateStart, location.latitude, location.longitude, location.name, location.city); // Fallback to scheduled start time
    };

    // Get customer location using Geolocation API and reverse geocode with Nominatim
    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setCustomerCoords({ latitude, longitude, address: null }); // Set coords first

                    // Reverse geocode using Nominatim API
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
                        );
                        if (!response.ok) throw new Error("Failed to fetch address");
                        const data = await response.json();
                        const address = data.display_name || "Unknown address";
                        setCustomerCoords((prev) => ({ ...prev, address }));
                    } catch (err) {
                        setError("Không thể lấy địa chỉ: " + err.message);
                    }
                },
                (err) => setError("Không thể truy cập vị trí: " + err.message)
            );
        } else {
            setError("Trình duyệt không hỗ trợ Geolocation.");
        }
    };

    return (
        <div className="tracking-page container mx-auto p-4">
            <div className="tour-header bg-white p-4 rounded shadow mb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Theo dõi Tour - ID: {tourId} (Tour vũng tàu)</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-600">
                            Bắt đầu: {new Date("2025-06-16T10:00:00").toLocaleString()}
                        </p>
                        {customerCoords.address && (
                            <p className="text-gray-600">Vị trí hiện tại: {customerCoords.address}</p>
                        )}
                    </div>
                </div>
                <button
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleGetLocation}
                >
                    Cập nhật vị trí của tôi
                </button>
            </div>

            {error && <div className="text-red-600 mb-4">{error}</div>}
            {loading && <div className="text-center">Đang tải...</div>}

            {!loading && (
                <div className="timeline">
                    {locations.length > 0 ? (
                        locations.map((location) => {
                            const isAtLocation = customerCoords.latitude && customerCoords.longitude;
                            const R = 6371e3; // Earth's radius in meters
                            const φ1 = (customerCoords.latitude * Math.PI) / 180;
                            const φ2 = (location.latitude * Math.PI) / 180;
                            const Δφ = ((location.latitude - customerCoords.latitude) * Math.PI) / 180;
                            const Δλ = ((location.longitude - customerCoords.longitude) * Math.PI) / 180;

                            const a =
                                Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                                Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
                            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                            const distance = R * c; // Distance in meters
                            const isMatch = distance <= 5000;

                            return (
                                <div key={location.id} className="timeline-item">
                                    <div className={`timeline-dot ${isMatch ? "bg-green-600" : "bg-red-600"}`}></div>
                                    <div className={`timeline-content ${isMatch ? "border-green-600" : "border-red-600"}`}>
                                        <p>
                                            {new Date(location.dateStart).toLocaleString()} -{" "}
                                            <span
                                                className={
                                                    getLocationStatus(location) === "arrived"
                                                        ? "text-blue-600"
                                                        : getLocationStatus(location) === "delayed"
                                                            ? "text-red-600"
                                                            : "text-green-600"
                                                }
                                            >
                                                {getLocationStatus(location) === "arrived"
                                                    ? "Đã đến"
                                                    : getLocationStatus(location) === "delayed"
                                                        ? "Đang trễ"
                                                        : "Đúng giờ"}
                                            </span>
                                        </p>
                                        <p>Địa điểm: {location.name}, {location.city}</p>
                                        <p>Mô tả: {location.description}</p>
                                        <img src={location.image} alt={location.name} className="w-32 h-32 object-cover mt-2" />
                                        <div className="timeline-actions">
                                            <button
                                                className="btn-edit"
                                                onClick={() => alert(`Edit location ${location.id}`)}
                                            >
                                                Chỉnh sửa
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => alert(`Delete location ${location.id}`)}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-500">Không có địa điểm theo dõi.</p>
                    )}
                </div>
            )}

            <div className="tour-actions mt-4 flex justify-between">
                <button className="btn-continue" onClick={() => alert("Tiếp tục tour")}>
                    Tiếp tục
                </button>
                <button className="btn-cancel" onClick={() => alert("Báo cáo hủy")}>
                    Báo cáo hủy
                </button>
            </div>

            <button className="btn-end-tour mt-4 w-full" onClick={() => alert("Kết thúc Tour")}>
                Kết thúc Tour
            </button>
        </div>
    );
};

export default TrackingPage;