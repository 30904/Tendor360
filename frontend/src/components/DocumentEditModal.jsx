import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import FormDrawerModal from './FormDrawerModal';
import { BiEdit, BiSave, BiX } from 'react-icons/bi';
import { DOCUMENT_TYPES, DOCUMENT_PRIORITIES, DOCUMENT_STATUSES } from '../services/documentAPI';
import { dummyDocumentEditForm } from '../utils/testFormDummies';
// Modal styles are now centralized in /styles/components.scss

const DocumentEditModal = ({ show, onHide, document, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'OTHER',
    tags: '',
    category: '',
    priority: 'MEDIUM',
    status: 'UPLOADED'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (document) {
      setFormData({
        name: document.name || '',
        type: document.type || 'OTHER',
        tags: document.tags ? document.tags.join(', ') : '',
        category: document.category || '',
        priority: document.priority || 'MEDIUM',
        status: document.status || 'UPLOADED'
      });
      setErrors({});
    }
  }, [document]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Document name is required.';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Prepare data for save
    const saveData = {
      ...formData,
      name: formData.name.trim(),
      tags: formData.tags.trim() ? formData.tags.split(',').map(tag => tag.trim()) : []
    };
    
    onSave(saveData);
  };

  const handleClose = () => {
    setErrors({});
    onHide();
  };

  return (
    <FormDrawerModal
      show={show}
      onHide={handleClose}
      className="document-edit-modal"
      onTestFill={show ? () => setFormData(dummyDocumentEditForm()) : undefined}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <BiEdit className="me-2" />
          Edit Document
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
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
            
            <Col md={6}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  {DOCUMENT_STATUSES.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group>
                <Form.Label>Tags</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="Enter tags separated by commas"
                />
                <Form.Text className="text-muted">
                  Use tags to help organize and search for documents
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <BiX className="me-2" />
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          <BiSave className="me-2" />
          Save Changes
        </Button>
      </Modal.Footer>
    </FormDrawerModal>
  );
};

export default DocumentEditModal;
