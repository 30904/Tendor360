import React, { useState } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import PostAwardWorkspaceModal from './components/PostAwardWorkspaceModal'
import { Shield, Wallet, RefreshCw, Brain } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { showToast } from '../../utils/toast'
import './GuaranteesDeposits.scss'

const WORKSPACE_FIELDS = [
  {
    name: 'instrumentType',
    label: 'Instrument type',
    type: 'select',
    required: true,
    options: [
      { value: 'bank_guarantee', label: 'Bank guarantee' },
      { value: 'performance_bond', label: 'Performance bond' },
      { value: 'security_deposit', label: 'Security deposit' },
      { value: 'retention', label: 'Retention' }
    ]
  },
  { name: 'contractRef', label: 'Contract reference', placeholder: 'CTR-2024-205', required: true },
  { name: 'amount', label: 'Amount (USD)', type: 'number', min: 0, required: true },
  { name: 'bank', label: 'Bank / issuer', placeholder: 'National Bank' },
  { name: 'expiryDate', label: 'Expiry date', type: 'date' }
]

const GuaranteesDeposits = () => {
  const navigate = useNavigate()
  const [showWorkspace, setShowWorkspace] = useState(false)

  const handleManageGuarantees = (formData) => {
    showToast.success(`Instrument registered for contract ${formData.contractRef}`)
    setShowWorkspace(false)
  }

  return (
    <>
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
          <Button variant="primary" onClick={() => setShowWorkspace(true)}>
            Manage guarantees
          </Button>
        </div>
      </ExecutiveCommandCenter>

      <PostAwardWorkspaceModal
        show={showWorkspace}
        onHide={() => setShowWorkspace(false)}
        title="Register guarantee or deposit"
        description="Add a post-award financial instrument for lifecycle monitoring."
        submitLabel="Register instrument"
        fields={WORKSPACE_FIELDS}
        onSubmit={handleManageGuarantees}
      />
    </>
  )
}

export default GuaranteesDeposits
