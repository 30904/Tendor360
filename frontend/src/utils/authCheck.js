// Authentication utility functions

export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  return !!token;
};

export const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

export const clearAuthTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const redirectToLogin = () => {
  clearAuthTokens();
  window.location.href = '/login';
};

export const checkAuthAndRedirect = () => {
  if (!isAuthenticated()) {
    redirectToLogin();
    return false;
  }
  return true;
};

// API response handler for authentication errors
export const handleAuthError = (error) => {
  if (error.response?.status === 401) {
    console.warn('Authentication failed, redirecting to login');
    redirectToLogin();
    return true; // Indicates auth error was handled
  }
  return false; // No auth error
};
