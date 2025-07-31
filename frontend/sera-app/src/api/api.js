const API_BASE_URL = "http://localhost:3000";

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
    params.append("parentId", parentId);
  }

  const response = await apiCall(`/api/recommendations/${studentId}?${params}`);
  return response.data || [];
};

export const getAllEvents = async () => {
  const response = await apiCall("/api/events");
  return response.data || [];
};

export const getEventById = async (eventId) => {
  const response = await apiCall(`/api/events/${eventId}`);
  return response.data;
};
export const getUserProfile = async (userId) => {
  const response = await apiCall(`/api/users/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId, profileData) => {
  const response = await apiCall(`/api/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
  return response.data;
};

export const getCarpoolRoutes = async (eventId, userId) => {
  const response = await apiCall(`/carpool/routes/${eventId}/${userId}`);
  return response.data || null;
};

export const getOptimalCarpoolRoute = async (eventId, userId) => {
  const response = await apiCall(`/carpool/optimization/${eventId}/${userId}`);
  return response.data || null;
};

export const getCarpoolParticipants = async (eventId) => {
  const response = await apiCall(`/carpool/event/${eventId}`);
  return response.data || [];
};

export const canViewCarpoolParticipants = async (eventId) => {
  const response = await apiCall(`/carpool/event/${eventId}/can-view`);
  return response.data || false;
};

export const getCarpoolDisplayName = async (userId) => {
  const response = await apiCall(`/carpool/user/${userId}/display-name`);
  return response.data || false;
};
