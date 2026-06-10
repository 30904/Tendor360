import React from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { BiUpload, BiBrain, BiFile, BiSearch, BiEdit, BiTrash, BiPlus, BiTime, BiCheckCircle, BiXCircle, BiHelpCircle, BiArrowBack } from 'react-icons/bi';
// Using centralized help page styling from components.scss

const DocumentManagementHelp = () => {
  return (
    <div className="document-management-help">
      {/* Hero Section */}
      <div className="hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={10}>
              <div className="hero-content">
                <h1 className="display-4 fw-bold text-white mb-4">
                  Document Management Help Center
                </h1>
                <p className="lead text-white-50 mb-4">
                  Your comprehensive guide to AI-powered document processing and tender record creation
                </p>
                <Button 
                  variant="outline-light" 
                  size="lg"
                  onClick={() => window.history.back()}
                  className="back-btn"
                >
                  <BiArrowBack className="me-2" />
                  Back to App
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        {/* Overview Section */}
        <Row className="mb-5">
          <Col lg={8}>
            <Card className="help-card">
              <Card.Body>
                <h2 className="h3 mb-4">
                  <BiFile className="me-3 text-primary" />
                  Overview
                </h2>
                <p className="lead">
                  The Document Management module is a powerful AI-driven system that helps you organize, 
                  process, and extract valuable information from tender documents and other business files.
                </p>
                <p>
                  This system automatically analyzes uploaded documents using advanced AI algorithms, 
                  extracts key tender information, and can create tender records automatically. It's 
                  designed to save time and improve accuracy in your tender management workflow.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="help-card feature-highlight">
              <Card.Body className="text-center">
                <div className="feature-icon mb-3">
                  <BiBrain size={48} className="text-primary" />
                </div>
                <h5>AI-Powered Processing</h5>
                <p className="text-muted">
                  Advanced machine learning algorithms extract key information from documents
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Key Features */}
        <Row className="mb-5">
          <Col>
            <Card className="help-card">
              <Card.Body>
                <h2 className="h3 mb-4">Key Features</h2>
                <Row className="g-4">
                  <Col md={6}>
                    <div className="feature-item">
                      <div className="feature-icon">
                        <BiUpload size={32} className="text-primary" />
                      </div>
                      <div className="feature-content">
                        <h5>Smart Document Upload</h5>
                        <p>Drag & drop interface with automatic file type detection and validation</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="feature-item">
                      <div className="feature-icon">
                        <BiBrain size={32} className="text-info" />
                      </div>
                      <div className="feature-content">
                        <h5>AI Extraction</h5>
                        <p>Automatically extract tender details, deadlines, and requirements</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="feature-item">
                      <div className="feature-icon">
                        <BiPlus size={32} className="text-success" />
                      </div>
                      <div className="feature-content">
                        <h5>Tender Record Creation</h5>
                        <p>Generate tender records automatically from extracted document data</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="feature-item">
                      <div className="feature-icon">
                        <BiSearch size={32} className="text-warning" />
                      </div>
                      <div className="feature-content">
                        <h5>Advanced Search & Filtering</h5>
                        <p>Find documents quickly with powerful search and categorization tools</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* How to Use */}
        <Row className="mb-5">
          <Col>
            <Card className="help-card">
              <Card.Body>
                <h2 className="h3 mb-4">How to Use</h2>
                
                <div className="usage-step mb-4">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h5>Upload Documents</h5>
                    <p>
                      Click the "Upload Document" button to open the upload modal. You can drag and drop 
                      files or click to browse. Supported formats include PDF, Word, Excel, and images.
                    </p>
                    <div className="step-tips">
                      <strong>Tips:</strong>
                      <ul className="mb-0">
                        <li>Use descriptive names for better organization</li>
                        <li>Set appropriate priority levels for urgent documents</li>
                        <li>Add relevant tags for easier searching</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="usage-step mb-4">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h5>AI Processing</h5>
                    <p>
                      For tender documents, use the "Process with AI" button to extract key information. 
                      The AI will analyze the document and provide a summary with confidence scores.
                    </p>
                    <div className="step-tips">
                      <strong>What AI Extracts:</strong>
                      <ul className="mb-0">
                        <li>Tender title and organization</li>
                        <li>Deadlines and submission dates</li>
                        <li>Budget and value information</li>
                        <li>Requirements and qualifications</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="usage-step mb-4">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h5>Create Tender Records</h5>
                    <p>
                      After AI processing, you can create tender records directly from the extracted data. 
                      Review the information, make any necessary adjustments, and save to create the record.
                    </p>
                    <div className="step-tips">
                      <strong>Benefits:</strong>
                      <ul className="mb-0">
                        <li>Automatic data entry saves time</li>
                        <li>Reduces manual errors</li>
                        <li>Immediate availability in tender management</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="usage-step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h5>Manage & Organize</h5>
                    <p>
                      Use the document library to view, edit, and organize your documents. Filter by type, 
                      status, or priority, and use the search function to find specific documents quickly.
                    </p>
                    <div className="step-tips">
                      <strong>Organization Features:</strong>
                      <ul className="mb-0">
                        <li>Status tracking (Uploaded, Processing, Extracted, Approved)</li>
                        <li>Priority-based organization</li>
                        <li>Category and tag-based filtering</li>
                        <li>Version control and history</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Document Types & Statuses */}
        <Row className="mb-5">
          <Col lg={6}>
            <Card className="help-card">
              <Card.Body>
                <h3 className="h4 mb-3">Document Types</h3>
                <div className="status-grid">
                  <Badge bg="primary" className="me-2 mb-2">TENDER_DOCUMENT</Badge>
                  <Badge bg="secondary" className="me-2 mb-2">CONTRACT</Badge>
                  <Badge bg="info" className="me-2 mb-2">PROPOSAL</Badge>
                  <Badge bg="success" className="me-2 mb-2">INVOICE</Badge>
                  <Badge bg="warning" className="me-2 mb-2">REPORT</Badge>
                  <Badge bg="dark" className="me-2 mb-2">OTHER</Badge>
                </div>
                <p className="text-muted mt-2">
                  Each document type has specific processing rules and AI extraction capabilities.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="help-card">
              <Card.Body>
                <h3 className="h4 mb-3">Document Statuses</h3>
                <div className="status-grid">
                  <Badge bg="secondary" className="me-2 mb-2">UPLOADED</Badge>
                  <Badge bg="info" className="me-2 mb-2">PROCESSING</Badge>
                  <Badge bg="warning" className="me-2 mb-2">EXTRACTED</Badge>
                  <Badge bg="success" className="me-2 mb-2">APPROVED</Badge>
                  <Badge bg="danger" className="me-2 mb-2">REJECTED</Badge>
                </div>
                <p className="text-muted mt-2">
                  Track the progress of your documents through the processing pipeline.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Troubleshooting */}
        <Row className="mb-5">
          <Col>
            <Card className="help-card">
              <Card.Body>
                <h2 className="h3 mb-4">Troubleshooting</h2>
                
                <div className="troubleshooting-item mb-3">
                  <h5><BiXCircle className="me-2 text-danger" />Upload Failed</h5>
                  <p>
                    <strong>Problem:</strong> Document upload is not working<br/>
                    <strong>Solution:</strong> Check file size (max 50MB), file type, and internet connection
                  </p>
                </div>

                <div className="troubleshooting-item mb-3">
                  <h5><BiTime className="me-2 text-warning" />AI Processing Stuck</h5>
                  <p>
                    <strong>Problem:</strong> AI processing is taking too long<br/>
                    <strong>Solution:</strong> Large documents take longer to process. Check the AI queue for status.
                  </p>
                </div>

                <div className="troubleshooting-item mb-3">
                  <h5><BiXCircle className="me-2 text-danger" />Extraction Errors</h5>
                  <p>
                    <strong>Problem:</strong> AI extraction results are inaccurate<br/>
                    <strong>Solution:</strong> Ensure document quality is good and text is readable. Complex layouts may affect accuracy.
                  </p>
                </div>

                <div className="troubleshooting-item">
                  <h5><BiSearch className="me-2 text-info" />Can't Find Documents</h5>
                  <p>
                    <strong>Problem:</strong> Documents not appearing in search<br/>
                    <strong>Solution:</strong> Check filters, search terms, and ensure documents are properly uploaded.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Best Practices */}
        <Row>
          <Col>
            <Card className="help-card">
              <Card.Body>
                <h2 className="h3 mb-4">Best Practices</h2>
                <Row>
                  <Col md={6}>
                    <h5><BiCheckCircle className="me-2 text-success" />Do's</h5>
                    <ul>
                      <li>Use clear, descriptive file names</li>
                      <li>Set appropriate priority levels</li>
                      <li>Add relevant tags and categories</li>
                      <li>Review AI extraction results before creating records</li>
                      <li>Regularly organize and archive old documents</li>
                    </ul>
                  </Col>
                  <Col md={6}>
                    <h5><BiXCircle className="me-2 text-danger" />Don'ts</h5>
                    <ul>
                      <li>{'Upload extremely large files (>50MB)'}</li>
                      <li>Use generic or unclear file names</li>
                      <li>Skip document categorization</li>
                      <li>Ignore AI extraction confidence scores</li>
                      <li>Leave documents in "Processing" status indefinitely</li>
                    </ul>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DocumentManagementHelp;
