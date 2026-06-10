import React, { useState, useEffect } from 'react'
import { Button, Badge, Alert, Row, Col } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Truck, Plus, DollarSign, Package, Globe, AlertTriangle, Calculator } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import './DutiesFreight.scss'

const DutiesFreight = () => {
  const navigate = useNavigate()
  const [dutiesFreight, setDutiesFreight] = useState([])
  const [stats, setStats] = useState({})

  useEffect(() => {
    // Mock data for duties and freight
    setDutiesFreight([
      {
        id: 1,
        itemName: 'Construction Equipment - Excavator',
        category: 'Heavy Machinery',
        originCountry: 'Germany',
        destinationCountry: 'USA',
        weight: 25000,
        volume: 45.5,
        value: 450000,
        currency: 'USD',
        dutyRate: 2.5,
        dutyAmount: 11250,
        freightCost: 8500,
        insuranceCost: 2250,
        totalCost: 22000,
        status: 'Calculated',
        aiOptimized: true,
        savings: 1500,
        lastUpdated: '2024-02-14',
        createdBy: 'John Doe',
        priority: 'High'
      },
      {
        id: 2,
        itemName: 'Medical Equipment - MRI Scanner',
        category: 'Medical Devices',
        originCountry: 'Japan',
        destinationCountry: 'Canada',
        weight: 3500,
        volume: 12.8,
        value: 1200000,
        currency: 'USD',
        dutyRate: 0,
        dutyAmount: 0,
        freightCost: 12000,
        insuranceCost: 6000,
        totalCost: 18000,
        status: 'Calculated',
        aiOptimized: true,
        savings: 2000,
        lastUpdated: '2024-02-13',
        createdBy: 'Jane Smith',
        priority: 'Critical'
      },
      {
        id: 3,
        itemName: 'Electronics - Server Racks',
        category: 'IT Equipment',
        originCountry: 'China',
        destinationCountry: 'UK',
        weight: 800,
        volume: 2.5,
        value: 85000,
        currency: 'USD',
        dutyRate: 3.2,
        dutyAmount: 2720,
        freightCost: 2500,
        insuranceCost: 425,
        totalCost: 5645,
        status: 'Pending',
        aiOptimized: false,
        savings: 0,
        lastUpdated: '2024-02-12',
        createdBy: 'Mike Johnson',
        priority: 'Medium'
      },
      {
        id: 4,
        itemName: 'Automotive Parts - Engine Components',
        category: 'Automotive',
        originCountry: 'South Korea',
        destinationCountry: 'Mexico',
        weight: 1200,
        volume: 1.8,
        value: 65000,
        currency: 'USD',
        dutyRate: 5.0,
        dutyAmount: 3250,
        freightCost: 1800,
        insuranceCost: 325,
        totalCost: 5375,
        status: 'Calculated',
        aiOptimized: true,
        savings: 800,
        lastUpdated: '2024-02-11',
        createdBy: 'Sarah Wilson',
        priority: 'High'
      },
      {
        id: 5,
        itemName: 'Textile Machinery - Weaving Looms',
        category: 'Manufacturing Equipment',
        originCountry: 'Italy',
        destinationCountry: 'India',
        weight: 15000,
        volume: 28.5,
        value: 320000,
        currency: 'USD',
        dutyRate: 7.5,
        dutyAmount: 24000,
        freightCost: 15000,
        insuranceCost: 1600,
        totalCost: 40600,
        status: 'In Review',
        aiOptimized: true,
        savings: 3200,
        lastUpdated: '2024-02-10',
        createdBy: 'David Brown',
        priority: 'Medium'
      },
      {
        id: 6,
        itemName: 'Pharmaceutical Equipment - Tablet Press',
        category: 'Pharmaceutical',
        originCountry: 'Switzerland',
        destinationCountry: 'Brazil',
        weight: 5000,
        volume: 8.2,
        value: 280000,
        currency: 'USD',
        dutyRate: 4.0,
        dutyAmount: 11200,
        freightCost: 8000,
        insuranceCost: 1400,
        totalCost: 20600,
        status: 'Calculated',
        aiOptimized: true,
        savings: 1800,
        lastUpdated: '2024-02-09',
        createdBy: 'Lisa Davis',
        priority: 'High'
      }
    ])

    setStats({
      totalItems: 6,
      totalValue: 2845000,
      totalDutyAmount: 52420,
      totalFreightCost: 47800,
      totalSavings: 9500,
      aiOptimized: 5,
      pendingCalculations: 1,
      avgSavings: 1583
    })
  }, [])

  const handleViewDutiesFreight = (item) => {
    console.log('View duties & freight:', item)
    // Navigate to view item or open view modal
  }

  const handleEditDutiesFreight = (item) => {
    console.log('Edit duties & freight:', item)
    // Navigate to edit item or open edit modal
  }

  const handleDeleteDutiesFreight = (item) => {
    if (window.confirm('Are you sure you want to delete this duties & freight calculation?')) {
      setDutiesFreight(prev => prev.filter(i => i.id !== item.id))
    }
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'itemName',
      label: 'Item Details',
      width: '20%',
      render: (value, row) => (
        <div className="item-info">
          <div className="fw-semibold d-flex align-items-center">
            <Package size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.category}</small>
          <div className="item-meta">
            <small className="text-muted">{row.originCountry} → {row.destinationCountry}</small>
          </div>
        </div>
      )
    },
    {
      key: 'value',
      label: 'Item Value',
      width: '10%',
      render: (value, row) => (
        <div className="item-value">
          <div className="fw-bold text-primary">
            ${(value / 1000).toFixed(0)}K
          </div>
          <small className="text-muted">{row.currency}</small>
        </div>
      )
    },
    {
      key: 'dutyAmount',
      label: 'Duty Amount',
      width: '10%',
      render: (value, row) => (
        <div className="duty-amount">
          <div className="fw-bold text-warning">
            ${(value / 1000).toFixed(1)}K
          </div>
          <small className="text-muted">{row.dutyRate}% rate</small>
        </div>
      )
    },
    {
      key: 'freightCost',
      label: 'Freight Cost',
      width: '10%',
      render: (value) => (
        <div className="freight-cost">
          <div className="fw-bold text-info">
            ${(value / 1000).toFixed(1)}K
          </div>
          <small className="text-muted">shipping</small>
        </div>
      )
    },
    {
      key: 'totalCost',
      label: 'Total Cost',
      width: '10%',
      render: (value) => (
        <div className="total-cost">
          <div className="fw-bold text-success">
            ${(value / 1000).toFixed(1)}K
          </div>
          <small className="text-muted">total</small>
        </div>
      )
    },
    {
      key: 'savings',
      label: 'AI Savings',
      width: '8%',
      render: (value) => (
        <div className="savings">
          <div className="fw-bold text-success">
            ${(value / 1000).toFixed(1)}K
          </div>
          <small className="text-muted">saved</small>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: '8%',
      render: (value) => {
        const variants = {
          'Calculated': 'success',
          'Pending': 'warning',
          'In Review': 'info',
          'Failed': 'danger'
        }
        return <Badge bg={variants[value] || 'secondary'}>{value}</Badge>
      }
    },
    {
      key: 'aiOptimized',
      label: 'AI Optimized',
      width: '8%',
      render: (value) => (
        <div className="ai-optimized">
          {value ? (
            <Badge bg="success" className="d-flex align-items-center">
              <Calculator size={12} className="me-1" />
              Yes
            </Badge>
          ) : (
            <Badge bg="secondary">No</Badge>
          )}
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
      key: 'lastUpdated',
      label: 'Last Updated',
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
  const freightK = (stats.totalFreightCost || 0) / 1000
  const savingsK = (stats.totalSavings || 0) / 1000

  return (
    <>
      <ExecutiveCommandCenter
        className="duties-freight-page"
        breadcrumbs={[
          { label: 'Pricing & Simulation', onClick: () => navigate('/pricing-simulation') },
          { label: 'Duties & Freight', active: true }
        ]}
        onBack={() => navigate('/pricing-simulation')}
        backLabel="Back to Modules"
        title="Duties & Freight"
        description="Calculate and manage import duties and freight costs with AI-powered optimization"
        heroMeta="Landed cost"
        outlookTitle="Duties & freight outlook"
        outlookDescription={`${stats.totalItems || 0} items — $${totalValM.toFixed(1)}M value, $${freightK.toFixed(0)}K freight, $${savingsK.toFixed(1)}K AI savings signal.`}
        outlookChips={[
          `${stats.totalItems || 0} items`,
          `$${totalValM.toFixed(1)}M value`,
          `$${freightK.toFixed(0)}K freight`,
          `$${savingsK.toFixed(1)}K savings`
        ]}
        insights={[]}
        kpiTitle="Landed cost signal board"
        kpiMeta="Duty vs freight"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total items"
                value={stats.totalItems || 0}
                hint="Lines modeled"
                tone="intel"
                trend="Volume"
                icon={<Package size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total value"
                displayValue={`$${totalValM.toFixed(1)}M`}
                hint="Declared basis"
                tone="success"
                trend="Scale"
                icon={<DollarSign size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total freight"
                displayValue={`$${freightK.toFixed(0)}K`}
                hint="Logistics spend"
                tone="warning"
                trend="Lift"
                icon={<Truck size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI savings"
                displayValue={`$${savingsK.toFixed(1)}K`}
                hint="Optimization delta"
                tone="intel"
                trend="Leakage"
                icon={<Calculator size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Duties & freight (${dutiesFreight.length})`}
        tableActions={(
          <>
            <Button variant="primary" className="me-2">
              <Plus size={16} className="me-2" />
              Calculate Duties & Freight
            </Button>
            <Button variant="outline-secondary">
              <Globe size={16} className="me-2" />
              Import Rates
            </Button>
          </>
        )}
      >
        {stats.pendingCalculations > 0 && (
          <Alert variant="warning" className="d-flex align-items-center mb-3">
            <AlertTriangle size={20} className="me-2" />
            <div>
              <strong>Pending Calculations:</strong> {stats.pendingCalculations} items require duty and freight calculations. 
              Review and complete calculations to optimize costs.
            </div>
          </Alert>
        )}
        <DataTable
          data={dutiesFreight}
          columns={columns}
          title="Duties & Freight Calculations"
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          pageSize={10}
          showActions={true}
          showCheckboxes={false}
          onView={handleViewDutiesFreight}
          onEdit={handleEditDutiesFreight}
          onDelete={handleDeleteDutiesFreight}
          customActions={[
            {
              type: 'custom',
              label: 'Recalculate',
              onClick: (row) => {
                console.log('Recalculate:', row);
              }
            }
          ]}
          searchPlaceholder="Search duties & freight..."
          emptyMessage="No duties & freight calculations found"
          loading={false}
        />
      </ExecutiveCommandCenter>
    </>
  )
}

export default DutiesFreight