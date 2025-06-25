import axios from "axios";

const API_BASE = "https://tradivabe.felixtien.dev/api/Tour";
const API_FILE = "https://tradivabe.felixtien.dev/api/Files";
const API_DASHBOARD = "https://tradivabe.felixtien.dev/api/Dashboard";

export const getTours = async ({
  sortBy = "Date",
  isDescending = true,
  pageNumber = 1,
  pageSize = 100
} = []) => {
  const url = `${API_BASE}/GetTours?Pagination.SortBy=${sortBy}&Pagination.IsDescending=${isDescending}&Pagination.PageNumber=${pageNumber}&Pagination.PageSize=${pageSize}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.items)) {
      return data.items; // Extract the 'items' array
    } else if (data && Array.isArray(data.tours)) {
      return data.tours; // Support for 'tours' for backward compatibility
    } else {
      console.warn("Unexpected data format from API:", data);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch tours:", error);
    return [];
  }
};

export const getToursWithGuide = async ({
  userId,
  sortBy = "Date",
  isDescending = true,
  pageNumber = 1,
  pageSize = 100
} = []) => {
  const url = `${API_BASE}/GetToursByGuideId?Pagination.SortBy=${sortBy}&Pagination.IsDescending=${isDescending}&Pagination.PageNumber=${pageNumber}&Pagination.PageSize=${pageSize}&UserId=${userId}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.items)) {
      return data.items; // Extract the 'items' array
    } else if (data && Array.isArray(data.tours)) {
      return data.tours; // Support for 'tours' for backward compatibility
    } else {
      console.warn("Unexpected data format from API:", data);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch tours:", error);
    return [];
  }
};


export const fetchTours = async ({
  sortBy = "Date",
  isDescending = false,
  pageNumber = 1,
  pageSize = 8,
  search = "",
  minPrice = 0,
  maxPrice = 10000000,
  rating = ""
} = {}) => {
  let url = `${API_BASE}/GetTours?Pagination.SortBy=${sortBy}&Pagination.IsDescending=${isDescending}&Pagination.PageNumber=${pageNumber}&Pagination.PageSize=${pageSize}`;
  if (search) url += `&Search=${encodeURIComponent(search)}`;
  if (minPrice) url += `&MinPrice=${minPrice}`;
  if (maxPrice !== 10000000) url += `&MaxPrice=${maxPrice}`;
  if (rating) url += `&MinRating=${rating}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status} - ${res.statusText}`);
    }

    const data = await res.json();

    // Xử lý response format chính xác
    if (data && typeof data === 'object' && Array.isArray(data.items)) {
      // ✅ Format chuẩn với pagination (như JSON bạn cung cấp)
      const result = {
        items: data.items,
        totalPages: data.totalPages || Math.ceil((data.totalItems || 0) / pageSize),
        totalItems: data.totalItems || 0,
        pageIndex: data.pageIndex || pageNumber,
        pageSize: data.pageSize || pageSize,
        hasNextPage: data.hasNextPage || false,
        hasPreviousPage: data.hasPreviousPage || false
      };

      return result;
    }
    else if (Array.isArray(data)) {
      // 🔄 Fallback: Nếu API trả về array trực tiếp

      const result = {
        items: data,
        totalPages: 1,
        totalItems: data.length,
        pageIndex: 1,
        pageSize: data.length,
        hasNextPage: false,
        hasPreviousPage: false
      };
      return result;
    }
    else if (data && typeof data === 'object' && Array.isArray(data.tours)) {
      // 🔄 Fallback: Nếu API có field 'tours' thay vì 'items'
      console.log("🔄 [fetchTours] Found data.tours, mapping...");

      const result = {
        items: data.tours,
        totalPages: data.totalPages || 1,
        totalItems: data.totalItems || data.tours.length,
        pageIndex: data.pageIndex || pageNumber,
        pageSize: data.pageSize || pageSize,
        hasNextPage: data.hasNextPage || false,
        hasPreviousPage: data.hasPreviousPage || false
      };

      return result;
    }
    else {

      throw new Error(`Unexpected API response format. Expected object with 'items' array or direct array, got: ${typeof data}`);
    }

  } catch (err) {
    console.error("❌ [fetchTours] Error details:", {
      message: err.message,
      url: url,
      params: {
        sortBy,
        isDescending,
        pageNumber,
        pageSize,
        search,
        minPrice,
        maxPrice,
        rating
      }
    });

    // Ném lỗi để component có thể handle
    throw new Error(`Failed to fetch tours: ${err.message}`);
  }
};

/**
 * Fetches popular tours from the Dashboard API
 * @param {number} top - Number of top tours to fetch (default: 10)
 * @returns {Promise<Array>} Array of popular tour objects
 */
export const getPopularTours = async (top = 10) => {
  const url = `${API_DASHBOARD}/popular-tours?top=${top}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch popular tours: ${response.statusText}`);
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching popular tours:", error);
    return [];
  }
};

export const createTourApi = async (tourData) => {
  try {
    const response = await axios.post(`${API_BASE}`, tourData);
    return response.data;
  } catch (e) {
    console.error("createTourApi Error:", e);
    throw e.response?.data || e.message;
  }
};

export const getTourGuide = async () => {
  try {
    const listResponse = await axios.get(`${API_BASE}/GetTours`);
    const tours = listResponse.data?.items || [];

    const detailedTours = await Promise.all(
      tours.map(async (tour) => {
        const detailResponse = await axios.get(`${API_BASE}/${tour.id}`);
        return detailResponse.data;
      })
    );

    return detailedTours;
  } catch (e) {
    throw e.response?.data || e.message;
  }
};

export const uploadFile = async ({
  tourId,
  guideProfileId,
  reportId,
  fileName,
  fileType,
  url,
  file,
}) => {
  try {
    const formData = new FormData();
    formData.append('UserId', '');
    formData.append('TourId', tourId);
    formData.append('GuideProfileId', guideProfileId || '');
    formData.append('ReportId', reportId || '');
    formData.append('FileName', fileName);
    formData.append('FileType', fileType);
    formData.append('URL', url);
    formData.append('File', file); // file là đối tượng File (từ input type="file")

    const response = await axios.post(`${API_FILE}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("File uploaded successfully:", formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteTourApi = async (tourId) => {
  try {
    const response = await axios.put(`${API_BASE}/UpdateDeletedTour/${tourId}`);
    return response.data;
  } catch (e) {
    console.error("deleteTourApi Error:", e);
    throw e.response?.data || e.message;
  }
};

export const updateTourApi = async (tourData) => {
  try {
    const response = await axios.put(`${API_BASE}`, tourData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (e) {
    console.error("updateTourApi Error:", e);
    throw e.response?.data || e.message;
  }
};

export const getTourById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
  } catch (e) {
    console.error("getTourById Error:", e);
    throw e.response?.data || e.message;
  }
};


export const getTourDetail = async (id) => {
  try {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tải chi tiết tour');
  }
};