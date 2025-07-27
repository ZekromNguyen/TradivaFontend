export const fetchGuides = async (params) => {
  const {
    pageNumber = 1,
    pageSize = 10,
    search = "",
    minPrice = 0,
    maxPrice = 500,
    isVerified = "",
    isAvailable = "",
    major = "",
    languages = "",
    sortBy = "id",
    isDescending = true
  } = params;

  const queryParams = new URLSearchParams({
    ...(search && { Search: search }),
    "Pagination.SortBy": sortBy,
    "Pagination.IsDescending": isDescending,
    "Pagination.PageNumber": pageNumber,
    "Pagination.PageSize": pageSize,
    ...(minPrice > 0 && { MinPrice: minPrice }),
    ...(maxPrice < 500 && { MaxPrice: maxPrice }),
    ...(isVerified !== "" && { IsVerified: isVerified }),
    ...(isAvailable !== "" && { IsAvailable: isAvailable }),
    ...(major && { Major: major }),
    ...(languages && { Languages: languages })
  });

  const response = await fetch(
    `https://tradivabe.felixtien.dev/api/Auth/getListGuide?${queryParams}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export const fetchGuideById = async (guideId) => {
  try {
    const response = await fetch(`https://tradivabe.felixtien.dev/api/Auth/getGuideById/${guideId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching guide by ID:', error);
    throw error;
  }
};