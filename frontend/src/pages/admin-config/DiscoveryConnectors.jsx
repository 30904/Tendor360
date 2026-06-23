import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import {
  Badge,
  Button,
  Col,
  Form,
  Modal,
  Row,
  Spinner,
  Table
} from 'react-bootstrap'
import {
  Plus,
  RefreshCw,
  Plug,
  Globe,
  Key,
  Clock,
  Layers3,
  Radar,
  CheckCircle2,
  Database,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import FormDrawerModal from '../../components/FormDrawerModal'
import TableActionsCell from '../../components/TableActionsCell'
import { buildTableActions, runTableAction } from '../../utils/tableActions'
import discoveryConnectorsAPI from '../../services/discoveryConnectorsAPI'
import { showToast } from '../../utils/toast'
import './DiscoveryConnectors.scss'

const CREDENTIAL_MASK = '********'

const emptyForm = () => ({
  name: '',
  description: '',
  type: 'Government',
  url: '',
  integrationMode: 'api',
  connectorTemplate: 'generic_api',
  frequency: 'daily',
  priority: 'medium',
  reliability: 'medium',
  status: 'active',
  requiresAuth: true,
  authCredentials: { username: '', password: '', apiKey: '' },
  discoveryConfig: {
    baseUrl: '',
    opportunitiesPath: '/opportunities',
    authType: 'bearer',
    apiKeyHeader: 'Authorization',
    apiKeyPrefix: 'Bearer',
    lookbackHours: 24,
    pageSize: 25,
    searchQuery: '',
    scheduleEnabled: true,
    demoMode: false
  },
  scrapingConfig: {
    loginUrl: '',
    searchUrl: '',
    loginUsername: '',
    loginPassword: '',
    itemLinkSelector: 'a[href]'
  },
  keywords: [],
  keywordsText: ''
})

function sourceToForm(source) {
  if (!source) return emptyForm()
  return {
    ...emptyForm(),
    ...source,
    authCredentials: {
      username: source.authCredentials?.username || '',
      password: source.authCredentials?.password ? CREDENTIAL_MASK : '',
      apiKey: source.authCredentials?.apiKey ? CREDENTIAL_MASK : ''
    },
    discoveryConfig: { ...emptyForm().discoveryConfig, ...(source.discoveryConfig || {}) },
    scrapingConfig: {
      ...emptyForm().scrapingConfig,
      ...(source.scrapingConfig || {}),
      loginPassword: source.scrapingConfig?.loginPassword ? CREDENTIAL_MASK : ''
    },
    keywordsText: (source.keywords || []).join(', ')
  }
}

function formToPayload(form) {
  const keywords = String(form.keywordsText || '')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)

  const payload = {
    name: form.name,
    description: form.description,
    type: form.type,
    url: form.url,
    integrationMode: form.integrationMode,
    connectorTemplate: form.connectorTemplate,
    frequency: form.frequency,
    priority: form.priority,
    reliability: form.reliability,
    status: form.status,
    requiresAuth: form.requiresAuth,
    authCredentials: { ...form.authCredentials },
    discoveryConfig: { ...form.discoveryConfig, baseUrl: form.discoveryConfig.baseUrl || form.url },
    scrapingConfig: { ...form.scrapingConfig },
    keywords
  }

  if (payload.authCredentials.password === CREDENTIAL_MASK) delete payload.authCredentials.password
  if (payload.authCredentials.apiKey === CREDENTIAL_MASK) delete payload.authCredentials.apiKey
  if (payload.scrapingConfig.loginPassword === CREDENTIAL_MASK) delete payload.scrapingConfig.loginPassword

  return payload
}

function modeLabel(mode) {
  if (mode === 'web_scraping') return 'Web scrape'
  if (mode === 'api') return 'REST API'
  return mode || 'API'
}

