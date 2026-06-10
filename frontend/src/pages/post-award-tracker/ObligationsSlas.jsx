import React from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { FileCheck, ListChecks, Timer, Brain } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './ObligationsSLAs.scss'

const ObligationsSLAs = () => {
  const navigate = useNavigate()

  return (
    <ExecutiveCommandCenter
      className="obligations-slas-page"
      breadcrumbs={[
        { label: 'Post-Award Tracker', onClick: () => navigate('/post-award-tracker') },
        { label: 'Obligations & SLAs', active: true }
      ]}
      onBack={() => navigate('/post-award-tracker')}
      backLabel="Back to modules"
      title="Obligations & SLA command center"
      description="Track contractual obligations and service levels with unified executive visibility."
      heroMeta="Contractual compliance"
      outlookTitle="Obligation coverage outlook"
      outlookDescription="Consolidate clause libraries, milestone duties, and SLA clocks as integrations land."
      outlookChips={['Obligations', 'SLA clocks', 'Compliance']}
      insights={[
        {
          title: 'Obligations registry pending data',
          detail: 'Wire CLM or delivery systems to populate obligation owners and due dates.',
          tone: 'info'
        }
      ]}
      kpiTitle="Obligation signal board"
      kpiMeta="Coverage placeholders"
      kpiContent={
        <Row className="g-3">
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="Active obligations" value={0} hint="Tracked duties" tone="intel" trend="Scope" icon={<FileCheck size={20} />} />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="Due this month" value={0} hint="Calendar view" tone="warning" trend="Urgency" icon={<Timer size={20} />} />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="SLA watchlist" value={0} hint="At-risk timers" tone="danger" trend="Risk" icon={<ListChecks size={20} />} />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="AI monitors" value={0} hint="Assisted tracking" tone="intel" trend="Signals" icon={<Brain size={20} />} />
          </Col>
        </Row>
      }
      tableTitle="Obligations & SLAs management"
    >
      <div className="text-center py-5">
        <FileCheck size={48} className="text-muted mb-3" />
        <h5>Obligations & SLAs</h5>
        <p className="text-muted">Track contractual obligations and service level agreements with AI-powered monitoring</p>
        <Button variant="primary">Manage obligations</Button>
      </div>
    </ExecutiveCommandCenter>
  )
}

export default ObligationsSLAs
