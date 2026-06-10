import React from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Handshake, ClipboardCheck, Truck, Brain } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './HandoverDelivery.scss'

const HandoverDelivery = () => {
  const navigate = useNavigate()

  return (
    <ExecutiveCommandCenter
      className="handover-delivery-page"
      breadcrumbs={[
        { label: 'Post-Award Tracker', onClick: () => navigate('/post-award-tracker') },
        { label: 'Handover to Delivery', active: true }
      ]}
      onBack={() => navigate('/post-award-tracker')}
      backLabel="Back to modules"
      title="Handover to delivery command center"
      description="Coordinate project handover and delivery checkpoints with validated documentation."
      heroMeta="Operational transition"
      outlookTitle="Handover readiness outlook"
      outlookDescription="Operationalize acceptance packs, snag lists, and delivery sign-offs as APIs come online."
      outlookChips={['Acceptance', 'Delivery', 'Checklists']}
      insights={[
        {
          title: 'Delivery handoff workspace',
          detail: 'Use this lane to orchestrate owner acceptance and commissioning once tasks are synced.',
          tone: 'info'
        }
      ]}
      kpiTitle="Handover signal board"
      kpiMeta="Readiness placeholders"
      kpiContent={
        <Row className="g-3">
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="Packages due" value={0} hint="Planned transitions" tone="intel" trend="Wave" icon={<Handshake size={20} />} />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="Checklist complete" value={0} hint="Signed items" tone="success" trend="Quality" icon={<ClipboardCheck size={20} />} />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="Logistics gates" value={0} hint="Site releases" tone="primary" trend="Flow" icon={<Truck size={20} />} />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="AI validation" value={0} hint="Assisted review" tone="intel" trend="Signals" icon={<Brain size={20} />} />
          </Col>
        </Row>
      }
      tableTitle="Handover to delivery management"
    >
      <div className="text-center py-5">
        <Handshake size={48} className="text-muted mb-3" />
        <h5>Handover to delivery</h5>
        <p className="text-muted">Manage project handover and delivery processes with AI-powered validation</p>
        <Button variant="primary">Initiate handover</Button>
      </div>
    </ExecutiveCommandCenter>
  )
}

export default HandoverDelivery
