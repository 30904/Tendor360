import React from 'react';
import { Modal, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { BiBrain, BiInfoCircle, BiPlay, BiX } from 'react-icons/bi';
// Modal styles are now centralized in /styles/components.scss

const AIExtractionModal = ({ show, onHide, document, onProcess }) => {
  if (!document) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="ai-extraction-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          <BiBrain className="me-2" />
          AI Document Processing
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Alert variant="info" className="mb-4">
          <BiInfoCircle className="me-2" />
          <strong>AI-Powered Document Analysis</strong>
          <br />
          Our advanced AI will analyze your document and extract key information including tender details, 
          requirements, deadlines, and more.
        </Alert>

        <Row className="g-3">
          <Col md={8}>
            <Card>
              <Card.Header>
                <h6 className="mb-0">Document Information</h6>
              </Card.Header>
              <Card.Body>
                <div className="document-preview">
                  <div className="document-icon">
                    📄
                  </div>
                  <div className="document-details">
                    <h6>{document.name}</h6>
                    <p className="text-muted mb-0">
                      Type: {document.type} • Size: {document.storage?.size ? 
                        `${(document.storage.size / (1024 * 1024)).toFixed(2)} MB` : 'Unknown'
                      }
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card className="mt-3">
              <Card.Header>
                <h6 className="mb-0">What AI Will Extract</h6>
              </Card.Header>
              <Card.Body>
                <Row className="g-3">
                  <Col md={6}>
                    <div className="extraction-item">
                      <div className="extraction-icon">📋</div>
                      <div className="extraction-content">
                        <h6>Tender Title</h6>
                        <p>Main project or tender name</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="extraction-item">
                      <div className="extraction-icon">🏢</div>
                      <div className="extraction-content">
                        <h6>Organization</h6>
                        <p>Issuing company or government</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="extraction-item">
                      <div className="extraction-icon">💰</div>
                      <div className="extraction-content">
                        <h6>Estimated Value</h6>
                        <p>Project budget and currency</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="extraction-item">
                      <div className="extraction-icon">📅</div>
                      <div className="extraction-content">
                        <h6>Deadline</h6>
                        <p>Submission due date</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="extraction-item">
                      <div className="extraction-icon">📍</div>
                      <div className="extraction-content">
                        <h6>Location</h6>
                        <p>Project location</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="extraction-item">
                      <div className="extraction-icon">📝</div>
                      <div className="extraction-content">
                        <h6>Requirements</h6>
                        <p>Key project requirements</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Header>
                <h6 className="mb-0">Processing Details</h6>
              </Card.Header>
              <Card.Body>
                <div className="processing-info">
                  <div className="info-item">
                    <label>Processing Time</label>
                    <p>2-5 minutes</p>
                  </div>
                  <div className="info-item">
                    <label>AI Model</label>
                    <p>Advanced NLP</p>
                  </div>
                  <div className="info-item">
                    <label>Accuracy</label>
                    <p>85-95%</p>
                  </div>
                  <div className="info-item">
                    <label>Languages</label>
                    <p>English, Spanish, French</p>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card className="mt-3">
              <Card.Header>
                <h6 className="mb-0">Next Steps</h6>
              </Card.Header>
              <Card.Body>
                <div className="steps-list">
                  <div className="step-item">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h6>AI Processing</h6>
                      <p>Document analysis and extraction</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h6>Review Results</h6>
                      <p>Verify extracted information</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h6>Create Tender</h6>
                      <p>Generate tender record</p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          <BiX className="me-2" />
          Cancel
        </Button>
        <Button variant="primary" onClick={onProcess}>
          <BiPlay className="me-2" />
          Start AI Processing
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AIExtractionModal;
