import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Badge, Modal, ProgressBar } from 'react-bootstrap'
import FormDrawerModal from '../../components/FormDrawerModal'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Plus, Edit, Trash2, Eye, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Target } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import './BidNoBid.scss'
import { dummyBidNoBidPrefill } from '../../utils/testFormDummies'

const BidNoBid = () => {
  const navigate = useNavigate()
  const [decisions, setDecisions] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingDecision, setEditingDecision] = useState(null)
  const [prefillSnapshot, setPrefillSnapshot] = useState(null)
  const [modalFormKey, setModalFormKey] = useState(0)
  const [stats, setStats] = useState({})

  // Mock data for demonstration
  useEffect(() => {
    setDecisions([
      {
        id: 1,
        tenderTitle: 'Infrastructure Development Project',
        client: 'City Municipal Corporation',
        value: 2500000,
        decision: 'Bid',
        confidence: 85,
        riskLevel: 'Medium',
        rationale: 'Strong technical capabilities and competitive pricing',
        createdBy: 'John Doe',
        createdDate: '2024-01-20',
        status: 'Approved'
      },
      {
        id: 2,
        tenderTitle: 'Software Development Services',
        client: 'Tech Solutions Inc.',
        value: 1200000,
        decision: 'No-Bid',
        confidence: 75,
        riskLevel: 'High',
        rationale: 'Limited expertise in required technology stack',
        createdBy: 'Jane Smith',
        createdDate: '2024-01-19',
        status: 'Pending'
      },
      {
        id: 3,
        tenderTitle: 'Consulting Services',
        client: 'Global Corp',
        value: 800000,
        decision: 'Bid',
        confidence: 92,
        riskLevel: 'Low',
        rationale: 'Excellent track record with similar projects',
        createdBy: 'Mike Johnson',
        createdDate: '2024-01-18',
        status: 'Approved'
      },
      {
        id: 4,
        tenderTitle: 'Healthcare Facility Construction',
        client: 'Health Department',
        value: 4500000,
        decision: 'Bid',
        confidence: 78,
        riskLevel: 'Medium',
        rationale: 'Strong construction capabilities and healthcare experience',
        createdBy: 'Sarah Wilson',
        createdDate: '2024-01-21',
        status: 'Pending'
      },
      {
        id: 5,
        tenderTitle: 'IT Infrastructure Upgrade',
        client: 'Banking Authority',
        value: 3200000,
        decision: 'No-Bid',
        confidence: 65,
        riskLevel: 'High',
        rationale: 'Insufficient cybersecurity expertise for banking sector',
        createdBy: 'David Brown',
        createdDate: '2024-01-22',
        status: 'Approved'
      },
      {
        id: 6,
        tenderTitle: 'Educational Technology Platform',
        client: 'Education Board',
        value: 1800000,
        decision: 'Bid',
        confidence: 88,
        riskLevel: 'Low',
        rationale: 'Proven experience in educational technology solutions',
        createdBy: 'Emily Davis',
        createdDate: '2024-01-23',
        status: 'Approved'
      },
      {
        id: 7,
        tenderTitle: 'Manufacturing Equipment Supply',
        client: 'Manufacturing Corp',
        value: 5600000,
        decision: 'Bid',
        confidence: 82,
        riskLevel: 'Medium',
        rationale: 'Strong supplier network and technical expertise',
        createdBy: 'Robert Taylor',
        createdDate: '2024-01-24',
        status: 'Pending'
      },
      {
        id: 8,
        tenderTitle: 'Environmental Impact Assessment',
        client: 'Environmental Agency',
        value: 950000,
        decision: 'No-Bid',
        confidence: 70,
        riskLevel: 'High',
        rationale: 'Limited environmental assessment capabilities',
        createdBy: 'Lisa Anderson',
        createdDate: '2024-01-25',
        status: 'Approved'
      }
    ])

    setStats({
      totalDecisions: 8,
      bidDecisions: 5,
      noBidDecisions: 3,
      avgConfidence: 79,
      pendingDecisions: 2
    })
  }, [])

  const handleEditDecision = (decision) => {
    setPrefillSnapshot(null)
    setEditingDecision(decision)
    setModalFormKey((k) => k + 1)
    setShowModal(true)
  }

  const handleDeleteDecision = (decision) => {
    if (window.confirm(`Are you sure you want to delete decision for "${decision.tenderTitle}"?`)) {
      setDecisions(prev => prev.filter(d => d.id !== decision.id))
    }
  }

  const handleViewDecision = (decision) => {
    console.log('View decision:', decision)
    // Navigate to view decision or open view modal
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'tenderTitle',
      label: 'Tender Details',
      width: '25%',
      render: (value, row) => (
        <div className="tender-info">
          <div className="fw-semibold d-flex align-items-center">
            <Target size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">Client: {row.client}</small>
        </div>
      )
    },
    {
      key: 'value',
      label: 'Value',
      width: '12%',
      render: (value) => (
        <div className="value-info">
          <div className="fw-bold text-primary">${(value / 1000000).toFixed(1)}M</div>
        </div>
      )
    },
    {
      key: 'decision',
      label: 'Decision',
      width: '10%',
      render: (value) => getDecisionBadge(value)
    },
    {
      key: 'confidence',
      label: 'Confidence',
      width: '12%',
      render: (value) => (
        <div className="confidence-info">
          <div className="fw-bold text-primary">{value}%</div>
          <ProgressBar
            now={value}
            variant={value >= 80 ? 'success' : value >= 60 ? 'warning' : 'danger'}
            size="sm"
            style={{ height: '4px' }}
          />
        </div>
      )
    },
    {
      key: 'riskLevel',
      label: 'Risk Level',
      width: '10%',
      render: (value) => getRiskBadge(value)
    },
    {
      key: 'status',
      label: 'Status',
      width: '10%',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'createdBy',
      label: 'Created By',
      width: '12%'
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      width: '12%',
      render: (value) => {
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        });
      }
    }
  ]

  const getDecisionBadge = (decision) => {
    const variants = {
      'Bid': 'success',
      'No-Bid': 'danger'
    }
    return <Badge bg={variants[decision] || 'secondary'}>{decision}</Badge>
  }

  const getRiskBadge = (risk) => {
    const variants = {
      'Low': 'success',
      'Medium': 'warning',
      'High': 'danger'
    }
    return <Badge bg={variants[risk] || 'secondary'}>{risk}</Badge>
  }

  const getStatusBadge = (status) => {
    const variants = {
      'Approved': 'success',
      'Pending': 'warning',
      'Rejected': 'danger'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getConfidenceIcon = (confidence) => {
    if (confidence >= 80) return <TrendingUp size={16} className="text-success" />
    if (confidence >= 60) return <Target size={16} className="text-warning" />
    return <TrendingDown size={16} className="text-danger" />
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const insightItems = useMemo(() => {
    const items = []
    if ((stats.totalDecisions || 0) > 0) {
      items.push({
        title: `${stats.bidDecisions || 0} bid paths vs ${stats.noBidDecisions || 0} no-bid holds`,
        detail: `${stats.avgConfidence || 0}% average confidence with ${stats.pendingDecisions || 0} decision(s) awaiting approval.`,
        tone: 'info'
      })
    }
    if ((stats.pendingDecisions || 0) > 0) {
      items.push({
        title: 'Approvals backlog needs a steering touchpoint',
        detail: 'Clear pending items before hard deadlines lock the submission window.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Start logging pursuit discipline',
        detail: 'Record bid / no-bid rationale to build repeatable gates and confidence baselines.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  const formSeed = editingDecision || prefillSnapshot || {}

  const closeBidModal = () => {
    setShowModal(false)
    setEditingDecision(null)
    setPrefillSnapshot(null)
    setModalFormKey((k) => k + 1)
  }

  return (
    <>
      <ExecutiveCommandCenter
        className="bid-no-bid-page"
        breadcrumbs={[
          { label: 'Qualification & Evaluation', onClick: () => navigate('/qualification-evaluation') },
          { label: 'Bid / no-bid', active: true }
        ]}
        onBack={() => navigate('/qualification-evaluation')}
        backLabel="Back to modules"
        title="Bid / no-bid command center"
        description="Make informed bid and no-bid decisions with risk, confidence, and governance visibility."
        heroMeta="Pursuit intelligence"
        outlookTitle="Decision outlook"
        outlookDescription={`${stats.totalDecisions || 0} logged decisions — ${stats.bidDecisions || 0} bid, ${stats.noBidDecisions || 0} no-bid, ${stats.pendingDecisions || 0} pending.`}
        outlookChips={[
          `${stats.totalDecisions || 0} total`,
          `${stats.bidDecisions || 0} bid`,
          `${stats.noBidDecisions || 0} no-bid`,
          `${stats.avgConfidence || 0}% avg confidence`
        ]}
        insights={insightItems}
        kpiTitle="Decision signal board"
        kpiMeta="Posture vs confidence"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total decisions"
                value={stats.totalDecisions || 0}
                hint="Recorded pursuits"
                tone="intel"
                trend="Register"
                icon={<Target size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Bid"
                value={stats.bidDecisions || 0}
                hint="Proceed posture"
                tone="success"
                trend="Go"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="No-bid"
                value={stats.noBidDecisions || 0}
                hint="Declined pursuits"
                tone="warning"
                trend="Hold"
                icon={<AlertTriangle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg confidence"
                value={stats.avgConfidence || 0}
                hint="Model + leader stance"
                tone={(stats.avgConfidence || 0) >= 80 ? 'success' : 'warning'}
                trend="Quality"
                suffix="%"
                icon={<TrendingUp size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Bid / no-bid decisions (${decisions.length})`}
        tableActions={(
          <Button
            variant="primary"
            onClick={() => {
              setEditingDecision(null)
              setPrefillSnapshot(null)
              setModalFormKey((k) => k + 1)
              setShowModal(true)
            }}
            className="add-decision-btn"
          >
            <Plus size={20} className="me-2" />
            New decision
          </Button>
        )}
      >
        <DataTable
          data={decisions}
          columns={columns}
          title={`Bid/No-Bid Decisions (${decisions.length})`}
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          pageSize={10}
          showActions={true}
          showCheckboxes={false}
          onView={handleViewDecision}
          onEdit={handleEditDecision}
          onDelete={handleDeleteDecision}
          customActions={[
            {
              type: 'custom',
              label: 'View Rationale',
              onClick: (row) => {
                console.log('View rationale:', row.rationale);
              }
            }
          ]}
          searchPlaceholder="Search decisions..."
          emptyMessage="No decisions found"
          loading={loading}
        />
      </ExecutiveCommandCenter>

      <FormDrawerModal
        show={showModal}
        onHide={closeBidModal}
        size="lg"
        onTestFill={
          showModal
            ? () => {
                setPrefillSnapshot(dummyBidNoBidPrefill())
                setModalFormKey((k) => k + 1)
              }
            : undefined
        }
      >
          <Modal.Header closeButton>
            <Modal.Title>
              {editingDecision ? 'Edit Bid/No-Bid Decision' : 'New Bid/No-Bid Decision'}
            </Modal.Title>
          </Modal.Header>
          <Form key={modalFormKey}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tender Title</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={formSeed.tenderTitle || ''}
                      placeholder="Enter tender title"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Client</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={formSeed.client || ''}
                      placeholder="Enter client name"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tender Value</Form.Label>
                    <Form.Control
                      type="number"
                      defaultValue={formSeed.value ?? ''}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Decision</Form.Label>
                    <Form.Select defaultValue={formSeed.decision || 'Bid'}>
                      <option value="Bid">Bid</option>
                      <option value="No-Bid">No-Bid</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Risk Level</Form.Label>
                    <Form.Select defaultValue={formSeed.riskLevel || 'Medium'}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Confidence Level (%)</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={formSeed.confidence ?? ''}
                      placeholder="0-100"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select defaultValue={formSeed.status || 'Pending'}>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Rationale</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  defaultValue={formSeed.rationale || ''}
                  placeholder="Explain the reasoning behind this decision..."
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeBidModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingDecision ? 'Update Decision' : 'Create Decision'}
              </Button>
            </Modal.Footer>
          </Form>
        </FormDrawerModal>
    </>
  )
}

export default BidNoBid