const DiscoveryConnectors = () => {
  const navigate = useNavigate()
  const [catalog, setCatalog] = useState([])
  const [connectors, setConnectors] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [runningId, setRunningId] = useState(null)
  const [showDrawer, setShowDrawer] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [seedingDemo, setSeedingDemo] = useState(false)
  const [uploadingExcel, setUploadingExcel] = useState(false)
  const fileInputRef = useRef(null)

  const loadConnectors = useCallback(async () => {
    setLoading(true)
    try {
      const res = await discoveryConnectorsAPI.getSources({ limit: 100 })
      if (res.success) setConnectors(res.data.sources || [])
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to load discovery connectors')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    discoveryConnectorsAPI
      .getCatalog()
      .then((res) => {
        if (res.success) setCatalog(res.data.catalog || [])
      })
      .catch(() => {})
    loadConnectors()
  }, [loadConnectors])

  const stats = useMemo(() => {
    const active = connectors.filter((c) => c.status === 'active').length
    const api = connectors.filter((c) => c.integrationMode === 'api').length
    const scrape = connectors.filter((c) => c.integrationMode === 'web_scraping').length
    const scheduled = connectors.filter((c) => c.discoveryConfig?.scheduleEnabled !== false).length
    return {
      total: connectors.length,
      active,
      api,
      scrape,
      scheduled,
      catalogCount: catalog.length,
    }
  }, [connectors, catalog.length])

  const insightItems = useMemo(() => {
    const items = [
      {
        title: 'Product-generic discovery (TB-001)',
        detail:
          'Use Generic REST API for GovWin-style JSON, SAM.gov for US federal search, or Web scraping for public HTML listings. Credentials are tenant-scoped and power the discovery scheduler.',
        tone: 'info',
      },
    ]
    if (stats.total === 0) {
      items.push({
        title: 'No connectors configured yet',
        detail: 'Add your first portal to start importing opportunities into the tender pipeline.',
        tone: 'warning',
      })
    } else {
      items.push({
        title: `${stats.active} of ${stats.total} connectors active · ${stats.scheduled} on scheduled bot`,
        detail: `${stats.api} API · ${stats.scrape} web scrape · ${stats.catalogCount} templates in marketplace catalog.`,
        tone: stats.active > 0 ? 'success' : 'warning',
      })
    }
    return items
  }, [stats])

  const selectedTemplate = useMemo(
    () => catalog.find((c) => c.key === form.connectorTemplate),
    [catalog, form.connectorTemplate]
  )

  const loadDemoConnectors = async () => {
    setSeedingDemo(true)
    try {
      const res = await discoveryConnectorsAPI.seedDemoPlatform()
      if (res.success) {
        showToast.success(res.message || 'Demo connectors loaded')
        await loadConnectors()
      }
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to load demo connectors')
    } finally {
      setSeedingDemo(false)
    }
  }

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm())
    setShowDrawer(true)
  }

  const openEdit = async (row) => {
    try {
      const res = await discoveryConnectorsAPI.getSource(row._id)
      if (res.success) {
        setEditingId(row._id)
        setForm(sourceToForm(res.data.source))
        setShowDrawer(true)
      }
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to load connector')
    }
  }

  const handleTemplateChange = (key) => {
    const item = catalog.find((c) => c.key === key)
    setForm((prev) => ({
      ...prev,
      connectorTemplate: key,
      integrationMode: item?.integrationMode || prev.integrationMode
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name?.trim() || !form.url?.trim()) {
      showToast.error('Name and portal URL are required')
      return
    }

    setSaving(true)
    try {
      const payload = formToPayload(form)
      const res = editingId
        ? await discoveryConnectorsAPI.updateSource(editingId, payload)
        : await discoveryConnectorsAPI.createSource(payload)

      if (res.success) {
        showToast.success(editingId ? 'Discovery connector updated' : 'Discovery connector created')
        setShowDrawer(false)
        loadConnectors()
      } else {
        showToast.error(res.message || 'Save failed')
      }
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    setTesting(true)
    try {
      const payload = formToPayload(form)
      const res = await discoveryConnectorsAPI.testConnection(
        editingId ? { sourceId: editingId, ...payload } : payload
      )
      if (res.success) showToast.success(res.message || 'Connection test passed')
      else showToast.error(res.message || 'Connection test failed')
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Connection test failed')
    } finally {
      setTesting(false)
    }
  }

  const handleRun = async (id) => {
    setRunningId(id)
    try {
      const res = await discoveryConnectorsAPI.runNow(id)
      if (res.success) {
        showToast.success(
          res.message ||
            `Discovery completed. Imported ${res.data?.job?.stats?.imported ?? res.data?.syncResult?.newTenders ?? 0} tenders.`
        )
        loadConnectors()
      } else {
        showToast.error(res.message || 'Discovery run failed')
      }
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Discovery run failed')
    } finally {
      setRunningId(null)
    }
  }

  const handleExcelUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !editingId) return

    setUploadingExcel(true)
    try {
      const res = await discoveryConnectorsAPI.uploadExcelKeywords(editingId, file)
      if (res.success) {
        showToast.success(res.message || 'Keywords uploaded successfully')
        setForm(prev => ({ 
          ...prev, 
          keywordFilePath: res.data.keywordFilePath,
          excelKeywords: res.data.keywords 
        }))
      } else {
        showToast.error(res.message || 'Upload failed')
      }
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploadingExcel(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const getConnectorActions = (row) =>
    buildTableActions({
      onEdit: true,
      onDelete: true,
      custom: [
        {
          type: 'custom',
          key: 'run',
          label: 'Run discovery now',
          icon: 'run',
          disabled: runningId === row._id
        }
      ]
    })

  const handleConnectorAction = (action, row) => {
    runTableAction(action, row, {
      run: () => handleRun(row._id),
      onEdit: () => openEdit(row),
      onDelete: () => handleDelete(row)
    })
  }

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete connector "${row.name}"?`)) return
    try {
      const res = await discoveryConnectorsAPI.deleteSource(row._id)
      if (res.success) {
        showToast.success('Connector deleted')
        loadConnectors()
      }
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Delete failed')
    }
  }

  const updateField = (path, value) => {
    setForm((prev) => {
      const next = { ...prev }
      const keys = path.split('.')
      let cursor = next
      for (let i = 0; i < keys.length - 1; i += 1) {
        cursor[keys[i]] = { ...cursor[keys[i]] }
        cursor = cursor[keys[i]]
      }
      cursor[keys[keys.length - 1]] = value
      return next
    })
  }

  const isApiMode = form.integrationMode === 'api'
  const isScrapeMode = form.integrationMode === 'web_scraping'

  return (
    <>
      <ExecutiveCommandCenter
        className="discovery-connectors-page"
        showSkeleton={loading && connectors.length === 0}
        breadcrumbs={[
          { label: 'Admin & Config', onClick: () => navigate('/admin-config') },
          { label: 'Discovery Connectors', active: true },
        ]}
        onBack={() => navigate('/admin-config')}
        backLabel="Back to Admin"
        title="Discovery connectors"
        description="Configure any discovery portal (API or web listing URL), saved credentials, bot frequency, and lookback window. Scheduled jobs import opportunities into the tender pipeline."
        heroMeta="TB-001 · Connector marketplace"
        heroActions={
          <Button size="sm" variant="outline-primary" onClick={loadConnectors} disabled={loading}>
            {loading ? (
              <Spinner animation="border" size="sm" className="me-2" />
            ) : (
              <RefreshCw size={16} className="me-1" />
            )}
            Refresh
          </Button>
        }
        outlookTitle="Discovery ingestion outlook"
        outlookDescription={`${stats.total} portal${stats.total === 1 ? '' : 's'} configured · ${stats.active} active · ${stats.scheduled} scheduled bots · ${stats.catalogCount} catalog templates available.`}
        outlookChips={[
          `${stats.total} connectors`,
          `${stats.active} active`,
          `${stats.api} API`,
          `${stats.scrape} web scrape`,
        ]}
        insights={insightItems}
        kpiBadge="Operating metrics"
        kpiTitle="Connector signal board"
        kpiMeta="Live portal & scheduler health"
        kpiContent={
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total connectors"
                value={stats.total}
                hint="Tenant portal configs"
                tone="intel"
                trend="Catalog"
                icon={<Layers3 size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Active"
                value={stats.active}
                hint="Ready for discovery jobs"
                tone={stats.active > 0 ? 'success' : 'warning'}
                trend="Status"
                icon={<CheckCircle2 size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Scheduled bots"
                value={stats.scheduled}
                hint="Auto poll enabled"
                tone="intel"
                trend="Scheduler"
                icon={<Clock size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Templates"
                value={stats.catalogCount}
                hint="Marketplace catalog"
                tone="intel"
                trend="TB-001"
                icon={<Radar size={20} />}
              />
            </Col>
          </Row>
        }
        tableTitle="Configured portals"
        tableActions={
          <Button variant="primary" onClick={openCreate}>
            <Plus size={16} className="me-2" />
            Add connector
          </Button>
        }
      >
        {loading && connectors.length > 0 ? (
          <div className="discovery-connectors-loading">
            <Spinner animation="border" size="sm" />
            <span>Refreshing connectors…</span>
          </div>
        ) : null}

        {!loading && connectors.length === 0 ? (
          <div className="discovery-empty-state">
            <div className="discovery-empty-state__icon">
              <Plug size={32} />
            </div>
            <h3>No discovery connectors yet</h3>
            <p>
              For <strong>MediCare Innovations Healthcare Pvt Ltd</strong>, load pre-configured SAM.gov,
              GovWin, Texas SmartBuy, Vizient GPO, and email inbox connectors — or add your own portals.
              The discovery bot imports matching tenders on the schedule you define.
            </p>
            <div className="discovery-empty-state__actions">
              <Button
                variant="primary"
                onClick={loadDemoConnectors}
                disabled={seedingDemo}
              >
                {seedingDemo ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Loading demo connectors…
                  </>
                ) : (
                  <>
                    <Database size={16} className="me-2" />
                    Load healthcare demo connectors
                  </>
                )}
              </Button>
              <Button variant="outline-primary" onClick={openCreate} disabled={seedingDemo}>
                <Plus size={16} className="me-2" />
                Add connector manually
              </Button>
            </div>
          </div>
        ) : (
          <div className="discovery-connectors-table-wrap">
            <Table hover className="discovery-connectors-table align-middle mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mode</th>
                  <th>Template</th>
                  <th>Frequency</th>
                  <th>Lookback</th>
                  <th>Last sync</th>
                  <th>Status</th>
                  <th className="table-actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {connectors.map((row) => (
                  <tr key={row._id}>
                    <td>
                      <div className="connector-name-cell">
                        <span className="connector-name-cell__title">{row.name}</span>
                        <span className="connector-name-cell__url">{row.url}</span>
                      </div>
                    </td>
                    <td>
                      <Badge className={`discovery-mode-pill discovery-mode-pill--${row.integrationMode || 'api'}`}>
                        {modeLabel(row.integrationMode)}
                      </Badge>
                      {row.connectorTemplate === 'govwin' && row.discoveryConfig?.demoMode && (
                        <Badge bg="info" className="ms-1">
                          demo
                        </Badge>
                      )}
                    </td>
                    <td>
                      <span className="connector-template-label">{row.connectorTemplate || 'generic_api'}</span>
                    </td>
                    <td className="text-capitalize">{row.frequency?.replace(/_/g, ' ')}</td>
                    <td>{row.discoveryConfig?.lookbackHours ?? 24}h</td>
                    <td className="connector-sync-cell">
                      {row.lastSync ? new Date(row.lastSync).toLocaleString() : '—'}
                    </td>
                    <td>
                      <Badge
                        className={`discovery-status-pill ${row.status === 'active' ? 'discovery-status-pill--active' : ''}`}
                      >
                        {row.status}
                      </Badge>
                    </td>
                    <td className="table-actions-col">
                      <TableActionsCell
                        actions={getConnectorActions(row)}
                        onAction={(action) => handleConnectorAction(action, row)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </ExecutiveCommandCenter>

      <FormDrawerModal show={showDrawer} onHide={() => setShowDrawer(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit discovery connector' : 'Add discovery connector'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body className="discovery-connectors-form">
            <h6 className="text-muted mb-3">Identity</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="e.g. GovWin Production"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Connector template *</Form.Label>
                  <Form.Select
                    value={form.connectorTemplate}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                  >
                    {catalog.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.displayName}
                      </option>
                    ))}
                  </Form.Select>
                  {selectedTemplate?.description ? (
                    <Form.Text className="text-muted">{selectedTemplate.description}</Form.Text>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <Globe size={14} className="me-1" />
                Portal / base URL *
              </Form.Label>
              <Form.Control
                type="url"
                value={form.url}
                onChange={(e) => {
                  updateField('url', e.target.value)
                  if (!form.discoveryConfig.baseUrl) updateField('discoveryConfig.baseUrl', e.target.value)
                }}
                placeholder="https://api.example.com or https://portal.example.com/listings"
                required
              />
            </Form.Group>

            <h6 className="text-muted mb-3 mt-2">
              <Clock size={14} className="me-1" />
              Bot schedule
            </h6>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Run frequency</Form.Label>
                  <Form.Select
                    value={form.frequency}
                    onChange={(e) => updateField('frequency', e.target.value)}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="every_4_hours">Every 4 hours</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Lookback (hours)</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    max={720}
                    value={form.discoveryConfig.lookbackHours}
                    onChange={(e) =>
                      updateField('discoveryConfig.lookbackHours', Number(e.target.value))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={form.status}
                    onChange={(e) => updateField('status', e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Check
              type="switch"
              className="mb-3"
              label="Enable scheduled discovery (bot)"
              checked={form.discoveryConfig.scheduleEnabled !== false}
              onChange={(e) => updateField('discoveryConfig.scheduleEnabled', e.target.checked)}
            />
            {form.connectorTemplate === 'govwin' && (
              <Form.Check
                type="switch"
                className="mb-3"
                label="GovWin demo mode (curated sample opportunities — no live API call)"
                checked={form.discoveryConfig.demoMode === true}
                onChange={(e) => updateField('discoveryConfig.demoMode', e.target.checked)}
              />
            )}

            {isApiMode && (
              <>
                <h6 className="text-muted mb-3">
                  <Key size={14} className="me-1" />
                  API configuration
                </h6>
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>API base URL</Form.Label>
                      <Form.Control
                        value={form.discoveryConfig.baseUrl}
                        onChange={(e) => updateField('discoveryConfig.baseUrl', e.target.value)}
                        placeholder="https://api.vendor.com"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Opportunities path</Form.Label>
                      <Form.Control
                        value={form.discoveryConfig.opportunitiesPath}
                        onChange={(e) =>
                          updateField('discoveryConfig.opportunitiesPath', e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Auth type</Form.Label>
                      <Form.Select
                        value={form.discoveryConfig.authType}
                        onChange={(e) => updateField('discoveryConfig.authType', e.target.value)}
                      >
                        <option value="bearer">Bearer token</option>
                        <option value="api_key">API key header</option>
                        <option value="basic">Basic (username/password)</option>
                        <option value="none">None</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>API key / token</Form.Label>
                      <Form.Control
                        type="password"
                        value={form.authCredentials.apiKey}
                        onChange={(e) => updateField('authCredentials.apiKey', e.target.value)}
                        placeholder={editingId ? 'Leave masked to keep unchanged' : ''}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Username (basic auth)</Form.Label>
                      <Form.Control
                        value={form.authCredentials.username}
                        onChange={(e) => updateField('authCredentials.username', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={form.authCredentials.password}
                        onChange={(e) => updateField('authCredentials.password', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Search query (optional)</Form.Label>
                  <Form.Control
                    value={form.discoveryConfig.searchQuery}
                    onChange={(e) => updateField('discoveryConfig.searchQuery', e.target.value)}
                  />
                </Form.Group>
              </>
            )}

            {isScrapeMode && (
              <>
                <h6 className="text-muted mb-3">Web scraping</h6>
                <Form.Group className="mb-3">
                  <Form.Label>Login / portal URL</Form.Label>
                  <Form.Control
                    value={form.scrapingConfig.loginUrl}
                    onChange={(e) => updateField('scrapingConfig.loginUrl', e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Search / listing URL</Form.Label>
                  <Form.Control
                    value={form.scrapingConfig.searchUrl}
                    onChange={(e) => updateField('scrapingConfig.searchUrl', e.target.value)}
                  />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Portal username</Form.Label>
                      <Form.Control
                        value={form.scrapingConfig.loginUsername}
                        onChange={(e) =>
                          updateField('scrapingConfig.loginUsername', e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Portal password</Form.Label>
                      <Form.Control
                        type="password"
                        value={form.scrapingConfig.loginPassword}
                        onChange={(e) =>
                          updateField('scrapingConfig.loginPassword', e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Username CSS Selector (optional)</Form.Label>
                      <Form.Control
                        value={form.scrapingConfig.usernameSelector || ''}
                        onChange={(e) => updateField('scrapingConfig.usernameSelector', e.target.value)}
                        placeholder="e.g. #username or input[name='user']"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password CSS Selector (optional)</Form.Label>
                      <Form.Control
                        value={form.scrapingConfig.passwordSelector || ''}
                        onChange={(e) => updateField('scrapingConfig.passwordSelector', e.target.value)}
                        placeholder="e.g. #password or input[type='password']"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Item Link CSS Selector *</Form.Label>
                  <Form.Control
                    value={form.scrapingConfig.itemLinkSelector || 'a[href]'}
                    onChange={(e) => updateField('scrapingConfig.itemLinkSelector', e.target.value)}
                    placeholder="e.g. .titleline > a"
                  />
                  <Form.Text className="text-muted">Target the specific clickable links for the tenders (defaults to all links).</Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Keywords (comma-separated)</Form.Label>
                  <Form.Control
                    value={form.keywordsText}
                    onChange={(e) => updateField('keywordsText', e.target.value)}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Excel Keywords Upload (.xlsx)</Form.Label>
                  {editingId ? (
                    <div className="d-flex align-items-center gap-3">
                      <Form.Control
                        type="file"
                        accept=".xlsx, .xls"
                        ref={fileInputRef}
                        onChange={handleExcelUpload}
                        disabled={uploadingExcel}
                      />
                      {uploadingExcel && <Spinner size="sm" animation="border" />}
                      {form.keywordFilePath && !uploadingExcel && (
                        <Badge bg="success" className="d-flex align-items-center gap-1 px-2 py-1">
                          <CheckCircle2 size={12} /> File Attached
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <div className="text-muted small p-2 bg-light rounded border">
                      Please save the connector first before uploading an Excel file.
                    </div>
                  )}
                  {form.keywordFilePath && (
                    <div className="mt-2">
                      <Form.Text className="text-muted d-block mb-2">
                        Current file: <strong>{form.keywordFilePath.split('/').pop().split('\\').pop()}</strong>
                      </Form.Text>
                      {form.excelKeywords && form.excelKeywords.length > 0 && (
                        <div className="p-2 bg-light border rounded" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                          <small className="d-block text-muted mb-1 fw-bold">Loaded Keywords ({form.excelKeywords.length}):</small>
                          <div className="d-flex flex-wrap gap-1">
                            {form.excelKeywords.map((kw, i) => (
                              <Badge bg="secondary" key={i} pill className="fw-normal">{kw}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer className="flex-wrap gap-2">
            <Button variant="outline-secondary" type="button" onClick={() => setShowDrawer(false)}>
              Cancel
            </Button>
            <Button variant="outline-info" type="button" disabled={testing} onClick={handleTest}>
              {testing ? <Spinner size="sm" animation="border" className="me-1" /> : null}
              Test connection
            </Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? <Spinner size="sm" animation="border" className="me-1" /> : null}
              {editingId ? 'Save changes' : 'Create connector'}
            </Button>
          </Modal.Footer>
        </Form>
      </FormDrawerModal>
    </>
  )
}

export default DiscoveryConnectors
