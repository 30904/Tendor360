import React from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { FileText, GitBranch, Scale, Brain } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './ChangeOrders.scss'

const ChangeOrders = () => {
  const navigate = useNavigate()

  return (
    <ExecutiveCommandCenter
      className="change-orders-page"
      breadcrumbs={[
        { label: 'Post-Award Tracker', onClick: () => navigate('/post-award-tracker') },
        { label: 'Change Orders', active: true }
      ]}
      onBack={() => navigate('/post-award-tracker')}
      backLabel="Back to modules"
      title="Change order command center"
      description="Track contract change orders with risk-aware approval context after award."
      heroMeta="Commercial control"
      outlookTitle="Change control outlook"
      outlookDescription="Quantify cumulative change impact on margin, schedule, and risk as PM and commercial data syncs."
      outlookChips={['Variations', 'Approvals', 'Baseline drift']}
      insights={[
        {
          title: 'Change register lane',
          detail: 'Enable variance tracking and delegated approval chains when ERP change modules connect.',
          tone: 'info'
        }
      ]}
      kpiTitle="Change signal board"
      kpiMeta="Workflow placeholders"
      kpiContent={
        <Row className="g-3">
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="Open COs" value={0} hint="In review" tone="warning" trend="Pipeline" icon={<FileText size={20} />} />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="Approved value" value={0} hint="Cumulative impact" tone="primary" trend="Commercial" icon={<Scale size={20} />} />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="Schedule impact" value={0} hint="Critical path" tone="danger" trend="Days" icon={<GitBranch size={20} />} />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard label="AI risk scans" value={0} hint="Assistive reads" tone="intel" trend="Signals" icon={<Brain size={20} />} />
          </Col>
        </Row>
      }
      tableTitle="Change orders"
    >
      <div className="text-center py-5">
        <FileText size={48} className="text-muted mb-3" />
        <h5>Change orders management</h5>
        <p className="text-muted">Track and manage contract change orders with AI-powered risk assessment</p>
        <Button variant="primary">Create new change order</Button>
      </div>
    </ExecutiveCommandCenter>
  )
}

export default ChangeOrders
