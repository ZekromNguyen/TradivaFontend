const API_BASE = "https://tradivabe.felixtien.dev/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
    };
};

// Lấy thông tin tour theo ID
export const fetchTourById = async (tourId) => {
    const response = await fetch(`${API_BASE}/Tour/${tourId}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu tour");
    }

    return await response.json();
};

// Lấy tracking logs
export const fetchTrackingLogs = async (tourId) => {
    const response = await fetch(
        `${API_BASE}/TrackingLogs/GetTrackingLogs?tourId=${tourId}&PageNumber=1&PageSize=10&SortBy=timestamp&IsDescending=true`,
        {
            method: "GET",
            headers: getAuthHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu tracking");
    }

    return await response.json();
};
