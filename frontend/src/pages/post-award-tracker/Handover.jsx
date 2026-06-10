import React from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Handshake, FileSignature, Package, Brain } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './Handover.scss'

const Handover = () => {
  const navigate = useNavigate()

  return (
    <ExecutiveCommandCenter
      className="handover-page"
      breadcrumbs={[
        { label: 'Post-Award Tracker', onClick: () => navigate('/post-award-tracker') },
        { label: 'Handover', active: true }
      ]}
      onBack={() => navigate('/post-award-tracker')}
      backLabel="Back to modules"
      title="Project handover command center"
      description="Manage project handover processes, documentation, and stakeholder sign-offs."
      heroMeta="Completion governance"
      outlookTitle="Handover governance outlook"
      outlookDescription="Bundle red-line registers, O&M manuals, and training sign-offs for a single executive thread."
      outlookChips={['Documentation', 'Training', 'Sign-off']}
      insights={[
        {
          title: 'Handover orchestration',
          detail: 'Link document control to auto-build completion dossiers for legal and client review.',
          tone: 'info'
        }
      ]}
      kpiTitle="Completion signal board"
      kpiMeta="Status placeholders"
      kpiContent={
        <Row className="g-3">
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="Workstreams" value={0} hint="Parallel tracks" tone="intel" trend="Scope" icon={<Handshake size={20} />} />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="Docs submitted" value={0} hint="Repository" tone="primary" trend="Records" icon={<Package size={20} />} />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="Pending signatures" value={0} hint="Approvals" tone="warning" trend="Gate" icon={<FileSignature size={20} />} />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="AI checks" value={0} hint="Validation" tone="intel" trend="Signals" icon={<Brain size={20} />} />
          </Col>
        </Row>
      }
      tableTitle="Project handover management"
    >
      <div className="text-center py-5">
        <Handshake size={48} className="text-muted mb-3" />
        <h5>Project handover</h5>
        <p className="text-muted">Manage project handover processes and documentation with AI-powered validation</p>
        <Button variant="primary">Initiate handover</Button>
      </div>
    </ExecutiveCommandCenter>
  )
}

export default Handover
