import React, { useState, useEffect } from 'react'
import { Button, Badge, Alert, Row, Col } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Shield, Plus, DollarSign, AlertTriangle, Calculator, TrendingUp, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import './GuaranteeCostModel.scss'

const GuaranteeCostModel = () => {
  const navigate = useNavigate()
  const [guaranteeModels, setGuaranteeModels] = useState([])
  const [stats, setStats] = useState({})

  useEffect(() => {
    // Mock data for guarantee cost models
    setGuaranteeModels([
      {
        id: 1,
        guaranteeName: 'Performance Guarantee - Highway Project',
        guaranteeType: 'Performance Bond',
        projectValue: 25000000,
        guaranteeAmount: 2500000,
        guaranteePercentage: 10.0,
        currency: 'USD',
        duration: 24,
        durationUnit: 'months',
        riskLevel: 'Medium',
        status: 'Active',
        issuer: 'Bank of America',
        beneficiary: 'Ministry of Transport',
        premiumRate: 1.5,
        premiumAmount: 37500,
        aiRiskAssessment: 'Moderate risk with stable project parameters',
        aiConfidence: 85,
        lastReview: '2024-02-14',
        nextReview: '2024-05-14',
        createdBy: 'John Doe',
        priority: 'High'
      },
      {
        id: 2,
        guaranteeName: 'Advance Payment Guarantee - Digital Platform',
        guaranteeType: 'Advance Payment',
        projectValue: 18000000,
        guaranteeAmount: 3600000,
        guaranteePercentage: 20.0,
        currency: 'USD',
        duration: 18,
        durationUnit: 'months',
        riskLevel: 'High',
        status: 'Active',
        issuer: 'JPMorgan Chase',
        beneficiary: 'Digital Transformation Authority',
        premiumRate: 2.2,
        premiumAmount: 79200,
        aiRiskAssessment: 'High risk due to technology complexity',
        aiConfidence: 78,
        lastReview: '2024-02-13',
        nextReview: '2024-05-13',
        createdBy: 'Jane Smith',
        priority: 'Critical'
      },
      {
        id: 3,
        guaranteeName: 'Warranty Guarantee - Medical Equipment',
        guaranteeType: 'Warranty Bond',
        projectValue: 32000000,
        guaranteeAmount: 1600000,
        guaranteePercentage: 5.0,
        currency: 'USD',
        duration: 36,
        durationUnit: 'months',
        riskLevel: 'Low',
        status: 'Active',
        issuer: 'Wells Fargo',
        beneficiary: 'Health Ministry',
        premiumRate: 0.8,
        premiumAmount: 12800,
        aiRiskAssessment: 'Low risk with proven equipment reliability',
        aiConfidence: 92,
        lastReview: '2024-02-12',
        nextReview: '2024-05-12',
        createdBy: 'Mike Johnson',
        priority: 'Medium'
      },
      {
        id: 4,
        guaranteeName: 'Bid Guarantee - Smart City Development',
        guaranteeType: 'Bid Bond',
        projectValue: 45000000,
        guaranteeAmount: 900000,
        guaranteePercentage: 2.0,
        currency: 'USD',
        duration: 6,
        durationUnit: 'months',
        riskLevel: 'Medium',
        status: 'Pending',
        issuer: 'Citibank',
        beneficiary: 'City Development Authority',
        premiumRate: 1.0,
        premiumAmount: 9000,
        aiRiskAssessment: 'Medium risk with complex urban requirements',
        aiConfidence: 80,
        lastReview: '2024-02-11',
        nextReview: '2024-05-11',
        createdBy: 'Sarah Wilson',
        priority: 'High'
      },
      {
        id: 5,
        guaranteeName: 'Retention Guarantee - Energy Project',
        guaranteeType: 'Retention Bond',
        projectValue: 28000000,
        guaranteeAmount: 1400000,
        guaranteePercentage: 5.0,
        currency: 'USD',
        duration: 12,
        durationUnit: 'months',
        riskLevel: 'Low',
        status: 'Active',
        issuer: 'Goldman Sachs',
        beneficiary: 'Energy Ministry',
        premiumRate: 0.9,
        premiumAmount: 12600,
        aiRiskAssessment: 'Low risk with established energy sector',
        aiConfidence: 88,
        lastReview: '2024-02-10',
        nextReview: '2024-05-10',
        createdBy: 'David Brown',
        priority: 'Medium'
      },
      {
        id: 6,
        guaranteeName: 'Maintenance Guarantee - Educational Platform',
        guaranteeType: 'Maintenance Bond',
        projectValue: 15000000,
        guaranteeAmount: 750000,
        guaranteePercentage: 5.0,
        currency: 'USD',
        duration: 24,
        durationUnit: 'months',
        riskLevel: 'Low',
        status: 'Active',
        issuer: 'Morgan Stanley',
        beneficiary: 'Education Ministry',
        premiumRate: 0.7,
        premiumAmount: 5250,
        aiRiskAssessment: 'Low risk with proven educational technology',
        aiConfidence: 90,
        lastReview: '2024-02-09',
        nextReview: '2024-05-09',
        createdBy: 'Lisa Davis',
        priority: 'Low'
      }
    ])

    setStats({
      totalGuarantees: 6,
      totalGuaranteeAmount: 10850000,
      totalPremiumAmount: 156350,
      activeGuarantees: 5,
      pendingGuarantees: 1,
      avgRiskLevel: 'Medium',
      totalProjectValue: 163000000,
      avgAiConfidence: 85
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
    if (window.confirm('Are you sure you want to delete this guarantee cost model?')) {
      setGuaranteeModels(prev => prev.filter(g => g.id !== guarantee.id))
    }
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'guaranteeName',
      label: 'Guarantee Details',
      width: '20%',
      render: (value, row) => (
        <div className="guarantee-info">
          <div className="fw-semibold d-flex align-items-center">
            <Shield size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.guaranteeType}</small>
          <div className="guarantee-meta">
            <small className="text-muted">Issuer: {row.issuer}</small>
          </div>
        </div>
      )
    },
    {
      key: 'projectValue',
      label: 'Project Value',
      width: '10%',
      render: (value, row) => (
        <div className="project-value">
          <div className="fw-bold text-primary">
            ${(value / 1000000).toFixed(1)}M
          </div>
          <small className="text-muted">{row.currency}</small>
        </div>
      )
    },
    {
      key: 'guaranteeAmount',
      label: 'Guarantee Amount',
      width: '12%',
      render: (value, row) => (
        <div className="guarantee-amount">
          <div className="fw-bold text-warning">
            ${(value / 1000000).toFixed(1)}M
          </div>
          <small className="text-muted">{row.guaranteePercentage}%</small>
        </div>
      )
    },
    {
      key: 'premiumAmount',
      label: 'Premium Amount',
      width: '10%',
      render: (value, row) => (
        <div className="premium-amount">
          <div className="fw-bold text-success">
            ${(value / 1000).toFixed(0)}K
          </div>
          <small className="text-muted">{row.premiumRate}% rate</small>
        </div>
      )
    },
    {
      key: 'duration',
      label: 'Duration',
      width: '8%',
      render: (value, row) => (
        <div className="duration">
          <div className="fw-bold text-info">{value}</div>
          <small className="text-muted">{row.durationUnit}</small>
        </div>
      )
    },
    {
      key: 'riskLevel',
      label: 'Risk Level',
      width: '8%',
      render: (value) => {
        const variants = {
          'Low': 'success',
          'Medium': 'warning',
          'High': 'danger'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
    },
    {
      key: 'status',
      label: 'Status',
      width: '8%',
      render: (value) => (
        <Badge bg={value === 'Active' ? 'success' : 'warning'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'aiConfidence',
      label: 'AI Confidence',
      width: '8%',
      render: (value) => (
        <div className="ai-confidence">
          <div className="fw-bold text-info">{value}%</div>
          <small className="text-muted">confidence</small>
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
      key: 'nextReview',
      label: 'Next Review',
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

  const guaranteeM = (stats.totalGuaranteeAmount || 0) / 1000000
  const premiumK = (stats.totalPremiumAmount || 0) / 1000

  return (
    <>
      <ExecutiveCommandCenter
        className="guarantee-cost-model-page"
        breadcrumbs={[
          { label: 'Pricing & Simulation', onClick: () => navigate('/pricing-simulation') },
          { label: 'Guarantee Cost Model', active: true }
        ]}
        onBack={() => navigate('/pricing-simulation')}
        backLabel="Back to Modules"
        title="Guarantee Cost Model"
        description="Manage guarantee costs and risk assessment with AI-powered analysis"
        heroMeta="Risk capital"
        outlookTitle="Guarantee outlook"
        outlookDescription={`${stats.totalGuarantees || 0} programs — $${guaranteeM.toFixed(1)}M exposure, $${premiumK.toFixed(0)}K premium stack, ${stats.avgAiConfidence || 0}% AI confidence.`}
        outlookChips={[
          `${stats.totalGuarantees || 0} guarantees`,
          `$${guaranteeM.toFixed(1)}M exposure`,
          `$${premiumK.toFixed(0)}K premium`,
          `${stats.avgAiConfidence || 0}% AI confidence`
        ]}
        insights={[]}
        kpiTitle="Guarantee signal board"
        kpiMeta="Exposure vs premium"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total guarantees"
                value={stats.totalGuarantees || 0}
                hint="Booked instruments"
                tone="intel"
                trend="Coverage"
                icon={<Shield size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Guarantee amount"
                displayValue={`$${guaranteeM.toFixed(1)}M`}
                hint="Notional exposure"
                tone="success"
                trend="Scale"
                icon={<DollarSign size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total premium"
                displayValue={`$${premiumK.toFixed(0)}K`}
                hint="Cost of carry"
                tone="warning"
                trend="Spend"
                icon={<Calculator size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.avgAiConfidence || 0}
                hint="Risk model trust"
                tone="intel"
                trend="Assurance"
                suffix="%"
                icon={<TrendingUp size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Guarantee cost models (${guaranteeModels.length})`}
        tableActions={(
          <>
            <Button variant="primary" className="me-2">
              <Plus size={16} className="me-2" />
              Create New Guarantee
            </Button>
            <Button variant="outline-secondary">
              <FileText size={16} className="me-2" />
              Generate Report
            </Button>
          </>
        )}
      >
        {stats.pendingGuarantees > 0 && (
          <Alert variant="warning" className="d-flex align-items-center mb-3">
            <AlertTriangle size={20} className="me-2" />
            <div>
              <strong>Pending Guarantees:</strong> {stats.pendingGuarantees} guarantee(s) require review and approval. 
              Complete the approval process to activate guarantees.
            </div>
          </Alert>
        )}
        <DataTable
          data={guaranteeModels}
          columns={columns}
          title="Guarantee Cost Models"
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
          searchPlaceholder="Search guarantee models..."
          emptyMessage="No guarantee cost models found"
          loading={false}
        />
      </ExecutiveCommandCenter>
    </>
  )
}

export default GuaranteeCostModel