import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Badge, Modal, Spinner } from 'react-bootstrap'
import FormDrawerModal from '../../components/FormDrawerModal'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { showToast, handleApiResponse, handleApiError } from '../../utils/toast'
import { dummyCompetitorForm } from '../../utils/testFormDummies'
import {
  Users,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  Award,
  RefreshCw
} from 'lucide-react'
import DataTable from '../../components/DataTable'
import competitorAPI from '../../services/competitorAPI'
import './Competitors.scss'

const Competitors = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector(state => state.auth)
  
  // State management
  const [competitors, setCompetitors] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [selectedCompetitor, setSelectedCompetitor] = useState(null)
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  })
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    industry: '',
    size: 'Unknown',
    location: {
      country: '',
      region: '',
      city: ''
    },
    contactInfo: {
      email: '',
      phone: '',
      address: ''
    },
    financialInfo: {
      revenue: '',
      currency: 'USD',
      employees: '',
      foundedYear: ''
    },
    capabilities: [],
    marketPosition: 'Unknown',
    threatLevel: 'Medium',
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
    tags: []
  })
  
  const [formErrors, setFormErrors] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [newCapability, setNewCapability] = useState({ category: '', description: '', strength: 'Unknown' })
  const [newTag, setNewTag] = useState('')
  const [newStrength, setNewStrength] = useState('')
  const [newWeakness, setNewWeakness] = useState('')
  const [newOpportunity, setNewOpportunity] = useState('')
  const [newThreat, setNewThreat] = useState('')

  const prevShowFormModal = React.useRef(false)

  useEffect(() => {
    if (prevShowFormModal.current && !showFormModal && location.pathname.endsWith('/new')) {
      navigate('/tender-intelligence/competitors', { replace: true })
    }
    prevShowFormModal.current = showFormModal
  }, [showFormModal, location.pathname, navigate])

  // Load competitors from API
  const loadCompetitors = async (page = 1, filters = {}) => {
    try {
      setLoading(true)
      
      const params = {
        page,
        limit: pagination.itemsPerPage,
        ...filters
      }
      
      const response = await competitorAPI.getCompetitors(params)
      
      if (response.success) {
        setCompetitors(response.data.competitors)
        setPagination(response.data.pagination)
      } else {
        showToast.error(response.message || 'Failed to load competitors')
      }
    } catch (err) {
      handleApiError(err, 'Failed to load competitors')
    } finally {
      setLoading(false)
    }
  }

  // Load statistics
  const loadStats = async () => {
    try {
      const response = await competitorAPI.getCompetitorStats()
      
      if (response.success) {
        setStats(response.data.overview)
      }
    } catch (err) {
      handleApiError(err, 'Failed to load statistics')
    }
  }

  // Check if user has permission
  const hasPermission = (permission) => {
    if (!user) return false
    
    // Admin users have all permissions
    const adminRoles = ['ADMIN', 'SYSTEM ADMINISTRATOR', 'System Administrator', 'Administrator']
    if (user.roles && user.roles.some(role => adminRoles.includes(role))) {
      return true
    }
    
    // Check specific permissions for other roles
    const requiredRoles = ['TENDER MANAGER', 'SYSTEM ADMINISTRATOR']
    return user.roles && user.roles.some(role => requiredRoles.includes(role))
  }

  const refreshAll = async () => {
    await Promise.all([loadCompetitors(pagination.currentPage), loadStats()])
  }

  useEffect(() => {
    refreshAll()
  }, [])

  const insightItems = useMemo(() => {
    const highThreat =
      (stats.threatLevelStats?.High || 0) + (stats.threatLevelStats?.Critical || 0)
    const leaderCount = stats.marketPositionStats?.Leader || 0
    const topIndustry =
      stats.industryStats?.[0]?._id != null && stats.industryStats[0]._id !== ''
        ? `${stats.industryStats[0]._id} (${stats.industryStats[0].count})`
        : 'Industry mix emerging'

    return [
      {
        title: `${stats.totalCompetitors || 0} competitor profiles linked to ${stats.totalTenders || 0} tender observations`,
        detail: `${highThreat} high or critical threat profiles deserve executive review before the next pursuit cycle.`,
        tone: highThreat > 0 ? 'warning' : 'info'
      },
      {
        title: `Portfolio average win rate ${stats.avgWinRate || 0}%`,
        detail: 'Benchmark rival performance where tender outcomes are recorded.',
        tone: (stats.avgWinRate || 0) >= 40 ? 'success' : 'primary'
      },
      {
        title: `${leaderCount} market leaders flagged — top industry: ${topIndustry}`,
        detail: 'Sharpen differentiation where concentration overlaps your core trades.',
        tone: 'info'
      }
    ]
  }, [stats])

  const handleViewCompetitor = (competitor) => {
    setSelectedCompetitor(competitor)
    setShowModal(true)
  }

  const handleCreateCompetitor = () => {
    setFormData({
      name: '',
      description: '',
      website: '',
      industry: '',
      size: 'Unknown',
      location: { country: '', region: '', city: '' },
      contactInfo: { email: '', phone: '', address: '' },
      financialInfo: { revenue: '', currency: 'USD', employees: '', foundedYear: '' },
      capabilities: [],
      marketPosition: 'Unknown',
      threatLevel: 'Medium',
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
      tags: []
    })
    setIsEditing(false)
    setSelectedCompetitor(null)
    setFormErrors({})
    setShowFormModal(true)
  }

  useEffect(() => {
    if (location.pathname.endsWith('/new')) {
      handleCreateCompetitor()
    }
  }, [location.pathname])

  const handleEditCompetitor = (competitor) => {
    setFormData({
      name: competitor.name || '',
      description: competitor.description || '',
      website: competitor.website || '',
      industry: competitor.industry || '',
      size: competitor.size || 'Unknown',
      location: competitor.location || { country: '', region: '', city: '' },
      contactInfo: competitor.contactInfo || { email: '', phone: '', address: '' },
      financialInfo: competitor.financialInfo || { revenue: '', currency: 'USD', employees: '', foundedYear: '' },
      capabilities: competitor.capabilities || [],
      marketPosition: competitor.marketPosition || 'Unknown',
      threatLevel: competitor.threatLevel || 'Medium',
      strengths: competitor.strengths || [],
      weaknesses: competitor.weaknesses || [],
      opportunities: competitor.opportunities || [],
      threats: competitor.threats || [],
      tags: competitor.tags || []
    })
    setIsEditing(true)
    setSelectedCompetitor(competitor)
    setFormErrors({})
    setShowFormModal(true)
  }

  const handleDeleteCompetitor = async (competitor) => {
    if (window.confirm(`Are you sure you want to delete competitor "${competitor.name}"?`)) {
      try {
        setLoading(true)
        const response = await competitorAPI.deleteCompetitor(competitor.id)
        
        if (handleApiResponse(response, 'Competitor deleted successfully', 'Failed to delete competitor')) {
          loadCompetitors(pagination.currentPage)
          loadStats()
        }
      } catch (err) {
        handleApiError(err, 'Failed to delete competitor')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    
    // Basic validation
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Competitor name is required'
    if (!formData.industry.trim()) errors.industry = 'Industry is required'
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      setLoading(true)
      
      let response
      if (isEditing) {
        response = await competitorAPI.updateCompetitor(selectedCompetitor.id, formData)
      } else {
        response = await competitorAPI.createCompetitor(formData)
      }
      
      const successMessage = isEditing ? 'Competitor updated successfully' : 'Competitor created successfully'
      const errorMessage = `Failed to ${isEditing ? 'update' : 'create'} competitor`
      
      if (handleApiResponse(response, successMessage, errorMessage)) {
        setShowFormModal(false)
        loadCompetitors(pagination.currentPage)
        loadStats()
      }
    } catch (err) {
      handleApiError(err, `Failed to ${isEditing ? 'update' : 'create'} competitor`)
    } finally {
      setLoading(false)
    }
  }

  // Helper functions for form management
  const addCapability = () => {
    if (newCapability.category.trim()) {
      setFormData(prev => ({
        ...prev,
        capabilities: [...prev.capabilities, { ...newCapability }]
      }))
      setNewCapability({ category: '', description: '', strength: 'Unknown' })
    }
  }

  const removeCapability = (index) => {
    setFormData(prev => ({
      ...prev,
      capabilities: prev.capabilities.filter((_, i) => i !== index)
    }))
  }

  const addTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }

  const addStrength = () => {
    if (newStrength.trim()) {
      setFormData(prev => ({
        ...prev,
        strengths: [...prev.strengths, newStrength.trim()]
      }))
      setNewStrength('')
    }
  }

  const removeStrength = (index) => {
    setFormData(prev => ({
      ...prev,
      strengths: prev.strengths.filter((_, i) => i !== index)
    }))
  }

  const addWeakness = () => {
    if (newWeakness.trim()) {
      setFormData(prev => ({
        ...prev,
        weaknesses: [...prev.weaknesses, newWeakness.trim()]
      }))
      setNewWeakness('')
    }
  }

  const removeWeakness = (index) => {
    setFormData(prev => ({
      ...prev,
      weaknesses: prev.weaknesses.filter((_, i) => i !== index)
    }))
  }

  const addOpportunity = () => {
    if (newOpportunity.trim()) {
      setFormData(prev => ({
        ...prev,
        opportunities: [...prev.opportunities, newOpportunity.trim()]
      }))
      setNewOpportunity('')
    }
  }

  const removeOpportunity = (index) => {
    setFormData(prev => ({
      ...prev,
      opportunities: prev.opportunities.filter((_, i) => i !== index)
    }))
  }

  const addThreat = () => {
    if (newThreat.trim()) {
      setFormData(prev => ({
        ...prev,
        threats: [...prev.threats, newThreat.trim()]
      }))
      setNewThreat('')
    }
  }

  const removeThreat = (index) => {
    setFormData(prev => ({
      ...prev,
      threats: prev.threats.filter((_, i) => i !== index)
    }))
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'name',
      label: 'Competitor',
      sortable: true,
      render: (competitor) => (
        <div>
          <div className="fw-medium">{competitor.name}</div>
          <small className="text-muted">{competitor.industry}</small>
        </div>
      )
    },
    {
      key: 'threatLevel',
      label: 'Threat Level',
      sortable: true,
      render: (competitor) => {
        const variants = {
          'Low': 'success',
          'Medium': 'warning',
          'High': 'danger',
          'Critical': 'dark'
        }
        return <Badge bg={variants[competitor.threatLevel] || 'secondary'}>{competitor.threatLevel}</Badge>
      }
    },
    {
      key: 'marketPosition',
      label: 'Market Position',
      sortable: true,
      render: (competitor) => {
        const variants = {
          'Leader': 'primary',
          'Challenger': 'warning',
          'Follower': 'info',
          'Niche': 'secondary',
          'Unknown': 'light'
        }
        return <Badge bg={variants[competitor.marketPosition] || 'secondary'}>{competitor.marketPosition}</Badge>
      }
    },
    {
      key: 'winRate',
      label: 'Win Rate',
      sortable: true,
      render: (competitor) => (
        <div>
          <div className="fw-medium">{competitor.winRate || 0}%</div>
          <small className="text-muted">{competitor.totalTenders || 0} tenders</small>
        </div>
      )
    },
    {
      key: 'size',
      label: 'Size',
      sortable: true,
      render: (competitor) => competitor.size || 'Unknown'
    },
    {
      key: 'location',
      label: 'Location',
      render: (competitor) => (
        <div>
          {competitor.location?.country && <div>{competitor.location.country}</div>}
          {competitor.location?.region && <small className="text-muted">{competitor.location.region}</small>}
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (competitor) => new Date(competitor.createdAt).toLocaleDateString()
    }
  ]

  return (
    <>
      <ExecutiveCommandCenter
        className="competitors-page"
        showSkeleton={loading && !competitors.length}
        breadcrumbs={[
          {
            label: 'Tender Intelligence',
            onClick: () => navigate('/tender-intelligence')
          },
          { label: 'Competitors', active: true }
        ]}
        onBack={() => navigate('/tender-intelligence')}
        title="Competitor intelligence command center"
        description="Manage and analyze your competitive landscape with comprehensive competitor profiles and win/loss analysis."
        heroActions={(
          <Button size="sm" variant="outline-primary" onClick={refreshAll} disabled={loading}>
            {loading ? (
              <Spinner animation="border" size="sm" className="me-2" />
            ) : (
              <RefreshCw size={16} className="me-1" />
            )}
            Refresh
          </Button>
        )}
        heroMeta={
          !hasPermission()
            ? 'Access limited: TENDER MANAGER or ADMIN role required to create or edit competitors.'
            : 'Competitive intelligence telemetry'
        }
        outlookTitle="Market rivalry outlook"
        outlookDescription={`${stats.totalCompetitors || 0} competitors are modeled with ${stats.totalTenders || 0} tender observations and ${stats.avgWinRate || 0}% average win rate.`}
        outlookChips={[
          `${stats.totalCompetitors || 0} competitors`,
          `${(stats.threatLevelStats?.High || 0) + (stats.threatLevelStats?.Critical || 0)} high threat`,
          `${stats.avgWinRate || 0}% avg win rate`,
          `${stats.totalTenders || 0} tenders tracked`
        ]}
        insights={insightItems}
        kpiTitle="Competitor signal board"
        kpiMeta="Threat concentration and tender performance"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total competitors"
                value={stats.totalCompetitors || 0}
                hint="Active profiles in registry"
                tone="intel"
                trend="Registry"
                icon={<Users size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="High threat"
                value={(stats.threatLevelStats?.High || 0) + (stats.threatLevelStats?.Critical || 0)}
                hint="High + critical threat levels"
                tone="warning"
                trend="Risk"
                icon={<AlertTriangle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg win rate"
                value={stats.avgWinRate || 0}
                hint="Across competitors with tender history"
                tone={(stats.avgWinRate || 0) >= 40 ? 'success' : 'primary'}
                trend="Performance"
                suffix="%"
                icon={<TrendingUp size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Tenders tracked"
                value={stats.totalTenders || 0}
                hint="Summed tender volume"
                tone="success"
                trend="Coverage"
                icon={<Award size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Competitors (${pagination.totalItems})`}
        tableActions={(
          <div className="d-flex flex-wrap gap-2">
            <Button variant="primary" onClick={handleCreateCompetitor} disabled={loading || !hasPermission()}>
              <Plus size={16} className="me-2" />
              New Competitor
            </Button>
            <Button variant="outline-primary" as={Link} to="/tender-intelligence/competitors/new" disabled={loading || !hasPermission()}>
              Full-page create
            </Button>
          </div>
        )}
      >
        <DataTable
          data={competitors}
          columns={columns}
          title={`Competitors (${pagination.totalItems})`}
          searchable
          sortable
          exportable
          pagination
          pageSize={pagination.itemsPerPage}
          showActions
          showCheckboxes={false}
          onView={handleViewCompetitor}
          onEdit={handleEditCompetitor}
          onDelete={handleDeleteCompetitor}
          searchPlaceholder="Search competitors..."
          emptyMessage="No competitors found"
          loading={loading}
        />
      </ExecutiveCommandCenter>

      {/* View Competitor Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>
              <Users size={20} className="me-2" />
              {selectedCompetitor?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedCompetitor && (
              <div>
                <Row className="mb-4">
                  <Col md={6}>
                    <h6>Basic Information</h6>
                    <p><strong>Industry:</strong> {selectedCompetitor.industry}</p>
                    <p><strong>Size:</strong> {selectedCompetitor.size}</p>
                    <p><strong>Market Position:</strong> 
                      <Badge bg="primary" className="ms-2">{selectedCompetitor.marketPosition}</Badge>
                    </p>
                    <p><strong>Threat Level:</strong> 
                      <Badge bg="danger" className="ms-2">{selectedCompetitor.threatLevel}</Badge>
                    </p>
                  </Col>
                  <Col md={6}>
                    <h6>Performance Metrics</h6>
                    <p><strong>Win Rate:</strong> {selectedCompetitor.winRate || 0}%</p>
                    <p><strong>Total Tenders:</strong> {selectedCompetitor.totalTenders || 0}</p>
                    <p><strong>Won Tenders:</strong> {selectedCompetitor.wonTenders || 0}</p>
                    <p><strong>Lost Tenders:</strong> {selectedCompetitor.lostTenders || 0}</p>
                  </Col>
                </Row>
                
                {selectedCompetitor.description && (
                  <div className="mb-4">
                    <h6>Description</h6>
                    <p>{selectedCompetitor.description}</p>
                  </div>
                )}

                {selectedCompetitor.location && (
                  <div className="mb-4">
                    <h6>Location</h6>
                    <p>
                      {selectedCompetitor.location.city && `${selectedCompetitor.location.city}, `}
                      {selectedCompetitor.location.region && `${selectedCompetitor.location.region}, `}
                      {selectedCompetitor.location.country}
                    </p>
                  </div>
                )}

                {selectedCompetitor.strengths && selectedCompetitor.strengths.length > 0 && (
                  <div className="mb-4">
                    <h6>Strengths</h6>
                    <ul>
                      {selectedCompetitor.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedCompetitor.weaknesses && selectedCompetitor.weaknesses.length > 0 && (
                  <div className="mb-4">
                    <h6>Weaknesses</h6>
                    <ul>
                      {selectedCompetitor.weaknesses.map((weakness, index) => (
                        <li key={index}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => {
              setShowModal(false)
              handleEditCompetitor(selectedCompetitor)
            }}>
              <Edit size={16} className="me-2" />
              Edit Competitor
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Add/Edit Competitor Form Modal */}
        <FormDrawerModal
          show={showFormModal}
          onHide={() => setShowFormModal(false)}
          onTestFill={showFormModal ? () => setFormData(dummyCompetitorForm()) : undefined}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <Users size={20} className="me-2" />
              {isEditing ? 'Edit Competitor' : 'Create New Competitor'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmitForm}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Competitor Name *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter competitor name"
                      isInvalid={!!formErrors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Industry *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.industry}
                      onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                      placeholder="Enter industry"
                      isInvalid={!!formErrors.industry}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.industry}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter competitor description"
                />
              </Form.Group>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Size</Form.Label>
                    <Form.Select
                      value={formData.size}
                      onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                    >
                      <option value="Unknown">Unknown</option>
                      <option value="Startup">Startup</option>
                      <option value="Small">Small</option>
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                      <option value="Enterprise">Enterprise</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Market Position</Form.Label>
                    <Form.Select
                      value={formData.marketPosition}
                      onChange={(e) => setFormData(prev => ({ ...prev, marketPosition: e.target.value }))}
                    >
                      <option value="Unknown">Unknown</option>
                      <option value="Leader">Leader</option>
                      <option value="Challenger">Challenger</option>
                      <option value="Follower">Follower</option>
                      <option value="Niche">Niche</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Threat Level</Form.Label>
                    <Form.Select
                      value={formData.threatLevel}
                      onChange={(e) => setFormData(prev => ({ ...prev, threatLevel: e.target.value }))}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://example.com"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.location.country}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, country: e.target.value }
                      }))}
                      placeholder="Enter country"
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Strengths */}
              <Form.Group className="mb-3">
                <Form.Label>Strengths</Form.Label>
                <div className="d-flex mb-2">
                  <Form.Control
                    type="text"
                    value={newStrength}
                    onChange={(e) => setNewStrength(e.target.value)}
                    placeholder="Add strength"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStrength())}
                  />
                  <Button variant="outline-primary" onClick={addStrength} className="ms-2">
                    Add
                  </Button>
                </div>
                {formData.strengths.map((strength, index) => (
                  <Badge key={index} bg="success" className="me-2 mb-1">
                    {strength}
                    <Button
                      variant="link"
                      size="sm"
                      className="text-white p-0 ms-1"
                      onClick={() => removeStrength(index)}
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
              </Form.Group>

              {/* Weaknesses */}
              <Form.Group className="mb-3">
                <Form.Label>Weaknesses</Form.Label>
                <div className="d-flex mb-2">
                  <Form.Control
                    type="text"
                    value={newWeakness}
                    onChange={(e) => setNewWeakness(e.target.value)}
                    placeholder="Add weakness"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addWeakness())}
                  />
                  <Button variant="outline-primary" onClick={addWeakness} className="ms-2">
                    Add
                  </Button>
                </div>
                {formData.weaknesses.map((weakness, index) => (
                  <Badge key={index} bg="danger" className="me-2 mb-1">
                    {weakness}
                    <Button
                      variant="link"
                      size="sm"
                      className="text-white p-0 ms-1"
                      onClick={() => removeWeakness(index)}
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
              </Form.Group>

              {/* Tags */}
              <Form.Group className="mb-3">
                <Form.Label>Tags</Form.Label>
                <div className="d-flex mb-2">
                  <Form.Control
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button variant="outline-primary" onClick={addTag} className="ms-2">
                    Add
                  </Button>
                </div>
                {formData.tags.map((tag, index) => (
                  <Badge key={index} bg="secondary" className="me-2 mb-1">
                    {tag}
                    <Button
                      variant="link"
                      size="sm"
                      className="text-white p-0 ms-1"
                      onClick={() => removeTag(index)}
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowFormModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading && <Spinner size="sm" className="me-2" />}
                {isEditing ? 'Update Competitor' : 'Create Competitor'}
              </Button>
            </Modal.Footer>
          </Form>
        </FormDrawerModal>
    </>
  )
}

export default Competitors
