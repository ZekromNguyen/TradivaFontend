import axios from "axios";

const API_BASE = "https://tradivabe.felixtien.dev/api/Tour";
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

export const createTourApi = async (tourData) => {
  try {
    // GỬI tới endpoint đúng (giả sử đúng là POST /api/Tour)
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
