import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5025/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

const userAPI = {
  // Get all users with filtering and pagination
  getUsers: async (params = {}) => {
    try {
      const response = await api.get('/users', { params })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get user by ID
  getUser: async (id) => {
    try {
      const response = await api.get(`/users/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Reset user password
  resetPassword: async (id, newPassword) => {
    try {
      const response = await api.post(`/users/${id}/reset-password`, {
        newPassword
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await api.get('/users/stats/overview')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get available roles
  getRoles: async () => {
    try {
      const response = await api.get('/users/roles')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Update current user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
}

export default userAPI
