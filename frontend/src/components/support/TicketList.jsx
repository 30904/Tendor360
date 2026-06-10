import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Table, Badge, Button, Row, Col, Form, InputGroup,
  Dropdown, Pagination, Spinner, Alert, Card
} from 'react-bootstrap';
import {
  BiSearch, BiFilter, BiPlus,
  BiRefresh, BiTime, BiTag, BiReceipt
} from 'react-icons/bi';
import TableActionsCell from '../TableActionsCell';
import { buildTableActions, runTableAction } from '../../utils/tableActions';
import {
  fetchTickets,
  setFilters,
  clearFilters,
  setCurrentPage,
  setModal,
  setCurrentTicket
} from '../../store/slices/supportSlice';
import { supportAPI } from '../../services/supportAPI';
import CreateTicketModal from './CreateTicketModal';

const TicketList = () => {
  const dispatch = useDispatch();
  const {
    tickets,
    pagination,
    filters,
    ticketsLoading,
    error
  } = useSelector(state => state.support);

  const { user } = useSelector(state => state.auth);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Constants
  const STATUS_OPTIONS = {
    'OPEN': 'Open',
    'IN_PROGRESS': 'In Progress',
    'WAITING_FOR_CUSTOMER': 'Waiting for Customer',
    'RESOLVED': 'Resolved',
    'CLOSED': 'Closed',
    'CANCELLED': 'Cancelled'
  };

  const PRIORITY_OPTIONS = {
    'LOW': 'Low',
    'MEDIUM': 'Medium',
    'HIGH': 'High',
    'URGENT': 'Urgent',
    'CRITICAL': 'Critical'
  };

  const CATEGORY_OPTIONS = {
    'TECHNICAL': 'Technical',
    'BILLING': 'Billing',
    'FEATURE_REQUEST': 'Feature Request',
    'BUG_REPORT': 'Bug Report',
    'GENERAL': 'General',
    'TRAINING': 'Training',
    'INTEGRATION': 'Integration'
  };



  // Single effect for initial load and filter changes
  useEffect(() => {
    // Initial load
    if (!tickets || tickets.length === 0) {
      dispatch(fetchTickets({ page: 1 }));
    }
  }, [dispatch]);

  // Effect for pagination changes
  useEffect(() => {
    // Only fetch if we have tickets and page changes
    if (tickets && tickets.length > 0 && pagination && pagination.currentPage > 1) {
      dispatch(fetchTickets({ ...filters, page: pagination.currentPage }));
    }
  }, [dispatch, pagination?.currentPage]);

  // Effect for filter changes
  useEffect(() => {
    // Only fetch if we have filters and tickets exist
    if (tickets && tickets.length > 0 && (filters.status || filters.priority || filters.category || filters.search)) {
      dispatch(fetchTickets({ ...filters, page: 1 }));
    }
  }, [dispatch, filters.status, filters.priority, filters.category, filters.search]);

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: e.target.search.value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handlePageChange = (page) => {
    if (pagination) {
      dispatch(setCurrentPage(page));
    }
  };

  const handleViewTicket = (ticket) => {
    dispatch(setCurrentTicket(ticket));
    dispatch(setModal({ modal: 'showTicketView', show: true }));
  };

  const handleEditTicket = (ticket) => {
    dispatch(setCurrentTicket(ticket));
    dispatch(setModal({ modal: 'showEditTicket', show: true }));
  };

  const canEditTicket = (ticket) =>
    user?.roles?.includes('ADMIN') ||
    user?.roles?.includes('SUPPORT_STAFF') ||
    ticket.createdBy?._id === user?._id;

  const getTicketActions = (ticket) =>
    buildTableActions({
      onView: true,
      onEdit: canEditTicket(ticket)
    });

  const handleTicketAction = (action, ticket) => {
    runTableAction(action, ticket, {
      onView: handleViewTicket,
      onEdit: handleEditTicket
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      'OPEN': 'primary',
      'IN_PROGRESS': 'info',
      'WAITING_FOR_CUSTOMER': 'warning',
      'RESOLVED': 'success',
      'CLOSED': 'secondary',
      'CANCELLED': 'danger'
    };
    
    return (
      <Badge bg={colors[status] || 'secondary'}>
        {STATUS_OPTIONS[status] || status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      'LOW': 'success',
      'MEDIUM': 'info',
      'HIGH': 'warning',
      'URGENT': 'danger',
      'CRITICAL': 'dark'
    };
    
    return (
      <Badge bg={colors[priority] || 'secondary'}>
        {PRIORITY_OPTIONS[priority] || priority}
      </Badge>
    );
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'TECHNICAL': 'bi-tools',
      'BILLING': 'bi-credit-card',
      'FEATURE_REQUEST': 'bi-lightbulb',
      'BUG_REPORT': 'bi-bug',
      'GENERAL': 'bi-question-circle',
      'TRAINING': 'bi-mortarboard',
      'INTEGRATION': 'bi-plug'
    };
    
    return icons[category] || 'bi-question-circle';
  };

  if (ticketsLoading && (!tickets || tickets.length === 0)) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading tickets...</p>
      </div>
    );
  }

  if (error && (!tickets || tickets.length === 0)) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error Loading Tickets</Alert.Heading>
        <p>{typeof error === 'string' ? error : error?.message || 'An error occurred'}</p>
        <Button onClick={() => dispatch(fetchTickets())}>
          <BiRefresh className="me-2" />
          Try Again
        </Button>
      </Alert>
    );
  }

  // Safety check: ensure pagination is available
  if (!pagination) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Initializing ticket system...</p>
      </div>
    );
  }

  // Safety check: ensure tickets array is available
  if (!tickets) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading ticket data...</p>
      </div>
    );
  }

  return (
    <div className="ticket-list help-support-ticket-list">
      <div className="ticket-list-toolbar">
        <div>
          <h5>Support tickets</h5>
          <small className="text-muted">
            {pagination?.totalTickets || 0} ticket{(pagination?.totalTickets || 0) !== 1 ? 's' : ''} found
          </small>
        </div>
        <div className="d-flex gap-2 flex-shrink-0">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => dispatch(fetchTickets({ ...filters, page: pagination?.currentPage || 1 }))}
          >
            <BiRefresh className="me-2" />
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreateModal(true)}
          >
            <BiPlus className="me-2" />
            New Ticket
          </Button>
        </div>
      </div>

      <Card className="ticket-list-filters">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="g-3">
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text>
                    <BiSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="search"
                    placeholder="Search tickets..."
                    defaultValue={filters.search}
                  />
                  <Button type="submit" variant="outline-secondary">
                    Search
                  </Button>
                </InputGroup>
              </Col>
              
              <Col md={2}>
                <Form.Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Status</option>
                  {Object.entries(STATUS_OPTIONS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </Form.Select>
              </Col>
              
              <Col md={2}>
                <Form.Select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                >
                  <option value="">All Priority</option>
                  {Object.entries(PRIORITY_OPTIONS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </Form.Select>
              </Col>
              
              <Col md={2}>
                <Form.Select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {Object.entries(CATEGORY_OPTIONS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </Form.Select>
              </Col>
              
              <Col md={2}>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-secondary"
                    onClick={handleClearFilters}
                    size="sm"
                  >
                    <BiFilter className="me-1" />
                    Clear
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => dispatch(fetchTickets({ ...filters, page: pagination?.currentPage || 1 }))}
                    size="sm"
                  >
                    <BiRefresh />
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card className="ticket-list-table-card">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created by</th>
                <th>Assigned to</th>
                <th>Created</th>
                <th className="table-actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets && tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td>
                      <code className="text-primary">{ticket.ticketNumber}</code>
                    </td>
                    <td>
                      <div>
                        <div className="fw-medium">{ticket.title}</div>
                        {ticket.tags && ticket.tags.length > 0 && (
                          <div className="mt-1">
                            {ticket.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} bg="light" text="dark" className="me-1">
                                <BiTag className="me-1" />
                                {tag}
                              </Badge>
                            ))}
                            {ticket.tags.length > 2 && (
                              <Badge bg="light" text="dark">
                                +{ticket.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className={`bi ${getCategoryIcon(ticket.category)} me-2`}></i>
                        {CATEGORY_OPTIONS[ticket.category] || ticket.category}
                      </div>
                    </td>
                    <td>{getPriorityBadge(ticket.priority)}</td>
                    <td>{getStatusBadge(ticket.status)}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2">
                          {ticket.createdBy?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="fw-medium">{ticket.createdBy?.name || 'Unknown'}</div>
                          <small className="text-muted">{ticket.createdBy?.email || 'No email'}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      {ticket.assignedTo ? (
                        <div className="d-flex align-items-center">
                          <div className="avatar-sm bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-2">
                            {ticket.assignedTo?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="fw-medium">{ticket.assignedTo?.name || 'Unknown'}</div>
                            <small className="text-muted">{ticket.assignedTo?.email || 'No email'}</small>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted">Unassigned</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <BiTime className="me-1 text-muted" />
                        <small>{supportAPI.formatTicketAge(ticket.createdAt)}</small>
                      </div>
                    </td>
                    <td className="table-actions-col">
                      <TableActionsCell
                        actions={getTicketActions(ticket)}
                        onAction={(action) => handleTicketAction(action, ticket)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    <div className="text-muted">
                      <BiReceipt className="mb-2" size={48} />
                      <p className="mb-2">No tickets found</p>
                      <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                        <BiPlus className="me-2" />
                        Create Your First Ticket
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          
          {tickets && tickets.length === 0 && !ticketsLoading && (
            <div className="text-center py-5">
              <p className="text-muted">No tickets found matching your criteria.</p>
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
              >
                <BiPlus className="me-2" />
                Create Your First Ticket
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Pagination */}
      {pagination?.totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={!pagination?.hasPrev}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(pagination?.currentPage - 1)}
              disabled={!pagination?.hasPrev}
            />
            
            {Array.from({ length: Math.min(5, pagination?.totalPages || 0) }, (_, i) => {
              const page = Math.max(1, Math.min(
                (pagination?.totalPages || 0) - 4,
                (pagination?.currentPage || 0) - 2
              )) + i;
              
              if (page > (pagination?.totalPages || 0)) return null;
              
              return (
                <Pagination.Item
                  key={page}
                  active={page === (pagination?.currentPage || 0)}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Pagination.Item>
              );
            })}
            
            <Pagination.Next
              onClick={() => handlePageChange(pagination?.currentPage + 1)}
              disabled={!pagination?.hasNext}
            />
            <Pagination.Last
              onClick={() => handlePageChange(pagination?.totalPages || 0)}
              disabled={!pagination?.hasNext}
            />
          </Pagination>
        </div>
      )}

      {/* Create Ticket Modal */}
      <CreateTicketModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default TicketList;
