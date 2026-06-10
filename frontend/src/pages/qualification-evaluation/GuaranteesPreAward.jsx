import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Badge, Alert } from 'react-bootstrap'
import { Shield, Plus, Edit, Trash2, Eye, CheckCircle, AlertTriangle, FileText, Brain, DollarSign } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import './GuaranteesPreAward.scss'

const GuaranteesPreAward = () => {
  const navigate = useNavigate()
  const [guarantees, setGuarantees] = useState([])
  const [stats, setStats] = useState({})

  useEffect(() => {
    setGuarantees([
      {
        id: 1,
        title: 'Bid Security Guarantee',
        description: 'Bank guarantee for bid security as per tender requirements',
        type: 'Bid Security',
        status: 'Active',
        tenderId: 'TEN-2024-001',
        client: 'Ministry of Transport',
        bank: 'National Bank Ltd.',
        amount: 500000,
        currency: 'USD',
        issuedDate: '2024-01-15',
        expiryDate: '2024-06-15',
        aiRiskAssessment: 'Low risk - Strong bank rating',
        aiConfidence: 94,
        complianceScore: 98,
        documents: 5,
        priority: 'High'
      },
      {
        id: 2,
        title: 'Performance Guarantee',
        description: 'Performance guarantee for project execution assurance',
        type: 'Performance',
        status: 'Active',
        tenderId: 'TEN-2024-002',
        client: 'City Development Authority',
        bank: 'International Bank Corp.',
        amount: 1200000,
        currency: 'USD',
        issuedDate: '2024-01-20',
        expiryDate: '2025-01-20',
        aiRiskAssessment: 'Medium risk - Monitor bank stability',
        aiConfidence: 87,
        complianceScore: 92,
        documents: 8,
        priority: 'High'
      },
      {
        id: 3,
        title: 'Advance Payment Guarantee',
        description: 'Guarantee for advance payment security',
        type: 'Advance Payment',
        status: 'Under Review',
        tenderId: 'TEN-2024-003',
        client: 'Environmental Agency',
        bank: 'Regional Bank Ltd.',
        amount: 800000,
        currency: 'USD',
        issuedDate: '2024-01-25',
        expiryDate: '2024-12-31',
        aiRiskAssessment: 'High risk - Bank rating concerns',
        aiConfidence: 72,
        complianceScore: 78,
        documents: 6,
        priority: 'Critical'
      },
      {
        id: 4,
        title: 'Warranty Guarantee',
        description: 'Warranty guarantee for post-completion defects',
        type: 'Warranty',
        status: 'Active',
        tenderId: 'TEN-2024-004',
        client: 'Manufacturing Corp',
        bank: 'Global Bank Inc.',
        amount: 300000,
        currency: 'USD',
        issuedDate: '2024-01-18',
        expiryDate: '2026-01-18',
        aiRiskAssessment: 'Low risk - Excellent bank standing',
        aiConfidence: 96,
        complianceScore: 99,
        documents: 7,
        priority: 'Medium'
      },
      {
        id: 5,
        title: 'Retention Money Guarantee',
        description: 'Guarantee for retention money release',
        type: 'Retention',
        status: 'Expired',
        tenderId: 'TEN-2024-005',
        client: 'Construction Authority',
        bank: 'Local Bank Ltd.',
        amount: 200000,
        currency: 'USD',
        issuedDate: '2023-12-01',
        expiryDate: '2024-01-31',
        aiRiskAssessment: 'Expired - Renewal required',
        aiConfidence: 0,
        complianceScore: 0,
        documents: 4,
        priority: 'Critical'
      },
      {
        id: 6,
        title: 'Mobilization Guarantee',
        description: 'Guarantee for project mobilization and startup',
        type: 'Mobilization',
        status: 'Active',
        tenderId: 'TEN-2024-006',
        client: 'Infrastructure Dept',
        bank: 'Commercial Bank Ltd.',
        amount: 600000,
        currency: 'USD',
        issuedDate: '2024-01-22',
        expiryDate: '2024-08-22',
        aiRiskAssessment: 'Medium risk - Standard bank rating',
        aiConfidence: 83,
        complianceScore: 89,
        documents: 9,
        priority: 'High'
      }
    ])

    setStats({
      totalGuarantees: 6,
      active: 4,
      underReview: 1,
      expired: 1,
      totalAmount: 3600000,
      avgAiConfidence: 72,
      avgComplianceScore: 76,
      criticalExpiry: 1
    })
  }, [])

  const handleViewGuarantee = (guarantee) => {
    console.log('View guarantee:', guarantee)
    // Navigate to view guarantee or open view modal
  }

  const handleEditGuarantee = (guarantee) => {
    console.log('Edit guarantee:', guarantee)
    // Navigate to edit guarantee or open edit modal
  }

  const handleDeleteGuarantee = (guarantee) => {
    if (window.confirm(`Are you sure you want to delete guarantee "${guarantee.title}"?`)) {
      setGuarantees(prev => prev.filter(g => g.id !== guarantee.id))
    }
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'title',
      label: 'Guarantee Details',
      width: '25%',
      render: (value, row) => (
        <div className="guarantee-info">
          <div className="fw-semibold d-flex align-items-center">
            <Shield size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.description}</small>
          <div className="guarantee-meta">
            <small className="text-muted">Tender: {row.tenderId}</small>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      width: '12%',
      render: (value) => (
        <Badge bg="info">{value}</Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: '10%',
      render: (value) => {
        const variants = {
          'Active': 'success',
          'Under Review': 'warning',
          'Expired': 'danger',
          'Inactive': 'secondary'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
    },
    {
      key: 'amount',
      label: 'Amount',
      width: '12%',
      render: (value, row) => (
        <div className="amount-info">
          <div className="fw-bold text-primary">${(value / 1000).toFixed(0)}K</div>
          <small className="text-muted">{row.currency}</small>
        </div>
      )
    },
    {
      key: 'bank',
      label: 'Bank',
      width: '15%',
      render: (value) => (
        <div className="bank-info">
          <span className="fw-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'aiConfidence',
      label: 'AI Confidence',
      width: '10%',
      render: (value) => (
        <div className="confidence-info">
          <div className="fw-bold text-primary">{value}%</div>
          <small className="text-muted">AI Score</small>
        </div>
      )
    },
    {
      key: 'priority',
      label: 'Priority',
      width: '8%',
      render: (value) => {
        const variants = {
          'Critical': 'danger',
          'High': 'warning',
          'Medium': 'info',
          'Low': 'success'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
    },
    {
      key: 'expiryDate',
      label: 'Expiry Date',
      width: '8%',
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

  const insightItems = useMemo(() => {
    const items = []
    if ((stats.totalGuarantees || 0) > 0) {
      items.push({
        title: `${stats.active || 0} active guarantees with $${((stats.totalAmount || 0) / 1000000).toFixed(1)}M total exposure`,
        detail: `${stats.avgAiConfidence || 0}% average AI stance on bank and instrument risk.`,
        tone: 'info'
      })
    }
    if ((stats.criticalExpiry || 0) > 0) {
      items.push({
        title: `${stats.criticalExpiry} instrument(s) breached renewal windows`,
        detail: 'Re-issue or substitute banking lines before procurement milestones.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Register guarantees ahead of qualification gates',
        detail: 'Store instruments centrally to correlate expiry, lien events, and compliance scores.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  return (
    <ExecutiveCommandCenter
      className="guarantees-pre-award-page"
      breadcrumbs={[
        { label: 'Qualification & Evaluation', onClick: () => navigate('/qualification-evaluation') },
        { label: 'Guarantees pre-award', active: true }
      ]}
      onBack={() => navigate('/qualification-evaluation')}
      backLabel="Back to modules"
      title="Pre-award guarantees command center"
      description="Track bid security and performance instruments with modeled bank risk before award."
      heroMeta="Instrument telemetry"
      outlookTitle="Exposure outlook"
      outlookDescription={`${stats.totalGuarantees || 0} instruments — ${stats.active || 0} active — ${stats.underReview || 0} under review.`}
      outlookChips={[
        `${stats.totalGuarantees || 0} guarantees`,
        `${stats.active || 0} active`,
        `$${((stats.totalAmount || 0) / 1000000).toFixed(1)}M exposure`,
        `${stats.avgAiConfidence || 0}% AI stance`
      ]}
      insights={insightItems}
      kpiTitle="Guarantee signal board"
      kpiMeta="Liquidity and assurance"
      kpiContent={(
        <Row className="g-3">
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Total guarantees"
              value={stats.totalGuarantees || 0}
              hint="Registered instruments"
              tone="intel"
              trend="Coverage"
              icon={<Shield size={20} />}
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Exposure"
              value={0}
              displayValue={`$${((stats.totalAmount || 0) / 1000000).toFixed(1)}M`}
              hint="Aggregate face value"
              tone="warning"
              trend="Notional"
              icon={<DollarSign size={20} />}
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Avg AI confidence"
              value={stats.avgAiConfidence || 0}
              hint="Counterparty stance"
              tone={(stats.avgAiConfidence || 0) >= 80 ? 'success' : 'warning'}
              trend="Model"
              suffix="%"
              icon={<Brain size={20} />}
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Critical expiry"
              value={stats.criticalExpiry || 0}
              hint="Renew urgently"
              tone={stats.criticalExpiry > 0 ? 'danger' : 'success'}
              trend="SLA"
              icon={<AlertTriangle size={20} />}
            />
          </Col>
        </Row>
      )}
      tableTitle={`Pre-award guarantees (${guarantees.length})`}
      tableActions={(
        <>
          <Button variant="primary" className="me-2">
            <Plus size={16} className="me-2" />
            New guarantee
          </Button>
          <Button variant="outline-secondary">
            <FileText size={16} className="me-2" />
            Export
          </Button>
        </>
      )}
    >
      {stats.criticalExpiry > 0 ? (
        <Alert variant="warning" className="d-flex align-items-center mb-3">
          <AlertTriangle size={20} className="me-2" />
          <strong>Warning:</strong> {stats.criticalExpiry} guarantee(s) have expired and require immediate attention.
        </Alert>
      ) : null}
      <DataTable
        data={guarantees}
        columns={columns}
        title="Pre-Award Guarantees"
        searchable={true}
        sortable={true}
        exportable={true}
        pagination={true}
        pageSize={10}
        showActions={true}
        showCheckboxes={false}
        onView={handleViewGuarantee}
        onEdit={handleEditGuarantee}
        onDelete={handleDeleteGuarantee}
        customActions={[
          {
            type: 'custom',
            label: 'Risk Assessment',
            onClick: (row) => {
              console.log('Risk Assessment:', row.aiRiskAssessment);
            }
          }
        ]}
        searchPlaceholder="Search guarantees..."
        emptyMessage="No guarantees found"
        loading={false}
      />
    </ExecutiveCommandCenter>
  )
}

export default GuaranteesPreAward