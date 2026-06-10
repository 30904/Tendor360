import React, { useState, useCallback } from 'react';
import { Modal, Form, Button, Alert, ProgressBar, Row, Col } from 'react-bootstrap';
import FormDrawerModal from './FormDrawerModal';
import { BiUpload, BiX, BiFile, BiCheckCircle } from 'react-icons/bi';
import { DOCUMENT_TYPES, DOCUMENT_PRIORITIES } from '../services/documentAPI';
import { dummyDocumentUploadForm } from '../utils/testFormDummies';
// Modal styles are now centralized in /styles/components.scss

const DocumentUploadModal = ({ show, onHide, onUpload, uploadProgress }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'OTHER',
    tags: '',
    category: '',
    priority: 'MEDIUM'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileSelect = (file) => {
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'image/jpeg',
        'image/png'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setErrors({ file: 'Invalid file type. Only PDF, Word, Excel, text, and image files are allowed.' });
        return;
      }
      
      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        setErrors({ file: 'File size too large. Maximum size is 50MB.' });
        return;
      }
      
      setSelectedFile(file);
      setErrors({ file: '' });
      
      // Auto-fill name if not provided
      if (!formData.name) {
        setFormData(prev => ({
          ...prev,
          name: file.name
        }));
      }
      
      // Auto-detect type for tender documents
      if (file.name.toLowerCase().includes('tender') || 
          file.name.toLowerCase().includes('rfp') ||
          file.name.toLowerCase().includes('bid')) {
        setFormData(prev => ({
          ...prev,
          type: 'TENDER_DOCUMENT'
        }));
      }
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!selectedFile) newErrors.file = 'Please select a file to upload.';
    if (!formData.name.trim()) newErrors.name = 'Document name is required.';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Create FormData for upload
    const uploadFormData = new FormData();
    uploadFormData.append('document', selectedFile);
    uploadFormData.append('name', formData.name.trim());
    uploadFormData.append('type', formData.type);
    uploadFormData.append('tags', formData.tags.trim());
    uploadFormData.append('category', formData.category.trim());
    uploadFormData.append('priority', formData.priority);
    
    onUpload(uploadFormData);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      type: 'OTHER',
      tags: '',
      category: '',
      priority: 'MEDIUM'
    });
    setSelectedFile(null);
    setErrors({});
    onHide();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // console.log('DocumentUploadModal render - show prop:', show);
  
  return (
    <FormDrawerModal
      show={show}
      onHide={handleClose}
      className="document-upload-modal"
      backdrop="static"
      keyboard={false}
      onTestFill={show ? () => setFormData(dummyDocumentUploadForm()) : undefined}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <BiUpload className="me-2" />
          Upload Document
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* File Upload Area */}
          <div className="upload-area mb-4">
            <div
              className={`drag-drop-zone ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'has-file' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="file-selected">
                  <BiCheckCircle className="file-icon text-success" />
                  <div className="file-info">
                    <div className="file-name">{selectedFile.name}</div>
                    <div className="file-meta">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type}
                    </div>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    <BiX />
                  </Button>
                </div>
              ) : (
                <div className="upload-prompt">
                  <BiUpload className="upload-icon" />
                  <h5>Drag & Drop your file here</h5>
                  <p className="text-muted">or click to browse</p>
                  <input
                    type="file"
                    id="file-input"
                    className="file-input"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                  />
                  <label htmlFor="file-input" className="browse-btn">
                    Browse Files
                  </label>
                </div>
              )}
            </div>
            
            {errors.file && (
              <Alert variant="danger" className="mt-2">
                {errors.file}
              </Alert>
            )}
          </div>

          {/* Document Metadata */}
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Document Name *</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter document name"
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group>
                <Form.Label>Document Type</Form.Label>
                <Form.Select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                >
                  {DOCUMENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="e.g., Healthcare, IT, Construction"
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group>
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                >
                  {DOCUMENT_PRIORITIES.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={12}>
              <Form.Group>
                <Form.Label>Tags</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="Enter tags separated by commas (e.g., tender, healthcare, IT)"
                />
                <Form.Text className="text-muted">
                  Use tags to help organize and search for documents
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="upload-progress mt-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <small>Uploading...</small>
                <small>{uploadProgress}%</small>
              </div>
              <ProgressBar now={uploadProgress} />
            </div>
          )}
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!selectedFile || uploadProgress > 0 && uploadProgress < 100}
        >
          <BiUpload className="me-2" />
          Upload Document
        </Button>
      </Modal.Footer>
    </FormDrawerModal>
  );
};

export default DocumentUploadModal;
