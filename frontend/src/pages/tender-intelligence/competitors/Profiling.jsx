import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Badge, Modal } from 'react-bootstrap'
import FormDrawerModal from '../../../components/FormDrawerModal'
import ExecutiveCommandCenter from '../../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../../components/intelligence/PremiumKpiCard'
import { Plus, RefreshCw, Users, TrendingUp, AlertTriangle, Eye, Building } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../../components/DataTable'
import { dummyProfilingCompetitorPrefill } from '../../../utils/testFormDummies'
import './Profiling.scss'

const MOCK_COMPETITORS = [
  {
    id: 1,
    name: 'TechCorp Solutions',
    industry: 'Technology',
    size: 'Large',
    marketShare: 25.5,
    strength: 'High',
    weakness: 'Medium',
    threat: 'High',
    lastUpdated: '2024-01-20',
    status: 'Active',
    keyStrengths: ['Innovation', 'Market Presence', 'Financial Stability'],
    keyWeaknesses: ['Customer Service', 'Pricing']
  },
  {
    id: 2,
    name: 'Global Systems Inc',
    industry: 'Technology',
    size: 'Medium',
    marketShare: 18.2,
    strength: 'Medium',
    weakness: 'High',
    threat: 'Medium',
    lastUpdated: '2024-01-19',
    status: 'Active',
    keyStrengths: ['Cost Efficiency', 'Local Presence'],
    keyWeaknesses: ['Innovation', 'Market Reach', 'Brand Recognition']
  },
  {
    id: 3,
    name: 'InnovateTech Ltd',
    industry: 'Technology',
    size: 'Small',
    marketShare: 12.8,
    strength: 'High',
    weakness: 'Low',
    threat: 'Low',
    lastUpdated: '2024-01-18',
    status: 'Active',
    keyStrengths: ['Innovation', 'Agility', 'Customer Focus'],
    keyWeaknesses: ['Market Presence', 'Financial Resources']
  },
  {
    id: 4,
    name: 'MegaCorp Industries',
    industry: 'Manufacturing',
    size: 'Large',
    marketShare: 22.3,
    strength: 'High',
    weakness: 'Medium',
    threat: 'High',
    lastUpdated: '2024-01-17',
    status: 'Active',
    keyStrengths: ['Scale', 'Manufacturing Capability', 'Global Reach'],
    keyWeaknesses: ['Innovation', 'Agility', 'Customer Service']
  },
  {
    id: 5,
    name: 'StartupX Solutions',
    industry: 'Technology',
    size: 'Small',
    marketShare: 8.5,
    strength: 'Medium',
    weakness: 'High',
    threat: 'Low',
    lastUpdated: '2024-01-16',
    status: 'Active',
    keyStrengths: ['Innovation', 'Cost Efficiency', 'Flexibility'],
    keyWeaknesses: ['Market Presence', 'Financial Resources', 'Brand Recognition']
  },
  {
    id: 6,
    name: 'Enterprise Systems Co',
    industry: 'Technology',
    size: 'Medium',
    marketShare: 15.7,
    strength: 'Medium',
    weakness: 'Medium',
    threat: 'Medium',
    lastUpdated: '2024-01-15',
    status: 'Active',
    keyStrengths: ['Enterprise Focus', 'Stability', 'Customer Relationships'],
    keyWeaknesses: ['Innovation', 'Market Agility', 'Pricing']
  }
]

