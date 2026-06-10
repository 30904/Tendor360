import React from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Shield, Wallet, RefreshCw, Brain } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './GuaranteesDeposits.scss'

const GuaranteesDeposits = () => {
  const navigate = useNavigate()

  return (
    <ExecutiveCommandCenter
      className="guarantees-deposits-page"
      breadcrumbs={[
        { label: 'Post-Award Tracker', onClick: () => navigate('/post-award-tracker') },
        { label: 'Guarantees & Deposits', active: true }
      ]}
      onBack={() => navigate('/post-award-tracker')}
      backLabel="Back to modules"
      title="Post-award guarantees command center"
      description="Manage guarantees and security deposits after award with lifecycle tracking."
      heroMeta="Treasury alignment"
      outlookTitle="Deposit & guarantee outlook"
      outlookDescription="Mirror bank and surety positions with automated release triggers when milestones clear."
      outlookChips={['Deposits', 'BG / PG', 'Release workflow']}
      insights={[
        {
          title: 'Post-award instruments',
          detail: 'Connect treasury and legal for live balances, margin calls, and replacement timelines.',
          tone: 'info'
        }
      ]}
      kpiTitle="Instrument signal board"
      kpiMeta="Lifecycle placeholders"
      kpiContent={
        <Row className="g-3">
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="Active deposits" value={0} hint="Cash / BG" tone="intel" trend="Coverage" icon={<Wallet size={20} />} />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="Pending release" value={0} hint="Awaiting sign-off" tone="warning" trend="Flow" icon={<RefreshCw size={20} />} />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="Critical expiries" value={0} hint="90-day window" tone="danger" trend="Runway" icon={<Shield size={20} />} />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="AI monitors" value={0} hint="Anomaly watch" tone="intel" trend="Signals" icon={<Brain size={20} />} />
          </Col>
        </Row>
      }
      tableTitle="Guarantees & deposits management"
    >
      <div className="text-center py-5">
        <Shield size={48} className="text-muted mb-3" />
        <h5>Guarantees & deposits</h5>
        <p className="text-muted">Manage post-award guarantees and security deposits with AI-powered monitoring</p>
        <Button variant="primary">Manage guarantees</Button>
      </div>
    </ExecutiveCommandCenter>
  )
}

export default GuaranteesDeposits
