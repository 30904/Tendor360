import React, { useState } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import PostAwardWorkspaceModal from './components/PostAwardWorkspaceModal'
import { AlertTriangle, Gavel, ShieldAlert, Brain } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { showToast } from '../../utils/toast'
import './ClaimsRisks.scss'

const WORKSPACE_FIELDS = [
  { name: 'claimTitle', label: 'Claim title', placeholder: 'Delay damages — phase 1', required: true },
  { name: 'contractRef', label: 'Contract reference', placeholder: 'CTR-2024-118', required: true },
  {
    name: 'claimType',
    label: 'Claim type',
    type: 'select',
    required: true,
    options: [
      { value: 'delay', label: 'Delay' },
      { value: 'variation', label: 'Variation dispute' },
      { value: 'defect', label: 'Defect / warranty' },
      { value: 'other', label: 'Other' }
    ]
  },
  { name: 'estimatedExposure', label: 'Estimated exposure (USD)', type: 'number', min: 0 },
  { name: 'description', label: 'Summary', type: 'textarea', placeholder: 'Describe the claim basis and supporting evidence' }
]

const ClaimsRisks = () => {
  const navigate = useNavigate()
  const [showWorkspace, setShowWorkspace] = useState(false)

  const handleManageClaims = (formData) => {
    showToast.success(`Claim "${formData.claimTitle}" registered for review`)
    setShowWorkspace(false)
  }

  return (
    <>
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
          <Button variant="primary" onClick={() => setShowWorkspace(true)}>
            Manage claims & risks
          </Button>
        </div>
      </ExecutiveCommandCenter>

      <PostAwardWorkspaceModal
        show={showWorkspace}
        onHide={() => setShowWorkspace(false)}
        title="Register claim or risk"
        description="Log a new claim or risk item for legal and delivery review."
        submitLabel="Register item"
        fields={WORKSPACE_FIELDS}
        onSubmit={handleManageClaims}
      />
    </>
  )
}

export default ClaimsRisks
