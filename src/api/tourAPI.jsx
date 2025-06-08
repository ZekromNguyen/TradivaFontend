import axios from "axios";

const API_BASE = "https://tradivabe.felixtien.dev/api/Tour";
const API_FILE = "https://tradivabe.felixtien.dev/api/Files";
const API_DASHBOARD = "https://tradivabe.felixtien.dev/api/Dashboard";

export const getTours = async ({
  sortBy = "Date",
  isDescending = true,
  pageNumber = 1,
  pageSize = 10
} = {}) => {
  const url = `${API_BASE}/GetTours?SortBy=${sortBy}&IsDescending=${isDescending}&PageNumber=${pageNumber}&PageSize=${pageSize}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data || [];
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
  let url = `${API_BASE}/GetTours?SortBy=${sortBy}&IsDescending=${isDescending}&PageNumber=${pageNumber}&PageSize=${pageSize}`;
  if (search) url += `&Search=${encodeURIComponent(search)}`;
  if (minPrice) url += `&MinPrice=${minPrice}`;
  if (maxPrice !== 10000000) url += `&MaxPrice=${maxPrice}`;
  if (rating) url += `&MinRating=${rating}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Không thể tải dữ liệu tour");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Lỗi fetchTours:", err);
    throw err;
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