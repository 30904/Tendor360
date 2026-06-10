import axios from 'axios'

// Create axios instance
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5025/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    
    const originalRequest = error.config
    const requestUrl = String(originalRequest?.url || '')
    const isAuthEndpoint =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/register-respondent') ||
      requestUrl.includes('/auth/forgot-password') ||
      requestUrl.includes('/auth/reset-password')

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      // console.log('🔄 Frontend: Attempting token refresh...');
      originalRequest._retry = true
      
      try {
        // Try to refresh token
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          withCredentials: true
        })
        
        const { accessToken } = refreshResponse.data.data
        localStorage.setItem('accessToken', accessToken)
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
        
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

// Auth API methods
export const authAPI = {
  // Login user
  login: (credentials) => {
    // console.log('Making login request to:', '/auth/login', 'with credentials:', credentials)
    return api.post('/auth/login', credentials)
  },
  
  // Register user
  register: (userData) => api.post('/auth/register', userData),

  /** Participant onboarding — creates supplier Company + User */
  registerRespondent: (body) => api.post('/auth/register-respondent', body),
  
  // Refresh token
  refreshToken: () => api.post('/auth/refresh'),
  
  // Logout user
  logout: () => api.post('/auth/logout'),
  
  // Get user profile
  getProfile: () => api.get('/auth/profile'),
  
  // Update user profile
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  
  // Forgot password
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  
  // Reset password
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password })
}

export default api
