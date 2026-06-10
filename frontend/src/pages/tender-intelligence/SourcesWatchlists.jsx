import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Badge, Breadcrumb, Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap'
import { ArrowLeft, Bell, ExternalLink, Globe, Layers3, Plus, RefreshCw, Sparkles } from 'lucide-react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import InsightStream from '../../components/intelligence/InsightStream'
import sourcesWatchlistsAPI from '../../services/sourcesWatchlistsAPI'
import { mapSourceRow, mapWatchlistRow } from './sourcesWatchlistsMappers'
import SourcesWatchlistsModals from './SourcesWatchlistsModals'
import { dummyTenderSourceFormData, dummyWatchlistFormData } from '../../utils/testFormDummies'
import './SourcesWatchlists.scss'

const parseCommaList = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const SourcesWatchlists = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [sources, setSources] = useState([])
  const [watchlists, setWatchlists] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [activeTab, setActiveTab] = useState('sources')
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  })
  const [sourceFormData, setSourceFormData] = useState({
    name: '',
    description: '',
    type: 'Government',
    url: 'https://',
    priority: 'medium',
    reliability: 'medium',
    frequency: 'daily'
  })
  const [watchlistFormData, setWatchlistFormData] = useState({
    name: '',
    description: '',
    priority: 'medium',
    frequency: 'daily',
    keywordsText: '',
    categoriesText: '',
    regionsText: '',
    minValue: 0,
    maxValue: '',
    currency: 'USD',
    daysAhead: 30,
    daysBehind: 7
  })

  const prevShowFormModal = React.useRef(showFormModal)

  React.useEffect(() => {
    if (prevShowFormModal.current && !showFormModal && location.pathname.endsWith('/new')) {
      navigate('/tender-intelligence/sources', { replace: true })
    }
    prevShowFormModal.current = showFormModal
  }, [showFormModal, location.pathname, navigate])

  const loadSources = async (page = 1, filters = {}) => {
    setLoading(true)
    setError('')
    try {
      const response = await sourcesWatchlistsAPI.getTenderSources({
        page,
        limit: pagination.itemsPerPage,
        ...filters
      })
      if (response.success) {
        setSources((response.data.sources || []).map(mapSourceRow))
        setPagination(response.data.pagination)
      } else {
        setError(response.message || 'Failed to load sources')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load sources')
    } finally {
      setLoading(false)
    }
  }

  const loadWatchlists = async (page = 1, filters = {}) => {
    setLoading(true)
    setError('')
    try {
      const response = await sourcesWatchlistsAPI.getWatchlists({
        page,
        limit: pagination.itemsPerPage,
        ...filters
      })
      if (response.success) {
        setWatchlists((response.data.watchlists || []).map(mapWatchlistRow))
        setPagination(response.data.pagination)
      } else {
        setError(response.message || 'Failed to load watchlists')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load watchlists')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await sourcesWatchlistsAPI.getStats()
      if (response.success) {
        setStats(response.data.overview || {})
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load source intelligence metrics')
    }
  }

  const refreshAll = async () => {
    await Promise.all([
      loadSources(pagination.currentPage),
      loadWatchlists(pagination.currentPage),
      loadStats()
    ])
  }

  useEffect(() => {
    refreshAll()
  }, [])

  useEffect(() => {
    if (activeTab === 'sources') {
      loadSources(1)
    } else {
      loadWatchlists(1)
    }
  }, [activeTab])

  const insightItems = useMemo(
    () => [
      {
        title: `${stats.totalSources || 0} configured sources monitoring ${stats.totalTenders || 0} opportunities`,
        detail: `${stats.newTenders || 0} new opportunities detected across active connector feeds.`,
        tone: 'info'
      },
      {
        title: `${stats.totalWatchlists || 0} active watchlists generating ${stats.totalAlerts || 0} alerts`,
        detail: 'Saved filters and keyword monitors are ready for qualification handoff.',
        tone: 'primary'
      },
      {
        title: `Average AI confidence at ${stats.avgAiConfidence || 0}% across source monitoring`,
        detail: 'Review low-confidence feeds before expanding automated ingestion.',
        tone: (stats.avgAiConfidence || 0) >= 75 ? 'success' : 'warning'
      }
    ],
    [stats]
  )

  const openCreateModal = () => {
    setIsEditing(false)
    setSelectedItem(null)
    if (activeTab === 'sources') {
      setSourceFormData({
        name: '',
        description: '',
        type: 'Government',
        url: 'https://',
        priority: 'medium',
        reliability: 'medium',
        frequency: 'daily'
      })
    } else {
      setWatchlistFormData({
        name: '',
        description: '',
        priority: 'medium',
        frequency: 'daily',
        keywordsText: '',
        categoriesText: '',
        regionsText: '',
        minValue: 0,
        maxValue: '',
        currency: 'USD',
        daysAhead: 30,
        daysBehind: 7
      })
    }
    setShowFormModal(true)
  }

  useEffect(() => {
    if (location.pathname.endsWith('/new')) {
      openCreateModal()
    }
  }, [location.pathname])

  const handleEditSource = (source) => {
    setSourceFormData({
      name: source.name || '',
      description: source.description || '',
      type: source.type || 'Government',
      url: source.url || 'https://',
      priority: source.priority || 'medium',
      reliability: source.reliability || 'medium',
      frequency: source.frequency || 'daily'
    })
    setIsEditing(true)
    setSelectedItem(source)
    setShowFormModal(true)
  }

  const handleEditWatchlist = (watchlist) => {
    setWatchlistFormData({
      name: watchlist.name || '',
      description: watchlist.description || '',
      priority: watchlist.priority || 'medium',
      frequency: watchlist.frequency || 'daily',
      keywordsText: (watchlist.keywords || []).join(', '),
      categoriesText: (watchlist.categories || []).join(', '),
      regionsText: (watchlist.regions || []).join(', '),
      minValue: watchlist.minValue || 0,
      maxValue: watchlist.maxValue ?? '',
      currency: watchlist.currency || 'USD',
      daysAhead: watchlist.daysAhead || 30,
      daysBehind: watchlist.daysBehind || 7
    })
    setIsEditing(true)
    setSelectedItem(watchlist)
    setShowFormModal(true)
  }

  const handleSaveForm = async () => {
    try {
      setLoading(true)
      setError('')
      if (activeTab === 'sources') {
        const payload = { ...sourceFormData }
        const response = isEditing
          ? await sourcesWatchlistsAPI.updateTenderSource(selectedItem.id, payload)
          : await sourcesWatchlistsAPI.createTenderSource(payload)
        if (!response.success) throw new Error(response.message || 'Failed to save source')
        setSuccess(isEditing ? 'Source updated successfully' : 'Source created successfully')
        await loadSources(pagination.currentPage)
      } else {
        const payload = {
          name: watchlistFormData.name,
          description: watchlistFormData.description,
          priority: watchlistFormData.priority,
          frequency: watchlistFormData.frequency,
          keywords: parseCommaList(watchlistFormData.keywordsText),
          categories: parseCommaList(watchlistFormData.categoriesText),
          regions: parseCommaList(watchlistFormData.regionsText),
          minValue: Number(watchlistFormData.minValue) || 0,
          maxValue: watchlistFormData.maxValue === '' ? null : Number(watchlistFormData.maxValue),
          currency: watchlistFormData.currency,
          daysAhead: Number(watchlistFormData.daysAhead) || 30,
          daysBehind: Number(watchlistFormData.daysBehind) || 7
        }
        if (!payload.keywords.length) {
          setError('At least one keyword is required for a watchlist')
          return
        }
        const response = isEditing
          ? await sourcesWatchlistsAPI.updateWatchlist(selectedItem.id, payload)
          : await sourcesWatchlistsAPI.createWatchlist(payload)
        if (!response.success) throw new Error(response.message || 'Failed to save watchlist')
        setSuccess(isEditing ? 'Watchlist updated successfully' : 'Watchlist created successfully')
        await loadWatchlists(pagination.currentPage)
      }
      setShowFormModal(false)
      await loadStats()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save record')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSource = async (source) => {
    if (!window.confirm(`Delete source "${source.name}"?`)) return
    setLoading(true)
    try {
      const response = await sourcesWatchlistsAPI.deleteTenderSource(source.id)
      if (response.success) {
        setSuccess('Source deleted successfully')
        await loadSources(pagination.currentPage)
        await loadStats()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete source')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteWatchlist = async (watchlist) => {
    if (!window.confirm(`Delete watchlist "${watchlist.name}"?`)) return
    setLoading(true)
    try {
      const response = await sourcesWatchlistsAPI.deleteWatchlist(watchlist.id)
      if (response.success) {
        setSuccess('Watchlist deleted successfully')
        await loadWatchlists(pagination.currentPage)
        await loadStats()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete watchlist')
    } finally {
      setLoading(false)
    }
  }

  const handleSyncSource = async (source) => {
    setLoading(true)
    try {
      const response = await sourcesWatchlistsAPI.syncTenderSource(source.id)
      if (response.success) {
        setSuccess('Source sync completed')
        await loadSources(pagination.currentPage)
        await loadStats()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sync source')
    } finally {
      setLoading(false)
    }
  }

  const handleRunWatchlist = async (watchlist) => {
    setLoading(true)
    try {
      const response = await sourcesWatchlistsAPI.runWatchlist(watchlist.id)
      if (response.success) {
        setSuccess('Watchlist run completed')
        await loadWatchlists(pagination.currentPage)
        await loadStats()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to run watchlist')
    } finally {
      setLoading(false)
    }
  }

  const sourcesColumns = [
    {
      key: 'name',
      label: 'Source',
      width: '24%',
      render: (value, row) => (
        <div className="sources-watchlists-page__source-cell">
          <div className="fw-semibold d-flex align-items-center">
            <Globe size={16} className="me-2 text-primary" />
            {value}
          </div>
          {row.description ? <small className="text-muted d-block mt-1">{row.description}</small> : null}
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      width: '10%',
      render: (value) => <Badge bg="primary">{value || '—'}</Badge>
    },
    {
      key: 'statusLabel',
      label: 'Status',
      width: '10%',
      render: (value) => (
        <Badge bg={value === 'Active' ? 'success' : 'secondary'}>{value || '—'}</Badge>
      )
    },
    {
      key: 'newTenders',
      label: 'New',
      width: '8%',
      render: (value) => <span className="fw-semibold text-primary">{value ?? 0}</span>
    },
    {
      key: 'totalTenders',
      label: 'Tender count',
      width: '10%',
      render: (value) => (
        <div className="sources-watchlists-page__metric-cell">
          <span className="fw-semibold text-success">{(value ?? 0).toLocaleString()}</span>
          <small className="text-muted d-block">tenders</small>
        </div>
      )
    },
    {
      key: 'lastCheckedLabel',
      label: 'Last checked',
      width: '10%'
    },
    {
      key: 'reliabilityLabel',
      label: 'Reliability',
      width: '10%'
    },
    {
      key: 'aiConfidence',
      label: 'AI %',
      width: '8%',
      render: (value) => <span className="fw-semibold">{value ?? 0}%</span>
    },
    {
      key: 'priorityLabel',
      label: 'Priority',
      width: '10%'
    },
    {
      key: 'frequencyLabel',
      label: 'Frequency',
      width: '12%'
    },
    {
      key: 'url',
      label: 'URL',
      width: '10%',
      render: (value) =>
        value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none">
            <ExternalLink size={14} className="me-1" />
            Visit
          </a>
        ) : (
          '—'
        )
    }
  ]

  const watchlistsColumns = [
    {
      key: 'name',
      label: 'Watchlist',
      width: '24%',
      render: (value, row) => (
        <div className="sources-watchlists-page__source-cell">
          <div className="fw-semibold d-flex align-items-center">
            <Bell size={16} className="me-2 text-primary" />
            {value}
          </div>
          {row.description ? <small className="text-muted d-block mt-1">{row.description}</small> : null}
        </div>
      )
    },
    {
      key: 'statusLabel',
      label: 'Status',
      width: '10%',
      render: (value) => (
        <Badge bg={value === 'Active' ? 'success' : 'secondary'}>{value || '—'}</Badge>
      )
    },
    {
      key: 'alerts',
      label: 'Alerts',
      width: '8%',
      render: (value) => <span className="fw-semibold text-warning">{value ?? 0}</span>
    },
    {
      key: 'matches',
      label: 'Matches',
      width: '8%',
      render: (value) => <span className="fw-semibold text-success">{value ?? 0}</span>
    },
    {
      key: 'aiConfidence',
      label: 'AI %',
      width: '8%',
      render: (value) => <span className="fw-semibold">{value ?? 0}%</span>
    },
    {
      key: 'priorityLabel',
      label: 'Priority',
      width: '10%'
    },
    {
      key: 'frequencyLabel',
      label: 'Frequency',
      width: '12%'
    },
    {
      key: 'categories',
      label: 'Categories',
      width: '10%',
      render: (value) => (value || []).length
    }
  ]

  if (loading && !sources.length && !watchlists.length && !error) {
    return (
      <div className="sources-watchlists-page page-enter page-bg-gradient intel-executive-page">
        <Container fluid className="py-4">
          <div className="intel-loading-skeleton mb-3" />
          <div className="intel-loading-skeleton mb-3" style={{ minHeight: 120 }} />
          <div className="intel-loading-skeleton mb-3" style={{ minHeight: 88 }} />
          <div className="intel-loading-skeleton" style={{ minHeight: 420 }} />
        </Container>
      </div>
    )
  }

  return (
    <div className="sources-watchlists-page page-enter page-bg-gradient intel-executive-page">
      <Container fluid>
        <Row className="mb-3">
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item onClick={() => navigate('/tender-intelligence')} style={{ cursor: 'pointer' }}>
                Tender Intelligence
              </Breadcrumb.Item>
              <Breadcrumb.Item active>Sources & Watchlists</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <div className="intel-executive-page__hero mb-3">
          <div>
            <Button variant="outline-secondary" size="sm" className="mb-2" onClick={() => navigate('/tender-intelligence')}>
              <ArrowLeft size={16} className="me-2" />
              Back to modules
            </Button>
            <h1>Sources & watchlists command center</h1>
            <p>Manage tender sources and automated watchlists with AI-powered monitoring and connector health.</p>
          </div>
          <div className="intel-executive-page__hero-actions">
            <Button size="sm" variant="outline-primary" onClick={refreshAll} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <RefreshCw size={16} className="me-1" />}
              Refresh
            </Button>
            <small>Source and watchlist telemetry</small>
          </div>
        </div>

        {error ? <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert> : null}
        {success ? <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert> : null}

        <div className="intel-cinematic-hero mb-3">
          <h2 className="h4 mb-2">Monitoring intelligence outlook</h2>
          <p className="mb-0">
            {stats.totalSources || 0} sources and {stats.totalWatchlists || 0} watchlists are monitoring the opportunity
            pipeline with {stats.avgAiConfidence || 0}% average AI confidence.
          </p>
          <div className="intel-cinematic-hero__chips">
            <span className="intel-chip">{stats.totalTenders || 0} monitored opportunities</span>
            <span className="intel-chip">{stats.newTenders || 0} newly detected</span>
            <span className="intel-chip">{stats.totalAlerts || 0} active alerts</span>
          </div>
        </div>

        <InsightStream items={insightItems} />

        <div className="intel-mission-control sources-kpi-strip mb-3">
          <div className="pipeline-kpi-strip__head">
            <div>
              <span className="pipeline-kpi-strip__badge">Operating metrics</span>
              <h2 className="pipeline-kpi-strip__title">Monitoring signal board</h2>
            </div>
            <small className="pipeline-kpi-strip__meta">Connector health and watchlist coverage</small>
          </div>
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total sources"
                value={stats.totalSources || 0}
                hint={`${stats.activeSources || 0} active connectors`}
                tone="intel"
                trend="Live"
                icon={<Globe size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Watchlists"
                value={stats.totalWatchlists || 0}
                hint={`${stats.activeWatchlists || 0} active monitors`}
                tone="success"
                trend="Active"
                icon={<Bell size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total alerts"
                value={stats.totalAlerts || 0}
                hint={`${stats.newTenders || 0} newly detected opportunities`}
                tone="warning"
                trend="Review"
                icon={<Layers3 size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="AI confidence"
                value={stats.avgAiConfidence || 0}
                hint={`${stats.totalTenders || 0} monitored opportunities`}
                tone={(stats.avgAiConfidence || 0) >= 75 ? 'success' : 'warning'}
                trend="Quality"
                suffix="%"
                icon={<Sparkles size={20} />}
              />
            </Col>
          </Row>
        </div>

        <Card className="intel-chart-card mb-3">
          <Card.Header className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div className="tab-navigation mb-0">
              <Button variant={activeTab === 'sources' ? 'primary' : 'outline-primary'} className="me-2" onClick={() => setActiveTab('sources')}>
                <Globe size={16} className="me-2" />
                Sources ({stats.totalSources || 0})
              </Button>
              <Button variant={activeTab === 'watchlists' ? 'primary' : 'outline-primary'} onClick={() => setActiveTab('watchlists')}>
                <Bell size={16} className="me-2" />
                Watchlists ({stats.totalWatchlists || 0})
              </Button>
            </div>
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <Button variant="primary" onClick={openCreateModal} disabled={loading}>
                <Plus size={16} className="me-2" />
                {activeTab === 'sources' ? 'New source' : 'New watchlist'}
              </Button>
              <Button variant="outline-primary" as={Link} to="/tender-intelligence/sources/new" disabled={loading}>
                Full-page create
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            {activeTab === 'sources' ? (
              <DataTable
                data={sources}
                columns={sourcesColumns}
                title={`Tender sources (${pagination.totalItems})`}
                searchable
                sortable
                exportable
                pagination
                pageSize={pagination.itemsPerPage}
                showActions
                onView={(item) => { setSelectedItem(item); setShowModal(true) }}
                onEdit={handleEditSource}
                onDelete={handleDeleteSource}
                customActions={[{ type: 'custom', label: 'Sync source', onClick: handleSyncSource }]}
                searchPlaceholder="Search sources..."
                emptyMessage="No sources found"
                loading={loading}
              />
            ) : (
              <DataTable
                data={watchlists}
                columns={watchlistsColumns}
                title={`Watchlists (${pagination.totalItems})`}
                searchable
                sortable
                exportable
                pagination
                pageSize={pagination.itemsPerPage}
                showActions
                onView={(item) => { setSelectedItem(item); setShowModal(true) }}
                onEdit={handleEditWatchlist}
                onDelete={handleDeleteWatchlist}
                customActions={[{ type: 'custom', label: 'Run watchlist', onClick: handleRunWatchlist }]}
                searchPlaceholder="Search watchlists..."
                emptyMessage="No watchlists found"
                loading={loading}
              />
            )}
          </Card.Body>
        </Card>
      </Container>

      <SourcesWatchlistsModals
        activeTab={activeTab}
        showModal={showModal}
        setShowModal={setShowModal}
        selectedItem={selectedItem}
        handleEditSource={handleEditSource}
        handleEditWatchlist={handleEditWatchlist}
        showFormModal={showFormModal}
        setShowFormModal={setShowFormModal}
        isEditing={isEditing}
        loading={loading}
        sourceFormData={sourceFormData}
        setSourceFormData={setSourceFormData}
        watchlistFormData={watchlistFormData}
        setWatchlistFormData={setWatchlistFormData}
        handleSaveForm={handleSaveForm}
        onTestFill={
          showFormModal
            ? () =>
                (activeTab === 'sources'
                  ? setSourceFormData(dummyTenderSourceFormData())
                  : setWatchlistFormData(dummyWatchlistFormData()))
            : undefined
        }
      />
    </div>
  )
}

export default SourcesWatchlists
