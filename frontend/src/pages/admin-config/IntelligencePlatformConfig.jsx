import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Col, Row, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import {
  RefreshCw,
  Plug,
  Brain,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { intelligenceAPI } from '../../services/intelligenceAPI'
import './IntelligencePlatformConfig.scss'

function PanelManageButton({ onClick, label = 'Manage' }) {
  return (
    <Button size="sm" variant="outline-primary" className="intel-config-panel__action" onClick={onClick}>
      {label}
    </Button>
  )
}

function ConfigPanel({ title, icon, action, footnote, children, emptyMessage, isEmpty = false }) {
  return (
    <Col xs={12} lg={6}>
      <div className="intel-config-panel">
        <div className="intel-config-panel__head">
          <div className="intel-config-panel__title-wrap">
            <div className="intel-config-panel__icon" aria-hidden="true">
              {icon}
            </div>
            <h3 className="intel-config-panel__title">{title}</h3>
          </div>
          {action}
        </div>
        <div className="intel-config-panel__body">
          {isEmpty ? (
            <div className="intel-config-panel__empty">
              <AlertCircle size={18} />
              <span>{emptyMessage}</span>
            </div>
          ) : (
            children
          )}
          {footnote ? <p className="intel-config-panel__footnote">{footnote}</p> : null}
        </div>
      </div>
    </Col>
  )
}

function StatusRow({ label, configured, subtitle }) {
  return (
    <div className="intel-config-row">
      <div className="intel-config-row__text">
        <span className="intel-config-row__label">{label}</span>
        {subtitle ? <span className="intel-config-row__sub">{subtitle}</span> : null}
      </div>
      <Badge
        className={`intel-status-pill ${configured ? 'intel-status-pill--success' : 'intel-status-pill--muted'}`}
      >
        {configured ? (
          <>
            <CheckCircle2 size={12} className="me-1" />
            Configured
          </>
        ) : (
          'Not configured'
        )}
      </Badge>
    </div>
  )
}

const IntelligencePlatformConfig = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [config, setConfig] = useState(null)

  const loadConfig = useCallback(() => {
    setLoading(true)
    setError(null)
    intelligenceAPI
      .getPlatformConfig()
      .then((res) => setConfig(res.data?.data ?? null))
      .catch((e) => setError(e.response?.data?.message || 'Unable to load intelligence platform configuration'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadConfig()
  }, [loadConfig])

  const connectors = config?.connectors || []
  const aiProviders = config?.aiProviders || []
  const scoringProfiles = config?.scoringProfiles || []
  const scheduler = config?.scheduler || {}

  const stats = useMemo(() => {
    const connectorsConfigured = connectors.filter((c) => c.configured).length
    const aiConfigured = aiProviders.filter((p) => p.configured).length
    return {
      connectorsConfigured,
      connectorsTotal: connectors.length,
      aiConfigured,
      aiTotal: aiProviders.length,
      scoringCount: scoringProfiles.length,
      schedulerEnabled: Boolean(scheduler.enabled),
      intervalMs: scheduler.intervalMs || 0,
    }
  }, [connectors, aiProviders, scoringProfiles, scheduler])

  const insightItems = useMemo(() => {
    if (!config) return []
    const items = [
      {
        title: `${stats.connectorsConfigured} of ${stats.connectorsTotal} discovery connectors are configured`,
        detail:
          stats.connectorsConfigured === stats.connectorsTotal
            ? 'All connector slots have credentials — discovery jobs can run on schedule.'
            : 'Complete connector credentials in Discovery Connectors to enable automated tender ingestion.',
        tone: stats.connectorsConfigured >= stats.connectorsTotal / 2 ? 'success' : 'warning',
      },
      {
        title: `${stats.aiConfigured} AI provider${stats.aiConfigured === 1 ? '' : 's'} active for scoring and document intelligence`,
        detail: 'OpenAI and heuristic engines power qualification, extraction, and insight streams.',
        tone: stats.aiConfigured > 0 ? 'info' : 'warning',
      },
      {
        title: stats.schedulerEnabled
          ? `Discovery scheduler enabled · ${stats.intervalMs.toLocaleString()} ms interval`
          : 'Discovery scheduler is paused',
        detail: stats.schedulerEnabled
          ? 'Scheduled discovery runs will poll configured sources automatically.'
          : 'Enable the scheduler after connectors are configured to avoid empty job runs.',
        tone: stats.schedulerEnabled ? 'success' : 'warning',
      },
    ]
    return items
  }, [config, stats])

  const formatInterval = (ms) => {
    if (!ms) return '—'
    if (ms >= 3_600_000) return `${Math.round(ms / 3_600_000)}h`
    if (ms >= 60_000) return `${Math.round(ms / 60_000)}m`
    return `${Math.round(ms / 1000)}s`
  }

  return (
    <ExecutiveCommandCenter
      className="intelligence-platform-config-page"
      showSkeleton={loading && !config}
      breadcrumbs={[
        { label: 'Admin & Config', onClick: () => navigate('/admin-config') },
        { label: 'Intelligence Platform', active: true },
      ]}
      onBack={() => navigate('/admin-config')}
      backLabel="Back to Admin"
      title="Intelligence platform configuration"
      description="Connector credentials, AI providers, scoring profiles, and scheduler settings for demo and production environments."
      heroMeta="Platform telemetry"
      heroActions={
        <Button size="sm" variant="outline-primary" onClick={loadConfig} disabled={loading}>
          {loading ? (
            <Spinner animation="border" size="sm" className="me-2" />
          ) : (
            <RefreshCw size={16} className="me-1" />
          )}
          Refresh
        </Button>
      }
      error={error}
      onDismissError={() => setError(null)}
      outlookTitle="Intelligence platform outlook"
      outlookDescription={`${stats.connectorsConfigured} connectors live · ${stats.aiConfigured} AI engines · ${stats.scoringCount} scoring profile${stats.scoringCount === 1 ? '' : 's'} · scheduler ${stats.schedulerEnabled ? 'on' : 'off'}.`}
      outlookChips={[
        `${stats.connectorsConfigured}/${stats.connectorsTotal} connectors`,
        `${stats.aiConfigured} AI providers`,
        `${stats.scoringCount} scoring profiles`,
        `Scheduler ${stats.schedulerEnabled ? 'enabled' : 'disabled'}`,
      ]}
      insights={insightItems}
      kpiBadge="Operating metrics"
      kpiTitle="Platform signal board"
      kpiMeta="Connectors, AI, scoring, scheduler"
      kpiContent={
        <Row className="g-3">
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Connectors"
              value={stats.connectorsConfigured}
              hint={`${stats.connectorsTotal} catalog entries`}
              tone="intel"
              trend="Discovery"
              icon={<Plug size={20} />}
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="AI providers"
              value={stats.aiConfigured}
              hint={`${stats.aiTotal} available engines`}
              tone="intel"
              trend="Models"
              icon={<Brain size={20} />}
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Scoring profiles"
              value={stats.scoringCount}
              hint="Qualification & pursuit rules"
              tone={stats.scoringCount > 0 ? 'success' : 'warning'}
              trend="Rules"
              icon={<Target size={20} />}
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <PremiumKpiCard
              label="Scheduler"
              value={stats.schedulerEnabled ? 1 : 0}
              displayValue={stats.schedulerEnabled ? 'On' : 'Off'}
              hint={`Interval ${formatInterval(stats.intervalMs)}`}
              tone={stats.schedulerEnabled ? 'success' : 'warning'}
              trend="Jobs"
              icon={<Clock size={20} />}
            />
          </Col>
        </Row>
      }
    >
      {!loading && config ? (
        <Row className="g-3 intel-config-grid">
          <ConfigPanel
            title="Connector credentials"
            icon={<Plug size={20} />}
            isEmpty={!connectors.length}
            emptyMessage="No connectors in catalog."
            action={
              <PanelManageButton onClick={() => navigate('/admin-config/discovery-connectors')} />
            }
            footnote="Add portals, API keys, and per-connector bot frequency in Discovery Connectors."
          >
            {connectors.map((connector) => (
              <StatusRow
                key={connector.key}
                label={connector.displayName}
                configured={connector.configured}
              />
            ))}
          </ConfigPanel>

          <ConfigPanel
            title="AI providers"
            icon={<Brain size={20} />}
            isEmpty={!aiProviders.length}
            emptyMessage="No AI providers registered."
            action={
              <PanelManageButton
                label="AI settings"
                onClick={() => navigate('/admin-config/ai-prompt-templates')}
              />
            }
            footnote="OpenAI: set OPENAI_API_KEY on the server. Optional AI_PROVIDER=openai|heuristic. Prompt templates are under Admin → AI Prompt Templates."
          >
            {aiProviders.map((provider) => (
              <StatusRow key={provider.key} label={provider.displayName} configured={provider.configured} />
            ))}
          </ConfigPanel>

          <ConfigPanel
            title="Scoring profiles"
            icon={<Target size={20} />}
            isEmpty={!scoringProfiles.length}
            emptyMessage="No scoring profiles configured."
            action={
              <PanelManageButton
                label="Scoring"
                onClick={() => navigate('/qualification-evaluation/scoring')}
              />
            }
            footnote="Define evaluation models and weights in Qualification → Scoring. Profiles stored for your tenant appear here after creation."
          >
            {scoringProfiles.map((profile) => (
              <div key={profile._id} className="intel-config-row intel-config-row--stacked">
                <div className="intel-config-row__text">
                  <span className="intel-config-row__label">{profile.name}</span>
                  {profile.description ? (
                    <span className="intel-config-row__sub">{profile.description}</span>
                  ) : null}
                </div>
                <Badge className="intel-status-pill intel-status-pill--info">Active</Badge>
              </div>
            ))}
          </ConfigPanel>

          <ConfigPanel
            title="Scheduler settings"
            icon={<Clock size={20} />}
            action={
              <div className="intel-config-panel__actions">
                <PanelManageButton
                  label="Connector bots"
                  onClick={() => navigate('/admin-config/discovery-connectors')}
                />
                <PanelManageButton
                  label="Status"
                  onClick={() => navigate('/tender-discovery/scheduler')}
                />
              </div>
            }
            footnote="Per-connector schedule: enable bot + frequency on each connector. Global poll interval (shown above) is set on the application server."
          >
            <div className="intel-scheduler-stats">
              <div className="intel-scheduler-stat">
                <span className="intel-scheduler-stat__label">Status</span>
                <Badge
                  className={`intel-status-pill ${scheduler.enabled ? 'intel-status-pill--success' : 'intel-status-pill--muted'}`}
                >
                  {scheduler.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="intel-scheduler-stat">
                <span className="intel-scheduler-stat__label">Poll interval</span>
                <strong className="intel-scheduler-stat__value">{formatInterval(scheduler.intervalMs)}</strong>
              </div>
              <div className="intel-scheduler-stat">
                <span className="intel-scheduler-stat__label">Raw interval</span>
                <strong className="intel-scheduler-stat__value">
                  {scheduler.intervalMs ? `${Number(scheduler.intervalMs).toLocaleString()} ms` : '—'}
                </strong>
              </div>
            </div>
          </ConfigPanel>
        </Row>
      ) : null}

      {loading && config ? (
        <div className="text-center py-4">
          <Spinner animation="border" size="sm" />
          <span className="ms-2 text-muted">Refreshing configuration…</span>
        </div>
      ) : null}
    </ExecutiveCommandCenter>
  )
}

export default IntelligencePlatformConfig
