import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Badge, Modal } from 'react-bootstrap'
import FormDrawerModal from '../../../components/FormDrawerModal'
import ExecutiveCommandCenter from '../../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../../components/intelligence/PremiumKpiCard'
import { Plus, Edit, Building, Mail, AlertTriangle, Eye, RefreshCw } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { dummyPrequalCustomerForm } from '../../../utils/testFormDummies'
import preQualificationAPI from '../../../services/preQualificationAPI'
import DataTable from '../../../components/DataTable'
import './CustomerManagement.scss'

const CustomerManagement = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [stats, setStats] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    industry: '',
    size: '',
    status: 'Active'
  })

  useEffect(() => {
    loadCustomers()
  }, [])

  const exitCreateRouteIfNeeded = () => {
    if (location.pathname.endsWith('/new')) {
      navigate('/tender-intelligence/prequalification/customer-management', { replace: true })
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCustomer(null)
    exitCreateRouteIfNeeded()
  }

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const response = await preQualificationAPI.getCustomers()
      setCustomers(response.data || [])
      calculateStats(response.data || [])
    } catch (error) {
      console.error('Error loading customers:', error)
      // Fallback to dummy data
      setCustomers([
        {
          id: 1,
          name: 'Ministry of Transport',
          email: 'contact@transport.gov',
          phone: '+1-555-0101',
          address: '123 Government Ave, Capital City',
          industry: 'Government',
          size: 'Large',
          status: 'Active',
          projects: 15,
          totalValue: 50000000,
          lastContact: '2024-01-15',
          relationshipScore: 85
        },
        {
          id: 2,
          name: 'Health Ministry',
          email: 'procurement@health.gov',
          phone: '+1-555-0102',
          address: '456 Health St, Medical District',
          industry: 'Healthcare',
          size: 'Large',
          status: 'Active',
          projects: 8,
          totalValue: 25000000,
          lastContact: '2024-01-10',
          relationshipScore: 92
        },
        {
          id: 3,
          name: 'City Development Authority',
          email: 'info@citydev.gov',
          phone: '+1-555-0103',
          address: '789 Urban Blvd, City Center',
          industry: 'Infrastructure',
          size: 'Medium',
          status: 'Active',
          projects: 12,
          totalValue: 35000000,
          lastContact: '2024-01-08',
          relationshipScore: 78
        }
      ])
      calculateStats([
        {
          id: 1,
          name: 'Ministry of Transport',
          email: 'contact@transport.gov',
          phone: '+1-555-0101',
          address: '123 Government Ave, Capital City',
          industry: 'Government',
          size: 'Large',
          status: 'Active',
          projects: 15,
          totalValue: 50000000,
          lastContact: '2024-01-15',
          relationshipScore: 85
        },
        {
          id: 2,
          name: 'Health Ministry',
          email: 'procurement@health.gov',
          phone: '+1-555-0102',
          address: '456 Health St, Medical District',
          industry: 'Healthcare',
          size: 'Large',
          status: 'Active',
          projects: 8,
          totalValue: 25000000,
          lastContact: '2024-01-10',
          relationshipScore: 92
        },
        {
          id: 3,
          name: 'City Development Authority',
          email: 'info@citydev.gov',
          phone: '+1-555-0103',
          address: '789 Urban Blvd, City Center',
          industry: 'Infrastructure',
          size: 'Medium',
          status: 'Active',
          projects: 12,
          totalValue: 35000000,
          lastContact: '2024-01-08',
          relationshipScore: 78
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (customerData) => {
    const totalCustomers = customerData.length
    const activeCustomers = customerData.filter(c => c.status === 'Active').length
    const totalProjects = customerData.reduce((sum, c) => sum + (c.projects || 0), 0)
    const avgRelationshipScore = customerData.reduce((sum, c) => sum + (c.relationshipScore || 0), 0) / totalCustomers

    setStats({
      totalCustomers,
      activeCustomers,
      totalProjects,
      avgRelationshipScore: Math.round(avgRelationshipScore)
    })
  }

  const handleViewCustomer = (customer) => {
    setEditingCustomer(customer)
    setShowModal(true)
  }

  const handleEditCustomer = (customer) => {
    setFormData(customer)
    setEditingCustomer(customer)
    setShowModal(true)
  }

  const handleSaveCustomer = async () => {
    try {
      if (editingCustomer) {
        await preQualificationAPI.updateCustomer(editingCustomer.id, formData)
        setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? { ...c, ...formData } : c))
      } else {
        const newCustomer = await preQualificationAPI.createCustomer(formData)
        setCustomers(prev => [...prev, newCustomer.data])
      }
      setShowModal(false)
      setEditingCustomer(null)
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        industry: '',
        size: '',
        status: 'Active'
      })
      exitCreateRouteIfNeeded()
    } catch (error) {
      console.error('Error saving customer:', error)
    }
  }

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await preQualificationAPI.deleteCustomer(customerId)
        setCustomers(prev => prev.filter(c => c.id !== customerId))
      } catch (error) {
        console.error('Error deleting customer:', error)
      }
    }
  }

  const handleEditCustomerProfile = (customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      industry: customer.industry,
      size: customer.size,
      status: customer.status
    })
    setShowModal(true)
  }

  const handleDeleteCustomerProfile = (customer) => {
    handleDeleteCustomer(customer.id)
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'name',
      label: 'Customer Details',
      width: '25%',
      render: (value, row) => (
        <div className="customer-info">
          <div className="fw-semibold d-flex align-items-center">
            <Building size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.email}</small>
          <div className="customer-meta">
            <small className="text-muted">{row.phone}</small>
          </div>
        </div>
      )
    },
    {
      key: 'industry',
      label: 'Industry',
      width: '12%',
      render: (value) => (
        <div className="industry-info">
          <div className="fw-bold text-primary">{value}</div>
        </div>
      )
    },
    {
      key: 'size',
      label: 'Size',
      width: '8%',
      render: (value) => {
        const variants = {
          'Large': 'primary',
          'Medium': 'info',
          'Small': 'secondary'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
    },
    {
      key: 'projects',
      label: 'Projects',
      width: '8%',
      render: (value) => (
        <div className="projects-count">
          <div className="fw-bold text-success">{value}</div>
          <small className="text-muted">projects</small>
        </div>
      )
    },
    {
      key: 'totalValue',
      label: 'Total Value',
      width: '12%',
      render: (value) => (
        <div className="total-value">
          <div className="fw-bold text-primary">
            ${(value / 1000000).toFixed(1)}M
          </div>
          <small className="text-muted">USD</small>
        </div>
      )
    },
    {
      key: 'relationshipScore',
      label: 'Relationship Score',
      width: '12%',
      render: (value) => (
        <div className="relationship-score">
          <div className="fw-bold text-success">{value}%</div>
          <small className="text-muted">score</small>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: '8%',
      render: (value) => (
        <Badge bg={value === 'Active' ? 'success' : 'secondary'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'lastContact',
      label: 'Last Contact',
      width: '10%',
      render: (value) => {
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        });
      }
    },
    {
      key: 'address',
      label: 'Location',
      width: '5%',
      render: (value) => (
        <div className="location">
          <small className="text-muted">{value.split(',')[0]}</small>
        </div>
      )
    }
  ]

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'success',
      'Inactive': 'secondary',
      'Prospect': 'warning',
      'Suspended': 'danger'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getRelationshipScoreColor = (score) => {
    if (score >= 80) return 'success'
    if (score >= 60) return 'warning'
    return 'danger'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.industry.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const insightItems = useMemo(() => {
    const items = []
    if ((stats.totalCustomers || 0) > 0) {
      items.push({
        title: `${stats.totalCustomers} customer relationships tracked across ${stats.totalProjects || 0} projects`,
        detail: `${stats.activeCustomers || 0} accounts are active with an average relationship score of ${stats.avgRelationshipScore || 0}%.`,
        tone: 'info'
      })
    }
    if ((stats.avgRelationshipScore || 0) >= 80) {
      items.push({
        title: 'Relationship health is strong across the active portfolio',
        detail: 'Prioritize expansion conversations with high-scoring public-sector accounts.',
        tone: 'success'
      })
    } else if ((stats.avgRelationshipScore || 0) > 0) {
      items.push({
        title: 'Relationship scores need executive attention',
        detail: 'Review engagement cadence for accounts below the portfolio average.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Customer registry is ready for your first accounts',
        detail: 'Add customer profiles to activate relationship scoring and project tracking.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  const openCreateModal = () => {
    setEditingCustomer(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      industry: '',
      size: '',
      status: 'Active'
    })
    setShowModal(true)
  }

  useEffect(() => {
    if (location.pathname.endsWith('/new')) {
      openCreateModal()
    }
  }, [location.pathname])

  return (
    <>
      <ExecutiveCommandCenter
        className="customer-management-page"
        showSkeleton={loading && !customers.length}
        breadcrumbs={[
          {
            label: 'Pre-Qualification Registry',
            onClick: () => navigate('/tender-intelligence/prequalification')
          },
          { label: 'Customer Management', active: true }
        ]}
        onBack={() => navigate('/tender-intelligence/prequalification')}
        title="Customer management command center"
        description="Manage customer profiles, relationships, and engagement tracking with portfolio-level visibility."
        heroActions={(
          <Button size="sm" variant="outline-primary" onClick={loadCustomers} disabled={loading}>
            {loading ? 'Refreshing...' : <><RefreshCw size={16} className="me-1" /> Refresh</>}
          </Button>
        )}
        heroMeta="Customer relationship telemetry"
        outlookTitle="Relationship intelligence outlook"
        outlookDescription={`${stats.totalCustomers || 0} customers are tracked with ${stats.activeCustomers || 0} active accounts and ${stats.totalProjects || 0} linked projects.`}
        outlookChips={[
          `${stats.totalCustomers || 0} customers`,
          `${stats.activeCustomers || 0} active`,
          `${stats.totalProjects || 0} projects`,
          `${stats.avgRelationshipScore || 0}% avg score`
        ]}
        insights={insightItems}
        kpiTitle="Customer signal board"
        kpiMeta="Portfolio health and engagement coverage"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total customers"
                value={stats.totalCustomers || 0}
                hint="Registered customer accounts"
                tone="intel"
                trend="Registry"
                icon={<Building size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Active customers"
                value={stats.activeCustomers || 0}
                hint="Currently engaged accounts"
                tone="success"
                trend="Live"
                icon={<Eye size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total projects"
                value={stats.totalProjects || 0}
                hint="Linked pursuit and delivery work"
                tone="warning"
                trend="Pipeline"
                icon={<AlertTriangle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg relationship score"
                value={stats.avgRelationshipScore || 0}
                hint="Portfolio relationship health"
                tone={(stats.avgRelationshipScore || 0) >= 80 ? 'success' : 'warning'}
                trend="Quality"
                suffix="%"
                icon={<Mail size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Customer directory (${filteredCustomers.length})`}
        tableActions={(
          <div className="d-flex flex-wrap gap-2">
            <Button variant="primary" onClick={openCreateModal} disabled={loading}>
              <Plus size={16} className="me-2" />
              Add customer
            </Button>
            <Button variant="outline-primary" as={Link} to="/tender-intelligence/prequalification/customer-management/new" disabled={loading}>
              Full-page create
            </Button>
          </div>
        )}
      >
        <DataTable
          data={filteredCustomers}
          columns={columns}
          title={`Customer directory (${filteredCustomers.length})`}
          searchable
          sortable
          exportable
          pagination
          pageSize={10}
          showActions
          showCheckboxes={false}
          onView={handleViewCustomer}
          onEdit={handleEditCustomerProfile}
          onDelete={handleDeleteCustomerProfile}
          customActions={[
            {
              type: 'custom',
              label: 'View projects',
              onClick: (row) => {
                console.log('View projects:', row)
              }
            }
          ]}
          searchPlaceholder="Search customers..."
          emptyMessage="No customers found"
          loading={loading}
        />
      </ExecutiveCommandCenter>

        <FormDrawerModal
          show={showModal}
          onHide={closeModal}
          size="lg"
          onTestFill={showModal ? () => setFormData(dummyPrequalCustomerForm()) : undefined}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Customer Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Industry</Form.Label>
                    <Form.Select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    >
                      <option value="">Select Industry</option>
                      <option value="Government">Government</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Technology">Technology</option>
                      <option value="Education">Education</option>
                      <option value="Finance">Finance</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Company Size</Form.Label>
                    <Form.Select
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    >
                      <option value="">Select Size</option>
                      <option value="Small">Small (1-50)</option>
                      <option value="Medium">Medium (51-500)</option>
                      <option value="Large">Large (500+)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Prospect">Prospect</option>
                      <option value="Suspended">Suspended</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveCustomer}>
              {editingCustomer ? 'Update Customer' : 'Add Customer'}
            </Button>
          </Modal.Footer>
        </FormDrawerModal>
    </>
  )
}

export default CustomerManagement
