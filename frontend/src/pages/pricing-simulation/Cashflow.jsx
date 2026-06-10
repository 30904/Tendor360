import React, { useState, useEffect } from 'react'
import { Button, Badge, Alert, Row, Col } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { TrendingUp, Plus, DollarSign, Calendar, Target, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import './Cashflow.scss'

const Cashflow = () => {
  const navigate = useNavigate()
  const [cashflows, setCashflows] = useState([])
  const [stats, setStats] = useState({})

  useEffect(() => {
    // Mock data for cashflows
    setCashflows([
      {
        id: 1,
        projectName: 'Highway Construction Phase 3',
        client: 'Ministry of Transport',
        totalValue: 25000000,
        currency: 'USD',
        status: 'Active',
        startDate: '2024-03-01',
        endDate: '2025-02-28',
        currentPhase: 'Construction',
        progress: 45,
        cashInflow: 11250000,
        cashOutflow: 8750000,
        netCashflow: 2500000,
        aiForecast: 'Positive cashflow expected with 15% variance',
        riskLevel: 'Medium',
        priority: 'High',
        lastUpdate: '2024-02-14',
        nextMilestone: 'Phase 2 Completion',
        daysRemaining: 45
      },
      {
        id: 2,
        projectName: 'Digital Government Platform',
        client: 'Digital Transformation Authority',
        totalValue: 18000000,
        currency: 'USD',
        status: 'Active',
        startDate: '2024-04-01',
        endDate: '2025-03-31',
        currentPhase: 'Development',
        progress: 25,
        cashInflow: 4500000,
        cashOutflow: 5200000,
        netCashflow: -700000,
        aiForecast: 'Negative cashflow in early stages, positive by Q3',
        riskLevel: 'High',
        priority: 'Medium',
        lastUpdate: '2024-02-13',
        nextMilestone: 'Alpha Release',
        daysRemaining: 60
      },
      {
        id: 3,
        projectName: 'Healthcare Infrastructure Upgrade',
        client: 'Health Ministry',
        totalValue: 32000000,
        currency: 'USD',
        status: 'Active',
        startDate: '2024-01-15',
        endDate: '2024-12-31',
        currentPhase: 'Implementation',
        progress: 65,
        cashInflow: 20800000,
        cashOutflow: 19500000,
        netCashflow: 1300000,
        aiForecast: 'Strong positive cashflow with minimal risk',
        riskLevel: 'Low',
        priority: 'Critical',
        lastUpdate: '2024-02-12',
        nextMilestone: 'System Integration',
        daysRemaining: 30
      },
      {
        id: 4,
        projectName: 'Smart City Development',
        client: 'City Development Authority',
        totalValue: 45000000,
        currency: 'USD',
        status: 'Planning',
        startDate: '2024-05-01',
        endDate: '2026-04-30',
        currentPhase: 'Design',
        progress: 15,
        cashInflow: 0,
        cashOutflow: 2500000,
        netCashflow: -2500000,
        aiForecast: 'Initial negative cashflow, positive from month 6',
        riskLevel: 'Medium',
        priority: 'High',
        lastUpdate: '2024-02-11',
        nextMilestone: 'Design Approval',
        daysRemaining: 75
      },
      {
        id: 5,
        projectName: 'Renewable Energy Project',
        client: 'Energy Ministry',
        totalValue: 28000000,
        currency: 'USD',
        status: 'Active',
        startDate: '2024-06-01',
        endDate: '2025-05-31',
        currentPhase: 'Procurement',
        progress: 30,
        cashInflow: 8400000,
        cashOutflow: 9200000,
        netCashflow: -800000,
        aiForecast: 'Negative cashflow until equipment delivery',
        riskLevel: 'Medium',
        priority: 'Medium',
        lastUpdate: '2024-02-10',
        nextMilestone: 'Equipment Delivery',
        daysRemaining: 90
      },
      {
        id: 6,
        projectName: 'Educational Technology Platform',
        client: 'Education Ministry',
        totalValue: 15000000,
        currency: 'USD',
        status: 'Active',
        startDate: '2024-02-01',
        endDate: '2024-11-30',
        currentPhase: 'Testing',
        progress: 80,
        cashInflow: 12000000,
        cashOutflow: 10500000,
        netCashflow: 1500000,
        aiForecast: 'Consistent positive cashflow with low risk',
        riskLevel: 'Low',
        priority: 'High',
        lastUpdate: '2024-02-09',
        nextMilestone: 'Beta Launch',
        daysRemaining: 15
      }
    ])

    setStats({
      totalProjects: 6,
      totalValue: 163000000,
      activeProjects: 5,
      totalCashInflow: 56950000,
      totalCashOutflow: 54650000,
      netCashflow: 2300000,
      avgProgress: 43,
      criticalDeadlines: 2
    })
  }, [])

  const handleViewCashflow = (cashflow) => {
    console.log('View cashflow:', cashflow)
    // Navigate to view cashflow or open view modal
  }

  const handleEditCashflow = (cashflow) => {
    console.log('Edit cashflow:', cashflow)
    // Navigate to edit cashflow or open edit modal
  }

  const handleDeleteCashflow = (cashflow) => {
    if (window.confirm('Are you sure you want to delete this cashflow?')) {
      setCashflows(prev => prev.filter(c => c.id !== cashflow.id))
    }
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'projectName',
      label: 'Project Details',
      width: '20%',
      render: (value, row) => (
        <div className="project-info">
          <div className="fw-semibold d-flex align-items-center">
            <Target size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.client}</small>
          <div className="project-meta">
            <small className="text-muted">Phase: {row.currentPhase}</small>
          </div>
        </div>
      )
    },
    {
      key: 'totalValue',
      label: 'Total Value',
      width: '10%',
      render: (value, row) => (
        <div className="total-value">
          <div className="fw-bold text-primary">
            ${(value / 1000000).toFixed(1)}M
          </div>
          <small className="text-muted">{row.currency}</small>
        </div>
      )
    },
    {
      key: 'progress',
      label: 'Progress',
      width: '8%',
      render: (value) => (
        <div className="progress-info">
          <div className="fw-bold text-success">{value}%</div>
          <small className="text-muted">complete</small>
        </div>
      )
    },
    {
      key: 'cashInflow',
      label: 'Cash Inflow',
      width: '10%',
      render: (value) => (
        <div className="cash-inflow">
          <div className="fw-bold text-success">
            ${(value / 1000000).toFixed(1)}M
          </div>
          <small className="text-muted">inflow</small>
        </div>
      )
    },
    {
      key: 'cashOutflow',
      label: 'Cash Outflow',
      width: '10%',
      render: (value) => (
        <div className="cash-outflow">
          <div className="fw-bold text-danger">
            ${(value / 1000000).toFixed(1)}M
          </div>
          <small className="text-muted">outflow</small>
        </div>
      )
    },
    {
      key: 'netCashflow',
      label: 'Net Cashflow',
      width: '10%',
      render: (value) => (
        <div className="net-cashflow">
          <div className={`fw-bold ${value >= 0 ? 'text-success' : 'text-danger'}`}>
            ${(value / 1000000).toFixed(1)}M
          </div>
          <small className="text-muted">net</small>
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
      key: 'daysRemaining',
      label: 'Days Remaining',
      width: '8%',
      render: (value) => (
        <div className="days-remaining">
          <div className="fw-bold text-warning">{value}</div>
          <small className="text-muted">days</small>
        </div>
      )
    },
    {
      key: 'endDate',
      label: 'End Date',
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

  const totalValM = (stats.totalValue || 0) / 1000000
  const netCfM = (stats.netCashflow || 0) / 1000000

  return (
    <>
      <ExecutiveCommandCenter
        className="cashflow-page"
        breadcrumbs={[
          { label: 'Pricing & Simulation', onClick: () => navigate('/pricing-simulation') },
          { label: 'Cashflow', active: true }
        ]}
        onBack={() => navigate('/pricing-simulation')}
        backLabel="Back to Modules"
        title="Cashflow"
        description="Manage project cashflow and financial planning with AI-powered forecasting"
        heroMeta="Liquidity"
        outlookTitle="Cashflow outlook"
        outlookDescription={`${stats.totalProjects || 0} projects — $${totalValM.toFixed(0)}M book, $${netCfM.toFixed(1)}M net cashflow, ${stats.criticalDeadlines || 0} critical deadline flags.`}
        outlookChips={[
          `${stats.totalProjects || 0} projects`,
          `$${totalValM.toFixed(0)}M value`,
          `$${netCfM.toFixed(1)}M net`,
          `${stats.criticalDeadlines || 0} critical`
        ]}
        insights={[]}
        kpiTitle="Cashflow signal board"
        kpiMeta="Projects vs runway"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total projects"
                value={stats.totalProjects || 0}
                hint="Active programs"
                tone="intel"
                trend="Coverage"
                icon={<Target size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total value"
                displayValue={`$${totalValM.toFixed(0)}M`}
                hint="Contracted book"
                tone="success"
                trend="Scale"
                icon={<DollarSign size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Net cashflow"
                displayValue={`$${netCfM.toFixed(1)}M`}
                hint="Forecast posture"
                tone="intel"
                trend="Trajectory"
                icon={<TrendingUp size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Critical deadlines"
                value={stats.criticalDeadlines || 0}
                hint="Needs steering"
                tone={(stats.criticalDeadlines || 0) > 0 ? 'warning' : 'success'}
                trend="Risk"
                icon={<Calendar size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Project cashflow (${cashflows.length})`}
        tableActions={(
          <>
            <Button variant="primary" className="me-2">
              <Plus size={16} className="me-2" />
              Create New Cashflow
            </Button>
            <Button variant="outline-secondary">
              <TrendingUp size={16} className="me-2" />
              Export Report
            </Button>
          </>
        )}
      >
        {stats.criticalDeadlines > 0 && (
          <Alert variant="warning" className="d-flex align-items-center mb-3">
            <AlertTriangle size={20} className="me-2" />
            <div>
              <strong>Critical Deadlines Alert:</strong> {stats.criticalDeadlines} projects have critical deadlines approaching. 
              Review cashflow projections and ensure adequate funding.
            </div>
          </Alert>
        )}
        <DataTable
          data={cashflows}
          columns={columns}
          title="Project Cashflow Management"
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          pageSize={10}
          showActions={true}
          showCheckboxes={false}
          onView={handleViewCashflow}
          onEdit={handleEditCashflow}
          onDelete={handleDeleteCashflow}
          customActions={[
            {
              type: 'custom',
              label: 'AI Forecast',
              onClick: (row) => {
                console.log('AI Forecast:', row.aiForecast);
              }
            }
          ]}
          searchPlaceholder="Search cashflows..."
          emptyMessage="No cashflows found"
          loading={false}
        />
      </ExecutiveCommandCenter>
    </>
  )
}

export default Cashflow