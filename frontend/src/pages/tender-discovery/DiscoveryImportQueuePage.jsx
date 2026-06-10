import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Col, Row, Spinner, Table } from 'react-bootstrap'
import { CloudDownload, FileDown, GitCompare, Plus, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { intelligenceAPI } from '../../services/intelligenceAPI'
import './TenderDiscoveryPages.scss'

const statusTone = (status) => {
  const k = String(status || '').toLowerCase()
  if (k === 'completed') return 'success'
  if (k === 'processing') return 'warning'
  if (k === 'failed') return 'danger'
  return 'secondary'
}

const DiscoveryImportQueuePage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [batches, setBatches] = useState([])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await intelligenceAPI.getImportQueue()
      setBatches(res.data?.data?.batches || [])
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to load import queue')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const stats = useMemo(() => {
    const imported = batches.reduce((s, b) => s + (b.recordsImported || 0), 0)
    const newCount = batches.reduce((s, b) => s + (b.recordsNew || 0), 0)
    const updated = batches.reduce((s, b) => s + (b.recordsUpdated || 0), 0)
    const attachments = batches.reduce((s, b) => s + (b.attachmentsDownloaded || 0), 0)
    const samFallback = batches.filter((b) => b.samFallbackUsed).length
    return { imported, newCount, updated, attachments, samFallback }
  }, [batches])

  const insights = useMemo(
    () => [
      {
        title: 'TB-004 — Document download on import',
        detail: 'Each batch downloads GovWin/SAM attachments into the tenant document store linked to pipeline tenders.',
        tone: 'info',
      },
      stats.samFallback
        ? {
            title: 'TB-005 — SAM.gov fallback engaged',
            detail: `${stats.samFallback} batch(es) used SAM notice documents when the primary connector had no files.`,
            tone: 'success',
          }
        : {
            title: 'TB-005 — SAM.gov fallback ready',
            detail: 'Configure SAM.gov API key on Discovery Connectors for missing attachment recovery.',
            tone: 'primary',
          },
    ],
    [stats]
  )

  return (
    <ExecutiveCommandCenter
      className="tender-discovery-subpage"
      showSkeleton={loading && !batches.length}
      breadcrumbs={[
        { label: 'Tender Discovery', onClick: () => navigate('/tender-discovery') },
        { label: 'Import queue', active: true },
      ]}
      onBack={() => navigate('/tender-discovery')}
      backLabel="Back to hub"
      title="Discovery import queue"
      description="Staged import batches with new vs updated counts, duplicate skips, and attachment harvest results before pipeline promotion."
      heroMeta="TB-003 · TB-004 · TB-005"
      heroActions={
        <Button size="sm" variant="outline-primary" onClick={load} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <RefreshCw size={16} className="me-1" />}
          Refresh
        </Button>
      }
      outlookTitle="Import validation outlook"
      outlookDescription={`${stats.imported} records processed · ${stats.newCount} new · ${stats.updated} updated · ${stats.attachments} attachments.`}
      insights={insights}
      error={error}
      kpiContent={
        <Row className="g-3 mb-3">
          <Col sm={6} xl={3}>
            <PremiumKpiCard label="Imported" value={stats.imported} tone="success" icon={<CloudDownload size={20} />} />
          </Col>
          <Col sm={6} xl={3}>
            <PremiumKpiCard label="New" value={stats.newCount} tone="intel" icon={<Plus size={20} />} />
          </Col>
          <Col sm={6} xl={3}>
            <PremiumKpiCard label="Updated" value={stats.updated} tone="warning" icon={<GitCompare size={20} />} />
          </Col>
          <Col sm={6} xl={3}>
            <PremiumKpiCard label="Files" value={stats.attachments} hint="TB-004" tone="intel" icon={<FileDown size={20} />} />
          </Col>
        </Row>
      }
      tableTitle="Import batches"
    >
      <Table hover responsive className="discovery-data-table mb-0">
        <thead>
          <tr>
            <th>Connector</th>
            <th>Lookback</th>
            <th>Processed</th>
            <th>New</th>
            <th>Updated</th>
            <th>Duplicates</th>
            <th>Attachments</th>
            <th>SAM fallback</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch) => (
            <tr key={batch._id}>
              <td>{batch.connectorType}</td>
              <td>{batch.lookbackHours ?? 24}h</td>
              <td>{batch.recordsProcessed}</td>
              <td>{batch.recordsNew ?? 0}</td>
              <td>{batch.recordsUpdated ?? 0}</td>
              <td>{batch.duplicatesSkipped}</td>
              <td>{batch.attachmentsDownloaded ?? 0}</td>
              <td>{batch.samFallbackUsed ? <Badge bg="info">Yes</Badge> : '—'}</td>
              <td>
                <Badge bg={statusTone(batch.status)}>{batch.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {!loading && !batches.length ? (
        <p className="text-muted text-center py-4 mb-0">No import batches yet. Run a discovery sync.</p>
      ) : null}
    </ExecutiveCommandCenter>
  )
}

export default DiscoveryImportQueuePage
