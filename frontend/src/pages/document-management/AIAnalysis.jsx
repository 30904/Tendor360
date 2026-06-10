import React, { useState, useEffect, useMemo } from 'react';
import {
  Row,
  Col,
  Button,
  Badge,
  Spinner,
  Alert,
  Form,
  InputGroup,
  Table
} from 'react-bootstrap';
import {
  Brain,
  Search,
  FileText,
  CheckCircle,
  Eye,
  Download,
  RefreshCw,
  Upload,
  BarChart3,
  FileStack,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentAnalysis from '../../components/ai/DocumentAnalysis';
import AIDashboard from '../../components/ai/AIDashboard';
import AuthGuard from '../../components/ai/AuthGuard';
import ExecutiveCommandCenter from '../../components/intelligence/ExecutiveCommandCenter';
import PremiumKpiCard from '../../components/intelligence/PremiumKpiCard';
import documentService from '../../services/documentService';
import { showToast } from '../../utils/toast';
import { handleAuthError } from '../../utils/authCheck';
import './AIAnalysis.scss';

const AIAnalysis = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [documents, searchTerm, filterType]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const response = await documentService.getDocuments();
      if (response.success) {
        setDocuments(response.data.documents || []);
      } else {
        showToast.error('Failed to load documents');
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      if (handleAuthError(error)) {
        showToast.error('Please log in again to access documents');
      } else {
        showToast.error('Failed to load documents');
      }
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.originalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.fileType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(doc => doc.fileType === filterType);
    }

    setFilteredDocuments(filtered);
  };

  const stats = useMemo(() => {
    const total = documents.length;
    const pdf = documents.filter(d => d.fileType?.toLowerCase() === 'pdf').length;
    const office = documents.filter(d =>
      ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(d.fileType?.toLowerCase() || '')
    ).length;
    const filtered = filteredDocuments.length;
    return { total, pdf, office, filtered };
  }, [documents, filteredDocuments]);

  const insightItems = useMemo(() => {
    const items = [];
    if (stats.total > 0) {
      items.push({
        title: `${stats.total} documents are AI-ready with ${stats.filtered} matching current lenses`,
        detail: 'Run analysis to extract requirements, risks, and executive-grade summaries before submission.',
        tone: 'info'
      });
    }
    if (stats.total === 0 && !loading) {
      items.push({
        title: 'Corpus is empty — upload to activate insights',
        detail: 'Connect procurement files to unlock automated requirement extraction.',
        tone: 'warning'
      });
    }
    if (stats.pdf > stats.total / 2 && stats.total > 0) {
      items.push({
        title: 'PDF-heavy portfolio detected',
        detail: 'Prioritize OCR-quality sources for the highest fidelity model outputs.',
        tone: 'success'
      });
    }
    if (!items.length) {
      items.push({
        title: 'AI analysis command deck is standing by',
        detail: 'Refresh the registry after uploading net-new tender artifacts.',
        tone: 'info'
      });
    }
    return items.slice(0, 3);
  }, [stats, loading]);

  const handleAnalyzeDocument = (document) => {
    setSelectedDocument(document);
    setShowAnalysisModal(true);
  };

  const handleCloseAnalysis = () => {
    setShowAnalysisModal(false);
    setSelectedDocument(null);
    loadDocuments();
  };

  const getFileTypeIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case 'pdf':
        return '📄';
      case 'docx':
      case 'doc':
        return '📝';
      case 'xlsx':
      case 'xls':
        return '📊';
      case 'pptx':
      case 'ppt':
        return '📈';
      default:
        return '📁';
    }
  };

  const getFileTypeColor = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case 'pdf':
        return 'danger';
      case 'docx':
      case 'doc':
        return 'primary';
      case 'xlsx':
      case 'xls':
        return 'success';
      case 'pptx':
      case 'ppt':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
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

  if (showDashboard) {
    return (
      <AuthGuard>
        <AIDashboard onBack={() => setShowDashboard(false)} />
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <ExecutiveCommandCenter
        className="ai-analysis-page"
        showSkeleton={loading && !documents.length}
        breadcrumbs={[
          {
            label: 'Document Management',
            onClick: () => navigate('/document-management')
          },
          { label: 'AI Analysis', active: true }
        ]}
        onBack={() => navigate('/document-management')}
        title="AI document analysis command center"
        description="Analyze documents with AI to extract requirements, assess risks, and generate executive-ready narratives."
        heroActions={(
          <>
            <Button
              variant="outline-primary"
              size="sm"
              className="me-2"
              onClick={() => setShowDashboard(true)}
            >
              <BarChart3 size={16} className="me-1" />
              Analytics
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={loadDocuments}
              disabled={loading}
            >
              <RefreshCw size={16} className="me-1" />
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </>
        )}
        heroMeta="Model-assisted review"
        outlookTitle="Intelligence readiness outlook"
        outlookDescription={`${stats.total} documents ingested; ${stats.filtered} visible under current search and type filters.`}
        outlookChips={[
          `${stats.total} documents`,
          `${stats.filtered} in view`,
          `${stats.pdf} PDF`,
          `${stats.office} office files`
        ]}
        insights={insightItems}
        kpiTitle="Corpus signal board"
        kpiMeta="Volume, format mix, and filter coverage"
        kpiContent={(
          <Row className="g-3">
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Total documents"
                value={stats.total}
                hint="Registry from document service"
                tone="intel"
                trend="Corpus"
                icon={<FileStack size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="In current view"
                value={stats.filtered}
                hint="After search & type filter"
                tone="success"
                trend="Lens"
                icon={<Filter size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="PDF assets"
                value={stats.pdf}
                hint="Native digital briefs"
                tone="warning"
                trend="Format"
                icon={<FileText size={20} />}
              />
            </Col>
            <Col xs={12} sm={6} xl={3}>
              <PremiumKpiCard
                label="Office formats"
                value={stats.office}
                hint="Doc / sheet / deck files"
                tone="intel"
                trend="Office"
                icon={<FileText size={20} />}
              />
            </Col>
          </Row>
        )}
        tableTitle={`Documents (${filteredDocuments.length})`}
        tableActions={(
          <Badge bg="primary" className="align-self-center">AI Ready</Badge>
        )}
      >
        <Row className="mb-4 g-2">
          <Col md={8}>
            <InputGroup>
              <InputGroup.Text>
                <Search size={16} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={4}>
            <Form.Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All File Types</option>
              <option value="pdf">PDF</option>
              <option value="docx">Word Documents</option>
              <option value="xlsx">Excel Files</option>
              <option value="pptx">PowerPoint</option>
            </Form.Select>
          </Col>
        </Row>

        <Alert variant="info" className="border-0 mb-4">
          <div className="d-flex align-items-center">
            <Brain className="me-3" size={24} />
            <div>
              <h6 className="mb-1">AI-Powered Document Analysis</h6>
              <p className="mb-0">
                Our AI can extract requirements, assess risks, identify key dates, and generate executive summaries from your documents.
              </p>
            </div>
          </div>
        </Alert>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" className="mb-3" />
            <h6>Loading documents...</h6>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-5">
            <FileText size={48} className="text-muted mb-3" />
            <h6 className="text-muted">No documents found</h6>
            <p className="text-muted mb-0">
              {searchTerm || filterType !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Upload documents to start AI analysis'
              }
            </p>
            {!searchTerm && filterType === 'all' && (
              <div className="mt-3">
                <Button variant="primary" size="sm">
                  <Upload size={16} className="me-1" />
                  Upload Document
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th>Document</th>
                <th>Type</th>
                <th>Size</th>
                <th>Uploaded</th>
                <th>AI Analysis</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((document, index) => (
                <tr key={index}>
                  <td>
                    <div className="d-flex align-items-center">
                      <span className="me-3 fs-4">
                        {getFileTypeIcon(document.fileType)}
                      </span>
                      <div>
                        <div className="fw-medium">
                          {document.originalName || document.name}
                        </div>
                        <small className="text-muted">
                          {document.description || 'No description'}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge bg={getFileTypeColor(document.fileType)}>
                      {document.fileType?.toUpperCase() || 'Unknown'}
                    </Badge>
                  </td>
                  <td>
                    <span className="text-muted">
                      {formatFileSize(document.fileSize)}
                    </span>
                  </td>
                  <td>
                    <small className="text-muted">
                      {formatDate(document.createdAt)}
                    </small>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <Badge bg="success" className="me-2">
                        <CheckCircle size={12} className="me-1" />
                        Ready
                      </Badge>
                      <small className="text-muted">
                        AI Analysis Available
                      </small>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAnalyzeDocument(document)}
                      >
                        <Brain size={14} className="me-1" />
                        Analyze
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                      >
                        <Eye size={14} />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                      >
                        <Download size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {showAnalysisModal && selectedDocument && (
          <DocumentAnalysis
            document={selectedDocument}
            onClose={handleCloseAnalysis}
          />
        )}
      </ExecutiveCommandCenter>
    </AuthGuard>
  );
};

export default AIAnalysis;
