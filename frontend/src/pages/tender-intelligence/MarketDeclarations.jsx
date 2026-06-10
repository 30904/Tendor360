import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Container, Row, Col, Card, Button, Form, Badge, Modal, Breadcrumb, Spinner, Alert } from 'react-bootstrap'
import FormDrawerModal from '../../components/FormDrawerModal'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import InsightStream from '../../components/intelligence/InsightStream'
import { ArrowLeft, Plus, Edit, Eye, Shield, Award, Users, Clock, RefreshCw } from 'lucide-react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { showToast, handleApiResponse, handleApiError } from '../../utils/toast'
import DataTable from '../../components/DataTable'
import regulatoryComplianceAPI from '../../services/regulatoryComplianceAPI'
import {
  dummyMarketCertificateForm,
  dummyMarketDeclarationForm,
  dummyMarketVendorForm
} from '../../utils/testFormDummies'
import './MarketDeclarations.scss'

const MarketDeclarations = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector(state => state.auth)
  
  // State management
  const [activeTab, setActiveTab] = useState('declarations')
  const [declarations, setDeclarations] = useState([])
  const [certificates, setCertificates] = useState([])
  const [vendors, setVendors] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  })
  
  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  
  // Form states
  const [declarationForm, setDeclarationForm] = useState({
    title: '',
    description: '',
    type: 'Regulatory Declaration',
    category: 'Regulatory',
    priority: 'Medium',
    jurisdiction: '',
    regulatoryBody: '',
    expiryDate: '',
    complianceRequirements: [],
    stakeholders: [],
    tags: []
  })
  
  const [certificateForm, setCertificateForm] = useState({
    certificateNumber: '',
    name: '',
    description: '',
    type: 'ISO 9001',
    category: 'Quality Management',
    issuingBody: '',
    scope: '',
    issueDate: '',
    expiryDate: '',
    renewalRequired: true,
    renewalFrequency: 'Annually',
    cost: { amount: '', currency: 'USD' },
    requirements: [],
    tags: []
  })
  
  const [vendorForm, setVendorForm] = useState({
    vendorId: '',
    companyName: '',
    legalName: '',
    businessType: 'Corporation',
    industry: '',
    category: 'Goods Supplier',
    contactInformation: {
      primaryContact: { name: '', title: '', email: '', phone: '' },
      address: { street: '', city: '', state: '', postalCode: '', country: '' }
    },
    businessInformation: {
      registrationNumber: '',
      taxId: '',
      website: '',
      establishedYear: '',
      numberOfEmployees: { min: '', max: '' }
    },
    capabilities: [],
    complianceRequirements: [],
    tags: []
  })
  
  const [formErrors, setFormErrors] = useState({})

  const prevShowFormModal = useRef(false)

  useEffect(() => {
    if (prevShowFormModal.current && !showFormModal && location.pathname.endsWith('/new')) {
      navigate('/tender-intelligence/market-declarations', { replace: true })
    }
    prevShowFormModal.current = showFormModal
  }, [showFormModal, location.pathname, navigate])

  // Load data functions
  const mapRowId = (row) => ({ ...row, id: row._id || row.id })

  const getRecordId = (item) => item?.id || item?._id

  const formatDateInput = (value) => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return date.toISOString().slice(0, 10)
  }

  const loadDeclarations = async (page = 1, filters = {}) => {
    try {
      setLoading(true)
      const params = { page, limit: pagination.itemsPerPage, ...filters }
      const response = await regulatoryComplianceAPI.getDeclarations(params)
      
      if (response.success) {
        setDeclarations((response.data.declarations || []).map(mapRowId))
        setPagination(response.data.pagination)
      } else {
        showToast.error(response.message || 'Failed to load declarations')
      }
    } catch (err) {
      handleApiError(err, 'Failed to load declarations')
    } finally {
      setLoading(false)
    }
  }

  const loadCertificates = async (page = 1, filters = {}) => {
    try {
      setLoading(true)
      const params = { page, limit: pagination.itemsPerPage, ...filters }
      const response = await regulatoryComplianceAPI.getCertificates(params)
      
      if (response.success) {
        setCertificates((response.data.certificates || []).map(mapRowId))
        setPagination(response.data.pagination)
      } else {
        showToast.error(response.message || 'Failed to load certificates')
      }
    } catch (err) {
      handleApiError(err, 'Failed to load certificates')
    } finally {
      setLoading(false)
    }
  }

  const loadVendors = async (page = 1, filters = {}) => {
    try {
      setLoading(true)
      const params = { page, limit: pagination.itemsPerPage, ...filters }
      const response = await regulatoryComplianceAPI.getVendors(params)
      
      if (response.success) {
        setVendors((response.data.vendors || []).map(mapRowId))
        setPagination(response.data.pagination)
      } else {
        showToast.error(response.message || 'Failed to load vendors')
      }
    } catch (err) {
      handleApiError(err, 'Failed to load vendors')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await regulatoryComplianceAPI.getStats()
      if (response.success) {
        setStats(response.data.overview)
      }
    } catch (err) {
      handleApiError(err, 'Failed to load statistics')
    }
  }

  // Check permissions
  const hasPermission = () => {
    if (!user) return false
    const adminRoles = ['ADMIN', 'SYSTEM ADMINISTRATOR', 'System Administrator', 'Administrator']
    if (user.roles && user.roles.some(role => adminRoles.includes(role))) {
      return true
    }
    const requiredRoles = ['TENDER MANAGER', 'SYSTEM ADMINISTRATOR']
    return user.roles && user.roles.some(role => requiredRoles.includes(role))
  }

  const refreshAll = async () => {
    await loadStats()
    if (activeTab === 'declarations') {
      await loadDeclarations(pagination.currentPage)
    } else if (activeTab === 'certificates') {
      await loadCertificates(pagination.currentPage)
    } else {
      await loadVendors(pagination.currentPage)
    }
  }

  const insightItems = useMemo(() => {
    const items = []
    const declarationTotal = stats.declarations?.totalDeclarations || 0
    const certificateTotal = stats.certificates?.totalCertificates || 0
    const vendorTotal = stats.vendors?.totalVendors || 0
    const expiringSoon = stats.totalExpiringSoon || 0

    if (expiringSoon > 0) {
      items.push({
        title: `${expiringSoon} compliance record${expiringSoon === 1 ? '' : 's'} expiring within 30 days`,
        detail: 'Prioritize renewals for declarations, certificates, and vendor pre-qualification windows.',
        tone: 'warning',
      })
    }

    if (declarationTotal > 0) {
      items.push({
        title: `${declarationTotal} regulatory declaration${declarationTotal === 1 ? '' : 's'} on file`,
        detail: 'Track jurisdiction coverage, approval status, and renewal obligations in one registry.',
        tone: 'info',
      })
    }

    if (certificateTotal > 0) {
      items.push({
        title: `${certificateTotal} certificate${certificateTotal === 1 ? '' : 's'} under active monitoring`,
        detail: 'ISO, CE, UL, and FDA credentials should stay aligned with pursuit eligibility.',
        tone: 'success',
      })
    }

    if (vendorTotal > 0) {
      items.push({
        title: `${vendorTotal} pre-qualified vendor${vendorTotal === 1 ? '' : 's'} in registry`,
        detail: 'Review sanctions, export control, and conflict-of-interest attestations before award.',
        tone: 'primary',
      })
    }

    if (!items.length) {
      items.push({
        title: 'Compliance registry is ready for your first records',
        detail: 'Add declarations, certificates, and vendor attestations to activate monitoring and expiry alerts.',
        tone: 'info',
      })
    }

    return items.slice(0, 4)
  }, [stats])

  useEffect(() => {
    loadStats()
    if (activeTab === 'declarations') loadDeclarations()
    else if (activeTab === 'certificates') loadCertificates()
    else if (activeTab === 'vendors') loadVendors()
  }, [activeTab])

  // Handler functions
  const handleViewItem = (item) => {
    setSelectedItem(item)
    setShowModal(true)
  }

  const handleCreateItem = () => {
    if (activeTab === 'declarations') {
      setDeclarationForm({
        title: '',
        description: '',
        type: 'Regulatory Declaration',
        category: 'Regulatory',
        priority: 'Medium',
        jurisdiction: '',
        regulatoryBody: '',
        expiryDate: '',
        complianceRequirements: [],
        stakeholders: [],
        tags: []
      })
    } else if (activeTab === 'certificates') {
      setCertificateForm({
        certificateNumber: '',
        name: '',
        description: '',
        type: 'ISO 9001',
        category: 'Quality Management',
        issuingBody: '',
        scope: '',
        issueDate: '',
        expiryDate: '',
        renewalRequired: true,
        renewalFrequency: 'Annually',
        cost: { amount: '', currency: 'USD' },
        requirements: [],
        tags: []
      })
    } else if (activeTab === 'vendors') {
      setVendorForm({
        vendorId: '',
        companyName: '',
        legalName: '',
        businessType: 'Corporation',
        industry: '',
        category: 'Goods Supplier',
        contactInformation: {
          primaryContact: { name: '', title: '', email: '', phone: '' },
          address: { street: '', city: '', state: '', postalCode: '', country: '' }
        },
        businessInformation: {
          registrationNumber: '',
          taxId: '',
          website: '',
          establishedYear: '',
          numberOfEmployees: { min: '', max: '' }
        },
        capabilities: [],
        complianceRequirements: [],
        tags: []
      })
    }
    setIsEditing(false)
    setSelectedItem(null)
    setFormErrors({})
    setShowFormModal(true)
  }

  useEffect(() => {
    if (location.pathname.endsWith('/new')) {
      handleCreateItem()
    }
  }, [location.pathname])

  const handleEditItem = (item) => {
    setSelectedItem(item)
    setIsEditing(true)
    setFormErrors({})

    if (activeTab === 'declarations') {
      setDeclarationForm({
        title: item.title || '',
        description: item.description || '',
        type: item.type || 'Regulatory Declaration',
        category: item.category || 'Regulatory',
        priority: item.priority || 'Medium',
        jurisdiction: item.jurisdiction || '',
        regulatoryBody: item.regulatoryBody || '',
        expiryDate: formatDateInput(item.expiryDate),
        complianceRequirements: item.complianceRequirements || [],
        stakeholders: item.stakeholders || [],
        tags: item.tags || []
      })
    } else if (activeTab === 'certificates') {
      setCertificateForm({
        certificateNumber: item.certificateNumber || '',
        name: item.name || '',
        description: item.description || '',
        type: item.type || 'ISO 9001',
        category: item.category || 'Quality Management',
        issuingBody: item.issuingBody || '',
        scope: item.scope || '',
        issueDate: formatDateInput(item.issueDate),
        expiryDate: formatDateInput(item.expiryDate),
        renewalRequired: item.renewalRequired ?? true,
        renewalFrequency: item.renewalFrequency || 'Annually',
        cost: {
          amount: item.cost?.amount ?? '',
          currency: item.cost?.currency || 'USD'
        },
        requirements: item.requirements || [],
        tags: item.tags || []
      })
    } else {
      setVendorForm({
        vendorId: item.vendorId || '',
        companyName: item.companyName || '',
        legalName: item.legalName || '',
        businessType: item.businessType || 'Corporation',
        industry: item.industry || '',
        category: item.category || 'Goods Supplier',
        contactInformation: {
          primaryContact: {
            name: item.contactInformation?.primaryContact?.name || '',
            title: item.contactInformation?.primaryContact?.title || '',
            email: item.contactInformation?.primaryContact?.email || '',
            phone: item.contactInformation?.primaryContact?.phone || ''
          },
          address: {
            street: item.contactInformation?.address?.street || '',
            city: item.contactInformation?.address?.city || '',
            state: item.contactInformation?.address?.state || '',
            postalCode: item.contactInformation?.address?.postalCode || '',
            country: item.contactInformation?.address?.country || ''
          }
        },
        businessInformation: {
          registrationNumber: item.businessInformation?.registrationNumber || '',
          taxId: item.businessInformation?.taxId || '',
          website: item.businessInformation?.website || '',
          establishedYear: item.businessInformation?.establishedYear || '',
          numberOfEmployees: {
            min: item.businessInformation?.numberOfEmployees?.min ?? '',
            max: item.businessInformation?.numberOfEmployees?.max ?? ''
          }
        },
        capabilities: item.capabilities || [],
        complianceRequirements: item.complianceRequirements || [],
        tags: item.tags || []
      })
    }

    setShowFormModal(true)
  }

  const handleDeleteItem = async (item) => {
    const itemType = activeTab === 'declarations' ? 'declaration' : 
                    activeTab === 'certificates' ? 'certificate' : 'vendor'
    
    if (window.confirm(`Are you sure you want to delete this ${itemType}?`)) {
      try {
        setLoading(true)
        let response
        
        if (activeTab === 'declarations') {
          response = await regulatoryComplianceAPI.deleteDeclaration(getRecordId(item))
        } else if (activeTab === 'certificates') {
          response = await regulatoryComplianceAPI.deleteCertificate(getRecordId(item))
        } else if (activeTab === 'vendors') {
          response = await regulatoryComplianceAPI.deleteVendor(getRecordId(item))
        }
        
        if (handleApiResponse(response, `${itemType} deleted successfully`, `Failed to delete ${itemType}`)) {
          if (activeTab === 'declarations') loadDeclarations(pagination.currentPage)
          else if (activeTab === 'certificates') loadCertificates(pagination.currentPage)
          else if (activeTab === 'vendors') loadVendors(pagination.currentPage)
          loadStats()
        }
      } catch (err) {
        handleApiError(err, `Failed to delete ${itemType}`)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      let response
      
      if (activeTab === 'declarations') {
        if (isEditing) {
          response = await regulatoryComplianceAPI.updateDeclaration(getRecordId(selectedItem), declarationForm)
        } else {
          response = await regulatoryComplianceAPI.createDeclaration(declarationForm)
        }
      } else if (activeTab === 'certificates') {
        if (isEditing) {
          response = await regulatoryComplianceAPI.updateCertificate(getRecordId(selectedItem), certificateForm)
        } else {
          response = await regulatoryComplianceAPI.createCertificate(certificateForm)
        }
      } else if (activeTab === 'vendors') {
        if (isEditing) {
          response = await regulatoryComplianceAPI.updateVendor(getRecordId(selectedItem), vendorForm)
        } else {
          response = await regulatoryComplianceAPI.createVendor(vendorForm)
        }
      }
      
      const itemType = activeTab.slice(0, -1) // Remove 's' from end
      const successMessage = isEditing ? `${itemType} updated successfully` : `${itemType} created successfully`
      const errorMessage = `Failed to ${isEditing ? 'update' : 'create'} ${itemType}`
      
      if (handleApiResponse(response, successMessage, errorMessage)) {
        setShowFormModal(false)
        if (activeTab === 'declarations') loadDeclarations(pagination.currentPage)
        else if (activeTab === 'certificates') loadCertificates(pagination.currentPage)
        else if (activeTab === 'vendors') loadVendors(pagination.currentPage)
        loadStats()
      }
    } catch (err) {
      const itemType = activeTab.slice(0, -1)
      handleApiError(err, `Failed to ${isEditing ? 'update' : 'create'} ${itemType}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchValue) => {
    if (activeTab === 'declarations') loadDeclarations(1, { search: searchValue })
    else if (activeTab === 'certificates') loadCertificates(1, { search: searchValue })
    else if (activeTab === 'vendors') loadVendors(1, { search: searchValue })
  }

  const handlePageChange = (page) => {
    if (activeTab === 'declarations') loadDeclarations(page)
    else if (activeTab === 'certificates') loadCertificates(page)
    else if (activeTab === 'vendors') loadVendors(page)
  }

  // Column definitions
  const declarationColumns = [
    {
      key: 'title',
      label: 'Declaration Details',
      sortable: true,
      render: (declaration) => (
        <div>
          <div className="fw-medium">{declaration.title}</div>
          <small className="text-muted">{declaration.jurisdiction} • {declaration.regulatoryBody}</small>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (declaration) => <Badge bg="info">{declaration.type}</Badge>
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (declaration) => {
        const variants = {
          'Approved': 'success',
          'Under Review': 'warning',
          'Draft': 'secondary',
          'Expired': 'danger',
          'Rejected': 'danger'
        }
        return <Badge bg={variants[declaration.status] || 'secondary'}>{declaration.status}</Badge>
      }
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (declaration) => {
        const variants = {
          'Critical': 'danger',
          'High': 'warning',
          'Medium': 'info',
          'Low': 'secondary'
        }
        return <Badge bg={variants[declaration.priority] || 'secondary'}>{declaration.priority}</Badge>
      }
    },
    {
      key: 'expiryDate',
      label: 'Expiry Date',
      sortable: true,
      render: (declaration) => {
        const expiryDate = new Date(declaration.expiryDate)
        const isExpired = expiryDate < new Date()
        const isExpiringSoon = expiryDate < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        
        return (
          <div>
            <div className={isExpired ? 'text-danger' : isExpiringSoon ? 'text-warning' : 'text-success'}>
              {expiryDate.toLocaleDateString()}
            </div>
            {isExpired && <small className="text-danger">Expired</small>}
            {isExpiringSoon && !isExpired && <small className="text-warning">Expiring Soon</small>}
          </div>
        )
      }
    }
  ]

  const certificateColumns = [
    {
      key: 'name',
      label: 'Certificate Details',
      sortable: true,
      render: (certificate) => (
        <div>
          <div className="fw-medium">{certificate.name}</div>
          <small className="text-muted">{certificate.certificateNumber} • {certificate.issuingBody}</small>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (certificate) => <Badge bg="primary">{certificate.type}</Badge>
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (certificate) => {
        const variants = {
          'Active': 'success',
          'Expired': 'danger',
          'Suspended': 'warning',
          'Pending Renewal': 'info'
        }
        return <Badge bg={variants[certificate.status] || 'secondary'}>{certificate.status}</Badge>
      }
    },
    {
      key: 'expiryDate',
      label: 'Expiry Date',
      sortable: true,
      render: (certificate) => {
        const expiryDate = new Date(certificate.expiryDate)
        const isExpired = expiryDate < new Date()
        const isExpiringSoon = expiryDate < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        
        return (
          <div>
            <div className={isExpired ? 'text-danger' : isExpiringSoon ? 'text-warning' : 'text-success'}>
              {expiryDate.toLocaleDateString()}
            </div>
            {isExpired && <small className="text-danger">Expired</small>}
            {isExpiringSoon && !isExpired && <small className="text-warning">Expiring Soon</small>}
          </div>
        )
      }
    }
  ]

  const vendorColumns = [
    {
      key: 'companyName',
      label: 'Vendor Details',
      sortable: true,
      render: (vendor) => (
        <div>
          <div className="fw-medium">{vendor.companyName}</div>
          <small className="text-muted">{vendor.vendorId} • {vendor.industry}</small>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (vendor) => <Badge bg="info">{vendor.category}</Badge>
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (vendor) => {
        const variants = {
          'Approved': 'success',
          'Pending': 'warning',
          'Rejected': 'danger',
          'Suspended': 'secondary',
          'Blacklisted': 'dark'
        }
        return <Badge bg={variants[vendor.status] || 'secondary'}>{vendor.status}</Badge>
      }
    },
    {
      key: 'preQualificationStatus',
      label: 'Pre-Qual Status',
      sortable: true,
      render: (vendor) => {
        const variants = {
          'Completed': 'success',
          'In Progress': 'warning',
          'Not Started': 'secondary',
          'Expired': 'danger'
        }
        return <Badge bg={variants[vendor.preQualificationStatus] || 'secondary'}>{vendor.preQualificationStatus}</Badge>
      }
    }
  ]

  const getCurrentData = () => {
    if (activeTab === 'declarations') return declarations
    else if (activeTab === 'certificates') return certificates
    else if (activeTab === 'vendors') return vendors
    return []
  }

  const getCurrentColumns = () => {
    if (activeTab === 'declarations') return declarationColumns
    else if (activeTab === 'certificates') return certificateColumns
    else if (activeTab === 'vendors') return vendorColumns
    return []
  }

  const getTabLabel = () => {
    if (activeTab === 'declarations') return 'declaration'
    if (activeTab === 'certificates') return 'certificate'
    return 'vendor'
  }

  return (
    <div className="market-declarations-page page-enter page-bg-gradient intel-executive-page">
      <Container fluid>
        <Row className="mb-3">
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item onClick={() => navigate('/tender-intelligence')} style={{ cursor: 'pointer' }}>
                Tender Intelligence
              </Breadcrumb.Item>
              <Breadcrumb.Item active>Regulatory Declarations &amp; Compliance</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <div className="intel-executive-page__hero mb-3">
          <div>
            <Button variant="outline-secondary" size="sm" className="mb-2" onClick={() => navigate('/tender-intelligence')}>
              <ArrowLeft size={16} className="me-2" />
              Back to modules
            </Button>
            <h1>Regulatory declarations &amp; compliance command center</h1>
            <p>
              Manage regulatory declarations, certificate monitoring, and vendor pre-qualification with expiry
              alerts and audit-ready evidence.
            </p>
          </div>
          <div className="intel-executive-page__hero-actions">
            <Button size="sm" variant="outline-primary" onClick={refreshAll} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <RefreshCw size={16} className="me-1" />}
              Refresh
            </Button>
            <small>Compliance registry telemetry</small>
          </div>
        </div>

        {!hasPermission() ? (
          <Alert variant="warning" className="mb-3">
            <strong>Access limited:</strong> You need Tender Manager or System Administrator role to create or
            update compliance records.
          </Alert>
        ) : null}

        <div className="intel-cinematic-hero mb-3">
          <h2 className="h4 mb-2">Compliance intelligence outlook</h2>
          <p className="mb-0">
            {stats.declarations?.totalDeclarations || 0} declarations, {stats.certificates?.totalCertificates || 0}{' '}
            certificates, and {stats.vendors?.totalVendors || 0} vendors are tracked with{' '}
            {stats.totalExpiringSoon || 0} renewals due inside 30 days.
          </p>
          <div className="intel-cinematic-hero__chips">
            <span className="intel-chip">{stats.declarations?.totalDeclarations || 0} declarations</span>
            <span className="intel-chip">{stats.certificates?.totalCertificates || 0} certificates</span>
            <span className="intel-chip">{stats.vendors?.totalVendors || 0} vendors</span>
            <span className="intel-chip">{stats.totalExpiringSoon || 0} expiring soon</span>
          </div>
        </div>

        <InsightStream items={insightItems} />

        <div className="intel-mission-control compliance-kpi-strip mb-3">
          <div className="pipeline-kpi-strip__head">
            <div>
              <span className="pipeline-kpi-strip__badge">Operating metrics</span>
              <h2 className="pipeline-kpi-strip__title">Compliance signal board</h2>
            </div>
            <small className="pipeline-kpi-strip__meta">Registry health and renewal horizon</small>
          </div>
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Declarations"
                value={stats.declarations?.totalDeclarations || 0}
                hint={`${stats.declarations?.expiringSoon || 0} expiring soon`}
                tone="intel"
                trend="Registry"
                icon={<Shield size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Certificates"
                value={stats.certificates?.totalCertificates || 0}
                hint={`${stats.certificates?.expiringSoon || 0} expiring soon`}
                tone="success"
                trend="Credentials"
                icon={<Award size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Vendors"
                value={stats.vendors?.totalVendors || 0}
                hint={`${stats.vendors?.preQualExpiringSoon || 0} pre-qual renewals`}
                tone="warning"
                trend="Partners"
                icon={<Users size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Expiring soon"
                value={stats.totalExpiringSoon || 0}
                hint="Across declarations, certificates, and vendors"
                tone={(stats.totalExpiringSoon || 0) > 0 ? 'risk' : 'success'}
                trend={(stats.totalExpiringSoon || 0) > 0 ? 'Renew' : 'Healthy'}
                trendDirection={(stats.totalExpiringSoon || 0) > 0 ? 'down' : 'up'}
                icon={<Clock size={20} />}
              />
            </Col>
          </Row>
        </div>

        <Card className="intel-chart-card mb-3">
          <Card.Header className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div className="tab-navigation mb-0">
              <Button
                variant={activeTab === 'declarations' ? 'primary' : 'outline-primary'}
                className="me-2"
                onClick={() => setActiveTab('declarations')}
              >
                <Shield size={16} className="me-2" />
                Declarations ({stats.declarations?.totalDeclarations || 0})
              </Button>
              <Button
                variant={activeTab === 'certificates' ? 'primary' : 'outline-primary'}
                className="me-2"
                onClick={() => setActiveTab('certificates')}
              >
                <Award size={16} className="me-2" />
                Certificates ({stats.certificates?.totalCertificates || 0})
              </Button>
              <Button
                variant={activeTab === 'vendors' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('vendors')}
              >
                <Users size={16} className="me-2" />
                Vendors ({stats.vendors?.totalVendors || 0})
              </Button>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <Button variant="primary" onClick={handleCreateItem} disabled={loading || !hasPermission()}>
                <Plus size={16} className="me-2" />
                New {getTabLabel()}
              </Button>
              <Button variant="outline-primary" as={Link} to="/tender-intelligence/market-declarations/new" disabled={loading || !hasPermission()}>
                Full-page create
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <DataTable
              data={getCurrentData()}
              columns={getCurrentColumns()}
              title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} (${pagination.totalItems || getCurrentData().length})`}
              searchable
              sortable
              exportable
              pagination
              pageSize={pagination.itemsPerPage}
              showActions
              onView={handleViewItem}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              searchPlaceholder={`Search ${activeTab}...`}
              emptyMessage={`No ${activeTab} found`}
              loading={loading}
            />
          </Card.Body>
        </Card>

        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="lg"
          centered
          className="intel-executive-modal"
          dialogClassName="intel-executive-modal__dialog"
          contentClassName="intel-executive-modal__content"
        >
          <Modal.Header closeButton className="intel-executive-modal__header">
            <div className="intel-executive-modal__header-copy">
              <div className="intel-executive-modal__icon">
                <Eye size={20} />
              </div>
              <div>
                <Modal.Title className="mb-0">
                  {selectedItem?.title || selectedItem?.name || selectedItem?.companyName}
                </Modal.Title>
                <p className="intel-executive-modal__subtitle mb-0">
                  {activeTab === 'vendors' ? 'Vendor compliance profile' : 'Compliance record details'}
                </p>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body className="intel-executive-modal__body">
            {selectedItem && (
              <div className="intel-executive-modal__detail-grid">
                <div className="intel-executive-modal__detail-card">
                  <h6>Registry status</h6>
                  <p><strong>Type:</strong> {selectedItem.type || selectedItem.category || '—'}</p>
                  <p><strong>Status:</strong> {selectedItem.status || '—'}</p>
                  <p><strong>Created:</strong> {selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleDateString() : '—'}</p>
                </div>
                <div className="intel-executive-modal__detail-card">
                  <h6>Compliance window</h6>
                  <p><strong>Description:</strong> {selectedItem.description || '—'}</p>
                  {selectedItem.expiryDate ? (
                    <p><strong>Expiry date:</strong> {new Date(selectedItem.expiryDate).toLocaleDateString()}</p>
                  ) : null}
                  {selectedItem.jurisdiction ? <p><strong>Jurisdiction:</strong> {selectedItem.jurisdiction}</p> : null}
                  {selectedItem.regulatoryBody ? <p><strong>Regulatory body:</strong> {selectedItem.regulatoryBody}</p> : null}
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="intel-executive-modal__footer">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
            <Button
              variant="primary"
              onClick={() => {
                setShowModal(false)
                handleEditItem(selectedItem)
              }}
              disabled={!hasPermission()}
            >
              <Edit size={16} className="me-2" />
              Edit
            </Button>
          </Modal.Footer>
        </Modal>

        <FormDrawerModal
          show={showFormModal}
          onHide={() => setShowFormModal(false)}
          className="intel-executive-modal"
          contentClassName="intel-executive-modal__content"
          onTestFill={
            showFormModal
              ? () => {
                  if (activeTab === 'declarations') setDeclarationForm(dummyMarketDeclarationForm())
                  else if (activeTab === 'certificates') setCertificateForm(dummyMarketCertificateForm())
                  else setVendorForm(dummyMarketVendorForm())
                }
              : undefined
          }
        >
          <Modal.Header closeButton className="intel-executive-modal__header">
            <div className="intel-executive-modal__header-copy">
              <div className="intel-executive-modal__icon">
                {isEditing ? <Edit size={20} /> : <Plus size={20} />}
              </div>
              <div>
                <Modal.Title className="mb-0">
                  {isEditing ? 'Edit' : 'Create'} {getTabLabel()}
                </Modal.Title>
                <p className="intel-executive-modal__subtitle mb-0">
                  {activeTab === 'declarations'
                    ? 'Capture regulatory declarations and renewal obligations.'
                    : activeTab === 'certificates'
                      ? 'Track certificate scope, issuer, and expiry monitoring.'
                      : 'Maintain vendor pre-qualification and contact evidence.'}
                </p>
              </div>
            </div>
          </Modal.Header>
          <Form onSubmit={handleSubmitForm} className="intel-executive-modal__form">
            <Modal.Body className="intel-executive-modal__body">
              {activeTab === 'declarations' && (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Title *</Form.Label>
                      <Form.Control
                        type="text"
                        value={declarationForm.title}
                        onChange={(e) => setDeclarationForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter declaration title"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Type *</Form.Label>
                      <Form.Select
                        value={declarationForm.type}
                        onChange={(e) => setDeclarationForm(prev => ({ ...prev, type: e.target.value }))}
                      >
                        <option value="Regulatory Declaration">Regulatory Declaration</option>
                        <option value="Conflict of Interest">Conflict of Interest</option>
                        <option value="Sanctions Compliance">Sanctions Compliance</option>
                        <option value="Export Control">Export Control</option>
                        <option value="Data Processing (GDPR)">Data Processing (GDPR)</option>
                        <option value="Compliance Audit">Compliance Audit</option>
                        <option value="Risk Assessment">Risk Assessment</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Description *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={declarationForm.description}
                        onChange={(e) => setDeclarationForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter description"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Jurisdiction *</Form.Label>
                      <Form.Control
                        type="text"
                        value={declarationForm.jurisdiction}
                        onChange={(e) => setDeclarationForm(prev => ({ ...prev, jurisdiction: e.target.value }))}
                        placeholder="e.g., United States, EU, Canada"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Regulatory Body *</Form.Label>
                      <Form.Control
                        type="text"
                        value={declarationForm.regulatoryBody}
                        onChange={(e) => setDeclarationForm(prev => ({ ...prev, regulatoryBody: e.target.value }))}
                        placeholder="e.g., FDA, EPA, SEC"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Priority</Form.Label>
                      <Form.Select
                        value={declarationForm.priority}
                        onChange={(e) => setDeclarationForm(prev => ({ ...prev, priority: e.target.value }))}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Expiry Date *</Form.Label>
                      <Form.Control
                        type="date"
                        value={declarationForm.expiryDate}
                        onChange={(e) => setDeclarationForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}

              {activeTab === 'certificates' && (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Certificate Number *</Form.Label>
                      <Form.Control
                        type="text"
                        value={certificateForm.certificateNumber}
                        onChange={(e) => setCertificateForm(prev => ({ ...prev, certificateNumber: e.target.value }))}
                        placeholder="Enter certificate number"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name *</Form.Label>
                      <Form.Control
                        type="text"
                        value={certificateForm.name}
                        onChange={(e) => setCertificateForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter certificate name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Type *</Form.Label>
                      <Form.Select
                        value={certificateForm.type}
                        onChange={(e) => setCertificateForm(prev => ({ ...prev, type: e.target.value }))}
                      >
                        <option value="ISO 9001">ISO 9001</option>
                        <option value="ISO 14001">ISO 14001</option>
                        <option value="ISO 45001">ISO 45001</option>
                        <option value="ISO 27001">ISO 27001</option>
                        <option value="CE Marking">CE Marking</option>
                        <option value="UL Listing">UL Listing</option>
                        <option value="FDA Approval">FDA Approval</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Issuing Body *</Form.Label>
                      <Form.Control
                        type="text"
                        value={certificateForm.issuingBody}
                        onChange={(e) => setCertificateForm(prev => ({ ...prev, issuingBody: e.target.value }))}
                        placeholder="Enter issuing body"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Issue Date *</Form.Label>
                      <Form.Control
                        type="date"
                        value={certificateForm.issueDate}
                        onChange={(e) => setCertificateForm(prev => ({ ...prev, issueDate: e.target.value }))}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Expiry Date *</Form.Label>
                      <Form.Control
                        type="date"
                        value={certificateForm.expiryDate}
                        onChange={(e) => setCertificateForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Scope *</Form.Label>
                      <Form.Control
                        type="text"
                        value={certificateForm.scope}
                        onChange={(e) => setCertificateForm(prev => ({ ...prev, scope: e.target.value }))}
                        placeholder="Enter certificate scope"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}

              {activeTab === 'vendors' && (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Vendor ID *</Form.Label>
                      <Form.Control
                        type="text"
                        value={vendorForm.vendorId}
                        onChange={(e) => setVendorForm(prev => ({ ...prev, vendorId: e.target.value }))}
                        placeholder="Enter vendor ID"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Company Name *</Form.Label>
                      <Form.Control
                        type="text"
                        value={vendorForm.companyName}
                        onChange={(e) => setVendorForm(prev => ({ ...prev, companyName: e.target.value }))}
                        placeholder="Enter company name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Industry *</Form.Label>
                      <Form.Control
                        type="text"
                        value={vendorForm.industry}
                        onChange={(e) => setVendorForm(prev => ({ ...prev, industry: e.target.value }))}
                        placeholder="Enter industry"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category *</Form.Label>
                      <Form.Select
                        value={vendorForm.category}
                        onChange={(e) => setVendorForm(prev => ({ ...prev, category: e.target.value }))}
                      >
                        <option value="Goods Supplier">Goods Supplier</option>
                        <option value="Service Provider">Service Provider</option>
                        <option value="Consultant">Consultant</option>
                        <option value="Contractor">Contractor</option>
                        <option value="Technology Provider">Technology Provider</option>
                        <option value="Professional Services">Professional Services</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Distribution">Distribution</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Primary Contact Name *</Form.Label>
                      <Form.Control
                        type="text"
                        value={vendorForm.contactInformation.primaryContact.name}
                        onChange={(e) => setVendorForm(prev => ({
                          ...prev,
                          contactInformation: {
                            ...prev.contactInformation,
                            primaryContact: {
                              ...prev.contactInformation.primaryContact,
                              name: e.target.value
                            }
                          }
                        }))}
                        placeholder="Enter contact name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Primary Contact Email *</Form.Label>
                      <Form.Control
                        type="email"
                        value={vendorForm.contactInformation.primaryContact.email}
                        onChange={(e) => setVendorForm(prev => ({
                          ...prev,
                          contactInformation: {
                            ...prev.contactInformation,
                            primaryContact: {
                              ...prev.contactInformation.primaryContact,
                              email: e.target.value
                            }
                          }
                        }))}
                        placeholder="Enter contact email"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}
            </Modal.Body>
            <Modal.Footer className="intel-executive-modal__footer">
              <Button variant="secondary" onClick={() => setShowFormModal(false)}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={loading || !hasPermission()}>
                {loading ? <Spinner animation="border" size="sm" /> : (isEditing ? 'Update' : 'Create')}
              </Button>
            </Modal.Footer>
          </Form>
        </FormDrawerModal>
      </Container>
    </div>
  )
}

export default MarketDeclarations