const Profiling = () => {
  const navigate = useNavigate()
  const [competitors, setCompetitors] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingCompetitor, setEditingCompetitor] = useState(null)
  const [prefillSnapshot, setPrefillSnapshot] = useState(null)
  const [modalFormKey, setModalFormKey] = useState(0)

  const loadCompetitors = async () => {
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 200))
      setCompetitors([...MOCK_COMPETITORS])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCompetitors()
  }, [])

  const stats = useMemo(() => {
    const total = competitors.length
    const activeCompetitors = competitors.filter((c) => c.status === 'Active').length
    const highThreatCompetitors = competitors.filter((c) => c.threat === 'High').length
    const avgMarketShare = total
      ? Math.round((competitors.reduce((s, c) => s + (c.marketShare || 0), 0) / total) * 10) / 10
      : 0
    return {
      totalCompetitors: total,
      activeCompetitors,
      highThreatCompetitors,
      avgMarketShare
    }
  }, [competitors])

  const handleEditCompetitor = (competitor) => {
    setPrefillSnapshot(null)
    setEditingCompetitor(competitor)
    setModalFormKey((k) => k + 1)
    setShowModal(true)
  }

  const handleDeleteCompetitor = (competitor) => {
    if (window.confirm(`Are you sure you want to delete competitor "${competitor.name}"?`)) {
      setCompetitors((prev) => prev.filter((c) => c.id !== competitor.id))
    }
  }

  const handleViewCompetitor = (competitor) => {
    console.log('View competitor:', competitor)
  }

  const handleEditCompetitorProfile = (competitor) => {
    handleEditCompetitor(competitor)
  }

  const handleDeleteCompetitorProfile = (competitor) => {
    handleDeleteCompetitor(competitor)
  }

  const columns = [
    {
      key: 'name',
      label: 'Competitor Details',
      width: '25%',
      render: (value, row) => (
        <div className="competitor-info">
          <div className="fw-semibold d-flex align-items-center">
            <Building size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">Industry: {row.industry}</small>
          <div className="competitor-meta">
            <small className="text-muted">Size: {row.size}</small>
          </div>
        </div>
      )
    },
    {
      key: 'marketShare',
      label: 'Market Share',
      width: '12%',
      render: (value) => (
        <div className="market-share">
          <div className="fw-bold text-primary">{value}%</div>
          <small className="text-muted">Share</small>
        </div>
      )
    },
    {
      key: 'strength',
      label: 'Strength',
      width: '10%',
      render: (value) => {
        const variants = {
          High: 'success',
          Medium: 'warning',
          Low: 'danger'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
    },
    {
      key: 'weakness',
      label: 'Weakness',
      width: '10%',
      render: (value) => {
        const variants = {
          High: 'danger',
          Medium: 'warning',
          Low: 'success'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
    },
    {
      key: 'threat',
      label: 'Threat Level',
      width: '10%',
      render: (value) => {
        const variants = {
          High: 'danger',
          Medium: 'warning',
          Low: 'success'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
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
      key: 'keyStrengths',
      label: 'Key Strengths',
      width: '15%',
      render: (value) => (
        <div className="strengths-info">
          <div className="fw-bold text-primary">{value.length}</div>
          <small className="text-muted">strengths</small>
        </div>
      )
    },
    {
      key: 'lastUpdated',
      label: 'Last Updated',
      width: '10%',
      render: (value) => {
        const date = new Date(value)
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        })
      }
    }
  ]

  const insightItems = useMemo(() => {
    const items = []
    if ((stats.totalCompetitors || 0) > 0) {
      items.push({
        title: `${stats.totalCompetitors} competitor profiles monitored with portfolio share averaging ${stats.avgMarketShare}%`,
        detail: `${stats.activeCompetitors} active trackers and ${stats.highThreatCompetitors} elevated threat classifications require differentiated positioning.`,
        tone: 'info'
      })
    }
    if ((stats.highThreatCompetitors || 0) >= 2) {
      items.push({
        title: 'High-threat concentration in the competitor set',
        detail: 'Review capture plans and escalation paths before major pursuits against top-tier rivals.',
        tone: 'warning'
      })
    } else if ((stats.totalCompetitors || 0) > 0) {
      items.push({
        title: 'Threat dispersion looks manageable versus peer count',
        detail: 'Use profiling data to deepen win themes against mid-tier and emerging players.',
        tone: 'success'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Competitor registry is ready for your first profiles',
        detail: 'Add profiling records to populate threat tiers, strengths, and market share signals.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  const openCreateModal = () => {
    setEditingCompetitor(null)
    setPrefillSnapshot(null)
    setModalFormKey((k) => k + 1)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCompetitor(null)
    setPrefillSnapshot(null)
    setModalFormKey((k) => k + 1)
  }

  const formSeed = editingCompetitor || prefillSnapshot || {}

  return (
    <>
      <ExecutiveCommandCenter
        className="profiling-page"
        showSkeleton={loading && !competitors.length}
        breadcrumbs={[
          { label: 'Tender Intelligence', onClick: () => navigate('/tender-intelligence') },
          {
            label: 'Competitor Intelligence',
            onClick: () => navigate('/tender-intelligence/competitors')
          },
          { label: 'Profiling & Tracking', active: true }
        ]}
        onBack={() => navigate('/tender-intelligence/competitors')}
        backLabel="Back to Competitor Intelligence"
        title="Competitor profiling command center"
        description="Comprehensive competitor profiles with tracking, threat tiers, and market share visibility for pursuits."
        heroActions={(
          <Button size="sm" variant="outline-primary" onClick={loadCompetitors} disabled={loading}>
            {loading ? 'Refreshing...' : <><RefreshCw size={16} className="me-1" /> Refresh</>}
          </Button>
        )}
        heroMeta="Competitor intelligence telemetry"
        outlookTitle="Competitive positioning outlook"
        outlookDescription={`${stats.totalCompetitors} organisations are profiled with ${stats.activeCompetitors} active and ${stats.highThreatCompetitors} high-threat classifications in the monitored set.`}
        outlookChips={[
          `${stats.totalCompetitors} tracked`,
          `${stats.activeCompetitors} active`,
          `${stats.highThreatCompetitors} high threat`,
          `${stats.avgMarketShare}% avg share`
        ]}
        insights={insightItems}
        kpiTitle="Competitor signal board"
        kpiMeta="Portfolio coverage and threat posture"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total competitors"
                value={stats.totalCompetitors || 0}
                hint="Profiled competitor organisations"
                tone="intel"
                trend="Registry"
                icon={<Users size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Active"
                value={stats.activeCompetitors || 0}
                hint="Under active surveillance"
                tone="success"
                trend="Live"
                icon={<Eye size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="High threat"
                value={stats.highThreatCompetitors || 0}
                hint="Priority rival attention"
                tone="danger"
                trend="Risk"
                icon={<AlertTriangle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg market share"
                value={stats.avgMarketShare || 0}
                hint="Estimated share across monitored set"
                tone="warning"
                trend="Share"
                suffix="%"
                icon={<TrendingUp size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Competitors (${competitors.length})`}
        tableActions={(
          <Button variant="primary" onClick={openCreateModal} disabled={loading}>
            <Plus size={16} className="me-2" />
            Add Competitor
          </Button>
        )}
      >
        <DataTable
          data={competitors}
          columns={columns}
          title={`Competitors (${competitors.length})`}
          searchable
          sortable
          exportable
          pagination
          pageSize={10}
          showActions
          showCheckboxes={false}
          onView={handleViewCompetitor}
          onEdit={handleEditCompetitorProfile}
          onDelete={handleDeleteCompetitorProfile}
          customActions={[
            {
              type: 'custom',
              label: 'View Analysis',
              onClick: (row) => {
                console.log('View Analysis:', row)
              }
            }
          ]}
          searchPlaceholder="Search competitors..."
          emptyMessage="No competitors found"
          loading={loading}
        />
      </ExecutiveCommandCenter>

      <FormDrawerModal
        show={showModal}
        onHide={closeModal}
        size="lg"
        onTestFill={
          showModal
            ? () => {
                setPrefillSnapshot(dummyProfilingCompetitorPrefill())
                setModalFormKey((k) => k + 1)
              }
            : undefined
        }
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCompetitor ? 'Edit Competitor' : 'Add New Competitor'}
          </Modal.Title>
        </Modal.Header>
        <Form key={modalFormKey}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={formSeed.name || ''}
                    placeholder="Enter company name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Industry</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={formSeed.industry || ''}
                    placeholder="Enter industry"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Company Size</Form.Label>
                  <Form.Select defaultValue={formSeed.size || 'Medium'}>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Market Share (%)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    defaultValue={formSeed.marketShare || ''}
                    placeholder="0.0"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select defaultValue={formSeed.status || 'Active'}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Monitoring">Monitoring</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Strength Level</Form.Label>
                  <Form.Select defaultValue={formSeed.strength || 'Medium'}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Threat Level</Form.Label>
                  <Form.Select defaultValue={formSeed.threat || 'Medium'}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Weakness Level</Form.Label>
                  <Form.Select defaultValue={formSeed.weakness || 'Medium'}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Key Strengths (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                defaultValue={formSeed.keyStrengths?.join(', ') || ''}
                placeholder="Innovation, Market Presence, Financial Stability"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Key Weaknesses (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                defaultValue={formSeed.keyWeaknesses?.join(', ') || ''}
                placeholder="Customer Service, Pricing, Market Reach"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingCompetitor ? 'Update Competitor' : 'Add Competitor'}
            </Button>
          </Modal.Footer>
        </Form>
      </FormDrawerModal>
    </>
  )
}

export default Profiling
