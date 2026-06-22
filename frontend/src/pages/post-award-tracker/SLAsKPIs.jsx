import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Table, Badge, Modal } from 'react-bootstrap'
import FormDrawerModal from '../../components/FormDrawerModal'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Search, Plus, Edit, Trash2, Eye, Award, TrendingUp, AlertCircle, CheckCircle, Brain } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { dummySlaKpiPrefill } from '../../utils/testFormDummies'
import { showToast } from '../../utils/toast'

const EMPTY_FORM = {
  name: '',
  contract: '',
  description: '',
  target: '',
  current: '',
  status: 'On Track',
  trend: 'up'
}

const SLAsKPIs = () => {
  const navigate = useNavigate()
  const [slas, setSlas] = useState([])
  const [kpis, setKpis] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [activeTab, setActiveTab] = useState('slas')

  useEffect(() => {
    setSlas([
      {
        id: 1,
        name: 'Response Time SLA',
        description: 'Average response time for customer inquiries',
        target: '4 hours',
        current: '3.2 hours',
        status: 'On Track',
        contract: 'CON-2024-001',
        lastUpdated: '2024-01-20'
      },
      {
        id: 2,
        name: 'Delivery SLA',
        description: 'On-time delivery performance',
        target: '95%',
        current: '97.5%',
        status: 'Exceeding',
        contract: 'CON-2024-002',
        lastUpdated: '2024-01-19'
      },
      {
        id: 3,
        name: 'Quality SLA',
        description: 'Defect rate and quality standards',
        target: '<2%',
        current: '1.8%',
        status: 'On Track',
        contract: 'CON-2024-003',
        lastUpdated: '2024-01-18'
      }
    ])

    setKpis([
      {
        id: 1,
        name: 'Customer Satisfaction',
        description: 'Overall customer satisfaction score',
        target: '4.5/5',
        current: '4.6/5',
        trend: 'up',
        contract: 'CON-2024-001',
        lastUpdated: '2024-01-20'
      },
      {
        id: 2,
        name: 'Cost Performance',
        description: 'Budget adherence and cost control',
        target: '100%',
        current: '98.5%',
        trend: 'down',
        contract: 'CON-2024-002',
        lastUpdated: '2024-01-19'
      },
      {
        id: 3,
        name: 'Schedule Performance',
        description: 'On-time project completion rate',
        target: '90%',
        current: '92%',
        trend: 'up',
        contract: 'CON-2024-003',
        lastUpdated: '2024-01-18'
      }
    ])
  }, [])

  const stats = useMemo(
    () => ({
      totalSLAs: slas.length,
      onTrackSLAs: slas.filter((s) => s.status === 'On Track').length,
      exceedingSLAs: slas.filter((s) => s.status === 'Exceeding').length,
      totalKPIs: kpis.length,
      improvingKPIs: kpis.filter((k) => k.trend === 'up').length,
      decliningKPIs: kpis.filter((k) => k.trend === 'down').length
    }),
    [slas, kpis]
  )

  const insights = useMemo(() => {
    const items = []
    items.push({
      title: `${stats.totalSLAs} SLAs and ${stats.totalKPIs} KPIs monitored`,
      detail: `${stats.onTrackSLAs} SLAs on track, ${stats.exceedingSLAs} exceeding; ${stats.improvingKPIs} KPIs improving, ${stats.decliningKPIs} declining.`,
      tone: 'info'
    })
    if (stats.decliningKPIs > 0) {
      items.push({
        title: 'Declining KPI signals detected',
        detail: 'Review resource and schedule drivers on contracts with downward trends.',
        tone: 'warning'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  const handleEditItem = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name || '',
      contract: item.contract || '',
      description: item.description || '',
      target: item.target || '',
      current: item.current || '',
      status: item.status || 'On Track',
      trend: item.trend || 'up'
    })
    setShowModal(true)
  }

  const handleOpenAddModal = () => {
    setEditingItem(null)
    setFormData({ ...EMPTY_FORM })
    setShowModal(true)
  }

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const name = formData.name.trim()
    if (!name) {
      showToast.error('Name is required')
      return
    }

    const payload = {
      name,
      contract: formData.contract.trim(),
      description: formData.description.trim(),
      target: formData.target.trim(),
      current: formData.current.trim(),
      lastUpdated: new Date().toISOString().split('T')[0]
    }

    if (activeTab === 'slas') {
      const slaPayload = {
        ...payload,
        status: formData.status || 'On Track'
      }

      if (editingItem) {
        setSlas((prev) => prev.map((item) => (item.id === editingItem.id ? { ...item, ...slaPayload } : item)))
        showToast.success(`SLA "${name}" updated`)
      } else {
        setSlas((prev) => [...prev, { id: Date.now(), ...slaPayload }])
        showToast.success(`SLA "${name}" created`)
      }
    } else {
      const kpiPayload = {
        ...payload,
        trend: formData.trend || 'up'
      }

      if (editingItem) {
        setKpis((prev) => prev.map((item) => (item.id === editingItem.id ? { ...item, ...kpiPayload } : item)))
        showToast.success(`KPI "${name}" updated`)
      } else {
        setKpis((prev) => [...prev, { id: Date.now(), ...kpiPayload }])
        showToast.success(`KPI "${name}" created`)
      }
    }

    setSearchTerm('')
    closeSlasModal()
  }

  const handleTestFill = () => {
    const sample = dummySlaKpiPrefill(activeTab === 'slas')
    setFormData({
      name: sample.name || '',
      contract: sample.contract || '',
      description: sample.description || '',
      target: sample.target || '',
      current: sample.current || '',
      status: sample.status || 'On Track',
      trend: sample.trend || 'up'
    })
  }

  const handleDeleteItem = (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      if (activeTab === 'slas') {
        setSlas((prev) => prev.filter((s) => s.id !== item.id))
      } else {
        setKpis((prev) => prev.filter((k) => k.id !== item.id))
      }
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      'On Track': 'success',
      Exceeding: 'primary',
      'At Risk': 'warning',
      Breached: 'danger'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp size={16} className="text-success" />
    if (trend === 'down')
      return <TrendingUp size={16} className="text-danger" style={{ transform: 'rotate(180deg)' }} />
    return <TrendingUp size={16} className="text-muted" />
  }

  const currentData = activeTab === 'slas' ? slas : kpis

  const closeSlasModal = () => {
    setShowModal(false)
    setEditingItem(null)
    setFormData({ ...EMPTY_FORM })
  }

  return (
    <>
      <ExecutiveCommandCenter
        className="slas-kpis-page"
        breadcrumbs={[
          { label: 'Post-Award Tracker', onClick: () => navigate('/post-award-tracker') },
          { label: 'SLAs & KPIs', active: true }
        ]}
        onBack={() => navigate('/post-award-tracker')}
        backLabel="Back to modules"
        title="SLA & KPI command center"
        description="Monitor service level agreements and key performance indicators across active contracts."
        heroMeta="Performance telemetry"
        outlookTitle="Post-award performance outlook"
        outlookDescription={`${stats.totalSLAs} SLAs and ${stats.totalKPIs} KPIs in scope — ${stats.onTrackSLAs} SLAs on track.`}
        outlookChips={[
          `${stats.totalSLAs} SLAs`,
          `${stats.onTrackSLAs} on track`,
          `${stats.totalKPIs} KPIs`,
          `${stats.improvingKPIs} improving`
        ]}
        insights={insights}
        kpiTitle="Signal board"
        kpiMeta="Coverage across SLAs and KPIs"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total SLAs"
                value={stats.totalSLAs}
                hint="Registered agreements"
                tone="intel"
                trend="SLAs"
                icon={<Award size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="On track"
                value={stats.onTrackSLAs}
                hint="Meeting targets"
                tone="success"
                trend="Health"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total KPIs"
                value={stats.totalKPIs}
                hint="Performance indicators"
                tone="intel"
                trend="KPIs"
                icon={<TrendingUp size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Improving"
                value={stats.improvingKPIs}
                hint="Positive trend"
                tone={stats.decliningKPIs > stats.improvingKPIs ? 'warning' : 'success'}
                trend="Momentum"
                icon={<Brain size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle={
          activeTab === 'slas'
            ? `Service level agreements (${slas.length})`
            : `Key performance indicators (${kpis.length})`
        }
        tableActions={
          <Button variant="primary" onClick={handleOpenAddModal}>
            <Plus size={20} className="me-2" />
            Add {activeTab === 'slas' ? 'SLA' : 'KPI'}
          </Button>
        }
      >
        <Row className="mb-3">
          <Col>
            <div className="tab-navigation">
              <Button
                variant={activeTab === 'slas' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('slas')}
                className="tab-btn"
              >
                <Award size={16} className="me-2" />
                SLAs ({stats.totalSLAs})
              </Button>
              <Button
                variant={activeTab === 'kpis' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('kpis')}
                className="tab-btn ms-2"
              >
                <TrendingUp size={16} className="me-2" />
                KPIs ({stats.totalKPIs})
              </Button>
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <div className="search-controls">
              <div className="search-input">
                <Search size={20} />
                <Form.Control
                  type="text"
                  placeholder={`Search ${activeTab.toUpperCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </Col>
        </Row>

        <div className="table-responsive">
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Target</th>
                <th>Current</th>
                <th>Status</th>
                <th>Contract</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData
                .filter(
                  (item) =>
                    !searchTerm ||
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="item-info">
                        <div className="item-name">
                          {activeTab === 'slas' ? (
                            <Award size={16} className="me-2" />
                          ) : (
                            <TrendingUp size={16} className="me-2" />
                          )}
                          <strong>{item.name}</strong>
                        </div>
                      </div>
                    </td>
                    <td>
                      <small className="text-muted">{item.description}</small>
                    </td>
                    <td>
                      <span className="target-value">{item.target}</span>
                    </td>
                    <td>
                      <div className="current-value">
                        <span className="value">{item.current}</span>
                        {item.trend && getTrendIcon(item.trend)}
                      </div>
                    </td>
                    <td>
                      {activeTab === 'slas' ? (
                        getStatusBadge(item.status)
                      ) : (
                        <div className="kpi-status">
                          {item.trend === 'up' && <CheckCircle size={16} className="text-success me-1" />}
                          {item.trend === 'down' && <AlertCircle size={16} className="text-warning me-1" />}
                          <span className="status-text">
                            {item.trend === 'up' ? 'Improving' : item.trend === 'down' ? 'Declining' : 'Stable'}
                          </span>
                        </div>
                      )}
                    </td>
                    <td>{item.contract}</td>
                    <td>{item.lastUpdated}</td>
                    <td>
                      <div className="action-buttons">
                        <Button variant="outline-primary" size="sm" onClick={() => handleEditItem(item)}>
                          <Edit size={16} />
                        </Button>
                        <Button variant="outline-info" size="sm" className="ms-1">
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="ms-1"
                          onClick={() => handleDeleteItem(item)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </ExecutiveCommandCenter>

      <FormDrawerModal
        show={showModal}
        onHide={closeSlasModal}
        size="lg"
        onTestFill={showModal ? handleTestFill : undefined}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingItem ? `Edit ${activeTab === 'slas' ? 'SLA' : 'KPI'}` : `Add New ${activeTab === 'slas' ? 'SLA' : 'KPI'}`}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    placeholder={`Enter ${activeTab === 'slas' ? 'SLA' : 'KPI'} name`}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contract</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.contract}
                    onChange={(e) => handleFormChange('contract', e.target.value)}
                    placeholder="Contract number"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Describe the SLA/KPI"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Target</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.target}
                    onChange={(e) => handleFormChange('target', e.target.value)}
                    placeholder="Target value"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Current</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.current}
                    onChange={(e) => handleFormChange('current', e.target.value)}
                    placeholder="Current value"
                  />
                </Form.Group>
              </Col>
            </Row>
            {activeTab === 'slas' ? (
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                >
                  <option value="On Track">On Track</option>
                  <option value="Exceeding">Exceeding</option>
                  <option value="At Risk">At Risk</option>
                  <option value="Breached">Breached</option>
                </Form.Select>
              </Form.Group>
            ) : (
              <Form.Group className="mb-3">
                <Form.Label>Trend</Form.Label>
                <Form.Select
                  value={formData.trend}
                  onChange={(e) => handleFormChange('trend', e.target.value)}
                >
                  <option value="up">Improving</option>
                  <option value="down">Declining</option>
                  <option value="stable">Stable</option>
                </Form.Select>
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" type="button" onClick={closeSlasModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingItem ? 'Update' : 'Create'} {activeTab === 'slas' ? 'SLA' : 'KPI'}
            </Button>
          </Modal.Footer>
        </Form>
      </FormDrawerModal>
    </>
  )
}

export default SLAsKPIs
