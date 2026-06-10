import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge, 
  Spinner, 
  Alert,
  Modal,
  Tab,
  Tabs,
  ProgressBar,
  Form
} from 'react-bootstrap';
import { 
  Brain, 
  FileText, 
  AlertTriangle, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Star,
  Download,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from 'lucide-react';
import aiService from '../../services/aiService';
import { showToast } from '../../utils/toast';
import './DocumentAnalysis.scss';

const DocumentAnalysis = ({ document, onClose }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [feedback, setFeedback] = useState({ helpful: null, accuracy: 5, comments: '' });
  const [showFeedback, setShowFeedback] = useState(false);
  const [existingAnalyses, setExistingAnalyses] = useState([]);

  useEffect(() => {
    if (document) {
      loadExistingAnalyses();
    }
  }, [document]);

  const loadExistingAnalyses = async () => {
    try {
      const response = await aiService.getDocumentAnalyses(document._id);
      setExistingAnalyses(response.data.analyses);
      
      // If there's a completed analysis, load it
      const completedAnalysis = response.data.analyses.find(a => a.status === 'completed');
      if (completedAnalysis) {
        setAnalysis(completedAnalysis);
      }
    } catch (error) {
      console.error('Error loading existing analyses:', error);
    }
  };

  const startAnalysis = async () => {
    if (!document) return;

    setLoading(true);
    try {
      const response = await aiService.analyzeDocument(document._id, 'full');
      
      if (response.success) {
        showToast.success('AI analysis started! Results will be available shortly.');
        
        // Poll for results
        pollForResults(response.data.analysisId);
      } else {
        showToast.error(response.message || 'Failed to start analysis');
      }
    } catch (error) {
      console.error('Error starting analysis:', error);
      showToast.error('Failed to start AI analysis');
    } finally {
      setLoading(false);
    }
  };

  const pollForResults = async (analysisId) => {
    const maxAttempts = 30; // 5 minutes max
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await aiService.getAnalysisResults(analysisId);
        
        if (response.success && response.data.status === 'completed') {
          setAnalysis(response.data);
          showToast.success('AI analysis completed!');
          loadExistingAnalyses(); // Refresh the list
          return;
        } else if (response.data.status === 'failed') {
          showToast.error('AI analysis failed. Please try again.');
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          showToast.error('Analysis is taking longer than expected. Please check back later.');
        }
      } catch (error) {
        console.error('Error polling for results:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000);
        }
      }
    };

    poll();
  };

  const submitFeedback = async () => {
    if (!analysis || !feedback.helpful) return;

    try {
      await aiService.provideFeedback(analysis._id, feedback);
      showToast.success('Thank you for your feedback!');
      setShowFeedback(false);
      setFeedback({ helpful: null, accuracy: 5, comments: '' });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showToast.error('Failed to submit feedback');
    }
  };

  const getRiskLevelColor = (score) => {
    if (score >= 8) return 'danger';
    if (score >= 6) return 'warning';
    if (score >= 4) return 'info';
    return 'success';
  };

  const getRiskLevelText = (score) => {
    if (score >= 8) return 'Very High';
    if (score >= 6) return 'High';
    if (score >= 4) return 'Medium';
    return 'Low';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!document) return null;

  return (
    <Modal show={true} onHide={onClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <Brain className="me-2" size={20} />
          AI Document Analysis
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Container fluid>
          {/* Document Info */}
          <Row className="mb-4">
            <Col>
              <Card className="border-0 bg-light">
                <Card.Body className="py-3">
                  <div className="d-flex align-items-center">
                    <FileText className="me-3 text-primary" size={24} />
                    <div>
                      <h6 className="mb-1">{document.originalName || document.name}</h6>
                      <small className="text-muted">
                        {document.fileType?.toUpperCase()} • {formatDate(document.createdAt)}
                      </small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Analysis Status */}
          {!analysis && !loading && (
            <Row className="mb-4">
              <Col>
                <Alert variant="info" className="text-center">
                  <Brain className="me-2" size={20} />
                  <strong>Ready for AI Analysis</strong>
                  <p className="mb-3 mt-2">
                    Get instant insights on requirements, risks, and key dates from this document.
                  </p>
                  <Button 
                    variant="primary" 
                    onClick={startAnalysis}
                    disabled={loading}
                  >
                    <Brain className="me-2" size={16} />
                    Start AI Analysis
                  </Button>
                </Alert>
              </Col>
            </Row>
          )}

          {/* Loading State */}
          {loading && (
            <Row className="mb-4">
              <Col>
                <Alert variant="info" className="text-center">
                  <Spinner animation="border" size="sm" className="me-2" />
                  <strong>AI is analyzing your document...</strong>
                  <p className="mb-0 mt-2">This may take a few moments</p>
                </Alert>
              </Col>
            </Row>
          )}

          {/* Analysis Results */}
          {analysis && analysis.status === 'completed' && (
            <>
              {/* Analysis Overview */}
              <Row className="mb-4">
                <Col md={3}>
                  <Card className="text-center border-0 bg-primary text-white">
                    <Card.Body>
                      <CheckCircle size={24} className="mb-2" />
                      <h6>Requirements</h6>
                      <h4>{analysis.totalRequirements || 0}</h4>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center border-0 bg-warning text-white">
                    <Card.Body>
                      <AlertTriangle size={24} className="mb-2" />
                      <h6>Risks</h6>
                      <h4>{analysis.totalRisks || 0}</h4>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center border-0 bg-info text-white">
                    <Card.Body>
                      <Calendar size={24} className="mb-2" />
                      <h6>Key Dates</h6>
                      <h4>{analysis.dates?.key_dates?.length || 0}</h4>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center border-0 bg-success text-white">
                    <Card.Body>
                      <Star size={24} className="mb-2" />
                      <h6>Confidence</h6>
                      <h4>{Math.round((analysis.confidenceScore || 0) * 100)}%</h4>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Risk Score */}
              {analysis.risks?.overall_risk_score && (
                <Row className="mb-4">
                  <Col>
                    <Card>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0">Overall Risk Score</h6>
                          <Badge 
                            bg={getRiskLevelColor(analysis.risks.overall_risk_score)}
                            className="fs-6"
                          >
                            {analysis.risks.overall_risk_score}/10 - {getRiskLevelText(analysis.risks.overall_risk_score)}
                          </Badge>
                        </div>
                        <ProgressBar 
                          now={analysis.risks.overall_risk_score * 10} 
                          variant={getRiskLevelColor(analysis.risks.overall_risk_score)}
                          className="mb-2"
                        />
                        <small className="text-muted">
                          {analysis.risks.risk_summary}
                        </small>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}

              {/* Analysis Tabs */}
              <Tabs
                activeKey={activeTab}
                onSelect={setActiveTab}
                className="mb-3"
              >
                <Tab eventKey="summary" title="Summary">
                  <Card>
                    <Card.Body>
                      <h6 className="mb-3">Executive Summary</h6>
                      <p className="mb-0">{analysis.summary?.summary}</p>
                    </Card.Body>
                  </Card>
                </Tab>

                <Tab eventKey="requirements" title="Requirements">
                  <Card>
                    <Card.Body>
                      <h6 className="mb-3">Extracted Requirements</h6>
                      
                      {analysis.requirements?.technical_requirements?.length > 0 && (
                        <div className="mb-4">
                          <h6 className="text-primary">Technical Requirements</h6>
                          {analysis.requirements.technical_requirements.map((req, index) => (
                            <div key={index} className="border-start border-primary border-3 ps-3 mb-2">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <strong>{req.requirement}</strong>
                                  {req.mandatory && <Badge bg="danger" className="ms-2">Mandatory</Badge>}
                                </div>
                              </div>
                              <p className="text-muted mb-1">{req.description}</p>
                              <small className="text-muted">Category: {req.category}</small>
                            </div>
                          ))}
                        </div>
                      )}

                      {analysis.requirements?.commercial_requirements?.length > 0 && (
                        <div className="mb-4">
                          <h6 className="text-success">Commercial Requirements</h6>
                          {analysis.requirements.commercial_requirements.map((req, index) => (
                            <div key={index} className="border-start border-success border-3 ps-3 mb-2">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <strong>{req.requirement}</strong>
                                  {req.mandatory && <Badge bg="danger" className="ms-2">Mandatory</Badge>}
                                </div>
                              </div>
                              <p className="text-muted mb-1">{req.description}</p>
                              <small className="text-muted">Category: {req.category}</small>
                            </div>
                          ))}
                        </div>
                      )}

                      {analysis.requirements?.compliance_requirements?.length > 0 && (
                        <div className="mb-4">
                          <h6 className="text-warning">Compliance Requirements</h6>
                          {analysis.requirements.compliance_requirements.map((req, index) => (
                            <div key={index} className="border-start border-warning border-3 ps-3 mb-2">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <strong>{req.requirement}</strong>
                                  {req.mandatory && <Badge bg="danger" className="ms-2">Mandatory</Badge>}
                                </div>
                              </div>
                              <p className="text-muted mb-1">{req.description}</p>
                              <small className="text-muted">Category: {req.category}</small>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Tab>

                <Tab eventKey="risks" title="Risk Assessment">
                  <Card>
                    <Card.Body>
                      <h6 className="mb-3">Risk Analysis</h6>
                      
                      {analysis.risks?.high_risks?.length > 0 && (
                        <div className="mb-4">
                          <h6 className="text-danger">High Risks</h6>
                          {analysis.risks.high_risks.map((risk, index) => (
                            <div key={index} className="border-start border-danger border-3 ps-3 mb-3">
                              <div className="d-flex justify-content-between align-items-start">
                                <strong className="text-danger">{risk.risk}</strong>
                                <Badge bg="danger">{risk.category}</Badge>
                              </div>
                              <p className="text-muted mb-2">{risk.description}</p>
                              <div className="bg-light p-2 rounded">
                                <small><strong>Impact:</strong> {risk.impact}</small><br/>
                                <small><strong>Mitigation:</strong> {risk.mitigation}</small>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {analysis.risks?.medium_risks?.length > 0 && (
                        <div className="mb-4">
                          <h6 className="text-warning">Medium Risks</h6>
                          {analysis.risks.medium_risks.map((risk, index) => (
                            <div key={index} className="border-start border-warning border-3 ps-3 mb-3">
                              <div className="d-flex justify-content-between align-items-start">
                                <strong className="text-warning">{risk.risk}</strong>
                                <Badge bg="warning" text="dark">{risk.category}</Badge>
                              </div>
                              <p className="text-muted mb-2">{risk.description}</p>
                              <div className="bg-light p-2 rounded">
                                <small><strong>Impact:</strong> {risk.impact}</small><br/>
                                <small><strong>Mitigation:</strong> {risk.mitigation}</small>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {analysis.risks?.low_risks?.length > 0 && (
                        <div className="mb-4">
                          <h6 className="text-info">Low Risks</h6>
                          {analysis.risks.low_risks.map((risk, index) => (
                            <div key={index} className="border-start border-info border-3 ps-3 mb-3">
                              <div className="d-flex justify-content-between align-items-start">
                                <strong className="text-info">{risk.risk}</strong>
                                <Badge bg="info">{risk.category}</Badge>
                              </div>
                              <p className="text-muted mb-2">{risk.description}</p>
                              <div className="bg-light p-2 rounded">
                                <small><strong>Impact:</strong> {risk.impact}</small><br/>
                                <small><strong>Mitigation:</strong> {risk.mitigation}</small>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Tab>

                <Tab eventKey="dates" title="Key Dates">
                  <Card>
                    <Card.Body>
                      <h6 className="mb-3">Important Dates & Deadlines</h6>
                      
                      {analysis.dates?.key_dates?.length > 0 ? (
                        <div className="row">
                          {analysis.dates.key_dates.map((date, index) => (
                            <div key={index} className="col-md-6 mb-3">
                              <div className="card border-0 bg-light">
                                <div className="card-body">
                                  <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                      <h6 className="mb-1">{date.description}</h6>
                                      <p className="text-muted mb-1">
                                        {new Date(date.date).toLocaleDateString('en-US', {
                                          weekday: 'long',
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric'
                                        })}
                                      </p>
                                      <Badge 
                                        bg={date.importance === 'high' ? 'danger' : 
                                            date.importance === 'medium' ? 'warning' : 'info'}
                                        className="me-2"
                                      >
                                        {date.type}
                                      </Badge>
                                      <Badge 
                                        bg={date.importance === 'high' ? 'danger' : 
                                            date.importance === 'medium' ? 'warning' : 'info'}
                                      >
                                        {date.importance}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted">No specific dates found in the document.</p>
                      )}
                    </Card.Body>
                  </Card>
                </Tab>
              </Tabs>

              {/* Feedback Section */}
              <Row className="mt-4">
                <Col>
                  <Card>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">Was this analysis helpful?</h6>
                          <small className="text-muted">Your feedback helps improve our AI</small>
                        </div>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => setShowFeedback(true)}
                        >
                          <MessageSquare size={16} className="me-1" />
                          Provide Feedback
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}

          {/* Analysis History */}
          {existingAnalyses.length > 0 && (
            <Row className="mt-4">
              <Col>
                <Card>
                  <Card.Header>
                    <h6 className="mb-0">Analysis History</h6>
                  </Card.Header>
                  <Card.Body>
                    {existingAnalyses.map((analysisItem, index) => (
                      <div key={index} className="d-flex justify-content-between align-items-center border-bottom py-2">
                        <div>
                          <div className="d-flex align-items-center">
                            <Badge 
                              bg={analysisItem.status === 'completed' ? 'success' : 
                                  analysisItem.status === 'failed' ? 'danger' : 'warning'}
                              className="me-2"
                            >
                              {analysisItem.status}
                            </Badge>
                            <span className="fw-medium">
                              {analysisItem.analysisType} Analysis
                            </span>
                          </div>
                          <small className="text-muted">
                            {formatDate(analysisItem.createdAt)}
                          </small>
                        </div>
                        <div className="text-end">
                          {analysisItem.status === 'completed' && (
                            <>
                              <div className="small text-muted">
                                {analysisItem.totalRequirements} requirements • {analysisItem.totalRisks} risks
                              </div>
                              <div className="small text-muted">
                                Confidence: {Math.round((analysisItem.confidenceScore || 0) * 100)}%
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        {analysis && analysis.status === 'completed' && (
          <Button variant="primary" onClick={() => setShowFeedback(true)}>
            <ThumbsUp size={16} className="me-1" />
            Provide Feedback
          </Button>
        )}
      </Modal.Footer>

      {/* Feedback Modal */}
      <Modal show={showFeedback} onHide={() => setShowFeedback(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Analysis Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Was this analysis helpful?</Form.Label>
              <div className="d-flex gap-2">
                <Button
                  variant={feedback.helpful === true ? 'success' : 'outline-success'}
                  size="sm"
                  onClick={() => setFeedback(prev => ({ ...prev, helpful: true }))}
                >
                  <ThumbsUp size={16} className="me-1" />
                  Yes
                </Button>
                <Button
                  variant={feedback.helpful === false ? 'danger' : 'outline-danger'}
                  size="sm"
                  onClick={() => setFeedback(prev => ({ ...prev, helpful: false }))}
                >
                  <ThumbsDown size={16} className="me-1" />
                  No
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Accuracy Rating (1-5)</Form.Label>
              <Form.Range
                min="1"
                max="5"
                value={feedback.accuracy}
                onChange={(e) => setFeedback(prev => ({ ...prev, accuracy: parseInt(e.target.value) }))}
              />
              <div className="d-flex justify-content-between">
                <small>1 - Poor</small>
                <small>5 - Excellent</small>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Comments (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={feedback.comments}
                onChange={(e) => setFeedback(prev => ({ ...prev, comments: e.target.value }))}
                placeholder="Share any additional feedback..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFeedback(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={submitFeedback}
            disabled={feedback.helpful === null}
          >
            Submit Feedback
          </Button>
        </Modal.Footer>
      </Modal>
    </Modal>
  );
};

export default DocumentAnalysis;
