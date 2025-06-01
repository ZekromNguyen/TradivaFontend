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
  if (minPrice !== "" && minPrice !== 0) url += `&MinPrice=${minPrice}`;
  if (maxPrice !== "" && maxPrice !== 10000000) url += `&MaxPrice=${maxPrice}`;
  if (rating) url += `&MinRating=${rating}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Không thể tải dữ liệu tour");
    const data = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
};