import React from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Shield, FileCheck, Brain, Landmark } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './GuaranteesContract.scss'

const GuaranteesContract = () => {
  const navigate = useNavigate()

  return (
    <ExecutiveCommandCenter
      className="guarantees-contract-page"
      breadcrumbs={[
        { label: 'Post-Award Tracker', onClick: () => navigate('/post-award-tracker') },
        { label: 'Guarantees & Deposits (Contract)', active: true }
      ]}
      onBack={() => navigate('/post-award-tracker')}
      backLabel="Back to modules"
      title="Contract guarantees command center"
      description="Manage contract guarantees and security deposits with centralized monitoring."
      heroMeta="Instrument readiness"
      outlookTitle="Instrument coverage outlook"
      outlookDescription="Connect bank guarantees and retentions once contract data feeds are wired — this lane is scaffolded for executive review."
      outlookChips={['Contract instruments', 'Post-award', 'Security deposits']}
      insights={[
        {
          title: 'Guarantees workspace is staged',
          detail: 'Link ERP or treasury feeds to populate live exposures and expiry ladders.',
          tone: 'info'
        }
      ]}
      kpiTitle="Coverage signal board"
      kpiMeta="Placeholder KPIs until data connection"
      kpiContent={
        <Row className="g-3">
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="Live instruments" value={0} hint="Awaiting feed" tone="intel" trend="Coverage" icon={<Shield size={20} />} />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="Contracts linked" value={0} hint="Mapped awards" tone="primary" trend="Scope" icon={<FileCheck size={20} />} />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="Expiring (90d)" value={0} hint="Renewal watch" tone="warning" trend="Runway" icon={<Landmark size={20} />} />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="AI validations" value={0} hint="Model assists" tone="intel" trend="Signals" icon={<Brain size={20} />} />
          </Col>
        </Row>
      }
      tableTitle="Contract guarantees & deposits"
    >
      <div className="text-center py-5">
        <Shield size={48} className="text-muted mb-3" />
        <h5>Contract guarantees & deposits</h5>
        <p className="text-muted">Manage contract guarantees and security deposits with AI-powered monitoring</p>
        <Button variant="primary">Manage contract guarantees</Button>
      </div>
    </ExecutiveCommandCenter>
  )
}

export default GuaranteesContract
