import React, { useState, useEffect, useMemo } from 'react'
import { Container, Row, Col, Card, Button, Badge, Breadcrumb, Alert, Spinner } from 'react-bootstrap'
import { ArrowLeft, Plus, TrendingUp, Target, RefreshCw, Layers3, BadgeDollarSign, CheckCircle2, CalendarClock } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import InsightStream from '../../components/intelligence/InsightStream'
import tenderAPI from '../../services/tenderAPI'
import './Pipeline.scss'

const Pipeline = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // State management
  const [pipeline, setPipeline] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(location.state?.success || '')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  })

  // Load tenders from API
  const loadTenders = async (page = 1, filters = {}) => {
    try {
      setLoading(true)
      setError('')
      
      const params = {
        page,
        limit: pagination.itemsPerPage,
        ...filters
      }
      
      const response = await tenderAPI.getTenders(params)
      
      if (response.success) {
        setPipeline(response.data.tenders)
        setPagination(response.data.pagination)
      } else {
        setError(response.message || 'Failed to load tenders')
      }
    } catch (err) {
      console.error('Error loading tenders:', err)
      setError(err.response?.data?.message || 'Failed to load tenders')
    } finally {
      setLoading(false)
    }
  }

  // Load tender statistics
  const loadStats = async () => {
    try {
      const response = await tenderAPI.getTenderStats()
      
      if (response.success) {
        setStats(response.data.overview)
      }
    } catch (err) {
      console.error('Error loading tender stats:', err)
    }
  }

  useEffect(() => {
    loadTenders()
    loadStats()
  }, [])

  useEffect(() => {
    if (!location.state?.success) return
    setSuccess(location.state.success)
    navigate(location.pathname, { replace: true, state: {} })
  }, [location.pathname, location.state, navigate])

  const handleViewTender = (tender) => {
    navigate(`/tender-intelligence/pipeline/${tender.id}`, { state: { tender } })
  }

  const handleCreateTender = () => {
    navigate('/tender-intelligence/pipeline/new')
  }

  const handleEditTender = (tender) => {
    navigate(`/tender-intelligence/pipeline/${tender.id}/edit`, { state: { tender } })
  }

  const handleDeleteTender = async (tender) => {
    if (window.confirm(`Are you sure you want to delete tender "${tender.title}"?`)) {
      try {
        setLoading(true)
        const response = await tenderAPI.deleteTender(tender.id)
        
        if (response.success) {
          setSuccess('Tender deleted successfully')
          loadTenders(pagination.currentPage)
          loadStats()
        } else {
          setError(response.message || 'Failed to delete tender')
        }
      } catch (err) {
        console.error('Error deleting tender:', err)
        setError(err.response?.data?.message || 'Failed to delete tender')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue)
    loadTenders(1, { search: searchValue })
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'title',
      label: 'Tender Details',
      width: '25%',
      render: (value, row) => (
        <div className="tender-info">
          <div className="fw-semibold d-flex align-items-center">
            <Target size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.description}</small>
          <div className="tender-meta">
            <small className="text-muted">Client: {row.organization}</small>
          </div>
        </div>
      )
    },
    {
      key: 'estimatedValue',
      label: 'Value',
      width: '12%',
      render: (value, row) => (
        <div className="tender-value">
          <div className="fw-bold text-primary">
            ${(value / 1000000).toFixed(1)}M
          </div>
          <small className="text-muted">{row.currency}</small>
        </div>
      )
    },
    {
      key: 'pipelineStage',
      label: 'Stage',
      width: '10%',
      render: (value) => {
        const variants = {
          'identified': 'secondary',
          'evaluating': 'warning',
          'pursuing': 'info',
          'submitted': 'primary',
          'awarded': 'success',
          'lost': 'danger'
        }
        const displayName = value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Unknown'
        return <Badge bg={variants[value] || 'secondary'}>{displayName}</Badge>
      }
    },
    {
      key: 'winProbability',
      label: 'Probability',
      width: '10%',
      render: (value) => (
        <div className="probability">
          <div className="fw-bold text-success">{value || 0}%</div>
          <small className="text-muted">success</small>
        </div>
      )
    },
    {
      key: 'aiMatchScore',
      label: 'AI Score',
      width: '10%',
      render: (value) => (
        <div className="ai-confidence">
          <div className="fw-bold text-info">{value || 0}%</div>
          <small className="text-muted">match</small>
        </div>
      )
    },
    {
      key: 'urgency',
      label: 'Urgency',
      width: '8%',
      render: (value) => {
        const variants = {
          'low': 'success',
          'medium': 'warning',
          'high': 'danger',
          'critical': 'danger'
        }
        const displayName = value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Unknown'
        return <Badge bg={variants[value] || 'secondary'}>{displayName}</Badge>
      }
    },
    {
      key: 'priority',
      label: 'Priority',
      width: '8%',
      render: (value) => {
        const variants = {
          'low': 'success',
          'medium': 'info',
          'high': 'warning',
          'critical': 'danger'
        }
        const displayName = value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Unknown'
        return <Badge bg={variants[value] || 'secondary'}>{displayName}</Badge>
      }
    },
    {
      key: 'daysUntilDeadline',
      label: 'Days Left',
      width: '10%',
      render: (value) => {
        const days = value || 0
        const color = days < 0 ? 'danger' : days <= 7 ? 'warning' : 'success'
        return (
          <div className="days-remaining">
            <div className={`fw-bold text-${color}`}>{days}</div>
            <small className="text-muted">days</small>
          </div>
        )
      }
    },
    {
      key: 'deadline',
      label: 'Deadline',
      width: '7%',
      render: (value) => {
        if (!value) return '-'
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        });
      }
    }
  ]

  const getStageBadge = (stage) => {
    const variants = {
      'Qualification': 'warning',
      'Proposal': 'primary',
      'Evaluation': 'info',
      'Awarded': 'success',
      'Lost': 'danger'
    }
    return <Badge bg={variants[stage] || 'secondary'}>{stage}</Badge>
  }

  const getRiskBadge = (risk) => {
    const variants = {
      'Low': 'success',
      'Medium': 'warning',
      'High': 'danger'
    }
    return <Badge bg={variants[risk] || 'secondary'}>{risk}</Badge>
  }

  const getPriorityBadge = (priority) => {
    const variants = {
      'Critical': 'danger',
      'High': 'warning',
      'Medium': 'primary',
      'Low': 'secondary'
    }
    return <Badge bg={variants[priority] || 'secondary'}>{priority}</Badge>
  }

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return 'success'
    if (probability >= 60) return 'primary'
    if (probability >= 40) return 'warning'
    return 'danger'
  }

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPipelineValueMetric = (amount, currency = 'USD') => {
    const value = Number(amount || 0)
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
    return formatCurrency(value, currency)
  }

  const refreshAll = async () => {
    await Promise.all([loadTenders(pagination.currentPage), loadStats()])
  }

  const insightItems = useMemo(
    () => [
      {
        title: `${stats.totalTenders || 0} tenders tracked with ${formatCurrency(stats.totalValue || 0, 'USD')} combined value`,
        detail: 'Pipeline coverage across identification, pursuit, and submission stages.',
        tone: 'info'
      },
      {
        title: `Average win probability at ${stats.avgProbability || 0}% across qualified opportunities`,
        detail:
          (stats.avgProbability || 0) >= 65
            ? 'Probability profile supports focused pursuit and bid governance.'
            : 'Review qualification for tenders below the portfolio average.',
        tone: (stats.avgProbability || 0) >= 65 ? 'success' : 'warning'
      },
      {
        title: `${stats.upcomingDeadlines || 0} submissions approaching within the planning horizon`,
        detail: 'Align calendars, pricing, and respondent teams before response gates close.',
        tone: (stats.upcomingDeadlines || 0) > 0 ? 'warning' : 'success'
      }
    ],
    [stats]
  )

  return (
    <div className="pipeline-page page-enter page-bg-gradient intel-executive-page">
      <Container fluid>
        <Row className="mb-3">
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item onClick={() => navigate('/tender-intelligence')} style={{ cursor: 'pointer' }}>
                Tender Intelligence
              </Breadcrumb.Item>
              <Breadcrumb.Item active>Pipeline</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <div className="intel-executive-page__hero mb-3">
          <div>
            <Button variant="outline-secondary" size="sm" className="mb-2" onClick={() => navigate('/tender-intelligence')}>
              <ArrowLeft size={16} className="me-2" />
              Back to modules
            </Button>
            <h1>Tender pipeline command center</h1>
            <p>Track and manage tender opportunities with AI-powered probability assessment and pursuit governance.</p>
          </div>
          <div className="intel-executive-page__hero-actions">
            <Button size="sm" variant="outline-primary" onClick={refreshAll} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <RefreshCw size={16} className="me-1" />}
              Refresh
            </Button>
            <small>Pipeline telemetry and pursuit health</small>
          </div>
        </div>

        {error ? <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert> : null}
        {success ? <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert> : null}

        <div className="intel-cinematic-hero mb-3">
          <h2 className="h4 mb-2">Pipeline intelligence outlook</h2>
          <p className="mb-0">
            {stats.totalTenders || 0} tenders are in active pursuit with {formatCurrency(stats.totalValue || 0, 'USD')} combined
            value and {stats.avgProbability || 0}% average win probability.
          </p>
          <div className="intel-cinematic-hero__chips">
            <span className="intel-chip">{stats.totalTenders || 0} active tenders</span>
            <span className="intel-chip">{formatCurrency(stats.totalValue || 0, 'USD')} pipeline value</span>
            <span className="intel-chip">{stats.upcomingDeadlines || 0} upcoming deadlines</span>
          </div>
        </div>

        <InsightStream items={insightItems} />

        <div className="intel-mission-control pipeline-kpi-strip mb-3">
          <div className="pipeline-kpi-strip__head">
            <div>
              <span className="pipeline-kpi-strip__badge">Operating metrics</span>
              <h2 className="pipeline-kpi-strip__title">Pipeline signal board</h2>
            </div>
            <small className="pipeline-kpi-strip__meta">Live pursuit health snapshot</small>
          </div>
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total tenders"
                value={stats.totalTenders || 0}
                hint="Active pipeline records"
                tone="intel"
                trend="Live"
                icon={<Layers3 size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Pipeline value"
                value={stats.totalValue || 0}
                displayValue={formatPipelineValueMetric(stats.totalValue || 0, 'USD')}
                hint={formatCurrency(stats.totalValue || 0, 'USD')}
                tone="success"
                trend="Booked value"
                icon={<BadgeDollarSign size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg probability"
                value={stats.avgProbability || 0}
                hint="Average win probability"
                tone="success"
                trend="Win outlook"
                suffix="%"
                icon={<CheckCircle2 size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Upcoming deadlines"
                value={stats.upcomingDeadlines || 0}
                hint="Submissions in planning horizon"
                tone="warning"
                trend="Review horizon"
                icon={<CalendarClock size={20} />}
              />
            </Col>
          </Row>
        </div>

        <Card className="intel-chart-card mb-3">
          <Card.Header className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div className="pipeline-toolbar-title">
              <Target size={18} className="me-2 text-primary" />
              <span>Tender pipeline ({pagination.totalItems})</span>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <Button variant="primary" onClick={handleCreateTender} disabled={loading}>
                <Plus size={16} className="me-2" />
                Add tender
              </Button>
              <Button variant="outline-secondary">
                <TrendingUp size={16} className="me-2" />
                Export report
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <DataTable
              data={pipeline}
              columns={columns}
              title={`Tender pipeline (${pagination.totalItems})`}
              searchable={true}
              sortable={true}
              exportable={true}
              pagination={true}
              pageSize={pagination.itemsPerPage}
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              showActions={true}
              showCheckboxes={false}
              onView={handleViewTender}
              onEdit={handleEditTender}
              onDelete={handleDeleteTender}
              onSearch={handleSearch}
              onPageChange={(page) => loadTenders(page)}
              customActions={[
                {
                  type: 'custom',
                  label: 'AI Analysis',
                  onClick: (row) => {
                    console.log('AI Analysis:', row)
                  }
                }
              ]}
              searchPlaceholder="Search pipeline..."
              emptyMessage="No tenders in pipeline"
              loading={loading}
            />
          </Card.Body>
        </Card>

      </Container>
    </div>
  )
}

export default Pipeline
