// Token storage keys
const ACCESS_TOKEN_KEY = 'gamehub_access_token';
const REFRESH_TOKEN_KEY = 'gamehub_refresh_token';

// Get access token
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// Set access token
export const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

// Get refresh token
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

// Set refresh token
export const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

// Store both tokens
export const setTokens = (accessToken, refreshToken) => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
};

// Clear all tokens
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Check if user has tokens (potentially logged in)
export const hasTokens = () => {
  return !!getAccessToken() && !!getRefreshToken();
};

// Parse JWT token to get payload (without verification)
export const parseToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token) => {
  const payload = parseToken(token);
  if (!payload || !payload.exp) return true;

  // Add 10 second buffer
  return Date.now() >= (payload.exp * 1000) - 10000;
};

// Get user ID from token
export const getUserIdFromToken = () => {
  const token = getAccessToken();
  if (!token) return null;

  const payload = parseToken(token);
  return payload?.userId || null;
};
