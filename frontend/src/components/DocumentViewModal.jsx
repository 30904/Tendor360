import React, { useState } from 'react';
import { Modal, Button, Row, Col, Card, Badge, Tab, Nav, Alert } from 'react-bootstrap';
import {
  BiShow, BiDownload, BiBrain, BiPlus, BiTime, BiUser,
  BiTag, BiFile, BiCheckCircle, BiXCircle, BiInfoCircle
} from 'react-icons/bi';
import {
  getFileIcon, formatFileSize, getStatusColor, getPriorityColor,
  DOCUMENT_TYPES, DOCUMENT_PRIORITIES, DOCUMENT_STATUSES
} from '../services/documentAPI';
// Modal styles are now centralized in /styles/components.scss

const DocumentViewModal = ({ show, onHide, document, onProcessAI, onCreateTender }) => {
  const [activeTab, setActiveTab] = useState('details');

  if (!document) return null;

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDocumentTypeLabel = (type) => {
    return DOCUMENT_TYPES.find(t => t.value === type)?.label || type;
  };

  const getPriorityLabel = (priority) => {
    return DOCUMENT_PRIORITIES.find(p => p.value === priority)?.label || priority;
  };

  const getStatusLabel = (status) => {
    return DOCUMENT_STATUSES.find(s => s.value === status)?.label || status;
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered className="document-view-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          <div className="d-flex align-items-center">
            {getFileIcon(document.storage?.mimeType, document.storage?.originalName)}
            <span className="ms-2">{document.name}</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'details'}
              onClick={() => setActiveTab('details')}
            >
              <BiFile className="me-2" />
              Document Details
            </Nav.Link>
          </Nav.Item>
          {document.aiExtraction?.isProcessed && (
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'ai-extraction'}
                onClick={() => setActiveTab('ai-extraction')}
              >
                <BiBrain className="me-2" />
                AI Extraction
              </Nav.Link>
            </Nav.Item>
          )}
          {document.comments && document.comments.length > 0 && (
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'comments'}
                onClick={() => setActiveTab('comments')}
              >
                <BiInfoCircle className="me-2" />
                Comments ({document.comments.length})
              </Nav.Link>
            </Nav.Item>
          )}
        </Nav>

        {/* Document Details Tab */}
        {activeTab === 'details' && (
          <div className="tab-content">
            <Row className="g-3">
              <Col md={8}>
                <Card className="h-100">
                  <Card.Header>
                    <h6 className="mb-0">Document Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={6}>
                        <div className="info-item">
                          <label>Document Name</label>
                          <p>{document.name}</p>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="info-item">
                          <label>Document Type</label>
                          <Badge bg="secondary">{getDocumentTypeLabel(document.type)}</Badge>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="info-item">
                          <label>Status</label>
                          <Badge bg={getStatusColor(document.status)}>
                            {getStatusLabel(document.status)}
                          </Badge>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="info-item">
                          <label>Priority</label>
                          <Badge bg={getPriorityColor(document.priority)}>
                            {getPriorityLabel(document.priority)}
                          </Badge>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="info-item">
                          <label>Category</label>
                          <p>{document.category || 'Not specified'}</p>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="info-item">
                          <label>Tags</label>
                          <div className="tags-container">
                            {document.tags && document.tags.length > 0 ? (
                              document.tags.map((tag, index) => (
                                <Badge key={index} bg="light" text="dark" className="me-1">
                                  {tag}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted">No tags</span>
                            )}
                          </div>
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="info-item">
                          <label>File Information</label>
                          <div className="file-info-grid">
                            <div className="file-info-item">
                              <BiFile className="me-2" />
                              <span>Size: {formatFileSize(document.storage?.size || 0)}</span>
                            </div>
                            <div className="file-info-item">
                              <BiFile className="me-2" />
                              <span>Type: {document.storage?.mimeType || 'Unknown'}</span>
                            </div>
                            <div className="file-info-item">
                              <BiFile className="me-2" />
                              <span>Uploaded: {formatDate(document.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card className="h-100">
                  <Card.Header>
                    <h6 className="mb-0">Actions</h6>
                  </Card.Header>
                  <Card.Body className="d-flex flex-column gap-2">
                    <Button variant="outline-primary">
                      <BiDownload className="me-2" />
                      Download
                    </Button>
                    
                    {document.type === 'TENDER_DOCUMENT' && !document.aiExtraction?.isProcessed && (
                      <Button
                        variant="info"
                        size="sm"
                        onClick={onProcessAI}
                        className="mt-2"
                      >
                        <BiBrain className="me-2" />
                        Process with AI
                      </Button>
                    )}
                    
                    {document.aiExtraction?.isProcessed && !document.tenderRecord?.isCreated && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={onCreateTender}
                        className="mt-2"
                      >
                        <BiPlus className="me-2" />
                        Create Tender Record
                      </Button>
                    )}
                    
                    {document.tenderRecord?.isCreated && (
                      <Alert variant="success" className="mt-2">
                        <BiCheckCircle className="me-2" />
                        Tender record created successfully
                      </Alert>
                    )}
                  </Card.Body>
                </Card>

                <Card className="mt-3">
                  <Card.Header>
                    <h6 className="mb-0">Upload Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="info-item">
                      <label>Uploaded By</label>
                      <p>{document.uploadedBy?.name || 'Unknown'}</p>
                    </div>
                    <div className="info-item">
                      <label>Upload Date</label>
                      <p>{formatDate(document.createdAt)}</p>
                    </div>
                    {document.reviewedBy && (
                      <>
                        <div className="info-item">
                          <label>Reviewed By</label>
                          <p>{document.reviewedBy.name}</p>
                        </div>
                        <div className="info-item">
                          <label>Review Date</label>
                          <p>{formatDate(document.reviewedAt)}</p>
                        </div>
                      </>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {/* AI Extraction Tab */}
        {activeTab === 'ai-extraction' && document.aiExtraction?.isProcessed && (
          <div className="tab-content">
            <Row className="g-3">
              <Col md={8}>
                <Card>
                  <Card.Header>
                    <h6 className="mb-0">AI Extraction Results</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={6}>
                        <div className="info-item">
                          <label>Confidence Score</label>
                          <div className="confidence-score">
                            <div className="score-bar">
                              <div 
                                className="score-fill" 
                                style={{ width: `${document.aiExtraction.confidence}%` }}
                              ></div>
                            </div>
                            <span className="score-text">{document.aiExtraction.confidence}%</span>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="info-item">
                          <label>Processed At</label>
                          <p>{formatDate(document.aiExtraction.processedAt)}</p>
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="info-item">
                          <label>Summary</label>
                          <p>{document.aiExtraction.summary}</p>
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="info-item">
                          <label>Keywords</label>
                          <div className="keywords-container">
                            {document.aiExtraction.keywords?.map((keyword, index) => (
                              <Badge key={index} bg="light" text="dark" className="me-1">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {document.aiExtraction.extractedData && (
                  <Card className="mt-3">
                    <Card.Header>
                      <h6 className="mb-0">Extracted Tender Data</h6>
                    </Card.Header>
                    <Card.Body>
                      <Row className="g-3">
                        <Col md={6}>
                          <div className="info-item">
                            <label>Tender Title</label>
                            <p>{document.aiExtraction.extractedData.tenderTitle}</p>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="info-item">
                            <label>Organization</label>
                            <p>{document.aiExtraction.extractedData.organization}</p>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="info-item">
                            <label>Estimated Value</label>
                            <p>
                              {formatCurrency(
                                document.aiExtraction.extractedData.estimatedValue?.amount,
                                document.aiExtraction.extractedData.estimatedValue?.currency
                              )}
                            </p>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="info-item">
                            <label>Deadline</label>
                            <p>{formatDate(document.aiExtraction.extractedData.deadline)}</p>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="info-item">
                            <label>Location</label>
                            <p>{document.aiExtraction.extractedData.location}</p>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="info-item">
                            <label>Categories</label>
                            <div className="tags-container">
                              {document.aiExtraction.extractedData.categories?.map((category, index) => (
                                <Badge key={index} bg="primary" className="me-1">
                                  {category}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </Col>
                        <Col md={12}>
                          <div className="info-item">
                            <label>Description</label>
                            <p>{document.aiExtraction.extractedData.description}</p>
                          </div>
                        </Col>
                        {document.aiExtraction.extractedData.requirements && (
                          <Col md={12}>
                            <div className="info-item">
                              <label>Requirements</label>
                              <ul className="requirements-list">
                                {document.aiExtraction.extractedData.requirements.map((req, index) => (
                                  <li key={index}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          </Col>
                        )}
                      </Row>
                    </Card.Body>
                  </Card>
                )}
              </Col>

              <Col md={4}>
                <Card>
                  <Card.Header>
                    <h6 className="mb-0">AI Processing Status</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="status-indicator success">
                      <BiCheckCircle className="me-2" />
                      <span>AI Processing Complete</span>
                    </div>
                    <div className="info-item mt-3">
                      <label>Confidence Level</label>
                      <div className="confidence-indicator">
                        {document.aiExtraction.confidence >= 90 && (
                          <Badge bg="success">High Confidence</Badge>
                        )}
                        {document.aiExtraction.confidence >= 70 && document.aiExtraction.confidence < 90 && (
                          <Badge bg="warning">Medium Confidence</Badge>
                        )}
                        {document.aiExtraction.confidence < 70 && (
                          <Badge bg="danger">Low Confidence</Badge>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && document.comments && document.comments.length > 0 && (
          <div className="tab-content">
            <Card>
              <Card.Header>
                <h6 className="mb-0">Document Comments</h6>
              </Card.Header>
              <Card.Body>
                <div className="comments-list">
                  {document.comments.map((comment, index) => (
                    <div key={index} className="comment-item">
                      <div className="comment-header">
                        <div className="comment-author">
                          <BiUser className="me-2" />
                          {comment.author?.name || 'Unknown'}
                        </div>
                        <div className="comment-date">
                          <BiTime className="me-2" />
                          {formatDate(comment.createdAt)}
                        </div>
                      </div>
                      <div className="comment-text">{comment.text}</div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DocumentViewModal;
