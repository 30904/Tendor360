import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import FormDrawerModal from '../FormDrawerModal';
import SupportTicketFileUpload from './SupportTicketFileUpload';
import { dummySupportTicketForm } from '../../utils/testFormDummies';
import { BiX, BiPlus, BiTag } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { createTicket } from '../../store/slices/supportSlice';

const CreateTicketModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'GENERAL',
    subcategory: '',
    priority: 'MEDIUM',
    tags: [],
    relatedTenders: [],
    relatedDocuments: []
  });

  const [newTag, setNewTag] = useState('');
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [fileError, setFileError] = useState('');

  // Constants
  const CATEGORIES = {
    'TECHNICAL': 'Technical Issue',
    'BILLING': 'Billing & Payment',
    'FEATURE_REQUEST': 'Feature Request',
    'BUG_REPORT': 'Bug Report',
    'GENERAL': 'General Inquiry',
    'TRAINING': 'Training & Support',
    'INTEGRATION': 'Integration Help'
  };

  const PRIORITIES = {
    'LOW': 'Low',
    'MEDIUM': 'Medium',
    'HIGH': 'High',
    'URGENT': 'Urgent',
    'CRITICAL': 'Critical'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear subcategory when category changes
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        category: value,
        subcategory: ''
      }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = new FormData();
      payload.append('title', formData.title.trim());
      payload.append('description', formData.description.trim());
      payload.append('category', formData.category);
      payload.append('subcategory', formData.subcategory || '');
      payload.append('priority', formData.priority);
      payload.append('tags', JSON.stringify(formData.tags));
      attachmentFiles.forEach((file) => payload.append('attachments', file));

      await dispatch(createTicket(payload)).unwrap();
      handleClose();
    } catch (err) {
      const msg =
        err?.message ||
        err?.error ||
        (typeof err === 'string' ? err : 'Failed to create ticket');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: 'GENERAL',
      subcategory: '',
      priority: 'MEDIUM',
      tags: [],
      relatedTenders: [],
      relatedDocuments: []
    });
    setNewTag('');
    setAttachmentFiles([]);
    setFileError('');
    setError('');
    setLoading(false);
    onHide();
  };

  const getSubcategoryOptions = () => {
    const subcategories = {
      'TECHNICAL': ['Login Issues', 'Performance', 'Data Sync', 'API Problems', 'Mobile App', 'Other'],
      'BILLING': ['Payment Failed', 'Invoice Issues', 'Subscription', 'Refund Request', 'Other'],
      'FEATURE_REQUEST': ['New Feature', 'Enhancement', 'Workflow', 'Reporting', 'Other'],
      'BUG_REPORT': ['UI Bug', 'Functionality', 'Data Issue', 'Performance Bug', 'Other'],
      'GENERAL': ['Account Setup', 'Access Request', 'General Question', 'Other'],
      'TRAINING': ['User Training', 'Admin Training', 'Documentation', 'Video Tutorials', 'Other'],
      'INTEGRATION': ['API Integration', 'Third-party Tools', 'Data Import/Export', 'Other']
    };
    
    return subcategories[formData.category] || [];
  };

  return (
    <FormDrawerModal
      show={show}
      onHide={handleClose}
      onTestFill={show ? () => setFormData(dummySupportTicketForm()) : undefined}
    >
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <BiPlus className="me-2" />
          Create Support Ticket
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            {error}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Title *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Brief description of your issue"
                  maxLength={200}
                  required
                />
                <Form.Text className="text-muted">
                  {formData.title.length}/200 characters
                </Form.Text>
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Priority *</Form.Label>
                <Form.Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                >
                  {Object.entries(PRIORITIES).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category *</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {Object.entries(CATEGORIES).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Subcategory</Form.Label>
                <Form.Select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                >
                  <option value="">Select subcategory</option>
                  {getSubcategoryOptions().map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Please provide detailed information about your issue, including steps to reproduce, expected behavior, and actual behavior..."
              maxLength={2000}
              required
            />
            <Form.Text className="text-muted">
              {formData.description.length}/2000 characters
            </Form.Text>
          </Form.Group>

          <SupportTicketFileUpload
            files={attachmentFiles}
            onChange={(next) => {
              setAttachmentFiles(next);
              setFileError('');
            }}
            disabled={loading}
            error={fileError}
          />

          <Form.Group className="mb-3">
            <Form.Label>Tags</Form.Label>
            <div className="d-flex gap-2 mb-2">
              <Form.Control
                type="text"
                placeholder="Add a tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button
                variant="outline-primary"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
              >
                <BiPlus />
              </Button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="d-flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="badge bg-primary d-flex align-items-center gap-1"
                  >
                    <BiTag />
                    {tag}
                    <BiX
                      className="cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                      style={{ cursor: 'pointer' }}
                    />
                  </span>
                ))}
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading || !formData.title.trim() || !formData.description.trim() || !!fileError}
        >
          {loading
            ? 'Creating...'
            : attachmentFiles.length
              ? `Create ticket (${attachmentFiles.length} file${attachmentFiles.length > 1 ? 's' : ''})`
              : 'Create Ticket'}
        </Button>
      </Modal.Footer>
    </FormDrawerModal>
  );
};

export default CreateTicketModal;
