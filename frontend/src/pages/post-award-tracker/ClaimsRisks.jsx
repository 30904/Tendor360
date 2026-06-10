import React from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { AlertTriangle, Gavel, ShieldAlert, Brain } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './ClaimsRisks.scss'

const ClaimsRisks = () => {
  const navigate = useNavigate()

  return (
    <ExecutiveCommandCenter
      className="claims-risks-page"
      breadcrumbs={[
        { label: 'Post-Award Tracker', onClick: () => navigate('/post-award-tracker') },
        { label: 'Claims & Risks', active: true }
      ]}
      onBack={() => navigate('/post-award-tracker')}
      backLabel="Back to modules"
      title="Claims & risk command center"
      description="Track claims, disputes, and risk assessments with portfolio-level transparency."
      heroMeta="Legal & delivery risk"
      outlookTitle="Claims exposure outlook"
      outlookDescription="Centralize claim registers, reserve estimates, and mitigation actions as case data connects."
      outlookChips={['Claims', 'Disputes', 'Risk heatmap']}
      insights={[
        {
          title: 'Claims intelligence lane',
          detail: 'Feed legal and PM systems to unlock predictive risk scoring and reserve guidance.',
          tone: 'warning'
        }
      ]}
      kpiTitle="Risk signal board"
      kpiMeta="Exposure placeholders"
      kpiContent={
        <Row className="g-3">
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="Open claims" value={0} hint="Active caseload" tone="warning" trend="Legal" icon={<Gavel size={20} />} />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="High severity" value={0} hint="Escalations" tone="danger" trend="Heat" icon={<AlertTriangle size={20} />} />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="Mitigations due" value={0} hint="Action owners" tone="primary" trend="Runway" icon={<ShieldAlert size={20} />} />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="AI reviews" value={0} hint="Model assists" tone="intel" trend="Signals" icon={<Brain size={20} />} />
          </Col>
        </Row>
      }
      tableTitle="Claims & risks management"
    >
      <div className="text-center py-5">
        <AlertTriangle size={48} className="text-muted mb-3" />
        <h5>Claims & risks</h5>
        <p className="text-muted">Track and manage claims and risk assessments with AI-powered analysis</p>
        <Button variant="primary">Manage claims & risks</Button>
      </div>
    </ExecutiveCommandCenter>
  )
}

export default ClaimsRisks
