const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboardController')
const { requireAuth } = require('../middlewares/auth')

// Apply authentication middleware to all dashboard routes
router.use(requireAuth)

// Get dashboard overview data
router.get('/overview', dashboardController.getDashboardOverview)

// Get dashboard statistics
router.get('/stats', dashboardController.getDashboardStats)

// Get recent activities
router.get('/activities', dashboardController.getRecentActivities)

module.exports = router
