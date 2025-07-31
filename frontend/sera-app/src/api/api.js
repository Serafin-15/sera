const API_BASE_URL = "http:/localhost:3000";

async function apiCall(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

export const getRecommendedEvents = async (studentId, parentId = null) => {
  const params = new URLSearchParams();
  if (parentId) {
    params.appemd("parentId", parentId);
  }

  const response = await apiCall(
    `/api/ranking/recommendations/${studentId}?${params}`
  );
  return response.data || [];
};

export const getAllEvents = async () => {
  const response = await apiCall("/api/events");
  return response.data || [];
};

export const getEventById = async (userId) => {
  const response = await apiCall(`/api/events/${eventId}`);
};
const getUserProfile = async (userId) => {
  const response = await apiCall(`/api/users/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId, profileData) => {
  const response = await apiCall(`/api/users/${userId}`, {
    method: "PUT",
    vody: JSON.stringify(profileData),
  });
  return response.data;
};


