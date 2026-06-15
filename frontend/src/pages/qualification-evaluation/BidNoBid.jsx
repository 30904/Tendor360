import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Form, Badge, Modal, ProgressBar } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormDrawerModal from '../../components/FormDrawerModal'
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter'
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard'
import { Plus, Edit, Trash2, Eye, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Target } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable'
import { fetchEvaluations, createEvaluation, updateEvaluation, deleteEvaluation, fetchEvaluationStats, selectEvaluations, selectEvaluationStats, selectEvaluationLoading, predictAIScore, submitForReview, reviewEvaluation } from '../../store/slices/evaluationSlice'
import { fetchTenders } from '../../store/slices/tenderSlice'
import './BidNoBid.scss'
import { dummyBidNoBidPrefill } from '../../utils/testFormDummies'
import { userHasAnyRole } from '../../utils/roles'

const BidNoBid = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const evaluations = useSelector(selectEvaluations)
  const statsFromRedux = useSelector(selectEvaluationStats)
  const loading = useSelector(selectEvaluationLoading)
  const { tenders } = useSelector(state => state.tender)
  const { user } = useSelector(state => state.auth)

  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingDecision, setEditingDecision] = useState(null)
  const [prefillSnapshot, setPrefillSnapshot] = useState(null)
  const [modalFormKey, setModalFormKey] = useState(0)

  useEffect(() => {
    dispatch(fetchEvaluations({}))
    dispatch(fetchEvaluationStats())
    dispatch(fetchTenders({ filters: {}, pagination: { itemsPerPage: 100 }, sorting: {} }))
  }, [dispatch])

  // Computed stats from redux or local calculations
  const stats = useMemo(() => {
    if (statsFromRedux?.overview) {
      return {
        totalDecisions: statsFromRedux.overview.totalEvaluations,
        bidDecisions: statsFromRedux.overview.bidCount,
        noBidDecisions: statsFromRedux.overview.noBidCount,
        avgConfidence: Math.round(statsFromRedux.overview.averageScore || 0),
        pendingDecisions: statsFromRedux.overview.pendingCount
      }
    }
    return {
      totalDecisions: 0, bidDecisions: 0, noBidDecisions: 0, avgConfidence: 0, pendingDecisions: 0
    }
  }, [statsFromRedux])

  const availableTenders = useMemo(() => {
    if (!tenders) return [];
    const evaluatedTenderIds = new Set(evaluations?.map(e => e.tenderId?._id || e.tenderId) || []);
    return tenders.filter(t => !evaluatedTenderIds.has(t._id));
  }, [tenders, evaluations]);

  const handleEditDecision = (decision) => {
    setPrefillSnapshot(null)
    setEditingDecision(decision)
    setModalFormKey((k) => k + 1)
    setShowModal(true)
  }

  const handleDeleteDecision = (decision) => {
    if (window.confirm(`Are you sure you want to delete decision for "${decision.tenderId?.title || 'this tender'}"?`)) {
      dispatch(deleteEvaluation(decision._id)).then(() => {
        dispatch(fetchEvaluationStats());
      });
    }
  }

  const handleAIPredict = async () => {
    const tenderSelect = document.querySelector('select[name="tenderId"]');
    if (!tenderSelect || !tenderSelect.value) {
      alert("Please select a Tender first so the AI knows what to analyze.");
      return;
    }
    
    try {
      // Set a loading toast or state if we want, but for now just await
      const response = await dispatch(predictAIScore(tenderSelect.value)).unwrap();
      if (response && response.prediction) {
        setPrefillSnapshot((prev) => ({
          ...prev,
          tenderId: tenderSelect.value, // preserve current selection
          decision: 'BID', 
          confidenceLevel: response.prediction.confidenceLevel,
          riskLevel: response.prediction.riskLevel,
          decisionReason: response.prediction.decisionReason
        }));
        setModalFormKey((k) => k + 1);
      }
    } catch (e) {
      console.error(e);
      alert("AI prediction failed.");
    }
  }

  const handleWorkflowAction = (decision, actionType) => {
    if (actionType === 'SUBMIT') {
      dispatch(submitForReview({ id: decision._id, reviewers: [] })).then(() => {
        dispatch(fetchEvaluations({}));
        dispatch(fetchEvaluationStats());
      });
    } else if (actionType === 'APPROVE' || actionType === 'REJECT') {
      dispatch(reviewEvaluation({ id: decision._id, reviewData: { decision: actionType, comments: '' } })).then(() => {
        dispatch(fetchEvaluations({}));
        dispatch(fetchEvaluationStats());
      });
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const evaluationData = {
      tenderId: formData.get('tenderId'),
      decision: formData.get('decision'),
      riskLevel: formData.get('riskLevel'),
      confidenceLevel: Number(formData.get('confidenceLevel')),
      decisionReason: formData.get('decisionReason'),
      evaluationName: 'Bid/No-Bid Decision'
    };

    if (editingDecision) {
      dispatch(updateEvaluation({ id: editingDecision._id, updateData: evaluationData }))
        .unwrap()
        .then(() => {
          dispatch(fetchEvaluationStats());
          closeBidModal();
        })
        .catch(err => alert("Failed to update: " + err));
    } else {
      dispatch(createEvaluation(evaluationData))
        .unwrap()
        .then(() => {
          dispatch(fetchEvaluationStats());
          closeBidModal();
        })
        .catch(err => alert("Failed to save: " + err));
    }
  }

  const handleViewDecision = (decision) => {
    console.log('View decision:', decision)
    // Navigate to view decision or open view modal
  }

  // Column definitions for DataTable
  const columns = [
    {
      key: 'tenderTitle',
      label: 'Tender Details',
      width: '25%',
      render: (value, row) => (
        <div className="tender-info">
          <div className="fw-semibold d-flex align-items-center">
            <Target size={16} className="me-2" />
            {row.tenderId?.title || 'Unknown Tender'}
          </div>
          <small className="text-muted">Client: {row.tenderId?.organization || 'Unknown'}</small>
        </div>
      )
    },
    {
      key: 'value',
      label: 'Value',
      width: '12%',
      render: (value, row) => (
        <div className="value-info">
          <div className="fw-bold text-primary">${((row.tenderId?.estimatedValue || 0) / 1000000).toFixed(1)}M</div>
        </div>
      )
    },
    {
      key: 'decision',
      label: 'Decision',
      width: '10%',
      render: (value) => getDecisionBadge(value)
    },
    {
      key: 'confidenceLevel',
      label: 'Confidence',
      width: '12%',
      render: (value) => (
        <div className="confidence-info">
          <div className="fw-bold text-primary">{value || 0}%</div>
          <ProgressBar
            now={value || 0}
            variant={(value || 0) >= 80 ? 'success' : (value || 0) >= 60 ? 'warning' : 'danger'}
            size="sm"
            style={{ height: '4px' }}
          />
        </div>
      )
    },
    {
      key: 'riskLevel',
      label: 'Risk Level',
      width: '10%',
      render: (value) => getRiskBadge(value)
    },
    {
      key: 'status',
      label: 'Status',
      width: '10%',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'evaluator',
      label: 'Created By',
      width: '12%',
      render: (value, row) => row.evaluator?.name || 'Unknown'
    },
    {
      key: 'createdAt',
      label: 'Created Date',
      width: '12%',
      render: (value) => {
        if (!value) return '';
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        });
      }
    },
    {
      key: 'actions_workflow',
      label: 'Workflow',
      width: '15%',
      render: (value, row) => {
        if (row.status === 'DRAFT') {
          if (userHasAnyRole(user, ['TENDER MANAGER', 'ADMIN', 'SYSTEM ADMINISTRATOR'])) {
            return (
              <Button size="sm" variant="outline-primary" onClick={() => handleWorkflowAction(row, 'SUBMIT')}>
                Submit for Review
              </Button>
            )
          }
          return <span className="text-muted text-sm">Draft</span>;
        } else if (row.status === 'UNDER_REVIEW') {
          if (userHasAnyRole(user, ['REVIEWER', 'APPROVER', 'ADMIN', 'SYSTEM ADMINISTRATOR'])) {
            return (
              <div className="d-flex gap-2">
                <Button size="sm" variant="success" onClick={() => handleWorkflowAction(row, 'APPROVE')}>Approve</Button>
                <Button size="sm" variant="danger" onClick={() => handleWorkflowAction(row, 'REJECT')}>Reject</Button>
              </div>
            )
          }
          return <span className="text-warning text-sm fw-semibold">Pending Review</span>;
        }
        return <span className="text-muted text-sm">Completed</span>;
      }
    }
  ]

  const getDecisionBadge = (decision) => {
    const variants = {
      'BID': 'success',
      'NO_BID': 'danger'
    }
    return <Badge bg={variants[decision] || 'secondary'}>{decision}</Badge>
  }

  const getRiskBadge = (risk) => {
    const variants = {
      'LOW': 'success',
      'MEDIUM': 'warning',
      'HIGH': 'danger',
      'CRITICAL': 'danger'
    }
    return <Badge bg={variants[risk] || 'secondary'}>{risk}</Badge>
  }

  const getStatusBadge = (status) => {
    const variants = {
      'APPROVED': 'success',
      'PENDING': 'warning',
      'REJECTED': 'danger',
      'DRAFT': 'secondary',
      'UNDER_REVIEW': 'info'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getConfidenceIcon = (confidence) => {
    if (confidence >= 80) return <TrendingUp size={16} className="text-success" />
    if (confidence >= 60) return <Target size={16} className="text-warning" />
    return <TrendingDown size={16} className="text-danger" />
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const insightItems = useMemo(() => {
    const items = []
    if ((stats.totalDecisions || 0) > 0) {
      items.push({
        title: `${stats.bidDecisions || 0} bid paths vs ${stats.noBidDecisions || 0} no-bid holds`,
        detail: `${stats.avgConfidence || 0}% average confidence with ${stats.pendingDecisions || 0} decision(s) awaiting approval.`,
        tone: 'info'
      })
    }
    if ((stats.pendingDecisions || 0) > 0) {
      items.push({
        title: 'Approvals backlog needs a steering touchpoint',
        detail: 'Clear pending items before hard deadlines lock the submission window.',
        tone: 'warning'
      })
    }
    if (!items.length) {
      items.push({
        title: 'Start logging pursuit discipline',
        detail: 'Record bid / no-bid rationale to build repeatable gates and confidence baselines.',
        tone: 'info'
      })
    }
    return items.slice(0, 3)
  }, [stats])

  const formSeed = editingDecision || prefillSnapshot || {}

  const closeBidModal = () => {
    setShowModal(false)
    setEditingDecision(null)
    setPrefillSnapshot(null)
    setModalFormKey((k) => k + 1)
  }

  return (
    <>
      <ExecutiveCommandCenter
        className="bid-no-bid-page"
        breadcrumbs={[
          { label: 'Qualification & Evaluation', onClick: () => navigate('/qualification-evaluation') },
          { label: 'Bid / no-bid', active: true }
        ]}
        onBack={() => navigate('/qualification-evaluation')}
        backLabel="Back to modules"
        title="Bid / no-bid command center"
        description="Make informed bid and no-bid decisions with risk, confidence, and governance visibility."
        heroMeta="Pursuit intelligence"
        outlookTitle="Decision outlook"
        outlookDescription={`${stats.totalDecisions || 0} logged decisions — ${stats.bidDecisions || 0} bid, ${stats.noBidDecisions || 0} no-bid, ${stats.pendingDecisions || 0} pending.`}
        outlookChips={[
          `${stats.totalDecisions || 0} total`,
          `${stats.bidDecisions || 0} bid`,
          `${stats.noBidDecisions || 0} no-bid`,
          `${stats.avgConfidence || 0}% avg confidence`
        ]}
        insights={insightItems}
        kpiTitle="Decision signal board"
        kpiMeta="Posture vs confidence"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total decisions"
                value={stats.totalDecisions || 0}
                hint="Recorded pursuits"
                tone="intel"
                trend="Register"
                icon={<Target size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Bid"
                value={stats.bidDecisions || 0}
                hint="Proceed posture"
                tone="success"
                trend="Go"
                icon={<CheckCircle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="No-bid"
                value={stats.noBidDecisions || 0}
                hint="Declined pursuits"
                tone="warning"
                trend="Hold"
                icon={<AlertTriangle size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Avg confidence"
                value={stats.avgConfidence || 0}
                hint="Model + leader stance"
                tone={(stats.avgConfidence || 0) >= 80 ? 'success' : 'warning'}
                trend="Quality"
                suffix="%"
                icon={<TrendingUp size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Bid / no-bid decisions (${evaluations?.length || 0})`}
        tableActions={(
          <Button
            variant="primary"
            onClick={() => {
              setEditingDecision(null)
              setPrefillSnapshot(null)
              setModalFormKey((k) => k + 1)
              setShowModal(true)
            }}
            className="add-decision-btn"
          >
            <Plus size={20} className="me-2" />
            New decision
          </Button>
        )}
      >
        <DataTable
          data={evaluations || []}
          columns={columns}
          title={`Bid/No-Bid Decisions (${evaluations?.length || 0})`}
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          pageSize={10}
          showActions={true}
          showCheckboxes={false}
          onView={handleViewDecision}
          onEdit={handleEditDecision}
          onDelete={handleDeleteDecision}
          customActions={[
            {
              type: 'custom',
              label: 'View Rationale',
              onClick: (row) => {
                console.log('View rationale:', row.rationale);
              }
            }
          ]}
          searchPlaceholder="Search decisions..."
          emptyMessage="No decisions found"
          loading={loading}
        />
      </ExecutiveCommandCenter>

      <FormDrawerModal
        show={showModal}
        onHide={closeBidModal}
        size="lg"
        onTestFill={
          showModal
            ? () => {
                setPrefillSnapshot(dummyBidNoBidPrefill())
                setModalFormKey((k) => k + 1)
              }
            : undefined
        }
      >
          <Modal.Header closeButton>
            <Modal.Title>
              {editingDecision ? 'Edit Bid/No-Bid Decision' : 'New Bid/No-Bid Decision'}
            </Modal.Title>
          </Modal.Header>
          <Form key={modalFormKey} onSubmit={handleFormSubmit}>
            <Modal.Body>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Select Tender</Form.Label>
                    <Form.Select 
                      name="tenderId" 
                      defaultValue={formSeed.tenderId?._id || formSeed.tenderId || ''}
                      required
                    >
                      <option value="">-- Select a Tender --</option>
                      {availableTenders?.map(t => (
                        <option key={t._id} value={t._id}>{t.title} ({t.organization})</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={12} className="mb-3 d-flex justify-content-end">
                  <Button variant="outline-info" onClick={handleAIPredict}>
                    ✨ Predict with AI
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Decision</Form.Label>
                    <Form.Select name="decision" defaultValue={formSeed.decision || 'BID'}>
                      <option value="BID">BID</option>
                      <option value="NO_BID">NO BID</option>
                      <option value="PENDING">PENDING</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Risk Level</Form.Label>
                    <Form.Select name="riskLevel" defaultValue={formSeed.riskLevel || 'MEDIUM'}>
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Confidence Level (%)</Form.Label>
                    <Form.Control
                      name="confidenceLevel"
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={formSeed.confidenceLevel ?? 50}
                      placeholder="0-100"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Rationale</Form.Label>
                <Form.Control
                  name="decisionReason"
                  as="textarea"
                  rows={4}
                  defaultValue={formSeed.decisionReason || formSeed.rationale || ''}
                  placeholder="Explain the reasoning behind this decision..."
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeBidModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingDecision ? 'Update Decision' : 'Create Decision'}
              </Button>
            </Modal.Footer>
          </Form>
        </FormDrawerModal>
    </>
  )
}

export default BidNoBid