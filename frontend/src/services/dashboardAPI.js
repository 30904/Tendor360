import api from './authAPI'

// Dashboard API methods
export const dashboardAPI = {
  // Get dashboard overview data
  getOverview: async () => {
    try {
      const response = await api.get('/dashboard/overview')
      return response.data
    } catch (error) {
      // console.error('Error fetching dashboard overview:', error)
      throw error
    }
  },

  // Get dashboard statistics
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats')
      return response.data
    } catch (error) {
      // console.error('Error fetching dashboard stats:', error)
      throw error
    }
  },

  // Get recent activities
  getRecentActivities: async (limit = 10) => {
    try {
      const response = await api.get(`/dashboard/activities?limit=${limit}`)
      return response.data
    } catch (error) {
      // console.error('Error fetching recent activities:', error)
      throw error
    }
  },

  // Refresh dashboard data
  refreshDashboard: async () => {
    try {
      const [overview, stats, activities] = await Promise.all([
        api.get('/dashboard/overview'),
        api.get('/dashboard/stats'),
        api.get('/dashboard/activities')
      ])
      
      return {
        overview: overview.data,
        stats: stats.data,
        activities: activities.data
      }
    } catch (error) {
      // console.error('Error refreshing dashboard:', error)
      throw error
    }
  }
}

export default dashboardAPI
