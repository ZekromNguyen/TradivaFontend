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
