import React, { useState } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import PostAwardWorkspaceModal from './components/PostAwardWorkspaceModal'
import { Shield, FileCheck, Brain, Landmark } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { showToast } from '../../utils/toast'
import './GuaranteesContract.scss'

const WORKSPACE_FIELDS = [
  { name: 'contractRef', label: 'Contract reference', placeholder: 'CTR-2024-301', required: true },
  {
    name: 'instrumentType',
    label: 'Instrument type',
    type: 'select',
    required: true,
    options: [
      { value: 'performance_guarantee', label: 'Performance guarantee' },
      { value: 'advance_payment', label: 'Advance payment guarantee' },
      { value: 'retention', label: 'Retention' },
      { value: 'bid_security', label: 'Bid security' }
    ]
  },
  { name: 'amount', label: 'Coverage amount (USD)', type: 'number', min: 0, required: true },
  { name: 'issuer', label: 'Issuer / bank', placeholder: 'Surety provider' },
  { name: 'expiryDate', label: 'Expiry date', type: 'date' }
]

const GuaranteesContract = () => {
  const navigate = useNavigate()
  const [showWorkspace, setShowWorkspace] = useState(false)

  const handleManageContractGuarantees = (formData) => {
    showToast.success(`Contract guarantee linked to ${formData.contractRef}`)
    setShowWorkspace(false)
  }

  return (
    <>
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
          <Button variant="primary" onClick={() => setShowWorkspace(true)}>
            Manage contract guarantees
          </Button>
        </div>
      </ExecutiveCommandCenter>

      <PostAwardWorkspaceModal
        show={showWorkspace}
        onHide={() => setShowWorkspace(false)}
        title="Manage contract guarantee"
        description="Register or update a contract-level guarantee or security deposit."
        submitLabel="Save instrument"
        fields={WORKSPACE_FIELDS}
        onSubmit={handleManageContractGuarantees}
      />
    </>
  )
}

export default GuaranteesContract
