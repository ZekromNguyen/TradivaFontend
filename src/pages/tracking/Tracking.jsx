import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchTourById, fetchTrackingLogs } from "../../api/tracking";
import "./Tracking.css";

const TrackingPage = () => {
    const { id: tourId } = useParams();
    const [locations, setLocations] = useState([]);
    const [trackingLogs, setTrackingLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customerCoords, setCustomerCoords] = useState({ latitude: null, longitude: null, address: null });

    useEffect(() => {
        const loadTourData = async () => {
            try {
                setLoading(true);
                const tourData = await fetchTourById(tourId);
                if (tourData?.tourLocations) {
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

        loadTourData();
    }, [tourId]);

    useEffect(() => {
        const loadTrackingLogs = async () => {
            try {
                setLoading(true);
                const data = await fetchTrackingLogs(tourId);
                setTrackingLogs(data.items || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadTrackingLogs();
        const interval = setInterval(loadTrackingLogs, 60000);
        return () => clearInterval(interval);
    }, [tourId]);

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setCustomerCoords({ latitude, longitude, address: null });

                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
                        );
                        if (!response.ok) throw new Error("Không lấy được địa chỉ");
                        const data = await response.json();
                        setCustomerCoords((prev) => ({
                            ...prev,
                            address: data.display_name || "Unknown address",
                        }));
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

    const getStatus = (date, latitude, longitude, locationName, locationCity) => {
        const logTime = new Date(date);
        const currentTime = new Date("2025-06-18T23:24:00+07:00");
        const timeDiff = (currentTime - logTime) / (1000 * 60);

        const R = 6371e3;
        const φ1 = (customerCoords.latitude * Math.PI) / 180;
        const φ2 = (latitude * Math.PI) / 180;
        const Δφ = ((latitude - customerCoords.latitude) * Math.PI) / 180;
        const Δλ = ((longitude - customerCoords.longitude) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        const isAddressMatch =
            customerCoords.address &&
            (customerCoords.address.toLowerCase().includes(locationName.toLowerCase()) ||
                customerCoords.address.toLowerCase().includes(locationCity.toLowerCase()));

        if (customerCoords.latitude && customerCoords.longitude && distance <= 5000) {
            return "arrived";
        }

        return timeDiff > 15 ? "delayed" : "on time";
    };

    const getLocationStatus = (location) => {
        const log = trackingLogs.find(
            (log) => log.latitude === location.latitude && log.longitude === location.longitude
        );
        return getStatus(
            log?.timestamp || location.dateStart,
            location.latitude,
            location.longitude,
            location.name,
            location.city
        );
    };

    return (
        <div className="tracking-page container mx-auto p-4">
            <div className="tour-header bg-white p-4 rounded shadow mb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Theo dõi Tour - ID: {tourId}</h2>
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
                            const φ1 = (customerCoords.latitude * Math.PI) / 180;
                            const φ2 = (location.latitude * Math.PI) / 180;
                            const Δφ = ((location.latitude - customerCoords.latitude) * Math.PI) / 180;
                            const Δλ = ((location.longitude - customerCoords.longitude) * Math.PI) / 180;
                            const R = 6371e3;
                            const a =
                                Math.sin(Δφ / 2) ** 2 +
                                Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
                            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                            const distance = R * c;
                            const isMatch = distance <= 5000;

                            const status = getLocationStatus(location);

                            return (
                                <div key={location.id} className="timeline-item">
                                    <div className={`timeline-dot ${isMatch ? "bg-green-600" : "bg-red-600"}`}></div>
                                    <div className={`timeline-content ${isMatch ? "border-green-600" : "border-red-600"}`}>
                                        <p>
                                            {new Date(location.dateStart).toLocaleString()} -{" "}
                                            <span
                                                className={
                                                    status === "arrived"
                                                        ? "text-blue-600"
                                                        : status === "delayed"
                                                            ? "text-red-600"
                                                            : "text-green-600"
                                                }
                                            >
                                                {status === "arrived"
                                                    ? "Đã đến"
                                                    : status === "delayed"
                                                        ? "Đang trễ"
                                                        : "Đúng giờ"}
                                            </span>
                                        </p>
                                        <p>Địa điểm: {location.name}, {location.city}</p>
                                        <p>Mô tả: {location.description}</p>
                                        <img src={location.image} alt={location.name} className="w-32 h-32 object-cover mt-2" />
                                        <div className="timeline-actions">
                                            <button className="btn-edit" onClick={() => alert(`Edit ${location.id}`)}>Chỉnh sửa</button>
                                            <button className="btn-delete" onClick={() => alert(`Delete ${location.id}`)}>Xóa</button>
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
                <button className="btn-continue" onClick={() => alert("Tiếp tục tour")}>Tiếp tục</button>
                <button className="btn-cancel" onClick={() => alert("Báo cáo hủy")}>Báo cáo hủy</button>
            </div>
            <button className="btn-end-tour mt-4 w-full" onClick={() => alert("Kết thúc Tour")}>
                Kết thúc Tour
            </button>
        </div>
    );
};

export default TrackingPage;
