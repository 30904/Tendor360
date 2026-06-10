import React, { useState, useEffect } from 'react'
import { Button, Badge, Alert, Row, Col } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { DollarSign, Plus, TrendingUp, Globe, AlertTriangle, Calculator, Percent } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import './FXTaxes.scss'

const FXTaxes = () => {
  const navigate = useNavigate()
  const [fxTaxes, setFxTaxes] = useState([])
  const [stats, setStats] = useState({})

  useEffect(() => {
    // Mock data for FX and taxes
    setFxTaxes([
      {
        id: 1,
        currencyPair: 'USD/EUR',
        baseCurrency: 'USD',
        targetCurrency: 'EUR',
        currentRate: 0.9234,
        previousRate: 0.9187,
        changePercent: 0.51,
        taxRate: 19.0,
        taxType: 'VAT',
        country: 'Germany',
        region: 'EU',
        status: 'Active',
        lastUpdated: '2024-02-14',
        aiForecast: 'Stable with slight upward trend',
        aiConfidence: 85,
        volatility: 'Low',
        priority: 'High',
        createdBy: 'John Doe'
      },
      {
        id: 2,
        currencyPair: 'USD/GBP',
        baseCurrency: 'USD',
        targetCurrency: 'GBP',
        currentRate: 0.7892,
        previousRate: 0.7856,
        changePercent: 0.46,
        taxRate: 20.0,
        taxType: 'VAT',
        country: 'UK',
        region: 'Europe',
        status: 'Active',
        lastUpdated: '2024-02-14',
        aiForecast: 'Moderate volatility expected',
        aiConfidence: 78,
        volatility: 'Medium',
        priority: 'High',
        createdBy: 'Jane Smith'
      },
      {
        id: 3,
        currencyPair: 'USD/JPY',
        baseCurrency: 'USD',
        targetCurrency: 'JPY',
        currentRate: 149.85,
        previousRate: 150.12,
        changePercent: -0.18,
        taxRate: 10.0,
        taxType: 'Consumption Tax',
        country: 'Japan',
        region: 'Asia',
        status: 'Active',
        lastUpdated: '2024-02-14',
        aiForecast: 'Continued weakness expected',
        aiConfidence: 82,
        volatility: 'High',
        priority: 'Critical',
        createdBy: 'Mike Johnson'
      },
      {
        id: 4,
        currencyPair: 'USD/CAD',
        baseCurrency: 'USD',
        targetCurrency: 'CAD',
        currentRate: 1.3567,
        previousRate: 1.3523,
        changePercent: 0.33,
        taxRate: 13.0,
        taxType: 'HST',
        country: 'Canada',
        region: 'North America',
        status: 'Active',
        lastUpdated: '2024-02-14',
        aiForecast: 'Stable with minor fluctuations',
        aiConfidence: 90,
        volatility: 'Low',
        priority: 'Medium',
        createdBy: 'Sarah Wilson'
      },
      {
        id: 5,
        currencyPair: 'USD/AUD',
        baseCurrency: 'USD',
        targetCurrency: 'AUD',
        currentRate: 1.5234,
        previousRate: 1.5189,
        changePercent: 0.30,
        taxRate: 10.0,
        taxType: 'GST',
        country: 'Australia',
        region: 'Oceania',
        status: 'Active',
        lastUpdated: '2024-02-14',
        aiForecast: 'Commodity-driven movements',
        aiConfidence: 75,
        volatility: 'Medium',
        priority: 'Medium',
        createdBy: 'David Brown'
      },
      {
        id: 6,
        currencyPair: 'USD/CHF',
        baseCurrency: 'USD',
        targetCurrency: 'CHF',
        currentRate: 0.8765,
        previousRate: 0.8723,
        changePercent: 0.48,
        taxRate: 7.7,
        taxType: 'VAT',
        country: 'Switzerland',
        region: 'Europe',
        status: 'Active',
        lastUpdated: '2024-02-14',
        aiForecast: 'Safe haven demand increasing',
        aiConfidence: 88,
        volatility: 'Low',
        priority: 'High',
        createdBy: 'Lisa Davis'
      }
    ])

    setStats({
      totalCurrencies: 6,
      totalTaxRates: 6,
      avgVolatility: 'Medium',
      highVolatility: 2,
      aiConfidence: 83,
      activeRates: 6,
      lastUpdate: '2024-02-14',
      totalRegions: 4
    })
  }, [])

  const handleViewFxTax = (fxTax) => {
    console.log('View FX & Tax:', fxTax)
    // Navigate to view item or open view modal
  }

  const handleEditFxTax = (fxTax) => {
    console.log('Edit FX & Tax:', fxTax)
    // Navigate to edit item or open edit modal
  }

  const handleDeleteFxTax = (fxTax) => {
    if (window.confirm('Are you sure you want to delete this FX & Tax configuration?')) {
      setFxTaxes(prev => prev.filter(i => i.id !== fxTax.id))
    }
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'currencyPair',
      label: 'Currency Pair',
      width: '12%',
      render: (value, row) => (
        <div className="currency-pair">
          <div className="fw-semibold d-flex align-items-center">
            <DollarSign size={16} className="me-2" />
            {value}
          </div>
          <small className="text-muted">{row.country}</small>
        </div>
      )
    },
    {
      key: 'currentRate',
      label: 'Current Rate',
      width: '10%',
      render: (value) => (
        <div className="current-rate">
          <div className="fw-bold text-primary">{value}</div>
        </div>
      )
    },
    {
      key: 'changePercent',
      label: 'Change %',
      width: '8%',
      render: (value) => (
        <div className="change-percent">
          <div className={`fw-bold ${value >= 0 ? 'text-success' : 'text-danger'}`}>
            {value >= 0 ? '+' : ''}{value}%
          </div>
        </div>
      )
    },
    {
      key: 'taxRate',
      label: 'Tax Rate',
      width: '8%',
      render: (value, row) => (
        <div className="tax-rate">
          <div className="fw-bold text-warning">{value}%</div>
          <small className="text-muted">{row.taxType}</small>
        </div>
      )
    },
    {
      key: 'volatility',
      label: 'Volatility',
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
      key: 'aiConfidence',
      label: 'AI Confidence',
      width: '10%',
      render: (value) => (
        <div className="ai-confidence">
          <div className="fw-bold text-info">{value}%</div>
          <small className="text-muted">confidence</small>
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
      key: 'region',
      label: 'Region',
      width: '8%',
      render: (value) => (
        <div className="region">
          <small className="text-muted">{value}</small>
        </div>
      )
    },
    {
      key: 'lastUpdated',
      label: 'Last Updated',
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
      key: 'aiForecast',
      label: 'AI Forecast',
      width: '12%',
      render: (value) => (
        <div className="ai-forecast">
          <small className="text-muted">{value}</small>
        </div>
      )
    }
  ]

  return (
    <>
      <ExecutiveCommandCenter
        className="fx-taxes-page"
        breadcrumbs={[
          { label: 'Pricing & Simulation', onClick: () => navigate('/pricing-simulation') },
          { label: 'FX & Taxes', active: true }
        ]}
        onBack={() => navigate('/pricing-simulation')}
        backLabel="Back to Modules"
        title="FX & Taxes"
        description="Manage foreign exchange rates and tax calculations with AI-powered forecasting"
        heroMeta="FX desk"
        outlookTitle="FX & tax outlook"
        outlookDescription={`${stats.totalCurrencies || 0} pairs — ${stats.totalTaxRates || 0} tax regimes, ${stats.highVolatility || 0} volatile, ${stats.aiConfidence || 0}% AI confidence.`}
        outlookChips={[
          `${stats.totalCurrencies || 0} pairs`,
          `${stats.totalTaxRates || 0} tax rates`,
          `${stats.highVolatility || 0} high volatility`,
          `${stats.aiConfidence || 0}% AI confidence`
        ]}
        insights={[]}
        kpiTitle="FX signal board"
        kpiMeta="Volatility vs compliance"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Currency pairs"
                value={stats.totalCurrencies || 0}
                hint="Tracked crosses"
                tone="intel"
                trend="Coverage"
                icon={<DollarSign size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Tax rates"
                value={stats.totalTaxRates || 0}
                hint="Active schedules"
                tone="success"
                trend="Compliance"
                icon={<Percent size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="High volatility"
                value={stats.highVolatility || 0}
                hint="Pairs in stress"
                tone={(stats.highVolatility || 0) > 0 ? 'warning' : 'success'}
                trend="Hedge"
                icon={<TrendingUp size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.aiConfidence || 0}
                hint="Forecast trust"
                tone="intel"
                trend="Signal"
                suffix="%"
                icon={<Calculator size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`FX & tax rates (${fxTaxes.length})`}
        tableActions={(
          <>
            <Button variant="primary" className="me-2">
              <Plus size={16} className="me-2" />
              Add Currency Pair
            </Button>
            <Button variant="outline-secondary">
              <Globe size={16} className="me-2" />
              Update Rates
            </Button>
          </>
        )}
      >
        {stats.highVolatility > 0 && (
          <Alert variant="warning" className="d-flex align-items-center mb-3">
            <AlertTriangle size={20} className="me-2" />
            <div>
              <strong>High Volatility Alert:</strong> {stats.highVolatility} currency pairs are experiencing high volatility. 
              Monitor rates closely and consider hedging strategies.
            </div>
          </Alert>
        )}
        <DataTable
          data={fxTaxes}
          columns={columns}
          title="FX & Tax Rates Management"
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          pageSize={10}
          showActions={true}
          showCheckboxes={false}
          onView={handleViewFxTax}
          onEdit={handleEditFxTax}
          onDelete={handleDeleteFxTax}
          customActions={[
            {
              type: 'custom',
              label: 'AI Forecast',
              onClick: (row) => {
                console.log('AI Forecast:', row.aiForecast);
              }
            }
          ]}
          searchPlaceholder="Search FX & taxes..."
          emptyMessage="No FX & tax rates found"
          loading={false}
        />
      </ExecutiveCommandCenter>
    </>
  )
}

export default FXTaxes