import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  clearTokens,
  isTokenExpired
} from './tokenStorage';

const API_BASE_URL = '/api';

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshPromise = null;

// Refresh the access token
const refreshAccessToken = async () => {
  if (isRefreshing) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch (err) {
      clearTokens();
      throw err;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// Main API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get current access token
  let accessToken = getAccessToken();

  // Check if token needs refresh
  if (accessToken && isTokenExpired(accessToken)) {
    try {
      accessToken = await refreshAccessToken();
    } catch (err) {
      // Token refresh failed, clear tokens
      clearTokens();
      throw new Error('Session expired');
    }
  }

  // Build headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // Make request
  const response = await fetch(url, {
    ...options,
    headers
  });

  // Handle 401 - try to refresh token once
  if (response.status === 401) {
    const errorData = await response.json().catch(() => ({}));

    if (errorData.code === 'TOKEN_EXPIRED' && !options._retried) {
      try {
        accessToken = await refreshAccessToken();

        // Retry the original request
        return apiRequest(endpoint, {
          ...options,
          _retried: true,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`
          }
        });
      } catch (err) {
        clearTokens();
        throw new Error('Session expired');
      }
    }

    throw new Error(errorData.error || 'Unauthorized');
  }

  // Parse response
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }

  return data;
};

// API methods
export const api = {
  // Auth
  register: (name, email, password) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    }),

  login: (email, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  logout: (refreshToken) =>
    apiRequest('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    }),

  // Users
  getMe: () => apiRequest('/users/me'),

  updateMe: (updates) =>
    apiRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),

  updateSettings: (settings) =>
    apiRequest('/users/me/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    }),

  getMyGameHistory: (page = 1, limit = 20) =>
    apiRequest(`/users/me/game-history?page=${page}&limit=${limit}`),

  getUserProfile: (userId) =>
    apiRequest(`/users/${userId}/profile`),

  searchUsers: (query) =>
    apiRequest(`/users/search?q=${encodeURIComponent(query)}`),

  // Friends
  getFriends: () => apiRequest('/friends'),

  getPendingRequests: () => apiRequest('/friends/pending'),

  sendFriendRequest: (userId) =>
    apiRequest(`/friends/request/${userId}`, { method: 'POST' }),

  acceptFriendRequest: (requestId) =>
    apiRequest(`/friends/accept/${requestId}`, { method: 'POST' }),

  rejectFriendRequest: (requestId) =>
    apiRequest(`/friends/reject/${requestId}`, { method: 'POST' }),

  removeFriend: (friendId) =>
    apiRequest(`/friends/${friendId}`, { method: 'DELETE' }),

  blockUser: (userId) =>
    apiRequest(`/friends/block/${userId}`, { method: 'POST' })
};

export default api;
