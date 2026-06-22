import React, { useState } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import PostAwardWorkspaceModal from './components/PostAwardWorkspaceModal'
import { FileCheck, ListChecks, Timer, Brain } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { showToast } from '../../utils/toast'
import './ObligationsSLAs.scss'

const WORKSPACE_FIELDS = [
  { name: 'obligationTitle', label: 'Obligation title', placeholder: 'Monthly progress reporting', required: true },
  { name: 'contractRef', label: 'Contract reference', placeholder: 'CTR-2024-144', required: true },
  { name: 'owner', label: 'Owner', placeholder: 'Delivery manager', required: true },
  { name: 'dueDate', label: 'Due date', type: 'date', required: true },
  { name: 'slaTarget', label: 'SLA target', placeholder: '48 hours response time' },
  { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Clause reference and compliance criteria' }
]

const ObligationsSLAs = () => {
  const navigate = useNavigate()
  const [showWorkspace, setShowWorkspace] = useState(false)

  const handleManageObligations = (formData) => {
    showToast.success(`Obligation "${formData.obligationTitle}" added to registry`)
    setShowWorkspace(false)
  }

  return (
    <>
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
          <Button variant="primary" onClick={() => setShowWorkspace(true)}>
            Manage obligations
          </Button>
        </div>
      </ExecutiveCommandCenter>

      <PostAwardWorkspaceModal
        show={showWorkspace}
        onHide={() => setShowWorkspace(false)}
        title="Add obligation or SLA"
        description="Register a contractual duty with owner, due date, and SLA target."
        submitLabel="Add to registry"
        fields={WORKSPACE_FIELDS}
        onSubmit={handleManageObligations}
      />
    </>
  )
}

export default ObligationsSLAs
