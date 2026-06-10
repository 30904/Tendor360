const Tender = require('../models/Tender')
const Document = require('../models/Document')
const Evaluation = require('../models/Evaluation')
const { catchAsync } = require('../utils/errorHandler')

const formatMillions = (value, currency = 'USD') => {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '—'
  const symbol = currency === 'INR' ? '₹' : '$'
  return `${symbol}${(amount / 1_000_000).toFixed(1)}M`
}

const formatStatusLabel = (status) => {
  if (!status || typeof status !== 'string') return 'Unknown'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

// Get dashboard overview data
exports.getDashboardOverview = catchAsync(async (req, res) => {
  const userId = req.user._id

  // Get current date and calculate date ranges
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  // Get all company tenders for dashboard metrics
  const userTenders = await Tender.find({
    companyId: req.companyId, // Show all company tenders
    isDeleted: false
  })

  // Calculate KPIs
  const activeTenders = userTenders.filter(t => t.status === 'active').length
  const newTendersThisWeek = userTenders.filter(t => 
    t.publishedDate >= oneWeekAgo
  ).length

  // Calculate win ratio (mock calculation for now)
  const totalTenders = userTenders.length
  const wonTenders = userTenders.filter(t => t.status === 'awarded').length
  const winRatio = totalTenders > 0 ? (wonTenders / totalTenders * 100).toFixed(1) : 0

  // Get upcoming deadlines
  const upcomingDeadlines = userTenders.filter(t => 
    t.deadline >= now && t.deadline <= twoWeeksFromNow
  ).length

  // Calculate revenue pipeline
  const revenuePipeline = userTenders
    .filter(t => t.status === 'active')
    .reduce((sum, t) => sum + (t.estimatedValue || 0), 0)

  // Get active tenders with details
  const activeTendersList = await Tender.find({
    companyId: req.companyId, // Show all company tenders
    status: 'active',
    isDeleted: false
  })
  .populate('owner', 'name email')
  .populate('assignedTo', 'name email')
  .sort({ deadline: 1 })
  .limit(10)

  // Get upcoming deadlines with details
  const upcomingDeadlinesList = await Tender.find({
    companyId: req.companyId, // Show all company tenders
    deadline: { $gte: now, $lte: twoWeeksFromNow },
    isDeleted: false
  })
  .populate('owner', 'name email')
  .populate('assignedTo', 'name email')
  .sort({ deadline: 1 })
  .limit(10)

  // Calculate trends (mock data for now)
  const trends = {
    activeTenders: { value: '+12.5%', direction: 'up' },
    winRatio: { value: '+8.3%', direction: 'up' },
    upcomingDeadlines: { value: '-15.2%', direction: 'down' },
    revenuePipeline: { value: '+23.7%', direction: 'up' }
  }

  // Format data for frontend
  const kpiData = [
    {
      title: 'Active Tenders',
      value: activeTenders.toString(),
      subtitle: `${newTendersThisWeek} new this week`,
      trend: trends.activeTenders.value,
      trendDirection: trends.activeTenders.direction,
      color: 'primary',
      chartData: [4, 6, 8, 5] // Mock chart data
    },
    {
      title: 'Win Ratio',
      value: `${winRatio}%`,
      subtitle: 'Above industry avg',
      trend: trends.winRatio.value,
      trendDirection: trends.winRatio.direction,
      color: 'success',
      chartData: [7, 8, 9, 8] // Mock chart data
    },
    {
      title: 'Upcoming Deadlines',
      value: upcomingDeadlines.toString(),
      subtitle: 'Next 14 days',
      trend: trends.upcomingDeadlines.value,
      trendDirection: trends.upcomingDeadlines.direction,
      color: 'warning',
      chartData: [9, 7, 5, 3] // Mock chart data
    },
    {
      title: 'Revenue Pipeline',
      value: `$${(revenuePipeline / 1000000).toFixed(1)}M`,
      subtitle: 'Potential value',
      trend: trends.revenuePipeline.value,
      trendDirection: trends.revenuePipeline.direction,
      color: 'info',
      chartData: [6, 8, 10, 12] // Mock chart data
    }
  ]

  // Format active tenders for frontend
  const formattedActiveTenders = activeTendersList.map(tender => ({
    id: tender._id,
    name: tender.title,
    organization: tender.organization,
    deadline: tender.deadline,
    status: formatStatusLabel(tender.status),
    assignedTeam: tender.assignedTo ? tender.assignedTo.name : 'Unassigned',
    matchScore: tender.aiMatchScore || 0,
    value: formatMillions(tender.estimatedValue, tender.currency),
    region: tender.location
  }))

  // Format upcoming deadlines for frontend
  const formattedUpcomingDeadlines = upcomingDeadlinesList.map(tender => ({
    id: tender._id,
    name: tender.title,
    organization: tender.organization,
    deadline: tender.deadline,
    status: formatStatusLabel(tender.status),
    value: formatMillions(tender.estimatedValue, tender.currency),
    region: tender.location,
    isOverdue: Boolean(tender.deadline && tender.deadline < now)
  }))

  res.status(200).json({
    success: true,
    data: {
      kpiData,
      activeTenders: formattedActiveTenders,
      upcomingDeadlines: formattedUpcomingDeadlines,
      lastUpdated: new Date().toISOString()
    }
  })
})

// Get dashboard statistics
exports.getDashboardStats = catchAsync(async (req, res) => {
  const userId = req.user.id
  const now = new Date()

  // Get counts for different tender statuses
  const statusCounts = await Tender.aggregate([
    {
      $match: {
        companyId: req.companyId, // Show all company tenders
        isDeleted: false
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ])

  // Get tender value by status
  const valueByStatus = await Tender.aggregate([
    {
      $match: {
        companyId: req.companyId, // Show all company tenders
        isDeleted: false
      }
    },
    {
      $group: {
        _id: '$status',
        totalValue: { $sum: '$estimatedValue' },
        count: { $sum: 1 }
      }
    }
  ])

  // Get tenders by month for chart
  const tendersByMonth = await Tender.aggregate([
    {
      $match: {
        companyId: req.companyId, // Show all company tenders
        isDeleted: false,
        publishedDate: { $gte: new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$publishedDate' },
          month: { $month: '$publishedDate' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ])

  res.status(200).json({
    success: true,
    data: {
      statusCounts,
      valueByStatus,
      tendersByMonth
    }
  })
})

// Get recent activities
exports.getRecentActivities = catchAsync(async (req, res) => {
  const userId = req.user._id
  const limit = parseInt(req.query.limit) || 10

  // Get recent tenders
  const recentTenders = await Tender.find({
    companyId: req.companyId, // Show all company tenders
    isDeleted: false
  })
  .sort({ updatedDate: -1 })
  .limit(limit)
  .populate('owner', 'name email')
  .populate('assignedTo', 'name email')

  // Get recent documents
  const recentDocuments = await Document.find({
    'tenderRecord.tenderId': { $in: recentTenders.map(t => t._id) }
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate({
    path: 'tenderRecord.tenderId',
    select: 'title'
  })

  // Get recent evaluations
  const recentEvaluations = await Evaluation.find({
    tenderId: { $in: recentTenders.map(t => t._id) }
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('tenderId', 'title')
  .populate('evaluator', 'name email')

  res.status(200).json({
    success: true,
    data: {
      recentTenders,
      recentDocuments,
      recentEvaluations
    }
  })
})
